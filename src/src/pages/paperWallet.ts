
interface PaperWalletElementTransform
{
    anchor?: PaperWalletElementAnchor;
    size: number;
    posX: number;
    posY: number;
    rotation?: number;
}

const enum PaperWalletElementAnchor
{
    TopLeft, TopRight, BottomLeft, BottomRight
}

interface PaperWalletCustomTextElement
{
    text: string;
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
    transform: PaperWalletElementTransform;
}

interface PaperWalletDesign
{
    backgroundImageSrc?: string;
    width: number;
    height: number;
    addressQRCodes: PaperWalletElementTransform[];
    privateKeyQRCodes: PaperWalletElementTransform[];
    addressTexts: PaperWalletElementTransform[];
    privateKeyTexts: PaperWalletElementTransform[];
    customTexts?: PaperWalletCustomTextElement[];

    preProcess?(design: PaperWalletDesign, isBip38: boolean): void;
}

function GetPaperWalletDesigns(): { [key: string]: PaperWalletDesign }
{
    return {
        "Simple": {
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
                posX: 120,
                posY: 10,
                size: 18
            }],
            customTexts: [
                {
                    text: "Address:",
                    fontFamily: "Verdana",
                    bold: true,
                    transform: {
                        posX: 120,
                        posY: 15,
                        size: 25
                    }
                },
                {
                    text: "Private key:",
                    fontFamily: "Verdana",
                    bold: true,
                    transform: {
                        anchor: PaperWalletElementAnchor.BottomRight,
                        posX: 514,
                        posY: 40,
                        size: 25
                    }
                }
            ],
            preProcess: (design, isBip38) =>
            {
                if (!isBip38)
                {
                    return;
                }

                design.customTexts![1].text = "Encrypted private key:";
                design.privateKeyTexts[0]!.posX = 430;
            }
        }
    };
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

        function CreateText(text: string, fontFamily: string, transform: PaperWalletElementTransform)
        {
            const textDiv = document.createElement("div");
            textDiv.textContent = text;
            textDiv.style.position = "absolute";
            textDiv.style.fontSize = transform.size + "px";
            textDiv.style.fontFamily = fontFamily;

            const [horizontal, vertical] = AnchorToCSS(transform.anchor);
            textDiv.style[horizontal] = transform.posX + "px";
            textDiv.style[vertical] = transform.posY + "px";

            if (transform.rotation !== undefined)
            {
                textDiv.style.transformOrigin = "0% 0%";
                textDiv.style.transform = `rotate(${transform.rotation}deg)`;
            }

            return textDiv;
        }

        for (let textTransform of design.privateKeyTexts)
        {
            container.appendChild(CreateText(privateKey, "roboto-mono", textTransform));
        }

        for (let textTransform of design.addressTexts)
        {
            container.appendChild(CreateText(address, "roboto-mono", textTransform));
        }

        for (let customText of design.customTexts ?? [])
        {
            const textDiv = CreateText(customText.text, customText.fontFamily ?? "roboto-mono", customText.transform);
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

        let currentCount = 0;
        function UpdateProgress()
        {
            progressTextDiv.textContent = `Generating: ${currentCount++}/${count}`;
        }

        UpdateProgress();

        const currentAddressType = addressType;
        const currentQRErrorCorrectionLevel = qrErrorCorrectionLevel;

        // TODO
        let design = GetPaperWalletDesigns()["Simple"];
        if (design.preProcess !== undefined)
        {
            design.preProcess(design, /* isBIP38 */ false);
        }

        const allPromises = new Array<Promise<HTMLElement>>(count);
        for (let i = 0; i < count; ++i)
        {
            allPromises[i] = (async () =>
            {
                const { address, privateKey } = await WorkerInterface.GenerateRandomAddress(addressType)
                const div = await CreatePaperWalletDiv(design, address, privateKey, currentQRErrorCorrectionLevel, currentAddressType);
                UpdateProgress();
                return div;
            })();
        }

        const paperWalletDivs = await Promise.all(allPromises);
        progressTextDiv.style.display = "none";

        while (generatedPaperWalletsContainer.lastChild)
        {
            generatedPaperWalletsContainer.removeChild(generatedPaperWalletsContainer.lastChild);
        }

        for (let div of paperWalletDivs)
        {
            generatedPaperWalletsContainer.appendChild(div);
        }
    }

    generateButton.addEventListener("click", AsyncNoParallel(GeneratePaperWallets));
})();
