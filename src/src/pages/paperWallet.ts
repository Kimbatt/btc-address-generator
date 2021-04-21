
interface PaperWalletElementTransform
{
    anchor?: PaperWalletElementAnchor;
    size: number;
    posX: number;
    posY: number;
    rotation?: number;
}

type PaperWalletTextElement = PaperWalletElementTransform & {
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
    maxLineLength?: number;
};

const enum PaperWalletElementAnchor
{
    TopLeft, TopRight, BottomLeft, BottomRight
}

type PaperWalletCustomTextElement = PaperWalletTextElement & {
    text: string;
}

interface PaperWalletDesign
{
    backgroundImageSrc?: string;
    width: number;
    height: number;
    addressQRCodes: PaperWalletElementTransform[];
    privateKeyQRCodes: PaperWalletElementTransform[];
    addressTexts: PaperWalletTextElement[];
    privateKeyTexts: PaperWalletTextElement[];
    customTexts?: PaperWalletCustomTextElement[];
}

const PaperWalletDesignNames = ["Simple"] as const;
type PaperWalletDesignName = typeof PaperWalletDesignNames[number];

function GetPaperWalletDesigns(designName: PaperWalletDesignName, isBIP38: boolean): PaperWalletDesign
{
    switch (designName)
    {
        case "Simple":
            return {
                width: 1000,
                height: 200,
                addressQRCodes: [{
                    posX: 10,
                    posY: 10,
                    size: 100
                }],
                privateKeyQRCodes: [{
                    anchor: PaperWalletElementAnchor.BottomRight,
                    posX: 10,
                    posY: 10,
                    size: 100
                }],
                addressTexts: [{
                    posX: 120,
                    posY: 50,
                    size: 18
                }],
                privateKeyTexts: [{
                    anchor: PaperWalletElementAnchor.BottomRight,
                    posX: isBIP38 ? 430 : 120,
                    posY: 10,
                    size: 18
                }],
                customTexts: [
                    {
                        text: "Address:",
                        fontFamily: "Verdana",
                        bold: true,

                        posX: 120,
                        posY: 15,
                        size: 25
                    }, {
                        text: isBIP38 ? "Encrypted private key:" : "Private key:",
                        fontFamily: "Verdana",
                        bold: true,

                        anchor: PaperWalletElementAnchor.BottomRight,
                        posX: 514,
                        posY: 40,
                        size: 25
                    }
                ]
            };
    };
}

const enum PaperWalletGenerationType
{
    RandomNew, UseExisting, FromSeed
}

