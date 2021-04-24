"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
function INIT_BIP38() {
    function GenerateRandomBIP38EncryptionData(password, addressType) {
        if (password === "") {
            return { type: "err", error: "Password must not be empty" };
        }
        var ownersalt = WorkerUtils.Get32SecureRandomBytes().slice(0, 8);
        var passfactor = CryptoHelper.scrypt(password, ownersalt, 14, 8, 8, 32);
        var bigint = WorkerUtils.ByteArrayToBigint(passfactor);
        var keypair = EllipticCurve.EccMultiply(EllipticCurve.ecc_Gx, EllipticCurve.ecc_Gy, bigint);
        var publicKeyBytesX = WorkerUtils.BigintToByteArray(keypair.x);
        while (publicKeyBytesX.length < 32) {
            publicKeyBytesX.push(0);
        }
        var passpoint = publicKeyBytesX.slice(); // copy
        passpoint.push(keypair.y.isOdd() ? 0x03 : 0x02);
        passpoint.reverse();
        return {
            type: "ok",
            result: {
                addressType: addressType,
                keypair: { x: keypair.x.toString(), y: keypair.y.toString() },
                passpoint: passpoint,
                ownersalt: ownersalt
            }
        };
    }
    function GenerateRandomBIP38EncryptedAddress(encryptionData) {
        var seedb = WorkerUtils.Get32SecureRandomBytes().slice(0, 24);
        var factorb = CryptoHelper.SHA256(CryptoHelper.SHA256(seedb));
        var keypairX = new BN(encryptionData.keypair.x);
        var keypairY = new BN(encryptionData.keypair.y);
        var ecPoint = EllipticCurve.EccMultiply(keypairX, keypairY, WorkerUtils.ByteArrayToBigint(factorb));
        var generatedAddress = AddressUtil.MakeLegacyAddress(ecPoint);
        var addressWithType = (function () {
            switch (encryptionData.addressType) {
                case "legacy":
                    return generatedAddress;
                case "segwit":
                    return AddressUtil.MakeSegwitAddress(ecPoint);
                case "bech32":
                    return AddressUtil.MakeBech32Address(ecPoint);
            }
        })();
        var addressHash = CryptoHelper.SHA256(CryptoHelper.SHA256(generatedAddress)).slice(0, 4);
        var salt = __spreadArray(__spreadArray([], addressHash), encryptionData.ownersalt);
        var encrypted = CryptoHelper.scrypt(encryptionData.passpoint, salt, 10, 1, 1, 64);
        var derivedHalf1 = encrypted.slice(0, 32);
        var derivedHalf2 = encrypted.slice(32, 64);
        var encryptedpart1 = CryptoHelper.AES_Encrypt_ECB_NoPadding(WorkerUtils.ByteArrayXOR(seedb.slice(0, 16), derivedHalf1.slice(0, 16)), derivedHalf2);
        var block2 = __spreadArray(__spreadArray([], encryptedpart1.slice(8, 16)), seedb.slice(16, 24));
        var encryptedpart2 = CryptoHelper.AES_Encrypt_ECB_NoPadding(WorkerUtils.ByteArrayXOR(block2, derivedHalf1.slice(16, 32)), derivedHalf2);
        var finalPrivateKeyWithoutChecksum = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
            0x01, 0x43, 0x20
        ], addressHash), encryptionData.ownersalt), encryptedpart1.slice(0, 8)), encryptedpart2);
        return {
            addressType: encryptionData.addressType,
            address: addressWithType,
            privateKey: WorkerUtils.Base58CheckEncode(finalPrivateKeyWithoutChecksum)
        };
    }
    function DecryptPrivateKey(privateKey, password) {
        if (password === "") {
            return { type: "err", error: "password must not be empty" };
        }
        var decoded = WorkerUtils.Base58CheckDecode(privateKey);
        if (decoded.type === "err") {
            return decoded;
        }
        var bytes = decoded.result;
        if (bytes[0] !== 0x01) {
            return { type: "err", error: "invalid byte at position 0" };
        }
        bytes.shift();
        // typescript will show an error if I have (bytes[0] === 0x43) here, because it doesn't know that bytes.shift() changes the array
        // see https://github.com/microsoft/TypeScript/issues/35795
        // putting any here so it works
        if (bytes[0] === 0x43) {
            if ((bytes[1] & 0x20) === 0) {
                return { type: "err", error: "only compressed private keys are supported" };
            }
            var ownerSalt = bytes.slice(6, 14);
            var scryptResult = CryptoHelper.scrypt(password, ownerSalt, 14, 8, 8, 32);
            var bigint = WorkerUtils.ByteArrayToBigint(scryptResult);
            var keypair = EllipticCurve.GetECCKeypair(bigint);
            var publicKeyBytesX = WorkerUtils.BigintToByteArray(keypair.x);
            while (publicKeyBytesX.length < 32) {
                publicKeyBytesX.push(0);
            }
            var passpoint = publicKeyBytesX.slice();
            passpoint.push(keypair.y.isOdd() ? 0x03 : 0x02);
            passpoint.reverse();
            var encryptedPart2 = bytes.slice(22, 38);
            var addressHash = bytes.slice(2, 14);
            var scryptResult2 = CryptoHelper.scrypt(passpoint, addressHash, 10, 1, 1, 64);
            var derivedHalf1 = scryptResult2.slice(0, 32);
            var derivedHalf2 = scryptResult2.slice(32, 64);
            var decrypted2 = CryptoHelper.AES_Decrypt_ECB_NoPadding(encryptedPart2, derivedHalf2);
            var encryptedpart1 = __spreadArray(__spreadArray([], bytes.slice(14, 22)), WorkerUtils.ByteArrayXOR(decrypted2.slice(0, 8), scryptResult2.slice(16, 24)));
            var decrypted1 = CryptoHelper.AES_Decrypt_ECB_NoPadding(encryptedpart1, derivedHalf2);
            var seedb = __spreadArray(__spreadArray([], WorkerUtils.ByteArrayXOR(decrypted1.slice(0, 16), derivedHalf1.slice(0, 16))), WorkerUtils.ByteArrayXOR(decrypted2.slice(8, 16), derivedHalf1.slice(24, 32)));
            var factorb = CryptoHelper.SHA256(CryptoHelper.SHA256(seedb));
            var finalPrivateKeyValue = WorkerUtils.ByteArrayToBigint(scryptResult)
                .mul(WorkerUtils.ByteArrayToBigint(factorb))
                .mod(EllipticCurve.ecc_n);
            var finalKeypair = EllipticCurve.GetECCKeypair(finalPrivateKeyValue);
            var finalAddress = AddressUtil.MakeLegacyAddress(finalKeypair);
            var finalAddressHash = CryptoHelper.SHA256(CryptoHelper.SHA256(finalAddress));
            for (var i = 0; i < 4; ++i) {
                if (addressHash[i] !== finalAddressHash[i]) {
                    return { type: "err", error: "invalid password" };
                }
            }
            var finalPrivateKey = AddressUtil.MakePrivateKey(finalPrivateKeyValue);
            return {
                type: "ok",
                result: finalPrivateKey
            };
        }
        else if (bytes[0] === 0x42) {
            if (bytes[1] !== 0xe0) {
                return { type: "err", error: "only compressed private keys are supported" };
            }
            var addressHash = bytes.slice(2, 6);
            var derivedBytes = CryptoHelper.scrypt(password, addressHash, 14, 8, 8, 64);
            var decrypted = CryptoHelper.AES_Decrypt_ECB_NoPadding(bytes.slice(6, 38), derivedBytes.slice(32));
            var privateKeyBytes = WorkerUtils.ByteArrayXOR(decrypted, derivedBytes);
            var finalPrivateKeyValue = WorkerUtils.ByteArrayToBigint(privateKeyBytes);
            var finalKeypair = EllipticCurve.GetECCKeypair(finalPrivateKeyValue);
            var finalAddress = AddressUtil.MakeLegacyAddress(finalKeypair);
            var finalAddressHash = CryptoHelper.SHA256(CryptoHelper.SHA256(finalAddress));
            for (var i = 0; i < 4; ++i) {
                if (addressHash[i] !== finalAddressHash[i]) {
                    return { type: "err", error: "invalid password" };
                }
            }
            var finalPrivateKey = AddressUtil.MakePrivateKey(finalPrivateKeyValue);
            return {
                type: "ok",
                result: finalPrivateKey
            };
        }
        return { type: "err", error: "invalid byte at EC multiply flag" };
    }
    function EncryptPrivateKey(privateKey, password) {
        if (password === "") {
            return { type: "err", error: "password must not be empty" };
        }
        var privateKeyDecoded = AddressUtil.PrivateKeyStringToKeyPair(privateKey);
        if (privateKeyDecoded.type === "err") {
            return privateKeyDecoded;
        }
        var privateKeyBytes = WorkerUtils.BigintToByteArray(privateKeyDecoded.result.privateKeyValue);
        while (privateKeyBytes.length < 32) {
            privateKeyBytes.push(0);
        }
        privateKeyBytes.reverse();
        var address = AddressUtil.MakeLegacyAddress(privateKeyDecoded.result.keypair);
        var salt = CryptoHelper.SHA256(CryptoHelper.SHA256(address)).slice(0, 4);
        var derivedBytes = CryptoHelper.scrypt(password, salt, 14, 8, 8, 64);
        var firstHalf = WorkerUtils.ByteArrayXOR(privateKeyBytes, derivedBytes.slice(0, 32));
        var secondHalf = derivedBytes.slice(32);
        var finalPrivateKeyWithoutChecksum = __spreadArray(__spreadArray([
            0x01, 0x42, 0xe0
        ], salt), CryptoHelper.AES_Encrypt_ECB_NoPadding(firstHalf, secondHalf));
        return {
            type: "ok",
            result: WorkerUtils.Base58CheckEncode(finalPrivateKeyWithoutChecksum)
        };
    }
    return {
        GenerateRandomBIP38EncryptionData: GenerateRandomBIP38EncryptionData,
        GenerateRandomBIP38EncryptedAddress: GenerateRandomBIP38EncryptedAddress,
        DecryptPrivateKey: DecryptPrivateKey,
        EncryptPrivateKey: EncryptPrivateKey
    };
}
