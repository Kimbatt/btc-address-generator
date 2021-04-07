"use strict";
var Util = (function () {
    var isDarkMode = (function () {
        // check if browser supports prefers-color-scheme
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme)").matches) {
            // media query supported, check preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                // use dark mode
                return true;
            }
            else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                // use light mode
                return false;
            }
        }
        // use dark mode based on time
        var hour = new Date().getHours();
        return hour < 7 || hour > 18;
    })();
    var entropy = null;
    function SetEntropy(values) {
        entropy = [];
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            value = Math.abs(value | 0);
            do {
                entropy.push(value & 0xff);
                value >>>= 8;
            } while (value !== 0);
        }
        console.log(entropy);
    }
    function TypedArrayPush(targetArray, srcArray) {
        for (var i = 0; i < srcArray.length; ++i) {
            targetArray.push(srcArray[i]);
        }
    }
    function Get32SecureRandomBytes() {
        if (entropy !== null) {
            var tempArray = [];
            TypedArrayPush(tempArray, window.crypto.getRandomValues(new Uint8Array(8)));
            tempArray.push.apply(tempArray, entropy);
            var tempArray2 = SHA256(tempArray);
            TypedArrayPush(tempArray2, window.crypto.getRandomValues(new Uint8Array(8)));
            return SHA256(tempArray2);
        }
        // skipped randomness generation
        var bytes = window.crypto.getRandomValues(new Uint8Array(32));
        var ret = new Array(32);
        for (var i = 0; i < 32; ++i) {
            ret[i] = bytes[i];
        }
        return ret;
    }
    return {
        isDarkMode: isDarkMode,
        SetEntropy: SetEntropy,
        Get32SecureRandomBytes: Get32SecureRandomBytes
    };
});
