
function InitMnemonicSeedPage()
{
    const { AsyncNoParallel } = Util();

    // page switching
    const seedGeneratorPage = document.getElementById("seed-generate-page")!;
    const seedDetailsPage = document.getElementById("seed-details-page")!;

    const activateSeedGeneratorPageButton = <HTMLButtonElement>document.getElementById("seed-generate-page-button");
    const activateSeedDetailsPageButton = <HTMLButtonElement>document.getElementById("seed-details-page-button");

    activateSeedDetailsPageButton.addEventListener("click", () =>
    {
        seedGeneratorPage.style.display = "none";
        seedDetailsPage.style.display = "";

        activateSeedDetailsPageButton.disabled = true;
        activateSeedGeneratorPageButton.disabled = false;
    });

    activateSeedGeneratorPageButton.addEventListener("click", () =>
    {
        seedGeneratorPage.style.display = "";
        seedDetailsPage.style.display = "none";

        activateSeedDetailsPageButton.disabled = false;
        activateSeedGeneratorPageButton.disabled = true;
    });

    // seed generation
    const generateSeedButton = <HTMLButtonElement>document.getElementById("seed-generate-button");
    const generateSeedResultDiv = document.getElementById("seed-generate-result")!;
    const generateSeedWordCount = <HTMLSelectElement>document.getElementById("seed-generate-wordcount");

    generateSeedButton.addEventListener("click", AsyncNoParallel(async () =>
    {
        const wordCount = Number(generateSeedWordCount.value);
        switch (wordCount)
        {
            case 12: case 15: case 18: case 21: case 24:
                break;
            default:
                // should not happen
                return;
        }

        generateSeedResultDiv.textContent = await WorkerInterface.GenerateMnemonicSeed(wordCount);
        generateSeedResultDiv.style.display = "";
    }));

    // view seed details
    const seedInputTextArea = <HTMLTextAreaElement>document.getElementById("seed-details-seed-textarea");
    const seedPasswordInput = <HTMLInputElement>document.getElementById("seed-details-seed-password");
    const seedPasswordContainerDiv = document.getElementById("seed-details-password-container")!;

    const seedDetailsErrorText = document.getElementById("seed-details-error-text")!;
    const seedResultsContainerDiv = document.getElementById("seed-details-results")!;

    const bip32extendedKeyStartRegex = /^[xyz](pub|prv)/;
    function SeedChanged()
    {
        const seed = seedInputTextArea.value;
        const isBIP32key = bip32extendedKeyStartRegex.test(seed);
        seedPasswordContainerDiv.style.display = isBIP32key ? "none" : "";
        seedResultsContainerDiv.style.display = "none";
        seedDetailsErrorText.style.display = "none";
    }

    function SeedPasswordChanged()
    {
        seedResultsContainerDiv.style.display = "none";
        seedDetailsErrorText.style.display = "none";
    }

    seedInputTextArea.addEventListener("input", SeedChanged);
    seedPasswordInput.addEventListener("input", SeedPasswordChanged);


    const viewSeedDetailsButton = <HTMLButtonElement>document.getElementById("seed-view-details");
    const rootKeyContainerDiv = document.getElementById("seed-details-results-bip32-rootkey-container")!;
    const rootKeyTextArea = <HTMLTextAreaElement>document.getElementById("seed-details-results-rootkey");
    const changeAddressesLabel = document.getElementById("seed-details-results-change-addresses-label")!;
    const changeAddressesCheckbox = <HTMLInputElement>document.getElementById("seed-details-change-addresses-checkbox");
    const hardenedAddressesLabel = document.getElementById("seed-details-results-hardened-addresses-label")!;
    const hardenedAddressesCheckbox = <HTMLInputElement>document.getElementById("seed-details-hardened-addresses-checkbox");
    const seedResultsAddressesContainerDiv = document.getElementById("seed-details-results-addresses-container")!;
    const calculateAddressesErrorTextDiv = document.getElementById("seed-details-addresses-error-text")!;

    async function ViewSeedDetails()
    {
        const seed = seedInputTextArea.value.trim();
        const password = seedPasswordInput.value;
        changeAddressesLabel.style.display = "";
        hardenedAddressesLabel.style.display = "";
        calculateAddressesErrorTextDiv.style.display = "none";

        function ShowError(text: string)
        {
            seedDetailsErrorText.textContent = text;
            seedDetailsErrorText.style.display = "";
            seedResultsContainerDiv.style.display = "none";
        }

        if (seed === "")
        {
            ShowError("Seed cannot be empty");
            return;
        }

        const rootKey: string | null = await (async () =>
        {
            if (bip32extendedKeyStartRegex.test(seed))
            {
                // extended key
                const decodedKeyResult = await WorkerInterface.Base58CheckDecode(seed);
                if (decodedKeyResult.type === "err")
                {
                    ShowError(`Invalid BIP32 key: ${decodedKeyResult.error}`);
                    return null;
                }

                switch (seed[0])
                {
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
                        return null;
                }

                if (seed.substr(1, 3) === "pub")
                {
                    changeAddressesLabel.style.display = "none";
                    hardenedAddressesLabel.style.display = "none";
                }

                rootKeyContainerDiv.style.display = "none";
                return seed;
            }
            else
            {
                // seed
                const result = await WorkerInterface.GetBIP32RootKeyFromSeed(seed, password);
                if (result.type === "err")
                {
                    ShowError(`Invalid mnemonic seed: ${result.error}`);
                    return null;
                }

                rootKeyContainerDiv.style.display = "";
                return result.result;
            }
        })();

        if (rootKey === null)
        {
            return;
        }

        rootKeyTextArea.value = rootKey;
        seedDetailsErrorText.style.display = "none";
        seedResultsContainerDiv.style.display = "";
        seedResultsAddressesContainerDiv.style.display = "none";
    }

    viewSeedDetailsButton.addEventListener("click", AsyncNoParallel(ViewSeedDetails));

    const seedDerivationPathInput = <HTMLInputElement>document.getElementById("seed-details-results-derivation-path-input");
    const seedDerivationPathPresetSelector = <HTMLSelectElement>document.getElementById("seed-details-derivation-path-preset");
    function SeedDerivationPresetChanged(preset: string)
    {
        switch (preset)
        {
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

    seedDerivationPathPresetSelector.addEventListener("change", () => SeedDerivationPresetChanged(seedDerivationPathPresetSelector.value));

    const calculateAddressesButton = <HTMLButtonElement>document.getElementById("seed-details-address-calculate-button");
    const extendedPublicKeyTextArea = <HTMLTextAreaElement>document.getElementById("seed-details-results-extended-pubkey")!;
    const extendedPrivateKeyTextArea = <HTMLTextAreaElement>document.getElementById("seed-details-results-extended-private-key")!;
    const addressCountInput = <HTMLInputElement>document.getElementById("seed-details-address-count");
    const addressOffsetInput = <HTMLInputElement>document.getElementById("seed-details-address-offset");
    const addressesResultTable = document.getElementById("seed-details-results-addresses-table")!;
    const calculateProgressDiv = document.getElementById("seed-details-address-calculate-progress")!;
    async function CalculateAddresses()
    {
        calculateAddressesErrorTextDiv.style.display = "none";

        const rootKey = rootKeyTextArea.value;
        let path = seedDerivationPathInput.value;
        const generateHardenedAddresses = hardenedAddressesCheckbox.checked;

        function ShowError(text: string)
        {
            calculateAddressesErrorTextDiv.textContent = text;
            calculateAddressesErrorTextDiv.style.display = "";
            seedResultsAddressesContainerDiv.style.display = "none";
        }

        let count = Number(addressCountInput.value) | 0;
        if (isNaN(count) || count < 1)
        {
            count = 10;
            addressCountInput.value = count.toString();
        }

        let startIndex = Number(addressOffsetInput.value) | 0;
        if (isNaN(startIndex) || startIndex < 0)
        {
            startIndex = 0;
            addressOffsetInput.value = startIndex.toString();
        }

        const endIndex = startIndex + count;
        if (endIndex > 0x80000000)
        {
            ShowError("Start index + Count must be 2147483648 at most");
            return;
        }

        let derivedKeyPurpose = <BIP32Purpose>seedDerivationPathPresetSelector.value;
        const isPrivate = rootKey.substr(1, 3) === "prv";
        const generateChangeAddresses = changeAddressesCheckbox.checked;

        if (!isPrivate && generateHardenedAddresses)
        {
            ShowError("Hardened addresses can only be derived from extended private keys");
            return;
        }

        calculateProgressDiv.style.display = "";
        let currentProgress = 0;
        function UpdateProgress()
        {
            calculateProgressDiv.textContent = `Calculating: ${currentProgress++}/${count}`;
        }

        UpdateProgress();
        seedResultsAddressesContainerDiv.style.display = "none";

        const derived = await WorkerInterface.DeriveBIP32ExtendedKey(rootKey, path, derivedKeyPurpose, generateHardenedAddresses, generateChangeAddresses);
        if (derived.type === "err")
        {
            ShowError(derived.error);
            return;
        }

        path = derived.result.path;
        derivedKeyPurpose = derived.result.purpose;
        extendedPublicKeyTextArea.value = derived.result.publicKey;
        extendedPrivateKeyTextArea.value = derived.result.privateKey ?? "???";

        while (addressesResultTable.lastChild)
        {
            addressesResultTable.removeChild(addressesResultTable.lastChild);
        }

        const allPromises: Promise<{ address: string, privateKey: string, addressPath: string }>[] = [];
        for (let i = startIndex; i < endIndex; ++i)
        {
            allPromises.push((async () =>
            {
                const result = await WorkerInterface.DeriveBIP32Address(path, derived.result.publicKey, derived.result.privateKey, i, derivedKeyPurpose, generateHardenedAddresses);
                UpdateProgress();
                if (result.type === "err")
                {
                    return {
                        address: "Error calculating address",
                        privateKey: "Error calculating private key",
                        addressPath: "Error calculating path"
                    };
                }
                else
                {
                    return {
                        address: result.result.address,
                        privateKey: result.result.privateKey ?? "???",
                        addressPath: result.result.addressPath
                    };
                }
            })());
        }

        function CreateRow(path: string, address: string, privateKey: string)
        {
            const row = document.createElement("div");
            row.className = "seed-details-results-address-row";

            const pathDiv = document.createElement("div");
            pathDiv.textContent = path;

            const addressDiv = document.createElement("div");
            addressDiv.textContent = address;

            const privateKeyDiv = document.createElement("div");
            privateKeyDiv.textContent = privateKey;

            row.appendChild(pathDiv);
            row.appendChild(addressDiv);
            row.appendChild(privateKeyDiv);

            addressesResultTable.appendChild(row);
        }

        const result = await Promise.all(allPromises);
        calculateProgressDiv.style.display = "none";

        for (let current of result)
        {
            CreateRow(current.addressPath, current.address, current.privateKey);
        }

        seedResultsAddressesContainerDiv.style.display = "";
    }

    calculateAddressesButton.addEventListener("click", AsyncNoParallel(CalculateAddresses));

    const toggleExtendedKeysButton = <HTMLButtonElement>document.getElementById("seed-details-toggle-extended-keys-button");
    const extendedKeysContainer = document.getElementById("seed-details-results-extended-keys")!;
    let seedExtendedKeysVisible = false;
    function ToggleExtendedKeys()
    {
        seedExtendedKeysVisible = !seedExtendedKeysVisible;
        extendedKeysContainer.style.display = seedExtendedKeysVisible ? "" : "none";
        toggleExtendedKeysButton.textContent = seedExtendedKeysVisible ? "Hide extended keys" : "Show extended keys";
    }

    toggleExtendedKeysButton.addEventListener("click", ToggleExtendedKeys);
}
