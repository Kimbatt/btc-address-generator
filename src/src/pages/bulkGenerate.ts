
(() =>
{
    const { AsyncNoParallel } = Util();
/*

        <div id="page-bulk-generate" style="display: none; width: 80%; padding-left: 10px;">
            <div style="display: table-row; padding-right: 20px;">

                <div style="padding-left: 10px;">
                    <div style="font-weight: bold; font-size: 20px; padding-bottom: 10px;">Address type:</div>

                    <br>
                    <div style="display: table;">
                        <label style="display: table-cell; font-size: 20px; font-weight: bold;"><input type="checkbox" style="margin-bottom: 20px;" id="bip38-enabled-bulk">Bip38 encrypt</label>
                        <div class="link-style" id="show-bip38-info-button-bulk" style="display: table-cell; font-size: 22px; padding-left: 20px;">What is bip38 encryption?</div>
                    </div>
                </div>
                <div id="bip38-password-box-div-bulk" style="display: none; padding-bottom: 15px; border-bottom: 2px solid #bbbbbb;">
                    <div style="display: table-cell; padding-right: 10px; font-size: 25px;">Password:</div>
                    <input id="bip38-password-box-bulk" type="text" style="display: table-cell; font-size: 20px; padding: 5px;">
                </div>
                <br>
                <div style="font-weight: bold; font-size: 20px; padding-bottom: 10px;">Number of addresses to generate (max 1000):</div>
                <div style="display: table;">
                    <input id="bulk-count" type="number" value="10" min="1" max="1000" style="display: inline-block; font-size: 25px; width: 100px; padding: 5px;">
                    <button id="bulk-generate-button" style="display: inline-block; width: 300px; margin-left: 20px;">Generate</button>
                </div>
            </div>
            <textarea style="display: block; width: 100%; height: 400px; font-family: roboto-mono; font-size: 19px; padding: 8px; margin-top: 15px; border: 2px solid #bbbbbb; resize: none;" id="bulk-addresses" readonly>Press generate to start generating</textarea>
        </div>

*/


    // address type
    let addressType: AddressType = "bech32";
    const segwitAddressTypeRadioButton = <HTMLInputElement>document.getElementById("bulk-radio-type-segwit");
    const bech32AddressTypeRadioButton = <HTMLInputElement>document.getElementById("bulk-radio-type-bech32");
    const legacyAddressTypeRadioButton = <HTMLInputElement>document.getElementById("bulk-radio-type-legacy");

    segwitAddressTypeRadioButton.addEventListener("change", () => segwitAddressTypeRadioButton.checked && (addressType = "segwit"));
    bech32AddressTypeRadioButton.addEventListener("change", () => bech32AddressTypeRadioButton.checked && (addressType = "bech32"));
    legacyAddressTypeRadioButton.addEventListener("change", () => legacyAddressTypeRadioButton.checked && (addressType = "legacy"));

    // bip38
    const bip38Checkbox = <HTMLInputElement>document.getElementById("bip38-enabled-bulk");
    const bip38PasswordContainer = document.getElementById("bip38-password-box-div-bulk")!;
    const bip38PasswordInput = <HTMLInputElement>document.getElementById("bip38-password-box-bulk");
    const bip38InfoLink = document.getElementById("show-bip38-info-link-bulk")!;
    const bip38InfoOverlay = document.getElementById("bip38-info")!;

    bip38InfoLink.addEventListener("click", () => bip38InfoOverlay.style.display = "table");
    bip38Checkbox.addEventListener("change", () => bip38PasswordContainer.style.display = bip38Checkbox.checked ? "table" : "none");

    // generate related elements
    const bulkGenerateButton = <HTMLButtonElement>document.getElementById("bulk-generate-button");
    const bulkGenerateCountInput = <HTMLInputElement>document.getElementById("bulk-count");
    const resultTextArea = <HTMLTextAreaElement>document.getElementById("bulk-addresses");

    async function BulkGenerate()
    {
        // validate count
        const count = Number(bulkGenerateCountInput.value) | 0;
        if (isNaN(count))
        {
            resultTextArea.value = "Enter a number";
            return;
        }
        if (count < 1)
        {
            resultTextArea.value = "Number must be greater than zero";
            return;
        }
        if (count > 10000)
        {
            resultTextArea.value = "Number must be 10,000 at most";
            return;
        }

        const bulkAddressType = addressType;

        let generatedCount = 0;
        function UpdateProgress()
        {
            resultTextArea.value = `Generating: ${(generatedCount++)}/${count}`;
        }

        function SetAndFormatResult(result: { address: string, privateKey: string }[])
        {
            resultTextArea.value = result
                .map(({ address, privateKey }, index) => `${(index + 1)}, "${address}", "${privateKey}"`)
                .join("\n");
        }

        if (bip38Checkbox.checked)
        {
            // bip38 encrypted
            const bip38Password = bip38PasswordInput.value;

            resultTextArea.value = "Generating initial values";
            const encryptionData = await WorkerInterface.GenerateRandomBIP38EncryptionData(bip38Password, bulkAddressType);
            if (encryptionData.type === "err")
            {
                resultTextArea.value = encryptionData.error;
                return;
            }

            UpdateProgress();

            const allPromises = new Array<Promise<AddressWithPrivateKey>>(count);
            for (let i = 0; i < count; ++i)
            {
                allPromises[i] = WorkerInterface
                    .GenerateRandomBIP38EncryptedAddress(encryptionData.result)
                    .then(res =>
                    {
                        UpdateProgress();
                        return res;
                    });
            }

            const result = await Promise.all(allPromises);
            SetAndFormatResult(result);
        }
        else
        {
            UpdateProgress();

            const allPromises = new Array<Promise<AddressWithPrivateKey>>(count);
            for (let i = 0; i < count; ++i)
            {
                allPromises[i] = WorkerInterface
                    .GenerateRandomAddress(bulkAddressType)
                    .then(res =>
                    {
                        UpdateProgress();
                        return res;
                    });
            }

            const result = await Promise.all(allPromises);
            SetAndFormatResult(result);
        }
    }

    bulkGenerateButton.addEventListener("click", AsyncNoParallel(BulkGenerate));
})();
