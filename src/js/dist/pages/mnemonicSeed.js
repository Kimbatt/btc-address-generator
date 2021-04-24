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
function InitMnemonicSeedPage() {
    var _this = this;
    var AsyncNoParallel = Util().AsyncNoParallel;
    // page switching
    var seedGeneratorPage = document.getElementById("seed-generate-page");
    var seedDetailsPage = document.getElementById("seed-details-page");
    var activateSeedGeneratorPageButton = document.getElementById("seed-generate-page-button");
    var activateSeedDetailsPageButton = document.getElementById("seed-details-page-button");
    activateSeedDetailsPageButton.addEventListener("click", function () {
        seedGeneratorPage.style.display = "none";
        seedDetailsPage.style.display = "";
        activateSeedDetailsPageButton.disabled = true;
        activateSeedGeneratorPageButton.disabled = false;
    });
    activateSeedGeneratorPageButton.addEventListener("click", function () {
        seedGeneratorPage.style.display = "";
        seedDetailsPage.style.display = "none";
        activateSeedDetailsPageButton.disabled = false;
        activateSeedGeneratorPageButton.disabled = true;
    });
    // seed generation
    var generateSeedButton = document.getElementById("seed-generate-button");
    var generateSeedResultDiv = document.getElementById("seed-generate-result");
    var generateSeedWordCount = document.getElementById("seed-generate-wordcount");
    generateSeedButton.addEventListener("click", AsyncNoParallel(function () { return __awaiter(_this, void 0, void 0, function () {
        var wordCount, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    wordCount = Number(generateSeedWordCount.value);
                    switch (wordCount) {
                        case 12:
                        case 15:
                        case 18:
                        case 21:
                        case 24:
                            break;
                        default:
                            // should not happen
                            return [2 /*return*/];
                    }
                    _a = generateSeedResultDiv;
                    return [4 /*yield*/, WorkerInterface.GenerateMnemonicSeed(wordCount)];
                case 1:
                    _a.textContent = _b.sent();
                    generateSeedResultDiv.style.display = "";
                    return [2 /*return*/];
            }
        });
    }); }));
    // view seed details
    var seedInputTextArea = document.getElementById("seed-details-seed-textarea");
    var seedPasswordInput = document.getElementById("seed-details-seed-password");
    var seedPasswordContainerDiv = document.getElementById("seed-details-password-container");
    var seedDetailsErrorText = document.getElementById("seed-details-error-text");
    var seedResultsContainerDiv = document.getElementById("seed-details-results");
    var bip32extendedKeyStartRegex = /^[xyz](pub|prv)/;
    function SeedChanged() {
        var seed = seedInputTextArea.value;
        var isBIP32key = bip32extendedKeyStartRegex.test(seed);
        seedPasswordContainerDiv.style.display = isBIP32key ? "none" : "";
        seedResultsContainerDiv.style.display = "none";
        seedDetailsErrorText.style.display = "none";
    }
    function SeedPasswordChanged() {
        seedResultsContainerDiv.style.display = "none";
        seedDetailsErrorText.style.display = "none";
    }
    seedInputTextArea.addEventListener("input", SeedChanged);
    seedPasswordInput.addEventListener("input", SeedPasswordChanged);
    var viewSeedDetailsButton = document.getElementById("seed-view-details");
    var rootKeyContainerDiv = document.getElementById("seed-details-results-bip32-rootkey-container");
    var rootKeyTextArea = document.getElementById("seed-details-results-rootkey");
    var changeAddressesLabel = document.getElementById("seed-details-results-change-addresses-label");
    var changeAddressesCheckbox = document.getElementById("seed-details-change-addresses-checkbox");
    var hardenedAddressesLabel = document.getElementById("seed-details-results-hardened-addresses-label");
    var hardenedAddressesCheckbox = document.getElementById("seed-details-hardened-addresses-checkbox");
    var seedResultsAddressesContainerDiv = document.getElementById("seed-details-results-addresses-container");
    var calculateAddressesErrorTextDiv = document.getElementById("seed-details-addresses-error-text");
    function ViewSeedDetails() {
        return __awaiter(this, void 0, void 0, function () {
            function ShowError(text) {
                seedDetailsErrorText.textContent = text;
                seedDetailsErrorText.style.display = "";
                seedResultsContainerDiv.style.display = "none";
            }
            var seed, password, rootKey;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        seed = seedInputTextArea.value.trim();
                        password = seedPasswordInput.value;
                        changeAddressesLabel.style.display = "";
                        hardenedAddressesLabel.style.display = "";
                        calculateAddressesErrorTextDiv.style.display = "none";
                        if (seed === "") {
                            ShowError("Seed cannot be empty");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var decodedKeyResult, result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!bip32extendedKeyStartRegex.test(seed)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, WorkerInterface.Base58CheckDecode(seed)];
                                        case 1:
                                            decodedKeyResult = _a.sent();
                                            if (decodedKeyResult.type === "err") {
                                                ShowError("Invalid BIP32 key: " + decodedKeyResult.error);
                                                return [2 /*return*/, null];
                                            }
                                            switch (seed[0]) {
                                                case "x":
                                                    SeedDerivationPresetChanged("44");
                                                    break;
                                                case "y":
                                                    SeedDerivationPresetChanged("49");
                                                    break;
                                                case "z":
                                                    SeedDerivationPresetChanged("84");
                                                    break;
                                                default:
                                                    // should not happen
                                                    return [2 /*return*/, null];
                                            }
                                            if (seed.substr(1, 3) === "pub") {
                                                changeAddressesLabel.style.display = "none";
                                                hardenedAddressesLabel.style.display = "none";
                                            }
                                            rootKeyContainerDiv.style.display = "none";
                                            return [2 /*return*/, seed];
                                        case 2: return [4 /*yield*/, WorkerInterface.GetBIP32RootKeyFromSeed(seed, password)];
                                        case 3:
                                            result = _a.sent();
                                            if (result.type === "err") {
                                                ShowError("Invalid mnemonic seed: " + result.error);
                                                return [2 /*return*/, null];
                                            }
                                            rootKeyContainerDiv.style.display = "";
                                            return [2 /*return*/, result.result];
                                    }
                                });
                            }); })()];
                    case 1:
                        rootKey = _a.sent();
                        if (rootKey === null) {
                            return [2 /*return*/];
                        }
                        rootKeyTextArea.value = rootKey;
                        seedDetailsErrorText.style.display = "none";
                        seedResultsContainerDiv.style.display = "";
                        seedResultsAddressesContainerDiv.style.display = "none";
                        return [2 /*return*/];
                }
            });
        });
    }
    viewSeedDetailsButton.addEventListener("click", AsyncNoParallel(ViewSeedDetails));
    var seedDerivationPathInput = document.getElementById("seed-details-results-derivation-path-input");
    var seedDerivationPathPresetSelector = document.getElementById("seed-details-derivation-path-preset");
    function SeedDerivationPresetChanged(preset) {
        switch (preset) {
            case "44":
                seedDerivationPathInput.value = "m/44'/0'/0'";
                break;
            case "49":
                seedDerivationPathInput.value = "m/49'/0'/0'";
                break;
            case "84":
                seedDerivationPathInput.value = "m/84'/0'/0'";
                break;
            case "32":
            default:
                seedDerivationPathInput.value = "";
                break;
        }
        seedDerivationPathPresetSelector.value = preset;
        seedDerivationPathInput.disabled = preset !== "32";
        // hide change addresses checkbox when using custom path
        changeAddressesLabel.style.display = preset === "32" ? "none" : "";
    }
    seedDerivationPathPresetSelector.addEventListener("change", function () { return SeedDerivationPresetChanged(seedDerivationPathPresetSelector.value); });
    var calculateAddressesButton = document.getElementById("seed-details-address-calculate-button");
    var extendedPublicKeyTextArea = document.getElementById("seed-details-results-extended-pubkey");
    var extendedPrivateKeyTextArea = document.getElementById("seed-details-results-extended-private-key");
    var addressCountInput = document.getElementById("seed-details-address-count");
    var addressOffsetInput = document.getElementById("seed-details-address-offset");
    var addressesResultTable = document.getElementById("seed-details-results-addresses-table");
    var calculateProgressDiv = document.getElementById("seed-details-address-calculate-progress");
    function CalculateAddresses() {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            function ShowError(text) {
                calculateAddressesErrorTextDiv.textContent = text;
                calculateAddressesErrorTextDiv.style.display = "";
                seedResultsAddressesContainerDiv.style.display = "none";
            }
            function UpdateProgress() {
                calculateProgressDiv.textContent = "Calculating: " + currentProgress++ + "/" + count;
            }
            function CreateRow(path, address, privateKey) {
                var row = document.createElement("div");
                row.className = "seed-details-results-address-row";
                var pathDiv = document.createElement("div");
                pathDiv.textContent = path;
                var addressDiv = document.createElement("div");
                addressDiv.textContent = address;
                var privateKeyDiv = document.createElement("div");
                privateKeyDiv.textContent = privateKey;
                row.appendChild(pathDiv);
                row.appendChild(addressDiv);
                row.appendChild(privateKeyDiv);
                addressesResultTable.appendChild(row);
            }
            var rootKey, path, generateHardenedAddresses, count, startIndex, endIndex, derivedKeyPurpose, isPrivate, generateChangeAddresses, currentProgress, derived, allPromises, _loop_1, i, result, _i, result_1, current;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        calculateAddressesErrorTextDiv.style.display = "none";
                        rootKey = rootKeyTextArea.value;
                        path = seedDerivationPathInput.value;
                        generateHardenedAddresses = hardenedAddressesCheckbox.checked;
                        count = Number(addressCountInput.value) | 0;
                        if (isNaN(count) || count < 1) {
                            count = 10;
                            addressCountInput.value = count.toString();
                        }
                        startIndex = Number(addressOffsetInput.value) | 0;
                        if (isNaN(startIndex) || startIndex < 0) {
                            startIndex = 0;
                            addressOffsetInput.value = startIndex.toString();
                        }
                        endIndex = startIndex + count;
                        if (endIndex > 0x80000000) {
                            ShowError("Start index + Count must be 2147483648 at most");
                            return [2 /*return*/];
                        }
                        derivedKeyPurpose = seedDerivationPathPresetSelector.value;
                        isPrivate = rootKey.substr(1, 3) === "prv";
                        generateChangeAddresses = changeAddressesCheckbox.checked;
                        if (!isPrivate && generateHardenedAddresses) {
                            ShowError("Hardened addresses can only be derived from extended private keys");
                            return [2 /*return*/];
                        }
                        calculateProgressDiv.style.display = "";
                        currentProgress = 0;
                        UpdateProgress();
                        seedResultsAddressesContainerDiv.style.display = "none";
                        return [4 /*yield*/, WorkerInterface.DeriveBIP32ExtendedKey(rootKey, path, derivedKeyPurpose, generateHardenedAddresses, generateChangeAddresses)];
                    case 1:
                        derived = _b.sent();
                        if (derived.type === "err") {
                            ShowError(derived.error);
                            return [2 /*return*/];
                        }
                        path = derived.result.path;
                        derivedKeyPurpose = derived.result.purpose;
                        extendedPublicKeyTextArea.value = derived.result.publicKey;
                        extendedPrivateKeyTextArea.value = (_a = derived.result.privateKey) !== null && _a !== void 0 ? _a : "???";
                        while (addressesResultTable.lastChild) {
                            addressesResultTable.removeChild(addressesResultTable.lastChild);
                        }
                        allPromises = [];
                        _loop_1 = function (i) {
                            allPromises.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, WorkerInterface.DeriveBIP32Address(path, derived.result.publicKey, derived.result.privateKey, i, derivedKeyPurpose, generateHardenedAddresses)];
                                        case 1:
                                            result = _b.sent();
                                            UpdateProgress();
                                            if (result.type === "err") {
                                                return [2 /*return*/, {
                                                        address: "Error calculating address",
                                                        privateKey: "Error calculating private key",
                                                        addressPath: "Error calculating path"
                                                    }];
                                            }
                                            else {
                                                return [2 /*return*/, {
                                                        address: result.result.address,
                                                        privateKey: (_a = result.result.privateKey) !== null && _a !== void 0 ? _a : "???",
                                                        addressPath: result.result.addressPath
                                                    }];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })());
                        };
                        for (i = startIndex; i < endIndex; ++i) {
                            _loop_1(i);
                        }
                        return [4 /*yield*/, Promise.all(allPromises)];
                    case 2:
                        result = _b.sent();
                        calculateProgressDiv.style.display = "none";
                        for (_i = 0, result_1 = result; _i < result_1.length; _i++) {
                            current = result_1[_i];
                            CreateRow(current.addressPath, current.address, current.privateKey);
                        }
                        seedResultsAddressesContainerDiv.style.display = "";
                        return [2 /*return*/];
                }
            });
        });
    }
    calculateAddressesButton.addEventListener("click", AsyncNoParallel(CalculateAddresses));
    var toggleExtendedKeysButton = document.getElementById("seed-details-toggle-extended-keys-button");
    var extendedKeysContainer = document.getElementById("seed-details-results-extended-keys");
    var seedExtendedKeysVisible = false;
    function ToggleExtendedKeys() {
        seedExtendedKeysVisible = !seedExtendedKeysVisible;
        extendedKeysContainer.style.display = seedExtendedKeysVisible ? "" : "none";
        toggleExtendedKeysButton.textContent = seedExtendedKeysVisible ? "Hide extended keys" : "Show extended keys";
    }
    toggleExtendedKeysButton.addEventListener("click", ToggleExtendedKeys);
}
