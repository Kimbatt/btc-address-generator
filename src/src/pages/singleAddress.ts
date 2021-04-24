
function InitSingleAddressPage()
{
    const { AsyncNoParallel, GenerateAddressQRCode, GenerateQRCode } = Util();

    // address type
    let addressType: AddressType = "bech32";
    const segwitAddressTypeRadioButton = <HTMLInputElement>document.getElementById("singleaddress-radio-type-segwit");
    const bech32AddressTypeRadioButton = <HTMLInputElement>document.getElementById("singleaddress-radio-type-bech32");
    const legacyAddressTypeRadioButton = <HTMLInputElement>document.getElementById("singleaddress-radio-type-legacy");

    segwitAddressTypeRadioButton.addEventListener("change", () => segwitAddressTypeRadioButton.checked && (addressType = "segwit"));
    bech32AddressTypeRadioButton.addEventListener("change", () => bech32AddressTypeRadioButton.checked && (addressType = "bech32"));
    legacyAddressTypeRadioButton.addEventListener("change", () => legacyAddressTypeRadioButton.checked && (addressType = "legacy"));

    // qr error correction level
    let qrErrorCorrectionLevel: QRCodeErrorCorrectionLevel = "H";

    function SetQRErrorCorrectionLevel(level: QRCodeErrorCorrectionLevel)
    {
        qrErrorCorrectionLevel = level;
    }

    const qrErrorCorrectionLevelHRadioButton = <HTMLInputElement>document.getElementById("singleaddress-radio-qr-errorcorrectionlevel-h");
    const qrErrorCorrectionLevelQRadioButton = <HTMLInputElement>document.getElementById("singleaddress-radio-qr-errorcorrectionlevel-q");
    const qrErrorCorrectionLevelMRadioButton = <HTMLInputElement>document.getElementById("singleaddress-radio-qr-errorcorrectionlevel-m");
    const qrErrorCorrectionLevelLRadioButton = <HTMLInputElement>document.getElementById("singleaddress-radio-qr-errorcorrectionlevel-l");

    qrErrorCorrectionLevelHRadioButton.addEventListener("change", () => qrErrorCorrectionLevelHRadioButton.checked && SetQRErrorCorrectionLevel("H"));
    qrErrorCorrectionLevelQRadioButton.addEventListener("change", () => qrErrorCorrectionLevelQRadioButton.checked && SetQRErrorCorrectionLevel("Q"));
    qrErrorCorrectionLevelMRadioButton.addEventListener("change", () => qrErrorCorrectionLevelMRadioButton.checked && SetQRErrorCorrectionLevel("M"));
    qrErrorCorrectionLevelLRadioButton.addEventListener("change", () => qrErrorCorrectionLevelLRadioButton.checked && SetQRErrorCorrectionLevel("L"));

    // address generation
    const generateButton = <HTMLButtonElement>document.getElementById("singleaddress-generate-address-button");

    const privateKeyTextDiv = document.getElementById("single-address-private-key")!
    const privateKeyQRImage = <HTMLImageElement>document.getElementById("single-address-private-key-qr");

    const addressTextDiv = document.getElementById("single-address-address")!;
    const addressQRImage = <HTMLImageElement>document.getElementById("single-address-qr");

    const container = document.getElementById("address-div")!;

    const Generate = AsyncNoParallel(async () =>
    {
        const result = await WorkerInterface.GenerateRandomAddress(addressType);

        const [privateKeyQR, addressQR] = await Promise.all([
            GenerateQRCode(result.privateKey, qrErrorCorrectionLevel, "Byte", 6, 12),
            GenerateAddressQRCode(result.address, addressType, qrErrorCorrectionLevel, 6, 12),
        ]);

        privateKeyTextDiv.textContent = result.privateKey;
        privateKeyQRImage.src = privateKeyQR;
        privateKeyQRImage.style.display = "block";
        privateKeyQRImage.style.marginLeft = "auto";
        privateKeyQRImage.style.marginRight = "auto";

        addressTextDiv.textContent = result.address;
        addressQRImage.src = addressQR;
        addressQRImage.style.display = "block";
        addressQRImage.style.marginLeft = "auto";
        addressQRImage.style.marginRight = "auto";

        container.style.display = "table";
    });

    generateButton.addEventListener("click", Generate);
    return Generate;
}
