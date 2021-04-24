
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
        const passfactor = <Uint8Array>CryptoHelper.scrypt(password, ownersalt, 14, 8, 8, 32);
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

        const salt = [...addressHash, ...encryptionData.ownersalt];

        const encrypted = <Uint8Array>CryptoHelper.scrypt(encryptionData.passpoint, salt, 10, 1, 1, 64);
        const derivedHalf1 = encrypted.slice(0, 32);
        const derivedHalf2 = encrypted.slice(32, 64);

        const encryptedpart1 = CryptoHelper.AES_Encrypt_ECB_NoPadding(WorkerUtils.ByteArrayXOR(seedb.slice(0, 16), derivedHalf1.slice(0, 16)), derivedHalf2);

        const block2 = [...encryptedpart1.slice(8, 16), ...seedb.slice(16, 24)];
        const encryptedpart2 = CryptoHelper.AES_Encrypt_ECB_NoPadding(WorkerUtils.ByteArrayXOR(block2, derivedHalf1.slice(16, 32)), derivedHalf2);

        const finalPrivateKeyWithoutChecksum = [
            0x01, 0x43, 0x20,
            ...addressHash,
            ...encryptionData.ownersalt,
            ...encryptedpart1.slice(0, 8),
            ...encryptedpart2
        ];

        return {
            addressType: encryptionData.addressType,
            address: addressWithType,
            privateKey: WorkerUtils.Base58CheckEncode(finalPrivateKeyWithoutChecksum)
        };
    }

    function DecryptPrivateKey(privateKey: string, password: string): Result<string, string>
    {
        if (password === "")
        {
            return { type: "err", error: "password must not be empty" };
        }

        const decoded = WorkerUtils.Base58CheckDecode(privateKey);
        if (decoded.type === "err")
        {
            return decoded;
        }

        const bytes = decoded.result;
        if (bytes[0] !== 0x01)
        {
            return { type: "err", error: "invalid byte at position 0" };
        }

        bytes.shift();

        // typescript will show an error if I have (bytes[0] === 0x43) here, because it doesn't know that bytes.shift() changes the array
        // see https://github.com/microsoft/TypeScript/issues/35795
        // putting any here so it works
        if (<any>bytes[0] === 0x43)
        {
            if ((bytes[1] & 0x20) === 0)
            {
                return { type: "err", error: "only compressed private keys are supported" };
            }

            const ownerSalt = bytes.slice(6, 14);
            const scryptResult = <Uint8Array>CryptoHelper.scrypt(password, ownerSalt, 14, 8, 8, 32);
            const bigint = WorkerUtils.ByteArrayToBigint(scryptResult);
            const keypair = EllipticCurve.GetECCKeypair(bigint);

            const publicKeyBytesX = WorkerUtils.BigintToByteArray(keypair.x);
            while (publicKeyBytesX.length < 32)
            {
                publicKeyBytesX.push(0);
            }

            const passpoint = publicKeyBytesX.slice();
            passpoint.push(keypair.y.isOdd() ? 0x03 : 0x02);
            passpoint.reverse();
            const encryptedPart2 = bytes.slice(22, 38);
            const addressHash = bytes.slice(2, 14);
            const scryptResult2 = <Uint8Array>CryptoHelper.scrypt(passpoint, addressHash, 10, 1, 1, 64);

            const derivedHalf1 = scryptResult2.slice(0, 32);
            const derivedHalf2 = scryptResult2.slice(32, 64);

            const decrypted2 = CryptoHelper.AES_Decrypt_ECB_NoPadding(encryptedPart2, derivedHalf2);

            const encryptedpart1 = [
                ...bytes.slice(14, 22),
                ...WorkerUtils.ByteArrayXOR(decrypted2.slice(0, 8), scryptResult2.slice(16, 24))
            ];

            const decrypted1 = CryptoHelper.AES_Decrypt_ECB_NoPadding(encryptedpart1, derivedHalf2);
            const seedb = [
                ...WorkerUtils.ByteArrayXOR(decrypted1.slice(0, 16), derivedHalf1.slice(0, 16)),
                ...WorkerUtils.ByteArrayXOR(decrypted2.slice(8, 16), derivedHalf1.slice(24, 32))
            ];

            const factorb = CryptoHelper.SHA256(CryptoHelper.SHA256(seedb));
            const finalPrivateKeyValue = WorkerUtils.ByteArrayToBigint(scryptResult)
                .mul(WorkerUtils.ByteArrayToBigint(factorb))
                .mod(EllipticCurve.ecc_n);

            const finalKeypair = EllipticCurve.GetECCKeypair(finalPrivateKeyValue);
            const finalAddress = AddressUtil.MakeLegacyAddress(finalKeypair);
            const finalAddressHash = CryptoHelper.SHA256(CryptoHelper.SHA256(finalAddress));

            for (let i = 0; i < 4; ++i)
            {
                if (addressHash[i] !== finalAddressHash[i])
                {
                    return { type: "err", error: "invalid password" };
                }
            }

            const finalPrivateKey = AddressUtil.MakePrivateKey(finalPrivateKeyValue);

            return {
                type: "ok",
                result: finalPrivateKey
            };
        }
        else if (<any>bytes[0] === 0x42)
        {
            if (bytes[1] !== 0xe0)
            {
                return { type: "err", error: "only compressed private keys are supported" };
            }

            const addressHash = bytes.slice(2, 6);
            const derivedBytes = <Uint8Array>CryptoHelper.scrypt(password, addressHash, 14, 8, 8, 64);
            const decrypted = CryptoHelper.AES_Decrypt_ECB_NoPadding(bytes.slice(6, 38), derivedBytes.slice(32));
            const privateKeyBytes = WorkerUtils.ByteArrayXOR(decrypted, derivedBytes);

            const finalPrivateKeyValue = WorkerUtils.ByteArrayToBigint(privateKeyBytes);
            const finalKeypair = EllipticCurve.GetECCKeypair(finalPrivateKeyValue);
            const finalAddress = AddressUtil.MakeLegacyAddress(finalKeypair);
            const finalAddressHash = CryptoHelper.SHA256(CryptoHelper.SHA256(finalAddress));

            for (let i = 0; i < 4; ++i)
            {
                if (addressHash[i] !== finalAddressHash[i])
                {
                    return { type: "err", error: "invalid password" };
                }
            }

            const finalPrivateKey = AddressUtil.MakePrivateKey(finalPrivateKeyValue);

            return {
                type: "ok",
                result: finalPrivateKey
            };
        }

        return { type: "err", error: "invalid byte at EC multiply flag" };
    }

    function EncryptPrivateKey(privateKey: string, password: string): Result<string, string>
    {
        if (password === "")
        {
            return { type: "err", error: "password must not be empty" };
        }

        const privateKeyDecoded = AddressUtil.PrivateKeyStringToKeyPair(privateKey);
        if (privateKeyDecoded.type === "err")
        {
            return privateKeyDecoded;
        }

        const privateKeyBytes = WorkerUtils.BigintToByteArray(privateKeyDecoded.result.privateKeyValue);
        while (privateKeyBytes.length < 32)
        {
            privateKeyBytes.push(0);
        }

        privateKeyBytes.reverse();

        const address = AddressUtil.MakeLegacyAddress(privateKeyDecoded.result.keypair);

        const salt = CryptoHelper.SHA256(CryptoHelper.SHA256(address)).slice(0, 4);
        const derivedBytes = <Uint8Array>CryptoHelper.scrypt(password, salt, 14, 8, 8, 64);

        const firstHalf = WorkerUtils.ByteArrayXOR(privateKeyBytes, derivedBytes.slice(0, 32));
        const secondHalf = derivedBytes.slice(32);

        const finalPrivateKeyWithoutChecksum = [
            0x01, 0x42, 0xe0,
            ...salt,
            ...CryptoHelper.AES_Encrypt_ECB_NoPadding(firstHalf, secondHalf)
        ];

        return {
            type: "ok",
            result: WorkerUtils.Base58CheckEncode(finalPrivateKeyWithoutChecksum)
        }
    }

    return {
        GenerateRandomBIP38EncryptionData,
        GenerateRandomBIP38EncryptedAddress,
        DecryptPrivateKey,
        EncryptPrivateKey
    };
}
