
function InitAddressDetailsPage()
{
    const { AsyncNoParallel, GenerateAddressQRCode, WaitForImageLoad, ShowLoadingHelper } = Util();

    const privateKeyInput = <HTMLInputElement>document.getElementById("view-address-private-key-textbox");
    const privateKeyInfoContainer = document.getElementById("view-address-div")!;
    const viewAddressDetailsButton = <HTMLButtonElement>document.getElementById("view-address-details-button");
    const messageDiv = document.getElementById("view-address-message")!;
    const privateKeyTextDiv = document.getElementById("view-address-private-key")!;
    const privateKeyDetailsTextDiv = document.getElementById("view-address-private-key-details-text")!;
    const decryptedPrivateKeyTextDiv = document.getElementById("view-address-decrypted-private-key")!;
    const decryptedPrivateKeyDetailsTextDiv = document.getElementById("view-address-decrypted-private-key-details-text")!;
    const bip38decryptDiv = document.getElementById("view-address-bip38-decrypt-div")!;
    const bip38passwordInput = <HTMLInputElement>document.getElementById("view-address-bip38-password-textbox");
    const bip38decryptButton = <HTMLButtonElement>document.getElementById("view-address-decrypt-button");

    const segwitAddressTextDiv = document.getElementById("view-address-segwitaddress")!;
    const bech32AddressTextDiv = document.getElementById("view-address-bech32address")!;
    const legacyAddressTextDiv = document.getElementById("view-address-legacyaddress")!;

    const segwitQRImage = <HTMLImageElement>document.getElementById("view-address-segwitaddress-qr");
    const bech32QRImage = <HTMLImageElement>document.getElementById("view-address-bech32address-qr");
    const legacyQRImage = <HTMLImageElement>document.getElementById("view-address-legacyaddress-qr");

    const loading = new ShowLoadingHelper(document.getElementById("view-address-loading-container")!, 100);

    async function ViewAddressDetails(privateKey: string, encryptedPrivateKey: string | null = null)
    {
        if (privateKey === "")
        {
            return;
        }

        loading.show();
        const result = await WorkerInterface.GetPrivateKeyDetails(privateKey);

        if (encryptedPrivateKey === null)
        {
            decryptedPrivateKeyTextDiv.style.display = "none";
            decryptedPrivateKeyDetailsTextDiv.style.display = "none";
            bip38decryptDiv.style.display = "none";
        }

        if (result.type === "error")
        {
            messageDiv.style.display = "";
            privateKeyInfoContainer.style.display = "none";
            privateKeyDetailsTextDiv.style.display = "none";
            messageDiv.textContent = `Invalid private key (${result.message})`;
            loading.hide();
            return;
        }

        messageDiv.style.display = "none";

        if (result.type === "probablyBIP38")
        {
            bip38decryptDiv.style.display = "";
            privateKeyInfoContainer.style.display = "none";
            privateKeyDetailsTextDiv.style.display = "none";
            loading.hide();
            return;
        }

        // all ok, generate qr codes first
        await Promise.all([
            GenerateAddressQRCode(result.segwitAddress, "segwit", "H", 4, 8).then(qrImageSrc => WaitForImageLoad(segwitQRImage, qrImageSrc)),
            GenerateAddressQRCode(result.bech32Address, "bech32", "H", 4, 8).then(qrImageSrc => WaitForImageLoad(bech32QRImage, qrImageSrc)),
            GenerateAddressQRCode(result.legacyAddress, "legacy", "H", 4, 8).then(qrImageSrc => WaitForImageLoad(legacyQRImage, qrImageSrc))
        ]);

        // set text fields
        segwitAddressTextDiv.textContent = result.segwitAddress;
        bech32AddressTextDiv.textContent = result.bech32Address;
        legacyAddressTextDiv.textContent = result.legacyAddress;

        if (encryptedPrivateKey !== null)
        {
            privateKeyDetailsTextDiv.textContent = "Details for encrypted private key: ";
            privateKeyTextDiv.textContent = encryptedPrivateKey;
            decryptedPrivateKeyTextDiv.style.display = "inline";
            decryptedPrivateKeyTextDiv.textContent = privateKey;
            decryptedPrivateKeyDetailsTextDiv.style.display = "block";
        }
        else
        {
            privateKeyDetailsTextDiv.textContent = "Details for private key: ";
            privateKeyTextDiv.textContent = privateKey;
        }

        loading.hide();

        // show container
        privateKeyInfoContainer.style.display = "table";
        privateKeyDetailsTextDiv.style.display = "inline";

        bip38decryptDiv.style.display = "none";
    }

    const ViewDetailsFunction = AsyncNoParallel(ViewAddressDetails);
    const GetPrivateKeyInputValue = () => privateKeyInput.value.trim();
    viewAddressDetailsButton.addEventListener("click", () => ViewDetailsFunction(GetPrivateKeyInputValue()));
    privateKeyInput.addEventListener("keyup", ev => ev.key === "Enter" && ViewDetailsFunction(GetPrivateKeyInputValue()));

    async function DecryptPrivateKey()
    {
        loading.show();
        messageDiv.style.display = "none";

        const encryptedPrivateKey = privateKeyInput.value.trim();
        const decrypted = await WorkerInterface.BIP38DecryptPrivateKey(encryptedPrivateKey, bip38passwordInput.value);
        if (decrypted.type === "err")
        {
            messageDiv.style.display = "";
            messageDiv.textContent = `Cannot decrypt address (${decrypted.error})`;
            loading.hide();
            return;
        }

        await ViewAddressDetails(decrypted.result, encryptedPrivateKey);
    }

    const DecryptPrivateKeyFunction = AsyncNoParallel(DecryptPrivateKey);
    bip38decryptButton.addEventListener("click", DecryptPrivateKeyFunction);
    bip38passwordInput.addEventListener("keyup", ev => ev.key === "Enter" && DecryptPrivateKeyFunction());
}