(() =>
{
    const { AsyncNoParallel, GenerateAddressQRCode, GenerateQRCode } = Util();

    // address type
    let addressType: AddressType = "bech32";
    const segwitAddressTypeRadioButton = <HTMLInputElement>document.getElementById("paper-radio-type-segwit");
    const bech32AddressTypeRadioButton = <HTMLInputElement>document.getElementById("paper-radio-type-bech32");
    const legacyAddressTypeRadioButton = <HTMLInputElement>document.getElementById("paper-radio-type-legacy");

    segwitAddressTypeRadioButton.addEventListener("change", () => segwitAddressTypeRadioButton.checked && (addressType = "segwit"));
    bech32AddressTypeRadioButton.addEventListener("change", () => bech32AddressTypeRadioButton.checked && (addressType = "bech32"));
    legacyAddressTypeRadioButton.addEventListener("change", () => legacyAddressTypeRadioButton.checked && (addressType = "legacy"));

    // qr error correction level
    let qrErrorCorrectionLevel: QRCodeErrorCorrectionLevel = "H";

    function SetQRErrorCorrectionLevel(level: QRCodeErrorCorrectionLevel)
    {
        qrErrorCorrectionLevel = level;
    }

    const qrErrorCorrectionLevelHRadioButton = <HTMLInputElement>document.getElementById("paper-radio-qr-errorcorrectionlevel-h");
    const qrErrorCorrectionLevelQRadioButton = <HTMLInputElement>document.getElementById("paper-radio-qr-errorcorrectionlevel-q");
    const qrErrorCorrectionLevelMRadioButton = <HTMLInputElement>document.getElementById("paper-radio-qr-errorcorrectionlevel-m");
    const qrErrorCorrectionLevelLRadioButton = <HTMLInputElement>document.getElementById("paper-radio-qr-errorcorrectionlevel-l");

    qrErrorCorrectionLevelHRadioButton.addEventListener("change", () => qrErrorCorrectionLevelHRadioButton.checked && SetQRErrorCorrectionLevel("H"));
    qrErrorCorrectionLevelQRadioButton.addEventListener("change", () => qrErrorCorrectionLevelQRadioButton.checked && SetQRErrorCorrectionLevel("Q"));
    qrErrorCorrectionLevelMRadioButton.addEventListener("change", () => qrErrorCorrectionLevelMRadioButton.checked && SetQRErrorCorrectionLevel("M"));
    qrErrorCorrectionLevelLRadioButton.addEventListener("change", () => qrErrorCorrectionLevelLRadioButton.checked && SetQRErrorCorrectionLevel("L"));

    // generation type
    let generationType = PaperWalletGenerationType.RandomNew;
    const generationTypeRandomNewRadioButton = <HTMLInputElement>document.getElementById("paper-radio-generation-type-random-new");
    const generationTypeUseExistingRadioButton = <HTMLInputElement>document.getElementById("paper-radio-generation-type-use-existing");
    const generationTypeFromSeedRadioButton = <HTMLInputElement>document.getElementById("paper-radio-generation-type-from-seed");
    const generationUseExistingDiv = document.getElementById("paper-div-generate-use-existing")!;
    const generationFromSeedDiv = document.getElementById("paper-div-generate-from-seed")!;

    function SetGenerationType(type: PaperWalletGenerationType)
    {
        generationType = type;
        generationUseExistingDiv.style.display = type === PaperWalletGenerationType.UseExisting ? "" : "none";
        generationFromSeedDiv.style.display = type === PaperWalletGenerationType.FromSeed ? "" : "none";
    }

    generationTypeRandomNewRadioButton.addEventListener("change", () => generationTypeRandomNewRadioButton.checked && SetGenerationType(PaperWalletGenerationType.RandomNew));
    generationTypeUseExistingRadioButton.addEventListener("change", () => generationTypeUseExistingRadioButton.checked && SetGenerationType(PaperWalletGenerationType.UseExisting));
    generationTypeFromSeedRadioButton.addEventListener("change", () => generationTypeFromSeedRadioButton.checked && SetGenerationType(PaperWalletGenerationType.FromSeed));

    // bip38
    const bip38Checkbox = <HTMLInputElement>document.getElementById("bip38-enabled-paper");
    const bip38PasswordContainer = document.getElementById("bip38-password-box-div-paper")!;
    const bip38PasswordInput = <HTMLInputElement>document.getElementById("bip38-password-box-paper");
    const bip38InfoLink = document.getElementById("show-bip38-info-link-paper")!;
    const bip38InfoOverlay = document.getElementById("bip38-info")!;

    bip38InfoLink.addEventListener("click", () => bip38InfoOverlay.style.display = "table");
    bip38Checkbox.addEventListener("change", () => bip38PasswordContainer.style.display = bip38Checkbox.checked ? "table" : "none");

    // generate related elements
    const generateButton = <HTMLButtonElement>document.getElementById("paperwallet-generate-button");
    const generateCountInput = <HTMLInputElement>document.getElementById("paperwallet-generate-count");
    const styleSelector = <HTMLSelectElement>document.getElementById("paperwallet-style-selector");

    async function CreatePaperWalletDiv(design: PaperWalletDesign, address: string, privateKey: string,
        qrCodeErrorCorrectionLevel: QRCodeErrorCorrectionLevel, addressType: AddressType)
    {
        const [privateKeyQR, addressQR] = await Promise.all([
            GenerateQRCode(privateKey, qrCodeErrorCorrectionLevel, "Byte", undefined, 0),
            GenerateAddressQRCode(address, addressType, qrCodeErrorCorrectionLevel, undefined, 0)
        ]);

        const container = document.createElement("div");

        container.style.background = "white";
        container.style.color = "black";
        container.style.position = "relative";
        container.style.border = "2px solid black";
        container.style.width = design.width + "px";
        container.style.height = design.height + "px";

        function AnchorToCSS(anchor: PaperWalletElementAnchor | undefined)
        {
            if (anchor === undefined)
            {
                return ["left", "top"] as const;
            }

            switch (anchor)
            {
                case PaperWalletElementAnchor.TopLeft:
                    return ["left", "top"] as const;
                case PaperWalletElementAnchor.TopRight:
                    return ["right", "top"] as const;
                case PaperWalletElementAnchor.BottomLeft:
                    return ["left", "bottom"] as const;
                case PaperWalletElementAnchor.BottomRight:
                    return ["right", "bottom"] as const;
            }
        }

        function CreateQRImage(imageSrc: string, transform: PaperWalletElementTransform)
        {
            const img = new Image();
            img.src = imageSrc;

            img.style.width = img.style.height = transform.size + "px";

            img.style.position = "absolute";
            const [horizontal, vertical] = AnchorToCSS(transform.anchor);

            img.style[horizontal] = transform.posX + "px";
            img.style[vertical] = transform.posY + "px";

            if (transform.rotation !== undefined)
            {
                img.style.transform = `rotate(${transform.rotation}deg)`;
            }

            return img;
        }

        for (let transform of design.privateKeyQRCodes)
        {
            container.appendChild(CreateQRImage(privateKeyQR, transform));
        }

        for (let transform of design.addressQRCodes)
        {
            container.appendChild(CreateQRImage(addressQR, transform));
        }

        function SplitTextIntoLines(text: string, maxLineLength: number)
        {
            if (maxLineLength <= 0)
            {
                return [text];
            }

            const lines: string[] = [];
            for (let i = 0; i < text.length; i += maxLineLength)
            {
                lines.push(text.substr(i, maxLineLength));
            }

            return lines;
        }

        function CreateText(text: string, properties: PaperWalletTextElement)
        {
            const textDiv = document.createElement("div");
            textDiv.textContent = (() =>
            {
                if (properties.maxLineLength)
                {
                    textDiv.style.whiteSpace = "pre-line";
                    return SplitTextIntoLines(text, properties.maxLineLength).join("\n");
                }
                else
                {
                    return text;
                }
            })();
            textDiv.style.position = "absolute";
            textDiv.style.fontSize = properties.size + "px";
            textDiv.style.fontFamily = properties.fontFamily ?? "roboto-mono";

            const [horizontal, vertical] = AnchorToCSS(properties.anchor);
            textDiv.style[horizontal] = properties.posX + "px";
            textDiv.style[vertical] = properties.posY + "px";

            if (properties.rotation !== undefined)
            {
                textDiv.style.transformOrigin = "0% 0%";
                textDiv.style.transform = `rotate(${properties.rotation}deg)`;
            }

            return textDiv;
        }

        for (let textElement of design.privateKeyTexts)
        {
            container.appendChild(CreateText(privateKey, textElement));
        }

        for (let textElement of design.addressTexts)
        {
            container.appendChild(CreateText(address, textElement));
        }

        for (let customText of design.customTexts ?? [])
        {
            const textDiv = CreateText(customText.text, customText);
            if (customText.bold)
            {
                textDiv.style.fontWeight = "bold";
            }

            if (customText.italic)
            {
                textDiv.style.fontStyle = "italic";
            }

            container.appendChild(textDiv);
        }

        return container;
    }

    const progressTextDiv = document.getElementById("paperwallet-generate-progress-text")!;
    function ShowError(error: string)
    {
        progressTextDiv.textContent = error;
    }

    const useExistingPrivateKeysTextArea = <HTMLTextAreaElement>document.getElementById("paper-use-existing-textarea");

    const generateFromSeedSeedTextArea = <HTMLTextAreaElement>document.getElementById("paper-from-seed-textarea");
    const generateFromSeedOffsetInput = <HTMLInputElement>document.getElementById("paper-from-seed-offset");
    const generateFromSeedHardenedCheckbox = <HTMLInputElement>document.getElementById("paper-from-seed-hardened-checkbox");
    const generateFromSeedChangeAddressesCheckbox = <HTMLInputElement>document.getElementById("paper-from-seed-change-addresses-checkbox");

    const generatedPaperWalletsContainer = document.getElementById("paperwallet-print-area")!;
    async function GeneratePaperWallets()
    {
        progressTextDiv.style.display = "";

        const count = Number(generateCountInput.value) | 0;
        if (isNaN(count))
        {
            ShowError("Enter a number for count");
            return;
        }
        else if (count < 1)
        {
            ShowError("Count must be greater than zero");
            return;
        }
        else if (count > 100)
        {
            ShowError("Count must be 100 at most");
            return;
        }

        const currentAddressType = addressType;
        const currentQRErrorCorrectionLevel = qrErrorCorrectionLevel;

        // TODO
        let design = GetPaperWalletDesigns("Simple", /* isBIP38 */ false);

        const results: Promise<Result<HTMLElement, string>>[] = [];
        switch (generationType)
        {
            case PaperWalletGenerationType.RandomNew:
                for (let i = 0; i < count; ++i)
                {
                    results.push((async () =>
                    {
                        const { address, privateKey } = await WorkerInterface.GenerateRandomAddress(addressType);
                        const div = await CreatePaperWalletDiv(design, address, privateKey, currentQRErrorCorrectionLevel, currentAddressType);
                        UpdateProgress();

                        return <Result<HTMLElement, string>>{
                            type: "ok",
                            result: div
                        };
                    })());
                }
                break;
            case PaperWalletGenerationType.UseExisting:
                ShowError("Not implemented yet");
                return;
            case PaperWalletGenerationType.FromSeed:
                ShowError("Not implemented yet");
                return;
        }

        let currentCount = 0;
        function UpdateProgress()
        {
            progressTextDiv.textContent = `Generating: ${currentCount++}/${count}`;
        }

        UpdateProgress();

        const paperWalletDivs = await Promise.all(results);
        progressTextDiv.style.display = "none";

        while (generatedPaperWalletsContainer.lastChild)
        {
            generatedPaperWalletsContainer.removeChild(generatedPaperWalletsContainer.lastChild);
        }

        for (let divResult of paperWalletDivs)
        {
            divResult.type === "ok" && generatedPaperWalletsContainer.appendChild(divResult.result);
        }
    }

    generateButton.addEventListener("click", AsyncNoParallel(GeneratePaperWallets));
})();
