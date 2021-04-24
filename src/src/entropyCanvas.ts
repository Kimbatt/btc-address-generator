
const EntropyCanvas = (() => Lazy(() =>
{
    const { IsDarkMode } = Util();

    async function ShowRandomnessCanvas()
    {
        const randomnessCanvas = <HTMLCanvasElement>document.getElementById("randomness-canvas");
        const randomnessCanvasCTX = randomnessCanvas.getContext("2d")!;
        const randomnessText = document.getElementById("randomness-div")!;

        function CanvasResizerFunction()
        {
            const width = document.documentElement.clientWidth;
            const height = document.documentElement.clientHeight;
            const canvasWidth = width * 0.7;
            const canvasHeight = height * 0.6;

            let imageData = null;
            if (randomnessCanvas.width > 0 && randomnessCanvas.height > 0)
            {
                imageData = randomnessCanvasCTX.getImageData(0, 0, randomnessCanvas.width, randomnessCanvas.height);
            }

            const prevFillStyle = randomnessCanvasCTX.fillStyle;

            randomnessCanvas.width = canvasWidth;
            randomnessCanvas.height = canvasHeight;
            randomnessCanvas.style.left = (width / 2 - canvasWidth / 2) + "px";
            randomnessCanvas.style.top = (height / 2 - canvasHeight / 1.5) + "px";

            randomnessCanvasCTX.fillStyle = IsDarkMode() ? "#323639" : "#ffffff";
            randomnessCanvasCTX.fillRect(0, 0, randomnessCanvas.width, randomnessCanvas.height);
            randomnessCanvasCTX.fillStyle = prevFillStyle;

            if (imageData !== null)
            {
                randomnessCanvasCTX.putImageData(imageData, 0, 0);
            }

            randomnessText.style.left = (width / 2 - randomnessText.clientWidth / 2) + "px";
            randomnessText.style.top = (height / 2 - canvasHeight / 1.5) + "px";

            const randomnessContainer = document.getElementById("randomness-container")!;
            randomnessContainer.style.width = canvasWidth + "px";
            randomnessContainer.style.left = (width / 2 - canvasWidth / 2) + "px";
            randomnessContainer.style.top = (height / 2 + canvasHeight / 3 + 10) + "px";
        }

        document.getElementById("randomness-overlay-2")!.style.display = "table";

        window.addEventListener("resize", CanvasResizerFunction);
        CanvasResizerFunction();

        const entropy = await new Promise<number[] | null>(resolve =>
        {
            randomnessCanvasCTX.fillStyle = IsDarkMode() ? "#323639" : "#ffffff";
            randomnessCanvasCTX.fillRect(0, 0, randomnessCanvas.width, randomnessCanvas.height);
            randomnessCanvasCTX.fillStyle = "#5b96f7";

            const maxRandomnessCount = 1000;
            const tempEntropy: number[] = [];

            function MouseMoved(event: MouseEvent)
            {
                if (tempEntropy.length >= maxRandomnessCount)
                {
                    window.removeEventListener("resize", CanvasResizerFunction);

                    // add some more random values
                    const cryptoRandomNumbers = crypto.getRandomValues(new Uint32Array(32));
                    for (let i = 0; i < cryptoRandomNumbers.length; ++i)
                    {
                        tempEntropy.push(cryptoRandomNumbers[i]);
                    }

                    randomnessCanvas.removeEventListener("mousemove", MouseMoved);
                    resolve(tempEntropy);
                }
                else
                {
                    const rect = randomnessCanvas.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    randomnessCanvasCTX.beginPath();
                    randomnessCanvasCTX.arc(x, y, 4, 0, Math.PI * 2);
                    randomnessCanvasCTX.fill();
                    randomnessText.textContent = `Move your mouse around here for randomness\n${Math.floor(tempEntropy.length / maxRandomnessCount * 100)}%`;

                    tempEntropy.push(event.clientX + event.clientY * document.documentElement.clientWidth);
                }
            }

            randomnessCanvas.addEventListener("mousemove", MouseMoved);

            // skip button click, set entropy to null
            document.getElementById("randomness-skip-button")!.addEventListener("click", () => resolve(null));
        });

        if (entropy !== null)
        {
            await WorkerInterface.SetEntropy(entropy);
        }

        document.getElementById("randomness-overlay")!.style.display = "none";
        window.removeEventListener("resize", CanvasResizerFunction);
    }

    return {
        ShowRandomnessCanvas
    };
}))();
