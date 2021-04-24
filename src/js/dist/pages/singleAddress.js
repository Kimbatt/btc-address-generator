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
function InitSingleAddressPage() {
    var _this = this;
    var _a = Util(), AsyncNoParallel = _a.AsyncNoParallel, GenerateAddressQRCode = _a.GenerateAddressQRCode, GenerateQRCode = _a.GenerateQRCode;
    // address type
    var addressType = "bech32";
    var segwitAddressTypeRadioButton = document.getElementById("singleaddress-radio-type-segwit");
    var bech32AddressTypeRadioButton = document.getElementById("singleaddress-radio-type-bech32");
    var legacyAddressTypeRadioButton = document.getElementById("singleaddress-radio-type-legacy");
    segwitAddressTypeRadioButton.addEventListener("change", function () { return segwitAddressTypeRadioButton.checked && (addressType = "segwit"); });
    bech32AddressTypeRadioButton.addEventListener("change", function () { return bech32AddressTypeRadioButton.checked && (addressType = "bech32"); });
    legacyAddressTypeRadioButton.addEventListener("change", function () { return legacyAddressTypeRadioButton.checked && (addressType = "legacy"); });
    // qr error correction level
    var qrErrorCorrectionLevel = "H";
    function SetQRErrorCorrectionLevel(level) {
        qrErrorCorrectionLevel = level;
    }
    var qrErrorCorrectionLevelHRadioButton = document.getElementById("singleaddress-radio-qr-errorcorrectionlevel-h");
    var qrErrorCorrectionLevelQRadioButton = document.getElementById("singleaddress-radio-qr-errorcorrectionlevel-q");
    var qrErrorCorrectionLevelMRadioButton = document.getElementById("singleaddress-radio-qr-errorcorrectionlevel-m");
    var qrErrorCorrectionLevelLRadioButton = document.getElementById("singleaddress-radio-qr-errorcorrectionlevel-l");
    qrErrorCorrectionLevelHRadioButton.addEventListener("change", function () { return qrErrorCorrectionLevelHRadioButton.checked && SetQRErrorCorrectionLevel("H"); });
    qrErrorCorrectionLevelQRadioButton.addEventListener("change", function () { return qrErrorCorrectionLevelQRadioButton.checked && SetQRErrorCorrectionLevel("Q"); });
    qrErrorCorrectionLevelMRadioButton.addEventListener("change", function () { return qrErrorCorrectionLevelMRadioButton.checked && SetQRErrorCorrectionLevel("M"); });
    qrErrorCorrectionLevelLRadioButton.addEventListener("change", function () { return qrErrorCorrectionLevelLRadioButton.checked && SetQRErrorCorrectionLevel("L"); });
    // address generation
    var generateButton = document.getElementById("singleaddress-generate-address-button");
    var privateKeyTextDiv = document.getElementById("single-address-private-key");
    var privateKeyQRImage = document.getElementById("single-address-private-key-qr");
    var addressTextDiv = document.getElementById("single-address-address");
    var addressQRImage = document.getElementById("single-address-qr");
    var container = document.getElementById("address-div");
    var Generate = AsyncNoParallel(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, _a, privateKeyQR, addressQR;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, WorkerInterface.GenerateRandomAddress(addressType)];
                case 1:
                    result = _b.sent();
                    return [4 /*yield*/, Promise.all([
                            GenerateQRCode(result.privateKey, qrErrorCorrectionLevel, "Byte", 6, 12),
                            GenerateAddressQRCode(result.address, addressType, qrErrorCorrectionLevel, 6, 12),
                        ])];
                case 2:
                    _a = _b.sent(), privateKeyQR = _a[0], addressQR = _a[1];
                    privateKeyTextDiv.textContent = result.privateKey;
                    privateKeyQRImage.src = privateKeyQR;
                    privateKeyQRImage.style.display = "block";
                    privateKeyQRImage.style.marginLeft = "auto";
                    privateKeyQRImage.style.marginRight = "auto";
                    addressTextDiv.textContent = result.address;
                    addressQRImage.src = addressQR;
                    addressQRImage.style.display = "block";
                    addressQRImage.style.marginLeft = "auto";
                    addressQRImage.style.marginRight = "auto";
                    container.style.display = "table";
                    return [2 /*return*/];
            }
        });
    }); });
    generateButton.addEventListener("click", Generate);
    return Generate;
}
