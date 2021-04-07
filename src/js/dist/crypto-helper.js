"use strict";
function BytesToWordArray(bytes) {
    return (new window.CryptoJS.lib.WordArray.init(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), bytes.length));
}
function WordArrayToBytes() {
    var wordArrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        wordArrays[_i] = arguments[_i];
    }
    var totalCount = 0;
    wordArrays.forEach(function (e) { return totalCount += e.sigBytes; });
    var ret = new Array(totalCount);
    var totalIndex = 0;
    for (var i = 0; i < wordArrays.length; ++i) {
        var currentWordArray = wordArrays[i];
        var words = currentWordArray.words;
        var count = currentWordArray.sigBytes;
        var index = 0;
        var offset = 0;
        for (var j = 0; j < count; ++j) {
            ret[totalIndex++] = words[index] >> ((3 - offset) << 3) & 0xff;
            if (++offset === 4) {
                offset = 0;
                ++index;
            }
        }
    }
    return ret;
}
function SHA256(msg) {
    var result = window.CryptoJS.SHA256(typeof msg === "string" ? msg : BytesToWordArray(msg));
    return WordArrayToBytes(result);
}
function SHA256Hex(msg) {
    var result = window.CryptoJS.SHA256(typeof msg === "string" ? msg : BytesToWordArray(msg));
    return result.toString(window.CryptoJS.enc.Hex);
}
function RIPEMD160(bytes) {
    var result = window.CryptoJS.RIPEMD160(BytesToWordArray(bytes));
    return WordArrayToBytes(result);
}
function HmacSHA512(msg, key) {
    return WordArrayToBytes(window.CryptoJS.HmacSHA512(typeof msg === "string" ? msg : BytesToWordArray(msg), typeof key === "string" ? key : BytesToWordArray(key)));
}
function AES_Encrypt_ECB_NoPadding(msg, password) {
    var result = window.CryptoJS.AES.encrypt(BytesToWordArray(msg), BytesToWordArray(password), {
        mode: window.CryptoJS.mode.ECB,
        padding: window.CryptoJS.pad.NoPadding
    });
    return WordArrayToBytes(result.ciphertext);
}
function AES_Decrypt_ECB_NoPadding(ciphertext, password) {
    var result = window.CryptoJS.AES.decrypt({ ciphertext: BytesToWordArray(ciphertext) }, BytesToWordArray(password), {
        mode: window.CryptoJS.mode.ECB,
        padding: window.CryptoJS.pad.NoPadding
    });
    return WordArrayToBytes(result);
}
function PBKDF2(password, salt, iterations, dklen) {
    if (iterations === void 0) { iterations = 2048; }
    if (dklen === void 0) { dklen = 512 / 32; }
    return WordArrayToBytes(window.CryptoJS.PBKDF2(typeof password === "string" ? password : BytesToWordArray(password), typeof salt === "string" ? salt : BytesToWordArray(salt), {
        iterations: iterations,
        keySize: dklen,
        hasher: window.CryptoJS.algo.SHA512
    }));
}
