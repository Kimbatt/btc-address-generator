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
function InitPaperWalletPage() {
    var _a = Util(), AsyncNoParallel = _a.AsyncNoParallel, GenerateAddressQRCode = _a.GenerateAddressQRCode, GenerateQRCode = _a.GenerateQRCode, ShowLoadingHelper = _a.ShowLoadingHelper;
    // address type
    var addressType = "bech32";
    var segwitAddressTypeRadioButton = document.getElementById("paper-radio-type-segwit");
    var bech32AddressTypeRadioButton = document.getElementById("paper-radio-type-bech32");
    var legacyAddressTypeRadioButton = document.getElementById("paper-radio-type-legacy");
    segwitAddressTypeRadioButton.addEventListener("change", function () { return segwitAddressTypeRadioButton.checked && (addressType = "segwit"); });
    bech32AddressTypeRadioButton.addEventListener("change", function () { return bech32AddressTypeRadioButton.checked && (addressType = "bech32"); });
    legacyAddressTypeRadioButton.addEventListener("change", function () { return legacyAddressTypeRadioButton.checked && (addressType = "legacy"); });
    // qr error correction level
    var qrErrorCorrectionLevel = "H";
    function SetQRErrorCorrectionLevel(level) {
        qrErrorCorrectionLevel = level;
    }
    var qrErrorCorrectionLevelHRadioButton = document.getElementById("paper-radio-qr-errorcorrectionlevel-h");
    var qrErrorCorrectionLevelQRadioButton = document.getElementById("paper-radio-qr-errorcorrectionlevel-q");
    var qrErrorCorrectionLevelMRadioButton = document.getElementById("paper-radio-qr-errorcorrectionlevel-m");
    var qrErrorCorrectionLevelLRadioButton = document.getElementById("paper-radio-qr-errorcorrectionlevel-l");
    qrErrorCorrectionLevelHRadioButton.addEventListener("change", function () { return qrErrorCorrectionLevelHRadioButton.checked && SetQRErrorCorrectionLevel("H"); });
    qrErrorCorrectionLevelQRadioButton.addEventListener("change", function () { return qrErrorCorrectionLevelQRadioButton.checked && SetQRErrorCorrectionLevel("Q"); });
    qrErrorCorrectionLevelMRadioButton.addEventListener("change", function () { return qrErrorCorrectionLevelMRadioButton.checked && SetQRErrorCorrectionLevel("M"); });
    qrErrorCorrectionLevelLRadioButton.addEventListener("change", function () { return qrErrorCorrectionLevelLRadioButton.checked && SetQRErrorCorrectionLevel("L"); });
    // generation type
    var generationType = 0 /* RandomNew */;
    var generationTypeRandomNewRadioButton = document.getElementById("paper-radio-generation-type-random-new");
    var generationTypeUseExistingRadioButton = document.getElementById("paper-radio-generation-type-use-existing");
    var generationTypeFromSeedRadioButton = document.getElementById("paper-radio-generation-type-from-seed");
    var generationUseExistingDiv = document.getElementById("paper-div-generate-use-existing");
    var generationFromSeedDiv = document.getElementById("paper-div-generate-from-seed");
    function SetGenerationType(type) {
        generationType = type;
        generationUseExistingDiv.style.display = type === 1 /* UseExisting */ ? "" : "none";
        generationFromSeedDiv.style.display = type === 2 /* FromSeed */ ? "" : "none";
    }
    generationTypeRandomNewRadioButton.addEventListener("change", function () { return generationTypeRandomNewRadioButton.checked && SetGenerationType(0 /* RandomNew */); });
    generationTypeUseExistingRadioButton.addEventListener("change", function () { return generationTypeUseExistingRadioButton.checked && SetGenerationType(1 /* UseExisting */); });
    generationTypeFromSeedRadioButton.addEventListener("change", function () { return generationTypeFromSeedRadioButton.checked && SetGenerationType(2 /* FromSeed */); });
    // bip38
    var bip38Checkbox = document.getElementById("bip38-enabled-paper");
    var bip38PasswordContainer = document.getElementById("bip38-password-box-div-paper");
    var bip38PasswordInput = document.getElementById("bip38-password-box-paper");
    var bip38InfoLink = document.getElementById("show-bip38-info-link-paper");
    var bip38InfoOverlay = document.getElementById("bip38-info");
    bip38InfoLink.addEventListener("click", function () { return bip38InfoOverlay.style.display = "table"; });
    bip38Checkbox.addEventListener("change", function () { return bip38PasswordContainer.style.display = bip38Checkbox.checked ? "table" : "none"; });
    // generate related elements
    var generateButton = document.getElementById("paperwallet-generate-button");
    var generateCountInput = document.getElementById("paperwallet-generate-count");
    var styleSelector = document.getElementById("paperwallet-style-selector");
    var selectedStyle = "Simple";
    for (var paperWalletDesignName in PaperWalletDesignNames) {
        var option = document.createElement("option");
        option.text = paperWalletDesignName;
        option.value = paperWalletDesignName;
        styleSelector.appendChild(option);
    }
    var paperWalletSourceLink = document.getElementById("paperwallet-source-link");
    var paperWalletCustomControlsContainer = document.getElementById("paperwallet-custom-container");
    styleSelector.addEventListener("change", function () {
        selectedStyle = styleSelector.value;
        var source = PaperWalletDesignNames[selectedStyle];
        if (source) {
            paperWalletSourceLink.style.display = "block";
            paperWalletSourceLink.href = source;
        }
        else {
            paperWalletSourceLink.style.display = "none";
            paperWalletSourceLink.href = "";
        }
        paperWalletCustomControlsContainer.style.display = selectedStyle === "Your custom design" ? "" : "none";
    });
    function CreatePaperWalletDiv(design, address, privateKey, qrCodeErrorCorrectionLevel, addressType) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            function AnchorToCSS(anchor) {
                if (anchor === undefined) {
                    return ["left", "top"];
                }
                switch (anchor) {
                    case 0 /* TopLeft */:
                        return ["left", "top"];
                    case 1 /* TopRight */:
                        return ["right", "top"];
                    case 2 /* BottomLeft */:
                        return ["left", "bottom"];
                    case 3 /* BottomRight */:
                        return ["right", "bottom"];
                }
            }
            function CreateQRImage(imageSrc, transform) {
                var img = new Image();
                img.src = imageSrc;
                img.style.width = img.style.height = transform.size + "px";
                img.style.position = "absolute";
                var _a = AnchorToCSS(transform.anchor), horizontal = _a[0], vertical = _a[1];
                img.style[horizontal] = transform.position.x + "px";
                img.style[vertical] = transform.position.y + "px";
                if (transform.rotation !== undefined) {
                    img.style.transform = "rotate(" + transform.rotation + "deg)";
                }
                if (transform.rotationPivot !== undefined) {
                    img.style.transformOrigin = transform.rotationPivot.x + "% " + transform.rotationPivot.y + "%";
                }
                return img;
            }
            function SplitTextIntoLines(text, maxLineLength) {
                if (maxLineLength <= 0) {
                    return [text];
                }
                var lines = [];
                for (var i = 0; i < text.length; i += maxLineLength) {
                    lines.push(text.substr(i, maxLineLength));
                }
                return lines;
            }
            function CreateText(text, properties) {
                var _a;
                var textDiv = document.createElement("div");
                textDiv.textContent = (function () {
                    if (properties.maxLength !== undefined) {
                        text = text.substr(0, properties.maxLength);
                    }
                    if (properties.maxLineLength) {
                        textDiv.style.whiteSpace = "pre-line";
                        return SplitTextIntoLines(text, properties.maxLineLength).join("\n");
                    }
                    else {
                        return text;
                    }
                })();
                textDiv.style.position = "absolute";
                textDiv.style.fontSize = properties.size + "px";
                textDiv.style.fontFamily = (_a = properties.fontFamily) !== null && _a !== void 0 ? _a : "roboto-mono";
                if (properties.bold) {
                    textDiv.style.fontWeight = "bold";
                }
                if (properties.italic) {
                    textDiv.style.fontStyle = "italic";
                }
                var _b = AnchorToCSS(properties.anchor), horizontal = _b[0], vertical = _b[1];
                textDiv.style[horizontal] = properties.position.x + "px";
                textDiv.style[vertical] = properties.position.y + "px";
                if (properties.rotation !== undefined) {
                    textDiv.style.transform = "rotate(" + properties.rotation + "deg)";
                }
                if (properties.rotationPivot !== undefined) {
                    textDiv.style.transformOrigin = properties.rotationPivot.x + "% " + properties.rotationPivot.y + "%";
                }
                return textDiv;
            }
            var _b, privateKeyQR, addressQR, container, backgroundImage, _i, _c, transform, _d, _e, transform, _f, _g, textElement, _h, _j, textElement, _k, _l, customText;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            GenerateQRCode(privateKey, qrCodeErrorCorrectionLevel, "Byte", undefined, 0),
                            GenerateAddressQRCode(address, addressType, qrCodeErrorCorrectionLevel, undefined, 0)
                        ])];
                    case 1:
                        _b = _m.sent(), privateKeyQR = _b[0], addressQR = _b[1];
                        container = document.createElement("div");
                        container.style.background = "white";
                        container.style.color = "black";
                        container.style.position = "relative";
                        container.style.border = "2px solid black";
                        container.style.width = design.width + "px";
                        container.style.height = design.height + "px";
                        if (design.backgroundImageSrc) {
                            backgroundImage = new Image();
                            backgroundImage.style.position = "relative";
                            backgroundImage.style.width = container.style.width;
                            backgroundImage.style.height = container.style.height;
                            backgroundImage.src = design.backgroundImageSrc;
                            container.appendChild(backgroundImage);
                        }
                        for (_i = 0, _c = design.privateKeyQRCodes; _i < _c.length; _i++) {
                            transform = _c[_i];
                            container.appendChild(CreateQRImage(privateKeyQR, transform));
                        }
                        for (_d = 0, _e = design.addressQRCodes; _d < _e.length; _d++) {
                            transform = _e[_d];
                            container.appendChild(CreateQRImage(addressQR, transform));
                        }
                        for (_f = 0, _g = design.privateKeyTexts; _f < _g.length; _f++) {
                            textElement = _g[_f];
                            container.appendChild(CreateText(privateKey, textElement));
                        }
                        for (_h = 0, _j = design.addressTexts; _h < _j.length; _h++) {
                            textElement = _j[_h];
                            container.appendChild(CreateText(address, textElement));
                        }
                        for (_k = 0, _l = (_a = design.customTexts) !== null && _a !== void 0 ? _a : []; _k < _l.length; _k++) {
                            customText = _l[_k];
                            container.appendChild(CreateText(customText.text, customText));
                        }
                        return [2 /*return*/, container];
                }
            });
        });
    }
    var progressTextDiv = document.getElementById("paperwallet-generate-progress-text");
    var loading = new ShowLoadingHelper(document.getElementById("paperwallet-generate-progress-container"), 100);
    var errorMessageDiv = document.getElementById("paperwallet-generate-progress-error");
    function ShowMessage(message) {
        progressTextDiv.textContent = message;
    }
    function ShowError(message) {
        loading.hide();
        errorMessageDiv.style.display = "";
        errorMessageDiv.textContent = message;
    }
    var useExistingPrivateKeysTextArea = document.getElementById("paper-use-existing-textarea");
    var generateFromSeedSeedTextArea = document.getElementById("paper-from-seed-textarea");
    var generateFromSeedSeedPassword = document.getElementById("paper-from-seed-password");
    var generateFromSeedOffsetInput = document.getElementById("paper-from-seed-offset");
    var generateFromSeedHardenedCheckbox = document.getElementById("paper-from-seed-hardened-checkbox");
    var generateFromSeedChangeAddressesCheckbox = document.getElementById("paper-from-seed-change-addresses-checkbox");
    var generatedPaperWalletsContainer = document.getElementById("paperwallet-print-area");
    function GeneratePaperWallets() {
        return __awaiter(this, void 0, void 0, function () {
            function UpdateProgress() {
                progressTextDiv.textContent = "Generating: " + currentCount++ + "/" + count;
            }
            function CreateDivFromAddressAndPrivateKey(address, privateKey) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, CreatePaperWalletDiv(design, address, privateKey, currentQRErrorCorrectionLevel, currentAddressType)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            var count, currentAddressType, currentQRErrorCorrectionLevel, currentCount, isBIP38, bip38Password, design, results, _a, bip38Password_1, encryptionData_1, i, i, privateKeys, maybeValidPrivateKeys, i, current, match, _loop_1, _i, maybeValidPrivateKeys_1, privateKey, seed, seedPassword, offset, startIndex, endIndex, hardened_1, changeAddresses_1, rootKeyResult, rootKey_1, purpose_1, basePath_1, _loop_2, i, paperWalletDivs, errorMessages, _b, paperWalletDivs_1, divResult;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        loading.show();
                        errorMessageDiv.style.display = "none";
                        count = Number(generateCountInput.value) | 0;
                        if (isNaN(count)) {
                            ShowError("Enter a number for count");
                            return [2 /*return*/];
                        }
                        else if (count < 1) {
                            ShowError("Count must be greater than zero");
                            return [2 /*return*/];
                        }
                        else if (count > 100) {
                            ShowError("Count must be 100 at most");
                            return [2 /*return*/];
                        }
                        currentAddressType = addressType;
                        currentQRErrorCorrectionLevel = qrErrorCorrectionLevel;
                        currentCount = 0;
                        isBIP38 = bip38Checkbox.checked;
                        bip38Password = bip38PasswordInput.value;
                        if (isBIP38 && bip38Password === "") {
                            ShowError("BIP38 password must not be empty");
                            return [2 /*return*/];
                        }
                        design = GetPaperWalletDesign(selectedStyle, isBIP38);
                        results = [];
                        _a = generationType;
                        switch (_a) {
                            case 0 /* RandomNew */: return [3 /*break*/, 1];
                            case 1 /* UseExisting */: return [3 /*break*/, 5];
                            case 2 /* FromSeed */: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 1:
                        if (!isBIP38) return [3 /*break*/, 3];
                        bip38Password_1 = bip38PasswordInput.value;
                        ShowMessage("Generating initial values");
                        return [4 /*yield*/, WorkerInterface.GenerateRandomBIP38EncryptionData(bip38Password_1, currentAddressType)];
                    case 2:
                        encryptionData_1 = _c.sent();
                        if (encryptionData_1.type === "err") {
                            ShowError(encryptionData_1.error);
                            return [2 /*return*/];
                        }
                        UpdateProgress();
                        for (i = 0; i < count; ++i) {
                            results.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, address, privateKey, div;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, WorkerInterface.GenerateRandomBIP38EncryptedAddress(encryptionData_1.result)];
                                        case 1:
                                            _a = _b.sent(), address = _a.address, privateKey = _a.privateKey;
                                            return [4 /*yield*/, CreateDivFromAddressAndPrivateKey(address, privateKey)];
                                        case 2:
                                            div = _b.sent();
                                            UpdateProgress();
                                            return [2 /*return*/, {
                                                    type: "ok",
                                                    result: div
                                                }];
                                    }
                                });
                            }); })());
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        UpdateProgress();
                        for (i = 0; i < count; ++i) {
                            results.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, address, privateKey, div;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, WorkerInterface.GenerateRandomAddress(addressType)];
                                        case 1:
                                            _a = _b.sent(), address = _a.address, privateKey = _a.privateKey;
                                            return [4 /*yield*/, CreateDivFromAddressAndPrivateKey(address, privateKey)];
                                        case 2:
                                            div = _b.sent();
                                            UpdateProgress();
                                            return [2 /*return*/, {
                                                    type: "ok",
                                                    result: div
                                                }];
                                    }
                                });
                            }); })());
                        }
                        _c.label = 4;
                    case 4: return [3 /*break*/, 8];
                    case 5:
                        {
                            privateKeys = useExistingPrivateKeysTextArea.value.split(/\s+/g);
                            maybeValidPrivateKeys = [];
                            for (i = 0; i < privateKeys.length; ++i) {
                                current = privateKeys[i];
                                match = current.match(/[a-km-zA-HJ-NP-Z1-9]+/g);
                                if (match) {
                                    maybeValidPrivateKeys.push(match[0]);
                                }
                            }
                            if (maybeValidPrivateKeys.length === 0) {
                                ShowError("No valid private keys were entered");
                                return [2 /*return*/];
                            }
                            count = maybeValidPrivateKeys.length;
                            UpdateProgress();
                            _loop_1 = function (privateKey) {
                                results.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                    var decodeResult, resultPrivateKey, address, div;
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, WorkerInterface.GetPrivateKeyDetails(privateKey)];
                                            case 1:
                                                decodeResult = _a.sent();
                                                if (decodeResult.type !== "ok") {
                                                    UpdateProgress();
                                                    return [2 /*return*/, { type: "err", error: ["Invalid private key", privateKey] }];
                                                }
                                                return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                                        var encryptionResult;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    if (!isBIP38) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, WorkerInterface.BIP38EncryptPrivateKey(privateKey, bip38Password)];
                                                                case 1:
                                                                    encryptionResult = _a.sent();
                                                                    if (encryptionResult.type === "err") {
                                                                        return [2 /*return*/, encryptionResult];
                                                                    }
                                                                    return [2 /*return*/, { type: "ok", result: encryptionResult.result }];
                                                                case 2: return [2 /*return*/, { type: "ok", result: privateKey }];
                                                            }
                                                        });
                                                    }); })()];
                                            case 2:
                                                resultPrivateKey = _a.sent();
                                                if (resultPrivateKey.type === "err") {
                                                    UpdateProgress();
                                                    return [2 /*return*/, {
                                                            type: "err",
                                                            error: [resultPrivateKey.error, privateKey]
                                                        }];
                                                }
                                                address = (function () {
                                                    switch (currentAddressType) {
                                                        case "legacy":
                                                            return decodeResult.legacyAddress;
                                                        case "segwit":
                                                            return decodeResult.segwitAddress;
                                                        case "bech32":
                                                            return decodeResult.bech32Address;
                                                    }
                                                })();
                                                return [4 /*yield*/, CreateDivFromAddressAndPrivateKey(address, resultPrivateKey.result)];
                                            case 3:
                                                div = _a.sent();
                                                UpdateProgress();
                                                return [2 /*return*/, {
                                                        type: "ok",
                                                        result: div
                                                    }];
                                        }
                                    });
                                }); })());
                            };
                            for (_i = 0, maybeValidPrivateKeys_1 = maybeValidPrivateKeys; _i < maybeValidPrivateKeys_1.length; _i++) {
                                privateKey = maybeValidPrivateKeys_1[_i];
                                _loop_1(privateKey);
                            }
                            return [3 /*break*/, 8];
                        }
                        _c.label = 6;
                    case 6:
                        seed = generateFromSeedSeedTextArea.value;
                        seedPassword = generateFromSeedSeedPassword.value;
                        offset = Number(generateFromSeedOffsetInput.value) | 0;
                        if (isNaN(offset)) {
                            ShowError("Offset must be a number");
                            return [2 /*return*/];
                        }
                        if (offset < 0) {
                            ShowError("Offset must not be negative");
                            return [2 /*return*/];
                        }
                        startIndex = offset;
                        endIndex = startIndex + count;
                        if (endIndex > 0x80000000) {
                            ShowError("Offset + Count must be 2147483648 at most");
                            return [2 /*return*/];
                        }
                        hardened_1 = generateFromSeedHardenedCheckbox.checked;
                        changeAddresses_1 = generateFromSeedChangeAddressesCheckbox.checked;
                        UpdateProgress();
                        return [4 /*yield*/, WorkerInterface.GetBIP32RootKeyFromSeed(seed, seedPassword)];
                    case 7:
                        rootKeyResult = _c.sent();
                        if (rootKeyResult.type === "err") {
                            ShowError("Invalid seed: " + rootKeyResult.error);
                            return [2 /*return*/];
                        }
                        rootKey_1 = rootKeyResult.result;
                        purpose_1 = currentAddressType === "legacy" ? "44" : currentAddressType === "segwit" ? "49" : "84";
                        basePath_1 = "m/" + purpose_1 + "'/0'/0'";
                        _loop_2 = function (i) {
                            results.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var derivedResult, addressResult, address, privateKey, encryptionResult, div;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, WorkerInterface.DeriveBIP32ExtendedKey(rootKey_1, basePath_1, purpose_1, hardened_1, changeAddresses_1)];
                                        case 1:
                                            derivedResult = _a.sent();
                                            if (derivedResult.type === "err") {
                                                UpdateProgress();
                                                return [2 /*return*/, {
                                                        type: "err",
                                                        error: [derivedResult.error, "index " + i]
                                                    }];
                                            }
                                            return [4 /*yield*/, WorkerInterface.DeriveBIP32Address(derivedResult.result.path, derivedResult.result.publicKey, derivedResult.result.privateKey, i, purpose_1, hardened_1)];
                                        case 2:
                                            addressResult = _a.sent();
                                            if (addressResult.type === "err") {
                                                UpdateProgress();
                                                return [2 /*return*/, {
                                                        type: "err",
                                                        error: [addressResult.error, "index " + i]
                                                    }];
                                            }
                                            address = addressResult.result.address;
                                            privateKey = addressResult.result.privateKey;
                                            if (!isBIP38) return [3 /*break*/, 4];
                                            return [4 /*yield*/, WorkerInterface.BIP38EncryptPrivateKey(privateKey, bip38Password)];
                                        case 3:
                                            encryptionResult = _a.sent();
                                            if (encryptionResult.type === "err") {
                                                UpdateProgress();
                                                return [2 /*return*/, {
                                                        type: "err",
                                                        error: [encryptionResult.error, "index " + i]
                                                    }];
                                            }
                                            privateKey = encryptionResult.result;
                                            _a.label = 4;
                                        case 4: return [4 /*yield*/, CreateDivFromAddressAndPrivateKey(address, privateKey)];
                                        case 5:
                                            div = _a.sent();
                                            UpdateProgress();
                                            return [2 /*return*/, {
                                                    type: "ok",
                                                    result: div
                                                }];
                                    }
                                });
                            }); })());
                        };
                        for (i = startIndex; i < endIndex; ++i) {
                            _loop_2(i);
                        }
                        return [3 /*break*/, 8];
                    case 8: return [4 /*yield*/, Promise.all(results)];
                    case 9:
                        paperWalletDivs = _c.sent();
                        while (generatedPaperWalletsContainer.lastChild) {
                            generatedPaperWalletsContainer.removeChild(generatedPaperWalletsContainer.lastChild);
                        }
                        errorMessages = [];
                        for (_b = 0, paperWalletDivs_1 = paperWalletDivs; _b < paperWalletDivs_1.length; _b++) {
                            divResult = paperWalletDivs_1[_b];
                            if (divResult.type === "ok") {
                                generatedPaperWalletsContainer.appendChild(divResult.result);
                            }
                            else {
                                errorMessages.push(divResult.error);
                            }
                        }
                        if (errorMessages.length !== 0) {
                            ShowError("Some of the private keys were invalid, so the corresponding wallets were not generated: \n" +
                                errorMessages.map(function (err) {
                                    var errorMessage = err[0];
                                    var privateKey = err[1];
                                    return errorMessage + " (processing private key \"" + privateKey + "\")";
                                }).join("\n"));
                        }
                        else {
                            loading.hide();
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    generateButton.addEventListener("click", AsyncNoParallel(GeneratePaperWallets));
}
