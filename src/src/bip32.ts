
declare var BIP32Util: ReturnType<typeof INIT_BIP32>;

type BIP32Purpose = "44" | "49" | "84" | "32";

function INIT_BIP32()
{
    const bn_0 = new BN(0);
    const bn_1 = new BN(1);

    function Uint32ToBytes(num: number)
    {
        return [num >>> 24, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff];
    }

    function BytesToUint32(bytes: number[])
    {
        return ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
    }

    function SerializeECCKeypairCompressed(keypair: EcKeypair)
    {
        return [0x2 + keypair.y.and(bn_1).toNumber(), ...WorkerUtils.BigintToByteArrayLittleEndian32(keypair.x)];
    }

    function ModPow(num: BN, exponent: BN, mod: BN)
    {
        let ret = bn_1;

        while (!exponent.isZero())
        {
            if (!(exponent.and(bn_1)).isZero())
            {
                ret = (ret.mul(num)).mod(mod);
            }

            exponent = exponent.shrn(1);
            num = (num.mul(num)).mod(mod);
        }

        return ret;
    }

    interface KeyData
    {
        key: number[];
        chainCode: number[];
    }

    interface DerivedPrivateKey
    {
        key: BN;
        chainCode: number[];
    }

    function CKD_Priv(parent: KeyData, index: number): DerivedPrivateKey
    {
        const isHardened = (index & 0x80000000) !== 0;
        const parentKey = parent.key;
        const parentKeyBigint = WorkerUtils.ByteArrayToBigint(parentKey);
        const parentChainCode = parent.chainCode;

        const I = isHardened
            ? CryptoHelper.HmacSHA512([0x00, ...parentKey, ...Uint32ToBytes(index)], parentChainCode)
            : CryptoHelper.HmacSHA512([
                ...SerializeECCKeypairCompressed(EllipticCurve.GetECCKeypair(parentKeyBigint)),
                ...Uint32ToBytes(index)
            ], parentChainCode);

        const IL = I.slice(0, 32);
        const IR = I.slice(32, 64);

        const parsed256IL = WorkerUtils.ByteArrayToBigint(IL);
        const childKey = (parsed256IL.add(parentKeyBigint)).mod(EllipticCurve.ecc_n);

        // In case parse256(IL) >= n or ki == 0, the resulting key is invalid, and one should proceed with the next value for i. (Note: this has probability lower than 1 in 2^127.)
        if (parsed256IL.gte(EllipticCurve.ecc_n) || childKey.isZero())
        {
            return CKD_Priv(parent, index + 1);
        }

        return {
            key: childKey,
            chainCode: IR
        };
    }

    interface CompressedEcKeypair
    {
        x: number[];
        isOdd: boolean;
    }

    interface DerivedPubKey
    {
        keypair: EcKeypair;
        chainCode: number[];
    }

    function CKD_Pub(parent: { keypair: CompressedEcKeypair, chainCode: number[] }, index: number): Result<DerivedPubKey, string>
    {
        const isHardened = (index & 0x80000000) !== 0;
        if (isHardened)
        {
            return { type: "err", error: "Cannot derive hardened child key of extended public key" };
        }

        const parentKeyPair = parent.keypair;
        const pointX = WorkerUtils.ByteArrayToBigint(parentKeyPair.x);
        const isOdd = parentKeyPair.isOdd;

        const val = (pointX.mul(pointX).mul(pointX)).add(new BN(7));
        let pointY = ModPow(val, (EllipticCurve.ecc_p.add(bn_1)).shrn(2), EllipticCurve.ecc_p);
        if (pointY.lt(bn_0))
        {
            pointY = pointY.add(EllipticCurve.ecc_p);
        }

        if (pointY.isOdd() !== isOdd)
        {
            pointY = EllipticCurve.ecc_p.sub(pointY);
        }

        const parentKeyPairBigint = <EcKeypair>{ x: pointX, y: pointY };
        const parentChainCode = parent.chainCode;

        const I = CryptoHelper.HmacSHA512([...SerializeECCKeypairCompressed(parentKeyPairBigint), ...Uint32ToBytes(index)], parentChainCode);

        const IL = I.slice(0, 32);
        const IR = I.slice(32, 64);

        const tempBigint = WorkerUtils.ByteArrayToBigint(IL);
        const multiplied = EllipticCurve.GetECCKeypair(tempBigint);
        const childKeyPair = EllipticCurve.EcAdd(multiplied.x, multiplied.y, parentKeyPairBigint.x, parentKeyPairBigint.y);

        if (childKeyPair.y.lt(bn_0))
        {
            childKeyPair.y = childKeyPair.y.add(EllipticCurve.ecc_p);
        }

        // In case parse256(IL) >= n or Ki is the point at infinity, the resulting key is invalid, and one should proceed with the next value for i.
        if (tempBigint.gte(EllipticCurve.ecc_n) || tempBigint.isZero())
        {
            return CKD_Pub(parent, index + 1);
        }

        return {
            type: "ok",
            result: {
                keypair: childKeyPair,
                chainCode: IR
            }
        };
    }

    function GetExtendedKeyFingerprint(key: number[])
    {
        return CryptoHelper.RIPEMD160(CryptoHelper.SHA256(key)).slice(0, 4);
    }

    function GetMasterKeyFromSeed(seed: number[])
    {
        const I = CryptoHelper.HmacSHA512(seed, "Bitcoin seed");

        const IL = I.slice(0, 32);
        const IR = I.slice(32, 64);

        return {
            key: WorkerUtils.ByteArrayToBigint(IL),
            chainCode: IR
        };
    }

    type Bip32Purpose = "44" | "49" | "84" | "32";
    function SerializeExtendedKey(isPrivate: boolean, depth: number, parentKeyFingerprint: number[],
        childIndex: number, chainCode: number[], keyData: number[], purpose: Bip32Purpose): Result<string, string>
    {
        let versionBytes;
        switch (purpose)
        {
            case "49":
                // ypub yprv
                if (isPrivate)
                    versionBytes = [0x04, 0x9D, 0x78, 0x78];
                else
                    versionBytes = [0x04, 0x9D, 0x7C, 0xB2];
                break;
            case "84":
                // zpub zprv
                if (isPrivate)
                    versionBytes = [0x04, 0xB2, 0x43, 0x0C];
                else
                    versionBytes = [0x04, 0xB2, 0x47, 0x46];
                break;
            case "44":
            case "32":
                if (isPrivate)
                    versionBytes = [0x04, 0x88, 0xAD, 0xE4];
                else
                    versionBytes = [0x04, 0x88, 0xB2, 0x1E];
                break;
        }

        if (depth > 255)
        {
            return { type: "err", error: "Depth must be 255 at most" };
        }

        const finalResult = [...versionBytes, depth, ...parentKeyFingerprint, ...Uint32ToBytes(childIndex), ...chainCode, ...keyData];
        return {
            type: "ok",
            result: WorkerUtils.Base58CheckEncode(finalResult)
        };
    }

    function UnextendKey(extendedKey: string): Result<string, string>
    {
        const decodedKey = WorkerUtils.Base58CheckDecode(extendedKey);
        if (decodedKey.type === "err")
        {
            return decodedKey;
        }

        const keyData = decodedKey.result.slice(45);
        const key = WorkerUtils.ByteArrayToBigint(keyData.slice(1));

        if (keyData[0] === 0)
        {
            return {
                type: "ok",
                result: AddressUtil.MakePrivateKey(key)
            };
        }
        else
        {
            const keypair: EcKeypair = { x: key, y: new BN(keyData[0]) };
            switch (extendedKey[0])
            {
                case "x":
                    return {
                        type: "ok",
                        result: AddressUtil.MakeLegacyAddress(keypair)
                    };
                case "y":
                    return {
                        type: "ok",
                        result: AddressUtil.MakeSegwitAddress(keypair)
                    };
                case "z":
                    return {
                        type: "ok",
                        result: AddressUtil.MakeBech32Address(keypair)
                    };
                default:
                    return { type: "err", error: "Unknown key type" };
            }
        }
    }

    function DeriveKey(extendedKey: string, path: string, toPrivate: boolean, type: Bip32Purpose = "44"): Result<string, string>
    {
        if (path[0] !== "m")
        {
            return { type: "err", error: "Path must start with \"m\"" };
        }

        const segments = path.substr(2).split("/");
        const childIndices = [];

        for (let index of segments)
        {
            if (index === "")
            {
                continue;
            }

            const match = index.match(/^(\d+)(')?$/);
            if (match)
            {
                const index = parseInt(match[1]);
                const isHardened = match[2] !== undefined;
                childIndices.push((isHardened ? (index | 0x80000000) : index) >>> 0);
            }
            else
            {
                return { type: "err", error: "Invalid path segment: " + index };
            }
        }

        const decodedKey = WorkerUtils.Base58CheckDecode(extendedKey);
        if (decodedKey.type === "err")
        {
            return decodedKey;
        }

        let currentDepth = decodedKey.result[4];
        let chainCode = decodedKey.result.slice(13, 45);
        let keyData = decodedKey.result.slice(45);
        const fromPrivate = keyData[0] === 0;
        if (!fromPrivate && toPrivate)
        {
            return { type: "err", error: "Cannot derive private key from public key" };
        }

        let parentKeyData: number[] | null = null;

        let lastIndex = BytesToUint32(decodedKey.result.slice(9, 13));
        for (let childIndex of childIndices)
        {
            parentKeyData = keyData;
            lastIndex = childIndex;

            const chainCodeResult = ((): Result<number[], string> =>
            {
                if (fromPrivate)
                {
                    const privateKey = keyData.slice(1);
                    const derivedKey = CKD_Priv({ key: privateKey, chainCode: chainCode }, childIndex);
                    keyData = [0x00, ...WorkerUtils.BigintToByteArrayLittleEndian32(derivedKey.key)];
                    return {
                        type: "ok",
                        result: derivedKey.chainCode
                    }
                }
                else
                {
                    const keypair: CompressedEcKeypair = {
                        x: keyData.slice(1),
                        isOdd: (keyData[0] & 1) !== 0
                    };

                    const derivedKey = CKD_Pub({ keypair: keypair, chainCode: chainCode }, childIndex);
                    if (derivedKey.type === "err")
                    {
                        return derivedKey;
                    }

                    keyData = SerializeECCKeypairCompressed(derivedKey.result.keypair);
                    return {
                        type: "ok",
                        result: derivedKey.result.chainCode
                    }
                }
            })();

            if (chainCodeResult.type === "err")
            {
                return chainCodeResult;
            }

            chainCode = chainCodeResult.result;
            ++currentDepth;
        }

        const convertToPublic = !toPrivate && keyData[0] === 0;
        const convertParentToPublic = !toPrivate && parentKeyData !== null && parentKeyData[0] === 0;
        if (convertToPublic)
        {
            keyData = SerializeECCKeypairCompressed(EllipticCurve.GetECCKeypair(WorkerUtils.ByteArrayToBigint(keyData.slice(1))));
        }

        if (convertParentToPublic)
        {
            parentKeyData = SerializeECCKeypairCompressed(EllipticCurve.GetECCKeypair(WorkerUtils.ByteArrayToBigint(parentKeyData!.slice(1))));
        }

        const fingerprint = (() =>
        {
            if (parentKeyData)
            {
                if (toPrivate)
                {
                    const pubkey = SerializeECCKeypairCompressed(EllipticCurve.GetECCKeypair(WorkerUtils.ByteArrayToBigint(parentKeyData.slice(1))));
                    return GetExtendedKeyFingerprint(pubkey);
                }
                else
                    return GetExtendedKeyFingerprint(parentKeyData);
            }
            else
            {
                return decodedKey.result.slice(5, 9);
            }
        })()

        return SerializeExtendedKey(toPrivate, currentDepth, fingerprint, lastIndex, chainCode, keyData, type);
    }

    function DeriveBIP32ExtendedKey(rootKey: string, path: string, derivedKeyPurpose: BIP32Purpose, hardened: boolean, changeAddresses: boolean):
        Result<{ publicKey: string, privateKey: string | null, path: string, purpose: BIP32Purpose }, string>
    {
        const isPrivate = rootKey.substr(1, 3) === "prv";
        if (derivedKeyPurpose !== "32")
        {
            if (isPrivate)
            {
                path += (changeAddresses ? "/1" : "/0");
            }
            else
            {
                path = "m";
            }
        }
        else
        {
            if (rootKey[0] === "y")
            {
                derivedKeyPurpose = "49";
            }
            else if (rootKey[0] === "z")
            {
                derivedKeyPurpose = "84";
            }
        }

        if (!isPrivate && hardened)
        {
            return { type: "err", error: "Hardened addresses can only be derived from extended private keys" };
        }

        const derivedExtendedPublicKey = DeriveKey(rootKey, path, false, derivedKeyPurpose);
        if (derivedExtendedPublicKey.type === "err")
        {
            return derivedExtendedPublicKey;
        }

        const derivedExtendedPrivateKey = isPrivate ? DeriveKey(rootKey, path, isPrivate, derivedKeyPurpose) : null;
        if (derivedExtendedPrivateKey !== null)
        {
            if (derivedExtendedPrivateKey.type === "err")
            {
                return derivedExtendedPrivateKey;
            }
        }

        return {
            type: "ok",
            result: {
                privateKey: derivedExtendedPrivateKey === null ? null : derivedExtendedPrivateKey.result,
                publicKey: derivedExtendedPublicKey.result,
                path,
                purpose: derivedKeyPurpose
            }
        };
    }

    function DeriveBIP32Address(path: string, publicKey: string, privateKey: string | null, index: number, purpose: BIP32Purpose, hardened: boolean):
        Result<{ address: string, privateKey: string | null, addressPath: string }, string>
    {
        let resultPrivateKey: string | null = null;
        if (privateKey !== null)
        {
            const derivedPrivateKey = DeriveKey(privateKey, "m/" + index + (hardened ? "'" : ""), true, purpose);
            if (derivedPrivateKey.type === "err")
            {
                return derivedPrivateKey;
            }

            const unextendedPrivateKey = UnextendKey(derivedPrivateKey.result);
            if (unextendedPrivateKey.type === "err")
            {
                return unextendedPrivateKey;
            }

            resultPrivateKey = unextendedPrivateKey.result;
        }

        const derivedAddress = DeriveKey(privateKey ?? publicKey, "m/" + index + (hardened ? "'" : ""), false, purpose);
        if (derivedAddress.type === "err")
        {
            return derivedAddress;
        }

        const unextendedAddress = UnextendKey(derivedAddress.result);
        if (unextendedAddress.type === "err")
        {
            return unextendedAddress;
        }

        const addressPath = path + (path[path.length - 1] === "/" ? "" : "/") + index + (hardened ? "'" : "");

        return {
            type: "ok",
            result: {
                address: unextendedAddress.result,
                privateKey: resultPrivateKey,
                addressPath
            }
        };
    }

    return {
        SerializeExtendedKey,
        GetMasterKeyFromSeed,
        DeriveKey,
        DeriveBIP32ExtendedKey,
        DeriveBIP32Address
    };
}
