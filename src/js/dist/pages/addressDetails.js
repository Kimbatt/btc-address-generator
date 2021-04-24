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
function InitAddressDetailsPage() {
    var _a = Util(), AsyncNoParallel = _a.AsyncNoParallel, GenerateAddressQRCode = _a.GenerateAddressQRCode, WaitForImageLoad = _a.WaitForImageLoad, ShowLoadingHelper = _a.ShowLoadingHelper;
    var privateKeyInput = document.getElementById("view-address-private-key-textbox");
    var privateKeyInfoContainer = document.getElementById("view-address-div");
    var viewAddressDetailsButton = document.getElementById("view-address-details-button");
    var messageDiv = document.getElementById("view-address-message");
    var privateKeyTextDiv = document.getElementById("view-address-private-key");
    var privateKeyDetailsTextDiv = document.getElementById("view-address-private-key-details-text");
    var decryptedPrivateKeyTextDiv = document.getElementById("view-address-decrypted-private-key");
    var decryptedPrivateKeyDetailsTextDiv = document.getElementById("view-address-decrypted-private-key-details-text");
    var bip38decryptDiv = document.getElementById("view-address-bip38-decrypt-div");
    var bip38passwordInput = document.getElementById("view-address-bip38-password-textbox");
    var bip38decryptButton = document.getElementById("view-address-decrypt-button");
    var segwitAddressTextDiv = document.getElementById("view-address-segwitaddress");
    var bech32AddressTextDiv = document.getElementById("view-address-bech32address");
    var legacyAddressTextDiv = document.getElementById("view-address-legacyaddress");
    var segwitQRImage = document.getElementById("view-address-segwitaddress-qr");
    var bech32QRImage = document.getElementById("view-address-bech32address-qr");
    var legacyQRImage = document.getElementById("view-address-legacyaddress-qr");
    var loading = new ShowLoadingHelper(document.getElementById("view-address-loading-container"), 100);
    function ViewAddressDetails(privateKey, encryptedPrivateKey) {
        if (encryptedPrivateKey === void 0) { encryptedPrivateKey = null; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (privateKey === "") {
                            return [2 /*return*/];
                        }
                        loading.show();
                        return [4 /*yield*/, WorkerInterface.GetPrivateKeyDetails(privateKey)];
                    case 1:
                        result = _a.sent();
                        if (encryptedPrivateKey === null) {
                            decryptedPrivateKeyTextDiv.style.display = "none";
                            decryptedPrivateKeyDetailsTextDiv.style.display = "none";
                            bip38decryptDiv.style.display = "none";
                        }
                        if (result.type === "error") {
                            messageDiv.style.display = "";
                            privateKeyInfoContainer.style.display = "none";
                            privateKeyDetailsTextDiv.style.display = "none";
                            messageDiv.textContent = "Invalid private key (" + result.message + ")";
                            loading.hide();
                            return [2 /*return*/];
                        }
                        messageDiv.style.display = "none";
                        if (result.type === "probablyBIP38") {
                            bip38decryptDiv.style.display = "";
                            privateKeyInfoContainer.style.display = "none";
                            privateKeyDetailsTextDiv.style.display = "none";
                            loading.hide();
                            return [2 /*return*/];
                        }
                        // all ok, generate qr codes first
                        return [4 /*yield*/, Promise.all([
                                GenerateAddressQRCode(result.segwitAddress, "segwit", "H", 4, 8).then(function (qrImageSrc) { return WaitForImageLoad(segwitQRImage, qrImageSrc); }),
                                GenerateAddressQRCode(result.bech32Address, "bech32", "H", 4, 8).then(function (qrImageSrc) { return WaitForImageLoad(bech32QRImage, qrImageSrc); }),
                                GenerateAddressQRCode(result.legacyAddress, "legacy", "H", 4, 8).then(function (qrImageSrc) { return WaitForImageLoad(legacyQRImage, qrImageSrc); })
                            ])];
                    case 2:
                        // all ok, generate qr codes first
                        _a.sent();
                        // set text fields
                        segwitAddressTextDiv.textContent = result.segwitAddress;
                        bech32AddressTextDiv.textContent = result.bech32Address;
                        legacyAddressTextDiv.textContent = result.legacyAddress;
                        if (encryptedPrivateKey !== null) {
                            privateKeyDetailsTextDiv.textContent = "Details for encrypted private key: ";
                            privateKeyTextDiv.textContent = encryptedPrivateKey;
                            decryptedPrivateKeyTextDiv.style.display = "inline";
                            decryptedPrivateKeyTextDiv.textContent = privateKey;
                            decryptedPrivateKeyDetailsTextDiv.style.display = "block";
                        }
                        else {
                            privateKeyDetailsTextDiv.textContent = "Details for private key: ";
                            privateKeyTextDiv.textContent = privateKey;
                        }
                        loading.hide();
                        // show container
                        privateKeyInfoContainer.style.display = "table";
                        privateKeyDetailsTextDiv.style.display = "inline";
                        bip38decryptDiv.style.display = "none";
                        return [2 /*return*/];
                }
            });
        });
    }
    var ViewDetailsFunction = AsyncNoParallel(ViewAddressDetails);
    var GetPrivateKeyInputValue = function () { return privateKeyInput.value.trim(); };
    viewAddressDetailsButton.addEventListener("click", function () { return ViewDetailsFunction(GetPrivateKeyInputValue()); });
    privateKeyInput.addEventListener("keyup", function (ev) { return ev.key === "Enter" && ViewDetailsFunction(GetPrivateKeyInputValue()); });
    function DecryptPrivateKey() {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedPrivateKey, decrypted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading.show();
                        messageDiv.style.display = "none";
                        encryptedPrivateKey = privateKeyInput.value.trim();
                        return [4 /*yield*/, WorkerInterface.BIP38DecryptPrivateKey(encryptedPrivateKey, bip38passwordInput.value)];
                    case 1:
                        decrypted = _a.sent();
                        if (decrypted.type === "err") {
                            messageDiv.style.display = "";
                            messageDiv.textContent = "Cannot decrypt address (" + decrypted.error + ")";
                            loading.hide();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ViewAddressDetails(decrypted.result, encryptedPrivateKey)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    var DecryptPrivateKeyFunction = AsyncNoParallel(DecryptPrivateKey);
    bip38decryptButton.addEventListener("click", DecryptPrivateKeyFunction);
    bip38passwordInput.addEventListener("keyup", function (ev) { return ev.key === "Enter" && DecryptPrivateKeyFunction(); });
}
