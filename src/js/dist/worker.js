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
var WorkerInterface;
var CreateWorkers = function () {
    var _a;
    var sources = [
        { fn: INIT_BN, functionName: "INIT_BN" },
        { fn: INIT_EllipticCurve, functionName: "INIT_EllipticCurve", variableName: "EllipticCurve" },
        { fn: INIT_WorkerUtils, functionName: "INIT_WorkerUtils", variableName: "WorkerUtils" },
        { fn: INIT_CryptoJS, functionName: "INIT_CryptoJS", variableName: "CryptoJS" },
        { fn: INIT_CryptoHelper, functionName: "INIT_CryptoHelper", variableName: "CryptoHelper" },
        { fn: INIT_AddressUtil, functionName: "INIT_AddressUtil", variableName: "AddressUtil" },
        { fn: INIT_BIP38, functionName: "INIT_BIP38", variableName: "BIP38Util" },
        { fn: INIT_BIP32, functionName: "INIT_BIP32", variableName: "BIP32Util" },
        { fn: INIT_BIP39, functionName: "INIT_BIP39", variableName: "BIP39Util" },
        { fn: INIT_QR, functionName: "INIT_QR", variableName: "qrcode" },
    ];
    // creating workers from blob url-s are not supported in internet explorer
    var isInternetExplorer = (navigator.userAgent.indexOf("MSIE ") !== -1) || (navigator.userAgent.match(/Trident.*rv\:11\./) !== null);
    var workersAvailable = typeof Worker !== "undefined" && !isInternetExplorer;
    var DoWorkerJobWrapper;
    var ForEveryWorkerWrapper;
    if (!workersAvailable) {
        // no workers, setup single threaded
        sources.forEach(function (source) {
            var result = source.fn();
            if (source.variableName !== undefined) {
                self[source.variableName] = result;
            }
        });
        var working_1 = false;
        var waitingPromises_1 = [];
        var NotifyWorkFinished_1 = function () {
            var nextTask = waitingPromises_1.pop();
            if (nextTask !== undefined) {
                nextTask();
            }
            else {
                working_1 = false;
            }
        };
        var Work_1 = function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var functionPath, fn, i, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!working_1) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) { return waitingPromises_1.push(resolve); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        working_1 = true;
                        _a.label = 3;
                    case 3:
                        functionPath = data.functionName.split(".");
                        fn = self[functionPath[0]];
                        for (i = 1; i < functionPath.length; ++i) {
                            fn = fn[functionPath[i]];
                        }
                        return [4 /*yield*/, new Promise(window.requestAnimationFrame)];
                    case 4:
                        _a.sent();
                        result = fn.apply(void 0, data.functionParams);
                        NotifyWorkFinished_1();
                        return [2 /*return*/, result];
                }
            });
        }); };
        ForEveryWorkerWrapper = DoWorkerJobWrapper = function (data) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Work_1(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    }
    else {
        var CreateSources = function () {
            return sources.map(function (source) { return "var " + source.functionName + " = " + source.fn.toString() + ";"; }).join("\n\n") + "\n";
        };
        var InitializeSources = function () {
            return sources.map(function (source) { return "" + ("" + ((source.variableName !== undefined) ? "var " + source.variableName + " = " : "")) + source.functionName + "();"; }).join("\n");
        };
        var WorkerCreatorFunction = function () {
            addEventListener("message", function (message) {
                var functionPath = message.data.functionName.split(".");
                var fn = self[functionPath[0]];
                for (var i = 1; i < functionPath.length; ++i) {
                    fn = fn[functionPath[i]];
                }
                var result = fn.apply(void 0, message.data.functionParams);
                postMessage(result, undefined);
            });
        };
        var blobContents = ["\n\n// typescript array spread transformation\nvar __spreadArray = (this && this.__spreadArray) || function (to, from) {\n    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)\n        to[j] = from[i];\n    return to;\n};\n\n" + CreateSources() + "\n\n" + InitializeSources() + "\n\n(\n" + WorkerCreatorFunction.toString() + "\n)();"
        ];
        var blob = new Blob(blobContents, { type: "application/javascript" });
        var blobUrl = URL.createObjectURL(blob);
        var availableWorkers_1 = [];
        var allWorkers_1 = [];
        var maxWorkerCount = (_a = navigator.hardwareConcurrency) !== null && _a !== void 0 ? _a : 1;
        for (var i = 0; i < maxWorkerCount; ++i) {
            var worker = new Worker(blobUrl);
            availableWorkers_1.push(worker);
            allWorkers_1.push(worker);
        }
        URL.revokeObjectURL(blobUrl);
        var waitingPromises_2 = [];
        var WaitForAvailableWorker_1 = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return waitingPromises_2.push(resolve); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); };
        var NotifyWorkerBecameAvailable_1 = function (worker) {
            if (waitingPromises_2.length !== 0) {
                // there is more stuff to do
                waitingPromises_2.pop()(worker);
            }
            else {
                // nothing to do for now
                availableWorkers_1.push(worker);
            }
        };
        DoWorkerJobWrapper = function (data) { return __awaiter(void 0, void 0, void 0, function () {
            function GetAvailableWorker() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(availableWorkers_1.length !== 0)) return [3 /*break*/, 1];
                                return [2 /*return*/, availableWorkers_1.pop()];
                            case 1: return [4 /*yield*/, WaitForAvailableWorker_1()];
                            case 2: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            var worker, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GetAvailableWorker()];
                    case 1:
                        worker = _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                worker.onmessage = function (message) {
                                    worker.onmessage = null;
                                    resolve(message.data);
                                };
                                worker.postMessage(data);
                            })];
                    case 2:
                        result = _a.sent();
                        NotifyWorkerBecameAvailable_1(worker);
                        return [2 /*return*/, result];
                }
            });
        }); };
        ForEveryWorkerWrapper = function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var allPromises, _loop_1, _i, allWorkers_2, worker, _a, allWorkers_3, worker;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        allPromises = [];
                        availableWorkers_1.length = 0;
                        _loop_1 = function (worker) {
                            allPromises.push(new Promise(function (resolve) {
                                worker.onmessage = function () {
                                    worker.onmessage = null;
                                    resolve();
                                };
                                worker.postMessage(data);
                            }));
                        };
                        for (_i = 0, allWorkers_2 = allWorkers_1; _i < allWorkers_2.length; _i++) {
                            worker = allWorkers_2[_i];
                            _loop_1(worker);
                        }
                        return [4 /*yield*/, Promise.all(allPromises)];
                    case 1:
                        _b.sent();
                        for (_a = 0, allWorkers_3 = allWorkers_1; _a < allWorkers_3.length; _a++) {
                            worker = allWorkers_3[_a];
                            NotifyWorkerBecameAvailable_1(worker);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
    }
    WorkerInterface = {
        SetEntropy: function (entropy) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ForEveryWorkerWrapper({
                            functionName: "WorkerUtils.SetEntropy",
                            functionParams: [entropy]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        SetIsTestnet: function (isTestnet) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ForEveryWorkerWrapper({
                            functionName: "WorkerUtils.SetIsTestnet",
                            functionParams: [isTestnet]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        GenerateRandomAddress: function (addressType) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "AddressUtil.GenerateNewRandomAddress",
                            functionParams: [addressType]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        GetPrivateKeyDetails: function (privateKey) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "AddressUtil.GetPrivateKeyDetails",
                            functionParams: [privateKey]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        BIP38DecryptPrivateKey: function (privateKey, password) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "BIP38Util.DecryptPrivateKey",
                            functionParams: [privateKey, password]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        GenerateRandomBIP38EncryptionData: function (password, addressType) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "BIP38Util.GenerateRandomBIP38EncryptionData",
                            functionParams: [password, addressType]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        GenerateRandomBIP38EncryptedAddress: function (encryptionData) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "BIP38Util.GenerateRandomBIP38EncryptedAddress",
                            functionParams: [encryptionData]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        BIP38EncryptPrivateKey: function (privateKey, password) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "BIP38Util.EncryptPrivateKey",
                            functionParams: [privateKey, password]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        GenerateMnemonicSeed: function (wordCount) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "BIP39Util.GenerateSeedPhrase",
                            functionParams: [wordCount]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        GetBIP32RootKeyFromSeed: function (seed, password) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "BIP39Util.GetBIP32RootKeyFromSeed",
                            functionParams: [seed, password !== null && password !== void 0 ? password : ""]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        DeriveBIP32ExtendedKey: function (rootKey, path, derivedKeyPurpose, hardened, changeAddresses) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "BIP32Util.DeriveBIP32ExtendedKey",
                            functionParams: [rootKey, path, derivedKeyPurpose, hardened, changeAddresses]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        DeriveBIP32Address: function (path, publicKey, privateKey, index, purpose, hardened) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "BIP32Util.DeriveBIP32Address",
                            functionParams: [path, publicKey, privateKey, index, purpose, hardened]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        GenerateQRCode: function (data, errorCorrectionLevel, mode, cellSize, margin) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "WorkerUtils.GenerateQRCode",
                            functionParams: [data, errorCorrectionLevel, mode, cellSize, margin]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        Base58CheckDecode: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DoWorkerJobWrapper({
                            functionName: "WorkerUtils.Base58CheckDecode",
                            functionParams: [data]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }
    };
};
