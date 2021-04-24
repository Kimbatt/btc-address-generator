"use strict";
var GetCustomPaperWalletDesign;
function InitCustomPaperWalletDesign() {
    var _a = Util(), GenerateAddressQRCode = _a.GenerateAddressQRCode, GenerateQRCode = _a.GenerateQRCode;
    var controlsContainer = document.getElementById("paperwallet-custom-parameters");
    var parameters = {
        "backgroundImageScale": 100,
        "addressPositionX": 170,
        "addressPositionY": 10,
        "addressFontSize": 18,
        "addressLettersPerLine": 0,
        "addressRotation": 0,
        "addressQRPositionX": 10,
        "addressQRPositionY": 10,
        "addressQRSize": 150,
        "addressQRRotation": 0,
        "privateKeyPositionX": 170,
        "privateKeyPositionY": 180,
        "privateKeyFontSize": 18,
        "privateKeyLettersPerLine": 0,
        "privateKeyRotation": 0,
        "privateKeyQRPositionX": 10,
        "privateKeyQRPositionY": 180,
        "privateKeyQRSize": 150,
        "privateKeyQRRotation": 0
    };
    var previewContainer = document.getElementById("paperwallet-preview-div");
    var dummyAddress = "bc1qacdefghjklmnopqrstuvwxyz023456789acdef";
    var dummyPrivateKey = "6Pnabcdefghijkmnopqrstuvwxyz1234567ABCDEFGHJKLMNPQRSTUVXYZ";
    var previewAddress = document.createElement("div");
    previewAddress.style.position = "absolute";
    previewAddress.style.whiteSpace = "pre-line";
    previewAddress.style.fontFamily = "roboto-mono";
    previewAddress.textContent = dummyAddress;
    var previewPrivateKey = document.createElement("div");
    previewPrivateKey.style.position = "absolute";
    previewPrivateKey.style.whiteSpace = "pre-line";
    previewPrivateKey.style.fontFamily = "roboto-mono";
    previewPrivateKey.textContent = dummyPrivateKey;
    var previewAddressQR = new Image();
    previewAddressQR.style.position = "absolute";
    GenerateAddressQRCode(dummyAddress, "bech32", "H", 6, 0).then(function (res) { return previewAddressQR.src = res; });
    var previewPrivateKeyQR = new Image();
    previewPrivateKeyQR.style.position = "absolute";
    GenerateQRCode(dummyPrivateKey, "H", "Byte", 6, 0).then(function (res) { return previewPrivateKeyQR.src = res; });
    var backgroundImageSize = { x: 820, y: 400 };
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
    function UpdatePreview() {
        var backgroundImageScale = parameters["backgroundImageScale"];
        previewContainer.style.width = backgroundImageSize.x * backgroundImageScale / 100 + "px";
        previewContainer.style.height = backgroundImageSize.y * backgroundImageScale / 100 + "px";
        previewAddress.style.left = parameters["addressPositionX"] + "px";
        previewAddress.style.top = parameters["addressPositionY"] + "px";
        previewAddress.style.fontSize = parameters["addressFontSize"] + "px";
        previewAddress.textContent = SplitTextIntoLines(dummyAddress, parameters["addressLettersPerLine"]).join("\n");
        previewAddress.style.transform = "rotate(" + parameters["addressRotation"] + "deg)";
        previewPrivateKey.style.left = parameters["privateKeyPositionX"] + "px";
        previewPrivateKey.style.top = parameters["privateKeyPositionY"] + "px";
        previewPrivateKey.style.fontSize = parameters["privateKeyFontSize"] + "px";
        previewPrivateKey.textContent = SplitTextIntoLines(dummyPrivateKey, parameters["privateKeyLettersPerLine"]).join("\n");
        previewPrivateKey.style.transform = "rotate(" + parameters["privateKeyRotation"] + "deg)";
        previewAddressQR.style.left = parameters["addressQRPositionX"] + "px";
        previewAddressQR.style.top = parameters["addressQRPositionY"] + "px";
        previewAddressQR.style.width = previewAddress.style.height = parameters["addressQRSize"] + "px";
        previewAddressQR.style.transform = "rotate(" + parameters["addressQRRotation"] + "deg)";
        previewPrivateKeyQR.style.left = parameters["privateKeyQRPositionX"] + "px";
        previewPrivateKeyQR.style.top = parameters["privateKeyQRPositionY"] + "px";
        previewPrivateKeyQR.style.width = previewAddress.style.height = parameters["privateKeyQRSize"] + "px";
        previewPrivateKeyQR.style.transform = "rotate(" + parameters["privateKeyQRRotation"] + "deg)";
    }
    function CreateLabelForInput(text, input) {
        var label = document.createElement("label");
        var labelText = document.createElement("div");
        labelText.textContent = text;
        labelText.style.display = "inline-block";
        labelText.style.marginLeft = "8px";
        label.appendChild(input);
        label.appendChild(labelText);
        label.style.display = "block";
        return label;
    }
    function CreateNumberInput(text, bindingKey, min, max, step) {
        var input = document.createElement("input");
        input.type = "number";
        if (min !== undefined) {
            input.min = min.toString();
        }
        if (max !== undefined) {
            input.max = max.toString();
        }
        if (step !== undefined) {
            input.step = step.toString();
        }
        input.value = parameters[bindingKey].toString();
        input.addEventListener("input", function () {
            var value = Number(input.value);
            if (min !== undefined && value < min) {
                value = min;
            }
            if (max !== undefined && value > max) {
                value = max;
            }
            parameters[bindingKey] = value;
            UpdatePreview();
        });
        input.style.display = "inline-block";
        input.style.width = "80px";
        controlsContainer.appendChild(CreateLabelForInput(text, input));
    }
    var backgroundImageSelector = document.createElement("input");
    backgroundImageSelector.type = "file";
    backgroundImageSelector.accept = "image/*";
    controlsContainer.appendChild(CreateLabelForInput("Background image", backgroundImageSelector));
    var errorMessageDiv = document.getElementById("paperwallet-generate-progress-error");
    function ShowError(message) {
        errorMessageDiv.style.display = "";
        errorMessageDiv.textContent = message;
    }
    var backgroundImage = new Image();
    backgroundImage.style.width = "100%";
    backgroundImage.style.height = "100%";
    backgroundImage.style.position = "absolute";
    backgroundImage.style.top = "0px";
    backgroundImage.style.left = "0px";
    previewContainer.appendChild(backgroundImage);
    previewContainer.appendChild(previewPrivateKeyQR);
    previewContainer.appendChild(previewAddressQR);
    previewContainer.appendChild(previewPrivateKey);
    previewContainer.appendChild(previewAddress);
    backgroundImageSelector.addEventListener("change", function () {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            if (!reader.result || typeof reader.result !== "string") {
                ShowError("Error loading image");
                return;
            }
            function OnLoad() {
                backgroundImage.style.width = "";
                backgroundImage.style.height = "";
                backgroundImageSize.x = backgroundImage.clientWidth;
                backgroundImageSize.y = backgroundImage.clientHeight;
                backgroundImage.style.width = "100%";
                backgroundImage.style.height = "100%";
                previewContainer.style.backgroundColor = "";
                backgroundImage.removeEventListener("load", OnLoad);
                UpdatePreview();
            }
            backgroundImage.addEventListener("load", OnLoad);
            backgroundImage.src = reader.result;
        });
        var files = backgroundImageSelector.files;
        if (!files || !files[0]) {
            return;
        }
        try {
            reader.readAsDataURL(files[0]);
        }
        catch (ex) {
            ShowError("Error opening image");
        }
    });
    CreateNumberInput("Background image scale (percent)", "backgroundImageScale", 0);
    CreateNumberInput("Address position x (left)", "addressPositionX");
    CreateNumberInput("Address position y (top)", "addressPositionY");
    CreateNumberInput("Address font size", "addressFontSize", 0);
    CreateNumberInput("Address letters per line (0 = no line breaks)", "addressLettersPerLine", 0);
    CreateNumberInput("Address rotation (degrees)", "addressRotation");
    CreateNumberInput("Address QR code position x (left)", "addressQRPositionX");
    CreateNumberInput("Address QR code position y (top)", "addressQRPositionY");
    CreateNumberInput("Address QR code size", "addressQRSize");
    CreateNumberInput("Address QR code rotation (degrees)", "addressQRRotation");
    CreateNumberInput("Private key position x (left)", "privateKeyPositionX");
    CreateNumberInput("Private key position y (top)", "privateKeyPositionY");
    CreateNumberInput("Private key font size", "privateKeyFontSize", 0);
    CreateNumberInput("Private key letters per line (0 = no line breaks)", "privateKeyLettersPerLine", 0);
    CreateNumberInput("Private key rotation (degrees)", "privateKeyRotation");
    CreateNumberInput("Private key QR code position x (left)", "privateKeyQRPositionX");
    CreateNumberInput("Private key QR code position y (top)", "privateKeyQRPositionY");
    CreateNumberInput("Private key QR code size", "privateKeyQRSize");
    CreateNumberInput("Private key QR code rotation (degrees)", "privateKeyQRRotation");
    UpdatePreview();
    return function () {
        return {
            width: backgroundImageSize.x * parameters["backgroundImageScale"] / 100,
            height: backgroundImageSize.y * parameters["backgroundImageScale"] / 100,
            backgroundImageSrc: backgroundImage.src,
            addressQRCodes: [{
                    position: { x: parameters["addressQRPositionX"], y: parameters["addressQRPositionY"] },
                    size: parameters["addressQRSize"],
                    rotation: parameters["addressQRRotation"]
                }],
            privateKeyQRCodes: [{
                    position: { x: parameters["privateKeyQRPositionX"], y: parameters["privateKeyQRPositionY"] },
                    size: parameters["privateKeyQRSize"],
                    rotation: parameters["privateKeyQRRotation"]
                }],
            addressTexts: [{
                    position: { x: parameters["addressPositionX"], y: parameters["addressPositionY"] },
                    size: parameters["addressFontSize"],
                    rotation: parameters["addressRotation"],
                    maxLineLength: parameters["addressLettersPerLine"]
                }],
            privateKeyTexts: [{
                    position: { x: parameters["privateKeyPositionX"], y: parameters["privateKeyPositionY"] },
                    size: parameters["privateKeyFontSize"],
                    rotation: parameters["privateKeyRotation"],
                    maxLineLength: parameters["privateKeyLettersPerLine"]
                }]
        };
    };
}
