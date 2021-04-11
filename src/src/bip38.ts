
declare var BIP38Util: ReturnType<typeof INIT_BIP38>;

interface BIP38EncryptionData
{
    addressType: AddressType;
    keypair: EcKeypairString;
    passpoint: number[];
    ownersalt: number[];
}

function INIT_BIP38()
{
    function GenerateRandomBIP38EncryptionData(password: string, addressType: AddressType): Result<BIP38EncryptionData, string>
    {
        if (password === "")
        {
            return { type: "err", error: "Password must not be empty" };
        }

        const ownersalt = WorkerUtils.Get32SecureRandomBytes().slice(0, 8);
        const passfactor = <number[]>CryptoHelper.scrypt(password, ownersalt, 14, 8, 8, 32);
        const bigint = WorkerUtils.ByteArrayToBigint(passfactor);
        const keypair = EllipticCurve.EccMultiply(EllipticCurve.ecc_Gx, EllipticCurve.ecc_Gy, bigint);

        const publicKeyBytesX = WorkerUtils.BigintToByteArray(keypair.x);
        while (publicKeyBytesX.length < 32)
        {
            publicKeyBytesX.push(0);
        }

        const passpoint = publicKeyBytesX.slice(); // copy
        passpoint.push(keypair.y.isOdd() ? 0x03 : 0x02);
        passpoint.reverse();

        return {
            type: "ok",
            result: {
                addressType,
                keypair: { x: keypair.x.toString(), y: keypair.y.toString() },
                passpoint,
                ownersalt
            }
        };
    }

    function GenerateRandomBIP38EncryptedAddress(encryptionData: BIP38EncryptionData): AddressWithPrivateKey
    {
        const seedb = WorkerUtils.Get32SecureRandomBytes().slice(0, 24);

        const factorb = CryptoHelper.SHA256(CryptoHelper.SHA256(seedb));

        const keypairX = new BN(encryptionData.keypair.x);
        const keypairY = new BN(encryptionData.keypair.y);

        const ecPoint = EllipticCurve.EccMultiply(keypairX, keypairY, WorkerUtils.ByteArrayToBigint(factorb));
        const generatedAddress = AddressUtil.MakeLegacyAddress(ecPoint);
        const addressWithType = (() =>
        {
            switch (encryptionData.addressType)
            {
                case "legacy":
                    return generatedAddress;
                case "segwit":
                    return AddressUtil.MakeSegwitAddress(ecPoint);
                case "bech32":
                    return AddressUtil.MakeBech32Address(ecPoint);
            }
        })();

        const addressHash = CryptoHelper.SHA256(CryptoHelper.SHA256(generatedAddress)).slice(0, 4);

        const salt = WorkerUtils.ArrayConcat(addressHash, encryptionData.ownersalt);

        const encrypted = <number[]>CryptoHelper.scrypt(encryptionData.passpoint, salt, 10, 1, 1, 64);
        const derivedHalf1 = encrypted.slice(0, 32);
        const derivedHalf2 = encrypted.slice(32, 64);

        const encryptedpart1 = CryptoHelper.AES_Encrypt_ECB_NoPadding(WorkerUtils.ByteArrayXOR(seedb.slice(0, 16), derivedHalf1.slice(0, 16)), derivedHalf2);

        const block2 = WorkerUtils.ArrayConcat(encryptedpart1.slice(8, 16), seedb.slice(16, 24));
        const encryptedpart2 = CryptoHelper.AES_Encrypt_ECB_NoPadding(WorkerUtils.ByteArrayXOR(block2, derivedHalf1.slice(16, 32)), derivedHalf2);

        const finalPrivateKeyWithoutChecksum = WorkerUtils.ArrayConcat(
            [0x01, 0x43, 0x20],
            addressHash,
            encryptionData.ownersalt,
            encryptedpart1.slice(0, 8),
            encryptedpart2
        );

        const finalPrivateKey = WorkerUtils.ArrayConcat(
            finalPrivateKeyWithoutChecksum,
            CryptoHelper.SHA256(CryptoHelper.SHA256(finalPrivateKeyWithoutChecksum)).slice(0, 4)
        );

        return {
            addressType: encryptionData.addressType,
            address: addressWithType,
            privateKey: WorkerUtils.Base58Encode(finalPrivateKey) // TODO?: Base58CheckEncode + don't add checksum above
        };
    }

    return {
        GenerateRandomBIP38EncryptionData,
        GenerateRandomBIP38EncryptedAddress
    };
}
