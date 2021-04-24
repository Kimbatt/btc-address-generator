"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var EntropyCanvas = (function () { return Lazy(function () {
    var IsDarkMode = Util().IsDarkMode;
    function ShowRandomnessCanvas() {
        return __awaiter(this, void 0, void 0, function () {
            function CanvasResizerFunction() {
                var width = document.documentElement.clientWidth;
                var height = document.documentElement.clientHeight;
                var canvasWidth = width * 0.7;
                var canvasHeight = height * 0.6;
                var imageData = null;
                if (randomnessCanvas.width > 0 && randomnessCanvas.height > 0) {
                    imageData = randomnessCanvasCTX.getImageData(0, 0, randomnessCanvas.width, randomnessCanvas.height);
                }
                var prevFillStyle = randomnessCanvasCTX.fillStyle;
                randomnessCanvas.width = canvasWidth;
                randomnessCanvas.height = canvasHeight;
                randomnessCanvas.style.left = (width / 2 - canvasWidth / 2) + "px";
                randomnessCanvas.style.top = (height / 2 - canvasHeight / 1.5) + "px";
                randomnessCanvasCTX.fillStyle = IsDarkMode() ? "#323639" : "#ffffff";
                randomnessCanvasCTX.fillRect(0, 0, randomnessCanvas.width, randomnessCanvas.height);
                randomnessCanvasCTX.fillStyle = prevFillStyle;
                if (imageData !== null) {
                    randomnessCanvasCTX.putImageData(imageData, 0, 0);
                }
                randomnessText.style.left = (width / 2 - randomnessText.clientWidth / 2) + "px";
                randomnessText.style.top = (height / 2 - canvasHeight / 1.5) + "px";
                var randomnessContainer = document.getElementById("randomness-container");
                randomnessContainer.style.width = canvasWidth + "px";
                randomnessContainer.style.left = (width / 2 - canvasWidth / 2) + "px";
                randomnessContainer.style.top = (height / 2 + canvasHeight / 3 + 10) + "px";
            }
            var randomnessCanvas, randomnessCanvasCTX, randomnessText, entropy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        randomnessCanvas = document.getElementById("randomness-canvas");
                        randomnessCanvasCTX = randomnessCanvas.getContext("2d");
                        randomnessText = document.getElementById("randomness-div");
                        document.getElementById("randomness-overlay-2").style.display = "table";
                        window.addEventListener("resize", CanvasResizerFunction);
                        CanvasResizerFunction();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                randomnessCanvasCTX.fillStyle = IsDarkMode() ? "#323639" : "#ffffff";
                                randomnessCanvasCTX.fillRect(0, 0, randomnessCanvas.width, randomnessCanvas.height);
                                randomnessCanvasCTX.fillStyle = "#5b96f7";
                                var maxRandomnessCount = 1000;
                                var tempEntropy = [];
                                function MouseMoved(event) {
                                    if (tempEntropy.length >= maxRandomnessCount) {
                                        window.removeEventListener("resize", CanvasResizerFunction);
                                        // add some more random values
                                        var cryptoRandomNumbers = crypto.getRandomValues(new Uint32Array(32));
                                        for (var i = 0; i < cryptoRandomNumbers.length; ++i) {
                                            tempEntropy.push(cryptoRandomNumbers[i]);
                                        }
                                        randomnessCanvas.removeEventListener("mousemove", MouseMoved);
                                        resolve(tempEntropy);
                                    }
                                    else {
                                        var rect = randomnessCanvas.getBoundingClientRect();
                                        var x = event.clientX - rect.left;
                                        var y = event.clientY - rect.top;
                                        randomnessCanvasCTX.beginPath();
                                        randomnessCanvasCTX.arc(x, y, 4, 0, Math.PI * 2);
                                        randomnessCanvasCTX.fill();
                                        randomnessText.textContent = "Move your mouse around here for randomness\n" + Math.floor(tempEntropy.length / maxRandomnessCount * 100) + "%";
                                        tempEntropy.push(event.clientX + event.clientY * document.documentElement.clientWidth);
                                    }
                                }
                                randomnessCanvas.addEventListener("mousemove", MouseMoved);
                                // skip button click, set entropy to null
                                document.getElementById("randomness-skip-button").addEventListener("click", function () { return resolve(null); });
                            })];
                    case 1:
                        entropy = _a.sent();
                        if (!(entropy !== null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, WorkerInterface.SetEntropy(entropy)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        document.getElementById("randomness-overlay").style.display = "none";
                        window.removeEventListener("resize", CanvasResizerFunction);
                        return [2 /*return*/];
                }
            });
        });
    }
    return {
        ShowRandomnessCanvas: ShowRandomnessCanvas
    };
}); })();
