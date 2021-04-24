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
function InitBulkGeneratePage() {
    var AsyncNoParallel = Util().AsyncNoParallel;
    // address type
    var addressType = "bech32";
    var segwitAddressTypeRadioButton = document.getElementById("bulk-radio-type-segwit");
    var bech32AddressTypeRadioButton = document.getElementById("bulk-radio-type-bech32");
    var legacyAddressTypeRadioButton = document.getElementById("bulk-radio-type-legacy");
    segwitAddressTypeRadioButton.addEventListener("change", function () { return segwitAddressTypeRadioButton.checked && (addressType = "segwit"); });
    bech32AddressTypeRadioButton.addEventListener("change", function () { return bech32AddressTypeRadioButton.checked && (addressType = "bech32"); });
    legacyAddressTypeRadioButton.addEventListener("change", function () { return legacyAddressTypeRadioButton.checked && (addressType = "legacy"); });
    // bip38
    var bip38Checkbox = document.getElementById("bip38-enabled-bulk");
    var bip38PasswordContainer = document.getElementById("bip38-password-box-div-bulk");
    var bip38PasswordInput = document.getElementById("bip38-password-box-bulk");
    var bip38InfoLink = document.getElementById("show-bip38-info-link-bulk");
    var bip38InfoOverlay = document.getElementById("bip38-info");
    bip38InfoLink.addEventListener("click", function () { return bip38InfoOverlay.style.display = "table"; });
    bip38Checkbox.addEventListener("change", function () { return bip38PasswordContainer.style.display = bip38Checkbox.checked ? "table" : "none"; });
    // generate related elements
    var bulkGenerateButton = document.getElementById("bulk-generate-button");
    var bulkGenerateCountInput = document.getElementById("bulk-count");
    var resultTextArea = document.getElementById("bulk-addresses");
    function BulkGenerate() {
        return __awaiter(this, void 0, void 0, function () {
            function UpdateProgress() {
                resultTextArea.value = "Generating: " + (generatedCount++) + "/" + count;
            }
            function SetAndFormatResult(result) {
                resultTextArea.value = result
                    .map(function (_a, index) {
                    var address = _a.address, privateKey = _a.privateKey;
                    return (index + 1) + ", \"" + address + "\", \"" + privateKey + "\"";
                })
                    .join("\n");
            }
            var count, bulkAddressType, generatedCount, bip38Password, encryptionData, allPromises, i, result, allPromises, i, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        count = Number(bulkGenerateCountInput.value) | 0;
                        if (isNaN(count)) {
                            resultTextArea.value = "Enter a number";
                            return [2 /*return*/];
                        }
                        if (count < 1) {
                            resultTextArea.value = "Number must be greater than zero";
                            return [2 /*return*/];
                        }
                        if (count > 10000) {
                            resultTextArea.value = "Number must be 10,000 at most";
                            return [2 /*return*/];
                        }
                        bulkAddressType = addressType;
                        generatedCount = 0;
                        if (!bip38Checkbox.checked) return [3 /*break*/, 3];
                        bip38Password = bip38PasswordInput.value;
                        resultTextArea.value = "Generating initial values";
                        return [4 /*yield*/, WorkerInterface.GenerateRandomBIP38EncryptionData(bip38Password, bulkAddressType)];
                    case 1:
                        encryptionData = _a.sent();
                        if (encryptionData.type === "err") {
                            resultTextArea.value = encryptionData.error;
                            return [2 /*return*/];
                        }
                        UpdateProgress();
                        allPromises = new Array(count);
                        for (i = 0; i < count; ++i) {
                            allPromises[i] = WorkerInterface
                                .GenerateRandomBIP38EncryptedAddress(encryptionData.result)
                                .then(function (res) {
                                UpdateProgress();
                                return res;
                            });
                        }
                        return [4 /*yield*/, Promise.all(allPromises)];
                    case 2:
                        result = _a.sent();
                        SetAndFormatResult(result);
                        return [3 /*break*/, 5];
                    case 3:
                        UpdateProgress();
                        allPromises = new Array(count);
                        for (i = 0; i < count; ++i) {
                            allPromises[i] = WorkerInterface
                                .GenerateRandomAddress(bulkAddressType)
                                .then(function (res) {
                                UpdateProgress();
                                return res;
                            });
                        }
                        return [4 /*yield*/, Promise.all(allPromises)];
                    case 4:
                        result = _a.sent();
                        SetAndFormatResult(result);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    bulkGenerateButton.addEventListener("click", AsyncNoParallel(BulkGenerate));
}
