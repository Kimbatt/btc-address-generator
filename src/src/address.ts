
declare var AddressUtil: ReturnType<typeof INIT_AddressUtil>;

type AddressType = "legacy" | "segwit" | "bech32";

interface AddressWithPrivateKey
{
    addressType: AddressType;
    address: string;
    privateKey: string;
}

type GetPrivateKeyDetailsResult = GetPrivateKeyDetailsResultOK | GetPrivateKeyDetailsResultError | GetPrivateKeyDetailsResultProbablyBIP38;
interface GetPrivateKeyDetailsResultOK
{
    type: "ok";
    legacyAddress: string;
    segwitAddress: string;
    bech32Address: string;
}

interface GetPrivateKeyDetailsResultError
{
    type: "error";
    message: string;
}

interface GetPrivateKeyDetailsResultProbablyBIP38
{
    type: "probablyBIP38";
}

function INIT_AddressUtil()
{
    // Creates base58 encoded private key in string format from bigint
    function MakePrivateKey(bigint: BN)
    {
        const privkey: number[] = [];
        privkey.push(0x01);

        const temp = WorkerUtils.BigintToByteArray(bigint);
        while (temp.length < 32)
        {
           temp.push(0);
        }

        privkey.push(...temp);
        privkey.push(WorkerUtils.IsTestnet() ? 0xEF : 0x80);
        privkey.reverse();
        privkey.push.apply(privkey, CryptoHelper.SHA256(CryptoHelper.SHA256(privkey)).slice(0, 4));
        return WorkerUtils.Base58Encode(privkey);
    }

    // make legacy address from public key
    function MakeLegacyAddress(keypair: EcKeypair)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
        {
            bytes_public_x.push(0);
        }

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
        {
            key_bytes.push(0x03);
        }
        else
        {
            key_bytes.push(0x02);
        }

        key_bytes.reverse();
        const sha_result_1 = CryptoHelper.SHA256(key_bytes);
        const ripemd_result_2 = CryptoHelper.RIPEMD160(sha_result_1);
        const ripemd_extended = [WorkerUtils.IsTestnet() ? 0x6F : 0x00];
        ripemd_extended.push(...ripemd_result_2);
        const sha_result_3 = CryptoHelper.SHA256(ripemd_extended);
        const sha_result_4 = CryptoHelper.SHA256(sha_result_3);
        ripemd_extended.push.apply(ripemd_extended, sha_result_4.slice(0, 4));

        return WorkerUtils.Base58Encode(ripemd_extended);
    }

    // make segwit address from public key
    function MakeSegwitAddress(keypair: EcKeypair)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = CryptoHelper.SHA256(key_bytes);
        const keyhash = CryptoHelper.RIPEMD160(sha_result_1);

        const redeemscript = [0x00, 0x14];
        redeemscript.push(...keyhash);

        const redeemscripthash = [WorkerUtils.IsTestnet() ? 0xC4 : 0x05];

        redeemscripthash.push(...CryptoHelper.RIPEMD160(CryptoHelper.SHA256(redeemscript)));
        redeemscripthash.push.apply(redeemscripthash, CryptoHelper.SHA256(CryptoHelper.SHA256(redeemscripthash)).slice(0, 4));

        return WorkerUtils.Base58Encode(redeemscripthash);
    }

    const bech32Chars = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

    function Bech32HrpExpand(hrp: string)
    {
        const ret = [];
        for (let i = 0; i < hrp.length; ++i)
            ret.push(hrp.charCodeAt(i) >> 5);

        ret.push(0);

        for (let i = 0; i < hrp.length; ++i)
            ret.push(hrp.charCodeAt(i) & 0x1f);

        return ret;
    }

    function Bech32Polymod(values: number[])
    {
        const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
        let chk = 1;

        for (let i = 0; i < values.length; ++i)
        {
            const b = chk >> 25;
            chk = ((chk & 0x1ffffff) << 5) ^ values[i];

            for (let j = 0; j < 5; ++j)
            {
                if ((b >> j) & 1)
                    chk ^= GEN[j];
            }
        }

        return chk;
    }

    function Bech32CreateChecksum(hrp: string, data: number[])
    {
        const hrpExpanded = Bech32HrpExpand(hrp);
        hrpExpanded.push(...data);
        hrpExpanded.push.apply(hrpExpanded, [0, 0, 0, 0, 0, 0]);

        const polymod = Bech32Polymod(hrpExpanded) ^ 1;

        const ret = [];
        for (let i = 0; i < 6; ++i)
            ret.push((polymod >> 5 * (5 - i)) & 31);

        return ret;
    }

    // create bech32 address from public key
    function MakeBech32Address(keypair: EcKeypair)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = CryptoHelper.SHA256(key_bytes);
        const keyhash = CryptoHelper.RIPEMD160(sha_result_1);

        const redeemscript = [0x00, 0x14];
        redeemscript.push(...keyhash);

        let value = 0;
        let bits = 0;

        const result = [0];
        for (let i = 0; i < 20; ++i)
        {
            value = ((value << 8) | keyhash[i]) & 0xFFFFFF;
            bits += 8;

            while (bits >= 5)
            {
                bits -= 5;
                result.push((value >> bits) & 0x1F);
            }
        }

        let address = WorkerUtils.IsTestnet() ? "tb1" : "bc1";
        for (let i = 0; i < result.length; ++i)
            address += bech32Chars[result[i]];

        const checksum = Bech32CreateChecksum(WorkerUtils.IsTestnet() ? "tb" : "bc", result);
        for (let i = 0; i < checksum.length; ++i)
            address += bech32Chars[checksum[i]];

        return address;
    }

    function GenerateNewRandomAddress(addressType: AddressType)
    {
        const bytes = WorkerUtils.Get32SecureRandomBytes();

        let bigint = new BN(0);
        for (let j = 0; j < bytes.length; ++j)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[j]));
        }

        const keypair = EllipticCurve.GetECCKeypair(bigint);
        const privateKey = MakePrivateKey(bigint);

        let address: string;
        switch (addressType)
        {
            case "segwit":
                address = MakeSegwitAddress(keypair);
                break;
            case "bech32":
                address = MakeBech32Address(keypair);
                break;
            case "legacy":
                address = MakeLegacyAddress(keypair);
                break;
        }

        return {
            address,
            privateKey
        };
    }

    function PrivateKeyStringToKeyPair(privateKey: string): Result<{ privateKey: BN, keypair: EcKeypair }, string>
    {
        const decoded = WorkerUtils.Base58CheckDecode(privateKey);
        if (decoded.type === "err")
        {
            return decoded;
        }

        const bytes = decoded.result;

        if (bytes.pop() !== 1)
        {
            return { type: "err", error: "only compressed private keys are supported, they start with 'L' or 'K'" };
        }

        bytes.reverse();
        bytes.pop();

        if (bytes.length !== 32)
        {
            return { type: "err", error: "invalid length" };
        }

        let privateKeyValue = new BN(0);
        for (let j = bytes.length - 1; j >= 0; --j)
        {
            privateKeyValue = privateKeyValue.shln(8);
            privateKeyValue = privateKeyValue.or(new BN(bytes[j]));
        }

        const keypair = EllipticCurve.GetECCKeypair(privateKeyValue);

        const privateKeyReEncoded = MakePrivateKey(privateKeyValue);
        if (privateKey !== privateKeyReEncoded)
            return { type: "err", error: "cannot decode private key" };

        return {
            type: "ok",
            result: {
                privateKey: privateKeyValue,
                keypair: keypair
            }
        };
    }


    function GetPrivateKeyDetails(privateKey: string): GetPrivateKeyDetailsResult
    {
        if (privateKey.length === 58 && privateKey[0] === "6" && privateKey[1] === "P")
        {
            return { type: "probablyBIP38" };
        }

        const result = PrivateKeyStringToKeyPair(privateKey);
        if (result.type === "err")
        {
            return { type: "error", message: result.error };
        }

        const keypair = result.result.keypair;

        return {
            type: "ok",
            segwitAddress: MakeSegwitAddress(keypair),
            bech32Address: MakeBech32Address(keypair),
            legacyAddress: MakeLegacyAddress(keypair)
        };
    }

    return {
        GenerateNewRandomAddress,
        MakeLegacyAddress,
        MakeSegwitAddress,
        MakeBech32Address,
        GetPrivateKeyDetails
    };
}
