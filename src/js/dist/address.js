"use strict";
function INIT_AddressUtil() {
    // Creates base58 encoded private key in string format from bigint
    function MakePrivateKey(bigint) {
        var privateKey = [];
        privateKey.push(0x01);
        var temp = WorkerUtils.BigintToByteArray(bigint);
        while (temp.length < 32) {
            temp.push(0);
        }
        privateKey.push.apply(privateKey, temp);
        privateKey.push(WorkerUtils.IsTestnet() ? 0xEF : 0x80);
        privateKey.reverse();
        return WorkerUtils.Base58CheckEncode(privateKey);
    }
    // make legacy address from public key
    function MakeLegacyAddress(keypair) {
        var key_bytes = [];
        var bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32) {
            bytes_public_x.push(0);
        }
        key_bytes.push.apply(key_bytes, bytes_public_x);
        if (keypair.y.isOdd()) {
            key_bytes.push(0x03);
        }
        else {
            key_bytes.push(0x02);
        }
        key_bytes.reverse();
        var sha_result_1 = CryptoHelper.SHA256(key_bytes);
        var ripemd_result_2 = CryptoHelper.RIPEMD160(sha_result_1);
        var ripemd_extended = [WorkerUtils.IsTestnet() ? 0x6F : 0x00];
        ripemd_extended.push.apply(ripemd_extended, ripemd_result_2);
        return WorkerUtils.Base58CheckEncode(ripemd_extended);
    }
    // make segwit address from public key
    function MakeSegwitAddress(keypair) {
        var key_bytes = [];
        var bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);
        key_bytes.push.apply(key_bytes, bytes_public_x);
        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);
        key_bytes.reverse();
        var sha_result_1 = CryptoHelper.SHA256(key_bytes);
        var keyhash = CryptoHelper.RIPEMD160(sha_result_1);
        var redeemscript = [0x00, 0x14];
        redeemscript.push.apply(redeemscript, keyhash);
        var redeemscripthash = [WorkerUtils.IsTestnet() ? 0xC4 : 0x05];
        redeemscripthash.push.apply(redeemscripthash, CryptoHelper.RIPEMD160(CryptoHelper.SHA256(redeemscript)));
        return WorkerUtils.Base58CheckEncode(redeemscripthash);
    }
    var bech32Chars = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    function Bech32HrpExpand(hrp) {
        var ret = [];
        for (var i = 0; i < hrp.length; ++i)
            ret.push(hrp.charCodeAt(i) >> 5);
        ret.push(0);
        for (var i = 0; i < hrp.length; ++i)
            ret.push(hrp.charCodeAt(i) & 0x1f);
        return ret;
    }
    function Bech32Polymod(values) {
        var GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
        var chk = 1;
        for (var i = 0; i < values.length; ++i) {
            var b = chk >> 25;
            chk = ((chk & 0x1ffffff) << 5) ^ values[i];
            for (var j = 0; j < 5; ++j) {
                if ((b >> j) & 1)
                    chk ^= GEN[j];
            }
        }
        return chk;
    }
    function Bech32CreateChecksum(hrp, data) {
        var hrpExpanded = Bech32HrpExpand(hrp);
        hrpExpanded.push.apply(hrpExpanded, data);
        hrpExpanded.push.apply(hrpExpanded, [0, 0, 0, 0, 0, 0]);
        var polymod = Bech32Polymod(hrpExpanded) ^ 1;
        var ret = [];
        for (var i = 0; i < 6; ++i)
            ret.push((polymod >> 5 * (5 - i)) & 31);
        return ret;
    }
    // create bech32 address from public key
    function MakeBech32Address(keypair) {
        var key_bytes = [];
        var bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);
        key_bytes.push.apply(key_bytes, bytes_public_x);
        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);
        key_bytes.reverse();
        var sha_result_1 = CryptoHelper.SHA256(key_bytes);
        var keyhash = CryptoHelper.RIPEMD160(sha_result_1);
        var redeemscript = [0x00, 0x14];
        redeemscript.push.apply(redeemscript, keyhash);
        var value = 0;
        var bits = 0;
        var result = [0];
        for (var i = 0; i < 20; ++i) {
            value = ((value << 8) | keyhash[i]) & 0xFFFFFF;
            bits += 8;
            while (bits >= 5) {
                bits -= 5;
                result.push((value >> bits) & 0x1F);
            }
        }
        var address = WorkerUtils.IsTestnet() ? "tb1" : "bc1";
        for (var i = 0; i < result.length; ++i)
            address += bech32Chars[result[i]];
        var checksum = Bech32CreateChecksum(WorkerUtils.IsTestnet() ? "tb" : "bc", result);
        for (var i = 0; i < checksum.length; ++i)
            address += bech32Chars[checksum[i]];
        return address;
    }
    function GenerateNewRandomAddress(addressType) {
        var bytes = WorkerUtils.Get32SecureRandomBytes();
        var bigint = new BN(0);
        for (var j = 0; j < bytes.length; ++j) {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[j]));
        }
        var keypair = EllipticCurve.GetECCKeypair(bigint);
        var privateKey = MakePrivateKey(bigint);
        var address;
        switch (addressType) {
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
            address: address,
            privateKey: privateKey
        };
    }
    function PrivateKeyStringToValue(privateKey) {
        var decoded = WorkerUtils.Base58CheckDecode(privateKey);
        if (decoded.type === "err") {
            return decoded;
        }
        var bytes = decoded.result;
        if (bytes.pop() !== 1) {
            return { type: "err", error: "only compressed private keys are supported, they start with 'L' or 'K'" };
        }
        bytes.reverse();
        bytes.pop();
        if (bytes.length !== 32) {
            return { type: "err", error: "invalid length" };
        }
        var privateKeyValue = new BN(0);
        for (var j = bytes.length - 1; j >= 0; --j) {
            privateKeyValue = privateKeyValue.shln(8);
            privateKeyValue = privateKeyValue.or(new BN(bytes[j]));
        }
        return {
            type: "ok",
            result: privateKeyValue
        };
    }
    function PrivateKeyStringToKeyPair(privateKey) {
        var privateKeyDecoded = PrivateKeyStringToValue(privateKey);
        if (privateKeyDecoded.type === "err") {
            return privateKeyDecoded;
        }
        var privateKeyValue = privateKeyDecoded.result;
        var keypair = EllipticCurve.GetECCKeypair(privateKeyValue);
        var privateKeyReEncoded = MakePrivateKey(privateKeyValue);
        if (privateKey !== privateKeyReEncoded) {
            return { type: "err", error: "cannot decode private key" };
        }
        return {
            type: "ok",
            result: {
                privateKeyValue: privateKeyValue,
                keypair: keypair
            }
        };
    }
    function GetPrivateKeyDetails(privateKey) {
        if (privateKey.length === 58 && privateKey[0] === "6" && privateKey[1] === "P") {
            var base58Check = WorkerUtils.Base58CheckDecode(privateKey);
            if (base58Check.type === "err") {
                return { type: "error", message: base58Check.error };
            }
            return { type: "probablyBIP38" };
        }
        var result = PrivateKeyStringToKeyPair(privateKey);
        if (result.type === "err") {
            return { type: "error", message: result.error };
        }
        var keypair = result.result.keypair;
        return {
            type: "ok",
            segwitAddress: MakeSegwitAddress(keypair),
            bech32Address: MakeBech32Address(keypair),
            legacyAddress: MakeLegacyAddress(keypair)
        };
    }
    return {
        GenerateNewRandomAddress: GenerateNewRandomAddress,
        PrivateKeyStringToValue: PrivateKeyStringToValue,
        PrivateKeyStringToKeyPair: PrivateKeyStringToKeyPair,
        MakePrivateKey: MakePrivateKey,
        MakeLegacyAddress: MakeLegacyAddress,
        MakeSegwitAddress: MakeSegwitAddress,
        MakeBech32Address: MakeBech32Address,
        GetPrivateKeyDetails: GetPrivateKeyDetails
    };
}
