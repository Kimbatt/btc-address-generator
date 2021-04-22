
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
                    posX: 120,
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
                        posX: isBIP38 ? 431 : 514,
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
    const { AsyncNoParallel, GenerateAddressQRCode, GenerateQRCode, ShowLoadingHelper } = Util();

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
    const loading = new ShowLoadingHelper(document.getElementById("paperwallet-generate-progress-container")!, 100);

    const errorMessageDiv = document.getElementById("paperwallet-generate-progress-error")!;

    function ShowMessage(message: string)
    {
        progressTextDiv.textContent = message;
    }

    function ShowError(message: string)
    {
        loading.hide();
        errorMessageDiv.style.display = "";
        errorMessageDiv.textContent = message;
    }

    const useExistingPrivateKeysTextArea = <HTMLTextAreaElement>document.getElementById("paper-use-existing-textarea");

    const generateFromSeedSeedTextArea = <HTMLTextAreaElement>document.getElementById("paper-from-seed-textarea");
    const generateFromSeedSeedPassword = <HTMLInputElement>document.getElementById("paper-from-seed-password");
    const generateFromSeedOffsetInput = <HTMLInputElement>document.getElementById("paper-from-seed-offset");
    const generateFromSeedHardenedCheckbox = <HTMLInputElement>document.getElementById("paper-from-seed-hardened-checkbox");
    const generateFromSeedChangeAddressesCheckbox = <HTMLInputElement>document.getElementById("paper-from-seed-change-addresses-checkbox");

    const generatedPaperWalletsContainer = document.getElementById("paperwallet-print-area")!;
    async function GeneratePaperWallets()
    {
        loading.show();
        errorMessageDiv.style.display = "none";

        let count = Number(generateCountInput.value) | 0;
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

        let currentCount = 0;
        function UpdateProgress()
        {
            progressTextDiv.textContent = `Generating: ${currentCount++}/${count}`;
        }

        const isBIP38 = bip38Checkbox.checked;
        const bip38Password = bip38PasswordInput.value;
        if (isBIP38 && bip38Password === "")
        {
            ShowError("BIP38 password must not be empty");
            return;
        }

        const design = GetPaperWalletDesigns("Simple", isBIP38);

        async function CreateDivFromAddressAndPrivateKey(address: string, privateKey: string)
        {
            return await CreatePaperWalletDiv(design, address, privateKey, currentQRErrorCorrectionLevel, currentAddressType);
        }

        type PaperWalletGenerateResult = Result<HTMLElement, [string, string]>;
        const results: Promise<PaperWalletGenerateResult>[] = [];
        switch (generationType)
        {
            case PaperWalletGenerationType.RandomNew:
            {
                if (isBIP38)
                {
                    const bip38Password = bip38PasswordInput.value;

                    ShowMessage("Generating initial values");
                    const encryptionData = await WorkerInterface.GenerateRandomBIP38EncryptionData(bip38Password, currentAddressType);
                    if (encryptionData.type === "err")
                    {
                        ShowError(encryptionData.error);
                        return;
                    }

                    UpdateProgress();

                    for (let i = 0; i < count; ++i)
                    {
                        results.push((async () =>
                        {
                            const { address, privateKey } = await WorkerInterface.GenerateRandomBIP38EncryptedAddress(encryptionData.result);
                            const div = await CreateDivFromAddressAndPrivateKey(address, privateKey);

                            UpdateProgress();
                            return <PaperWalletGenerateResult>{
                                type: "ok",
                                result: div
                            };
                        })());
                    }
                }
                else
                {
                    UpdateProgress();

                    for (let i = 0; i < count; ++i)
                    {
                        results.push((async () =>
                        {
                            const { address, privateKey } = await WorkerInterface.GenerateRandomAddress(addressType);
                            const div = await CreateDivFromAddressAndPrivateKey(address, privateKey);

                            UpdateProgress();
                            return <PaperWalletGenerateResult>{
                                type: "ok",
                                result: div
                            };
                        })());
                    }
                }
                break;
            }
            case PaperWalletGenerationType.UseExisting:
            {
                const privateKeys = useExistingPrivateKeysTextArea.value.split(/\s+/g);
                const maybeValidPrivateKeys: string[] = [];
                for (let i = 0; i < privateKeys.length; ++i)
                {
                    const current = privateKeys[i];
                    const match = current.match(/[a-km-zA-HJ-NP-Z1-9]+/g);
                    if (match)
                    {
                        maybeValidPrivateKeys.push(match[0]);
                    }
                }

                if (maybeValidPrivateKeys.length === 0)
                {
                    ShowError("No valid private keys were entered");
                    return;
                }

                count = maybeValidPrivateKeys.length;
                UpdateProgress();

                for (let privateKey of maybeValidPrivateKeys)
                {
                    results.push((async () =>
                    {
                        const decodeResult = await WorkerInterface.GetPrivateKeyDetails(privateKey);
                        if (decodeResult.type !== "ok")
                        {
                            UpdateProgress();
                            return <PaperWalletGenerateResult>{ type: "err", error: ["Invalid private key", privateKey] };
                        }

                        const resultPrivateKey = await (async (): Promise<Result<string, string>> =>
                        {
                            if (isBIP38)
                            {
                                const encryptionResult = await WorkerInterface.BIP38EncryptPrivateKey(privateKey, bip38Password);
                                if (encryptionResult.type === "err")
                                {
                                    return encryptionResult;
                                }

                                return { type: "ok", result: encryptionResult.result };
                            }
                            else
                            {
                                return { type: "ok", result: privateKey };
                            }
                        })();

                        if (resultPrivateKey.type === "err")
                        {
                            UpdateProgress();
                            return <PaperWalletGenerateResult>{
                                type: "err",
                                error: [resultPrivateKey.error, privateKey]
                            };
                        }

                        const address = ((): string =>
                        {
                            switch (currentAddressType)
                            {
                                case "legacy":
                                    return decodeResult.legacyAddress;
                                case "segwit":
                                    return decodeResult.segwitAddress;
                                case "bech32":
                                    return decodeResult.bech32Address;
                            }
                        })();

                        const div = await CreateDivFromAddressAndPrivateKey(address, resultPrivateKey.result);

                        UpdateProgress();
                        return <PaperWalletGenerateResult>{
                            type: "ok",
                            result: div
                        };
                    })());
                }

                break;
            }
            case PaperWalletGenerationType.FromSeed:
            {
                const seed = generateFromSeedSeedTextArea.value;
                const seedPassword = generateFromSeedSeedPassword.value;
                const offset = Number(generateFromSeedOffsetInput.value) | 0;
                if (isNaN(offset))
                {
                    ShowError("Offset must be a number");
                    return;
                }
                if (offset < 0)
                {
                    ShowError("Offset must not be negative");
                    return;
                }

                const startIndex = offset;
                const endIndex = startIndex + count
                if (endIndex > 0x80000000)
                {
                    ShowError("Offset + Count must be 2147483648 at most");
                    return;
                }

                const hardened = generateFromSeedHardenedCheckbox.checked;
                const changeAddresses = generateFromSeedChangeAddressesCheckbox.checked;

                UpdateProgress();
                const rootKeyResult = await WorkerInterface.GetBIP32RootKeyFromSeed(seed, seedPassword);
                if (rootKeyResult.type === "err")
                {
                    ShowError("Invalid seed: " + rootKeyResult.error);
                    return;
                }

                const rootKey = rootKeyResult.result;

                const purpose: BIP32Purpose = currentAddressType === "legacy" ? "44" : currentAddressType === "segwit" ? "49" : "84";
                const basePath = `m/${purpose}'/0'/0'`;

                for (let i = startIndex; i < endIndex; ++i)
                {
                    results.push((async () =>
                    {
                        const derivedResult = await WorkerInterface.DeriveBIP32ExtendedKey(rootKey, basePath, purpose, hardened, changeAddresses);
                        if (derivedResult.type === "err")
                        {
                            UpdateProgress();
                            return <PaperWalletGenerateResult>{
                                type: "err",
                                error: [derivedResult.error, "index " + i]
                            };
                        }

                        const addressResult = await WorkerInterface.DeriveBIP32Address(derivedResult.result.path,
                            derivedResult.result.publicKey, derivedResult.result.privateKey, i, purpose, hardened);
                        if (addressResult.type === "err")
                        {
                            UpdateProgress();
                            return <PaperWalletGenerateResult>{
                                type: "err",
                                error: [addressResult.error, "index " + i]
                            };
                        }

                        const address = addressResult.result.address;
                        let privateKey = addressResult.result.privateKey!;

                        if (isBIP38)
                        {
                            const encryptionResult = await WorkerInterface.BIP38EncryptPrivateKey(privateKey, bip38Password);
                            if (encryptionResult.type === "err")
                            {
                                UpdateProgress();
                                return <PaperWalletGenerateResult>{
                                    type: "err",
                                    error: [encryptionResult.error, "index " + i]
                                };
                            }

                            privateKey = encryptionResult.result;
                        }

                        const div = await CreateDivFromAddressAndPrivateKey(address, privateKey);
                        UpdateProgress();

                        return <PaperWalletGenerateResult>{
                            type: "ok",
                            result: div
                        };
                    })());
                }

                break;
            }
        }

        const paperWalletDivs = await Promise.all(results);

        while (generatedPaperWalletsContainer.lastChild)
        {
            generatedPaperWalletsContainer.removeChild(generatedPaperWalletsContainer.lastChild);
        }

        const errorMessages: [string, string][] = [];
        for (let divResult of paperWalletDivs)
        {
            if (divResult.type === "ok")
            {
                generatedPaperWalletsContainer.appendChild(divResult.result);
            }
            else
            {
                errorMessages.push(divResult.error)
            }
        }

        if (errorMessages.length !== 0)
        {
            ShowError("Some of the private keys were invalid, so the corresponding wallets were not generated: \n" +
                errorMessages.map(err =>
                {
                    const errorMessage = err[0];
                    const privateKey = err[1];

                    return `${errorMessage} (processing private key "${privateKey}")`;
                }).join("\n")
            );
        }
        else
        {
            loading.hide();
        }
    }

    generateButton.addEventListener("click", AsyncNoParallel(GeneratePaperWallets));
})();
