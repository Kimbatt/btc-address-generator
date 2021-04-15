
(() =>
{
    const { AsyncNoParallel, GenerateAddressQRCode } = Util();

    const privateKeyInput = <HTMLInputElement>document.getElementById("view-address-privkey-textbox");
    const privateKeyInfoContainer = document.getElementById("view-address-div")!;
    const viewAddressDetailsButton = <HTMLButtonElement>document.getElementById("view-address-details-button");
    const messageDiv = document.getElementById("view-address-message")!;
    const privateKeyTextDiv = document.getElementById("view-address-private-key")!;
    const privateKeyDetailsTextDiv = document.getElementById("view-address-private-key-details-text")!;
    const bip38decryptDiv = document.getElementById("view-address-bip38-decrypt-div")!;
    const bip38passwordInput = <HTMLInputElement>document.getElementById("view-address-bip38-password-textbox");
    const bip38decryptButton = <HTMLButtonElement>document.getElementById("view-address-decrypt-button");

    const segwitAddressTextDiv = document.getElementById("view-address-segwitaddress")!;
    const bech32AddressTextDiv = document.getElementById("view-address-bech32address")!;
    const legacyAddressTextDiv = document.getElementById("view-address-legacyaddress")!;

    const segwitQRImage = <HTMLImageElement>document.getElementById("view-address-segwitaddress-qr");
    const bech32QRImage = <HTMLImageElement>document.getElementById("view-address-bech32address-qr");
    const legacyQRImage = <HTMLImageElement>document.getElementById("view-address-legacyaddress-qr");

    async function ViewAddressDetails()
    {
        const privateKey = privateKeyInput.value.trim();
        if (privateKey === "")
        {
            return;
        }

        messageDiv.style.display = "none";
        privateKeyInfoContainer.style.display = "none";
        privateKeyTextDiv.textContent = "";
        privateKeyDetailsTextDiv.style.display = "none";
        bip38decryptDiv.style.display = "none";

        const result = await WorkerInterface.GetPrivateKeyDetails(privateKey);
        if (result.type === "error")
        {
            messageDiv.style.display = "";
            messageDiv.textContent = "Invalid private key (" + result.message + ")";
            return;
        }
        else if (result.type === "probablyBIP38")
        {
            bip38decryptDiv.style.display = "";
            // TODO
            return;
        }

        // all ok, generate qr codes first
        const [segwitQR, bech32QR, legacyQR] = await Promise.all([
            GenerateAddressQRCode(result.segwitAddress, "segwit", "H", 4, 8),
            GenerateAddressQRCode(result.bech32Address, "bech32", "H", 4, 8),
            GenerateAddressQRCode(result.legacyAddress, "legacy", "H", 4, 8)
        ]);

        // set text fields
        privateKeyTextDiv.textContent = privateKey;

        segwitAddressTextDiv.textContent = result.segwitAddress;
        bech32AddressTextDiv.textContent = result.bech32Address;
        legacyAddressTextDiv.textContent = result.legacyAddress;

        // set qr code
        segwitQRImage.src = segwitQR;
        bech32QRImage.src = bech32QR;
        legacyQRImage.src = legacyQR;

        // show container
        privateKeyInfoContainer.style.display = "table";
        privateKeyDetailsTextDiv.style.display = "table";
    }

    const ViewDetailsFunction = AsyncNoParallel(ViewAddressDetails);
    viewAddressDetailsButton.addEventListener("click", ViewDetailsFunction);
    privateKeyInput.addEventListener("keyup", ev => ev.key === "Enter" && ViewDetailsFunction());

})();
