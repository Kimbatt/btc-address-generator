"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
// lazy evaluation, trying to achieve a behavior similar to imports
function Lazy(fn) {
    var evaluated = null;
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (evaluated !== null && evaluated !== void 0 ? evaluated : (evaluated = fn.apply(void 0, a)));
    };
}
var Util = (function () { return Lazy(function () {
    var _a = Query(), HasQueryKey = _a.HasQueryKey, GetQueryValue = _a.GetQueryValue, GetAllQueryValues = _a.GetAllQueryValues;
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
    function SetDarkMode(isDark) {
        isDarkMode = isDark;
        document.body.classList.remove(isDark ? "light" : "dark");
        document.body.classList.add(isDark ? "dark" : "light");
    }
    var isTestnet = HasQueryKey("testnet");
    function AsyncNoParallel(fn) {
        var _this = this;
        var running = false;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (running) {
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 3, 4]);
                            running = true;
                            return [4 /*yield*/, fn.apply(void 0, args)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            running = false;
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
    }
    function WaitForImageLoad(image, src) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (src !== undefined) {
                            image.src = src;
                        }
                        return [4 /*yield*/, new Promise(function (resolve) {
                                function OnLoad() {
                                    image.removeEventListener("load", OnLoad);
                                    resolve(image);
                                }
                                image.addEventListener("load", OnLoad);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function GenerateAddressQRCode(address, addressType, errorCorrectionLevel, cellSize, margin) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, mode;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = addressType === "bech32" ? [address.toUpperCase(), "Alphanumeric"] : [address, "Byte"], data = _a[0], mode = _a[1];
                        return [4 /*yield*/, WorkerInterface.GenerateQRCode(data, errorCorrectionLevel, mode, cellSize, margin)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    }
    function GenerateQRCode(data, errorCorrectionLevel, mode, cellSize, margin) {
        if (mode === void 0) { mode = "Byte"; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WorkerInterface.GenerateQRCode(data, errorCorrectionLevel, mode, cellSize, margin)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    var ShowLoadingHelper = /** @class */ (function () {
        function ShowLoadingHelper(elem, delayBeforeShow) {
            this.timeoutHandle = -1;
            this.elem = elem;
            this.delayBeforeShow = delayBeforeShow;
        }
        ShowLoadingHelper.prototype.show = function () {
            var _this = this;
            if (this.delayBeforeShow === 0) {
                this.elem.style.display = "";
            }
            else {
                this.timeoutHandle = setTimeout(function () { return _this.elem.style.display = ""; }, this.delayBeforeShow);
            }
        };
        ShowLoadingHelper.prototype.hide = function () {
            this.elem.style.display = "none";
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = -1;
        };
        return ShowLoadingHelper;
    }());
    return {
        IsDarkMode: function () { return isDarkMode; },
        SetDarkMode: SetDarkMode,
        IsTestnet: function () { return isTestnet; },
        AsyncNoParallel: AsyncNoParallel,
        GenerateAddressQRCode: GenerateAddressQRCode,
        GenerateQRCode: GenerateQRCode,
        WaitForImageLoad: WaitForImageLoad,
        ShowLoadingHelper: ShowLoadingHelper
    };
}); })();
function INIT_WorkerUtils() {
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
    }
    var isTestnet = false;
    function SetIsTestnet(testnet) {
        isTestnet = testnet;
    }
    function IsTestnet() {
        return isTestnet;
    }
    function TypedArrayPush(targetArray, srcArray) {
        for (var i = 0; i < srcArray.length; ++i) {
            targetArray.push(srcArray[i]);
        }
    }
    function Get32SecureRandomBytes() {
        if (entropy !== null) {
            var tempArray = [];
            TypedArrayPush(tempArray, self.crypto.getRandomValues(new Uint8Array(8)));
            tempArray.push.apply(tempArray, entropy);
            var tempArray2 = CryptoHelper.SHA256(tempArray);
            TypedArrayPush(tempArray2, self.crypto.getRandomValues(new Uint8Array(8)));
            return CryptoHelper.SHA256(tempArray2);
        }
        // skipped randomness generation
        var bytes = self.crypto.getRandomValues(new Uint8Array(32));
        var ret = new Array(32);
        for (var i = 0; i < 32; ++i) {
            ret[i] = bytes[i];
        }
        return ret;
    }
    var bn_0 = new BN(0);
    var bn_255 = new BN(255);
    function BigintToByteArray(bigint) {
        var ret = [];
        while (bigint.gt(bn_0)) {
            ret.push(bigint.and(bn_255).toNumber());
            bigint = bigint.shrn(8);
        }
        return ret;
    }
    function ByteArrayToBigint(bytes) {
        var bigint = new BN(0);
        for (var i = 0; i < bytes.length; ++i) {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[i]));
        }
        return bigint;
    }
    function BigintToBitArray(bigint) {
        if (bigint.isNeg())
            return [false];
        var values = [];
        while (bigint.gt(bn_0)) {
            values.push(bigint.isOdd());
            bigint = bigint.shrn(1);
        }
        return values.reverse();
    }
    function ByteArrayXOR(b1, b2) {
        var ret = [];
        for (var i = 0; i < b1.length; ++i)
            ret.push(b1[i] ^ b2[i]);
        return ret;
    }
    function BigintToByteArrayLittleEndian32(bigint) {
        var array = BigintToByteArray(bigint);
        while (array.length < 32) {
            array.push(0);
        }
        return array.reverse();
    }
    var base58Characters = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var base58CharsIndices = {
        "1": 0, "2": 1, "3": 2, "4": 3,
        "5": 4, "6": 5, "7": 6, "8": 7,
        "9": 8, "A": 9, "B": 10, "C": 11,
        "D": 12, "E": 13, "F": 14, "G": 15,
        "H": 16, "J": 17, "K": 18, "L": 19,
        "M": 20, "N": 21, "P": 22, "Q": 23,
        "R": 24, "S": 25, "T": 26, "U": 27,
        "V": 28, "W": 29, "X": 30, "Y": 31,
        "Z": 32, "a": 33, "b": 34, "c": 35,
        "d": 36, "e": 37, "f": 38, "g": 39,
        "h": 40, "i": 41, "j": 42, "k": 43,
        "m": 44, "n": 45, "o": 46, "p": 47,
        "q": 48, "r": 49, "s": 50, "t": 51,
        "u": 52, "v": 53, "w": 54, "x": 55,
        "y": 56, "z": 57,
    };
    var bn_58 = new BN(58);
    function Base58CheckEncode(bytes) {
        var leading_zeroes = 0;
        while (bytes[leading_zeroes] === 0) {
            // count leading zeroes
            ++leading_zeroes;
        }
        // note: typescript doesn't allow using the spread operator
        // on Uint8Arrays, but in javascript it works fine
        // so here the bytes are casted to number[] for this reason
        bytes = __spreadArray(__spreadArray([], bytes), CryptoHelper.SHA256(CryptoHelper.SHA256(bytes)).slice(0, 4));
        var bigint = new BN(0);
        // convert bytes to bigint
        for (var i = 0; i < bytes.length; ++i) {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[i]));
        }
        bytes.reverse();
        var ret = [];
        while (bigint.gt(bn_0)) {
            // get base58 character
            var remainder = bigint.mod(bn_58);
            bigint = bigint.div(bn_58);
            ret.push(base58Characters[remainder.toNumber()]);
        }
        for (var i = 0; i < leading_zeroes; ++i) {
            // add padding if necessary
            ret.push(base58Characters[0]);
        }
        return ret.reverse().join("");
    }
    function Base58CheckDecode(text) {
        var newstring = text.split("").reverse();
        for (var i_1 = 0; i_1 < text.length; ++i_1) {
            if (text[i_1] == base58Characters[0]) {
                newstring.pop();
            }
            else {
                break;
            }
        }
        var bigint = bn_0;
        for (var i_2 = newstring.length - 1; i_2 >= 0; --i_2) {
            var charIndex = base58CharsIndices[newstring[i_2]];
            if (charIndex === undefined) {
                return { type: "err", error: "invalid character: " + newstring[i_2] };
            }
            bigint = (bigint.mul(bn_58)).add(new BN(charIndex));
        }
        var bytes = BigintToByteArray(bigint);
        if (bytes[bytes.length - 1] == 0) {
            bytes.pop();
        }
        bytes.reverse();
        var checksum = bytes.slice(bytes.length - 4, bytes.length);
        bytes.splice(bytes.length - 4, 4);
        var sha_result = CryptoHelper.SHA256(CryptoHelper.SHA256(bytes));
        for (var i = 0; i < 4; ++i) {
            if (sha_result[i] != checksum[i]) {
                return { type: "err", error: "invalid checksum" };
            }
        }
        return { type: "ok", result: bytes };
    }
    function GenerateQRCode(data, errorCorrectionLevel, mode, cellSize, margin) {
        var qr = qrcode(0, errorCorrectionLevel);
        qr.addData(data, mode);
        qr.make();
        return "data:image/svg+xml," + encodeURI(qr.createSvgTag(cellSize, margin));
    }
    return {
        SetEntropy: SetEntropy,
        SetIsTestnet: SetIsTestnet,
        IsTestnet: IsTestnet,
        Get32SecureRandomBytes: Get32SecureRandomBytes,
        BigintToBitArray: BigintToBitArray,
        BigintToByteArray: BigintToByteArray,
        ByteArrayToBigint: ByteArrayToBigint,
        ByteArrayXOR: ByteArrayXOR,
        BigintToByteArrayLittleEndian32: BigintToByteArrayLittleEndian32,
        Base58CheckEncode: Base58CheckEncode,
        Base58CheckDecode: Base58CheckDecode,
        GenerateQRCode: GenerateQRCode
    };
}
