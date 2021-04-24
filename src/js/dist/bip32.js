"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
function INIT_BIP32() {
    var bn_0 = new BN(0);
    var bn_1 = new BN(1);
    function Uint32ToBytes(num) {
        return [num >>> 24, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff];
    }
    function BytesToUint32(bytes) {
        return ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
    }
    function SerializeECCKeypairCompressed(keypair) {
        return __spreadArray([0x2 + keypair.y.and(bn_1).toNumber()], WorkerUtils.BigintToByteArrayLittleEndian32(keypair.x));
    }
    function ModPow(num, exponent, mod) {
        var ret = bn_1;
        while (!exponent.isZero()) {
            if (!(exponent.and(bn_1)).isZero()) {
                ret = (ret.mul(num)).mod(mod);
            }
            exponent = exponent.shrn(1);
            num = (num.mul(num)).mod(mod);
        }
        return ret;
    }
    function CKD_Priv(parent, index) {
        var isHardened = (index & 0x80000000) !== 0;
        var parentKey = parent.key;
        var parentKeyBigint = WorkerUtils.ByteArrayToBigint(parentKey);
        var parentChainCode = parent.chainCode;
        var I = isHardened
            ? CryptoHelper.HmacSHA512(__spreadArray(__spreadArray([0x00], parentKey), Uint32ToBytes(index)), parentChainCode)
            : CryptoHelper.HmacSHA512(__spreadArray(__spreadArray([], SerializeECCKeypairCompressed(EllipticCurve.GetECCKeypair(parentKeyBigint))), Uint32ToBytes(index)), parentChainCode);
        var IL = I.slice(0, 32);
        var IR = I.slice(32, 64);
        var parsed256IL = WorkerUtils.ByteArrayToBigint(IL);
        var childKey = (parsed256IL.add(parentKeyBigint)).mod(EllipticCurve.ecc_n);
        // In case parse256(IL) >= n or ki == 0, the resulting key is invalid, and one should proceed with the next value for i. (Note: this has probability lower than 1 in 2^127.)
        if (parsed256IL.gte(EllipticCurve.ecc_n) || childKey.isZero()) {
            return CKD_Priv(parent, index + 1);
        }
        return {
            key: childKey,
            chainCode: IR
        };
    }
    function CKD_Pub(parent, index) {
        var isHardened = (index & 0x80000000) !== 0;
        if (isHardened) {
            return { type: "err", error: "Cannot derive hardened child key of extended public key" };
        }
        var parentKeyPair = parent.keypair;
        var pointX = WorkerUtils.ByteArrayToBigint(parentKeyPair.x);
        var isOdd = parentKeyPair.isOdd;
        var val = (pointX.mul(pointX).mul(pointX)).add(new BN(7));
        var pointY = ModPow(val, (EllipticCurve.ecc_p.add(bn_1)).shrn(2), EllipticCurve.ecc_p);
        if (pointY.lt(bn_0)) {
            pointY = pointY.add(EllipticCurve.ecc_p);
        }
        if (pointY.isOdd() !== isOdd) {
            pointY = EllipticCurve.ecc_p.sub(pointY);
        }
        var parentKeyPairBigint = { x: pointX, y: pointY };
        var parentChainCode = parent.chainCode;
        var I = CryptoHelper.HmacSHA512(__spreadArray(__spreadArray([], SerializeECCKeypairCompressed(parentKeyPairBigint)), Uint32ToBytes(index)), parentChainCode);
        var IL = I.slice(0, 32);
        var IR = I.slice(32, 64);
        var tempBigint = WorkerUtils.ByteArrayToBigint(IL);
        var multiplied = EllipticCurve.GetECCKeypair(tempBigint);
        var childKeyPair = EllipticCurve.EcAdd(multiplied.x, multiplied.y, parentKeyPairBigint.x, parentKeyPairBigint.y);
        if (childKeyPair.y.lt(bn_0)) {
            childKeyPair.y = childKeyPair.y.add(EllipticCurve.ecc_p);
        }
        // In case parse256(IL) >= n or Ki is the point at infinity, the resulting key is invalid, and one should proceed with the next value for i.
        if (tempBigint.gte(EllipticCurve.ecc_n) || tempBigint.isZero()) {
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
    function GetExtendedKeyFingerprint(key) {
        return CryptoHelper.RIPEMD160(CryptoHelper.SHA256(key)).slice(0, 4);
    }
    function GetMasterKeyFromSeed(seed) {
        var I = CryptoHelper.HmacSHA512(seed, "Bitcoin seed");
        var IL = I.slice(0, 32);
        var IR = I.slice(32, 64);
        return {
            key: WorkerUtils.ByteArrayToBigint(IL),
            chainCode: IR
        };
    }
    function SerializeExtendedKey(isPrivate, depth, parentKeyFingerprint, childIndex, chainCode, keyData, purpose) {
        var versionBytes;
        switch (purpose) {
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
        if (depth > 255) {
            return { type: "err", error: "Depth must be 255 at most" };
        }
        var finalResult = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], versionBytes), [depth]), parentKeyFingerprint), Uint32ToBytes(childIndex)), chainCode), keyData);
        return {
            type: "ok",
            result: WorkerUtils.Base58CheckEncode(finalResult)
        };
    }
    function UnextendKey(extendedKey) {
        var decodedKey = WorkerUtils.Base58CheckDecode(extendedKey);
        if (decodedKey.type === "err") {
            return decodedKey;
        }
        var keyData = decodedKey.result.slice(45);
        var key = WorkerUtils.ByteArrayToBigint(keyData.slice(1));
        if (keyData[0] === 0) {
            return {
                type: "ok",
                result: AddressUtil.MakePrivateKey(key)
            };
        }
        else {
            var keypair = { x: key, y: new BN(keyData[0]) };
            switch (extendedKey[0]) {
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
    function DeriveKey(extendedKey, path, toPrivate, type) {
        if (type === void 0) { type = "44"; }
        if (path[0] !== "m") {
            return { type: "err", error: "Path must start with \"m\"" };
        }
        var segments = path.substr(2).split("/");
        var childIndices = [];
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var index = segments_1[_i];
            if (index === "") {
                continue;
            }
            var match = index.match(/^(\d+)(')?$/);
            if (match) {
                var index_1 = parseInt(match[1]);
                var isHardened = match[2] !== undefined;
                childIndices.push((isHardened ? (index_1 | 0x80000000) : index_1) >>> 0);
            }
            else {
                return { type: "err", error: "Invalid path segment: " + index };
            }
        }
        var decodedKey = WorkerUtils.Base58CheckDecode(extendedKey);
        if (decodedKey.type === "err") {
            return decodedKey;
        }
        var currentDepth = decodedKey.result[4];
        var chainCode = decodedKey.result.slice(13, 45);
        var keyData = decodedKey.result.slice(45);
        var fromPrivate = keyData[0] === 0;
        if (!fromPrivate && toPrivate) {
            return { type: "err", error: "Cannot derive private key from public key" };
        }
        var parentKeyData = null;
        var lastIndex = BytesToUint32(decodedKey.result.slice(9, 13));
        var _loop_1 = function (childIndex) {
            parentKeyData = keyData;
            lastIndex = childIndex;
            var chainCodeResult = (function () {
                if (fromPrivate) {
                    var privateKey = keyData.slice(1);
                    var derivedKey = CKD_Priv({ key: privateKey, chainCode: chainCode }, childIndex);
                    keyData = __spreadArray([0x00], WorkerUtils.BigintToByteArrayLittleEndian32(derivedKey.key));
                    return {
                        type: "ok",
                        result: derivedKey.chainCode
                    };
                }
                else {
                    var keypair = {
                        x: keyData.slice(1),
                        isOdd: (keyData[0] & 1) !== 0
                    };
                    var derivedKey = CKD_Pub({ keypair: keypair, chainCode: chainCode }, childIndex);
                    if (derivedKey.type === "err") {
                        return derivedKey;
                    }
                    keyData = SerializeECCKeypairCompressed(derivedKey.result.keypair);
                    return {
                        type: "ok",
                        result: derivedKey.result.chainCode
                    };
                }
            })();
            if (chainCodeResult.type === "err") {
                return { value: chainCodeResult };
            }
            chainCode = chainCodeResult.result;
            ++currentDepth;
        };
        for (var _a = 0, childIndices_1 = childIndices; _a < childIndices_1.length; _a++) {
            var childIndex = childIndices_1[_a];
            var state_1 = _loop_1(childIndex);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        var convertToPublic = !toPrivate && keyData[0] === 0;
        var convertParentToPublic = !toPrivate && parentKeyData !== null && parentKeyData[0] === 0;
        if (convertToPublic) {
            keyData = SerializeECCKeypairCompressed(EllipticCurve.GetECCKeypair(WorkerUtils.ByteArrayToBigint(keyData.slice(1))));
        }
        if (convertParentToPublic) {
            parentKeyData = SerializeECCKeypairCompressed(EllipticCurve.GetECCKeypair(WorkerUtils.ByteArrayToBigint(parentKeyData.slice(1))));
        }
        var fingerprint = (function () {
            if (parentKeyData) {
                if (toPrivate) {
                    var pubkey = SerializeECCKeypairCompressed(EllipticCurve.GetECCKeypair(WorkerUtils.ByteArrayToBigint(parentKeyData.slice(1))));
                    return GetExtendedKeyFingerprint(pubkey);
                }
                else
                    return GetExtendedKeyFingerprint(parentKeyData);
            }
            else {
                return decodedKey.result.slice(5, 9);
            }
        })();
        return SerializeExtendedKey(toPrivate, currentDepth, fingerprint, lastIndex, chainCode, keyData, type);
    }
    function DeriveBIP32ExtendedKey(rootKey, path, derivedKeyPurpose, hardened, changeAddresses) {
        var isPrivate = rootKey.substr(1, 3) === "prv";
        if (derivedKeyPurpose !== "32") {
            if (isPrivate) {
                path += (changeAddresses ? "/1" : "/0");
            }
            else {
                path = "m";
            }
        }
        else {
            if (rootKey[0] === "y") {
                derivedKeyPurpose = "49";
            }
            else if (rootKey[0] === "z") {
                derivedKeyPurpose = "84";
            }
        }
        if (!isPrivate && hardened) {
            return { type: "err", error: "Hardened addresses can only be derived from extended private keys" };
        }
        var derivedExtendedPublicKey = DeriveKey(rootKey, path, false, derivedKeyPurpose);
        if (derivedExtendedPublicKey.type === "err") {
            return derivedExtendedPublicKey;
        }
        var derivedExtendedPrivateKey = isPrivate ? DeriveKey(rootKey, path, isPrivate, derivedKeyPurpose) : null;
        if (derivedExtendedPrivateKey !== null) {
            if (derivedExtendedPrivateKey.type === "err") {
                return derivedExtendedPrivateKey;
            }
        }
        return {
            type: "ok",
            result: {
                privateKey: derivedExtendedPrivateKey === null ? null : derivedExtendedPrivateKey.result,
                publicKey: derivedExtendedPublicKey.result,
                path: path,
                purpose: derivedKeyPurpose
            }
        };
    }
    function DeriveBIP32Address(path, publicKey, privateKey, index, purpose, hardened) {
        var resultPrivateKey = null;
        if (privateKey !== null) {
            var derivedPrivateKey = DeriveKey(privateKey, "m/" + index + (hardened ? "'" : ""), true, purpose);
            if (derivedPrivateKey.type === "err") {
                return derivedPrivateKey;
            }
            var unextendedPrivateKey = UnextendKey(derivedPrivateKey.result);
            if (unextendedPrivateKey.type === "err") {
                return unextendedPrivateKey;
            }
            resultPrivateKey = unextendedPrivateKey.result;
        }
        var derivedAddress = DeriveKey(privateKey !== null && privateKey !== void 0 ? privateKey : publicKey, "m/" + index + (hardened ? "'" : ""), false, purpose);
        if (derivedAddress.type === "err") {
            return derivedAddress;
        }
        var unextendedAddress = UnextendKey(derivedAddress.result);
        if (unextendedAddress.type === "err") {
            return unextendedAddress;
        }
        var addressPath = path + (path[path.length - 1] === "/" ? "" : "/") + index + (hardened ? "'" : "");
        return {
            type: "ok",
            result: {
                address: unextendedAddress.result,
                privateKey: resultPrivateKey,
                addressPath: addressPath
            }
        };
    }
    return {
        SerializeExtendedKey: SerializeExtendedKey,
        GetMasterKeyFromSeed: GetMasterKeyFromSeed,
        DeriveKey: DeriveKey,
        DeriveBIP32ExtendedKey: DeriveBIP32ExtendedKey,
        DeriveBIP32Address: DeriveBIP32Address
    };
}
