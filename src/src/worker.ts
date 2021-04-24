
var WorkerInterface: {
    SetEntropy: (entropy: number[]) => Promise<void>;
    SetIsTestnet: (isTestnet: boolean) => Promise<void>;

    GenerateRandomAddress: (addressType: AddressType) => Promise<AddressWithPrivateKey>;
    GetPrivateKeyDetails: (privateKey: string) => Promise<GetPrivateKeyDetailsResult>;

    BIP38DecryptPrivateKey: (privateKey: string, password: string) => Promise<Result<string, string>>;
    GenerateRandomBIP38EncryptionData: (password: string, addressType: AddressType) => Promise<Result<BIP38EncryptionData, string>>;
    GenerateRandomBIP38EncryptedAddress: (encryptionData: BIP38EncryptionData) => Promise<AddressWithPrivateKey>;
    BIP38EncryptPrivateKey: (privateKey: string, password: string) => Promise<Result<string, string>>;

    GenerateMnemonicSeed: (wordCount: 12 | 15 | 18 | 21 | 24) => Promise<string>;
    GetBIP32RootKeyFromSeed: (seed: string, password?: string | undefined) => Promise<Result<string, string>>;
    DeriveBIP32ExtendedKey: (rootKey: string, path: string, derivedKeyPurpose: BIP32Purpose,
        hardened: boolean, changeAddresses: boolean)
        => Promise<Result<{ publicKey: string, privateKey: string | null, path: string, purpose: BIP32Purpose }, string>>;
    DeriveBIP32Address: (path: string, publicKey: string, privateKey: string | null, index: number, purpose: BIP32Purpose, hardened: boolean)
        => Promise<Result<{ address: string, privateKey: string | null, addressPath: string }, string>>;

    GenerateQRCode: (data: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel,
        mode?: "Byte" | "Numeric" | "Alphanumeric" | "Kanji", cellSize?: number, margin?: number) => Promise<string>;

    Base58CheckDecode: (data: string) => Promise<Result<number[], string>>;
};

var CreateWorkers = () =>
{
    interface WorkerInitializerData
    {
        fn: () => unknown;
        functionName: string;
        variableName?: string;
    }

    const sources: WorkerInitializerData[] = [
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
    const isInternetExplorer = (navigator.userAgent.indexOf("MSIE ") !== -1) || (navigator.userAgent.match(/Trident.*rv\:11\./) !== null);
    const workersAvailable = typeof Worker !== "undefined" && !isInternetExplorer;

    let DoWorkerJobWrapper: (data: any) => any;
    let ForEveryWorkerWrapper: (data: any) => any;

    if (!workersAvailable)
    {
        // no workers, setup single threaded
        sources.forEach(source =>
        {
            const result = source.fn();
            if (source.variableName !== undefined)
            {
                (<any>self)[source.variableName] = result;
            }
        });

        let working = false;
        const waitingPromises: (() => void)[] = [];

        const NotifyWorkFinished = () =>
        {
            const nextTask = waitingPromises.pop();
            if (nextTask !== undefined)
            {
                nextTask();
            }
            else
            {
                working = false;
            }
        };

        const Work = async (data: any) =>
        {
            if (working)
            {
                await new Promise<void>(resolve => waitingPromises.push(resolve));
            }
            else
            {
                working = true;
            }

            const functionPath = data.functionName.split(".");
            let fn = (<any>self)[functionPath[0]];
            for (let i = 1; i < functionPath.length; ++i)
            {
                fn = fn[functionPath[i]];
            }

            await new Promise(window.requestAnimationFrame);
            const result = fn(...data.functionParams);
            NotifyWorkFinished();
            return result;
        };

        ForEveryWorkerWrapper = DoWorkerJobWrapper = async (data: any) =>
        {
            return await Work(data);
        };
    }
    else
    {
        const CreateSources = () =>
        {
            return sources.map(source => `var ${source.functionName} = ${source.fn.toString()};`).join("\n\n") + "\n";
        };

        const InitializeSources = () =>
        {
            return sources.map(source => `${`${(source.variableName !== undefined) ? `var ${source.variableName} = ` : ""}`}${source.functionName}();`).join("\n");
        };

        const WorkerCreatorFunction = () =>
        {
            addEventListener("message", message =>
            {
                const functionPath = message.data.functionName.split(".");
                let fn = (<any>self)[functionPath[0]];
                for (let i = 1; i < functionPath.length; ++i)
                {
                    fn = fn[functionPath[i]];
                }

                const result = fn(...message.data.functionParams);
                postMessage(result, <any>undefined);
            });
        };

        const blobContents = [`

// typescript array spread transformation
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};

${CreateSources()}

${InitializeSources()}

(
${WorkerCreatorFunction.toString()}
)();`
        ];
        const blob = new Blob(blobContents, { type: "application/javascript"});
        const blobUrl = URL.createObjectURL(blob);


        const availableWorkers: Worker[] = [];
        const allWorkers: Worker[] = [];
        const maxWorkerCount = navigator.hardwareConcurrency ?? 1;

        for (let i = 0; i < maxWorkerCount; ++i)
        {
            const worker = new Worker(blobUrl);
            availableWorkers.push(worker);
            allWorkers.push(worker);
        }

        URL.revokeObjectURL(blobUrl);

        const waitingPromises: ((worker: Worker) => void)[] = [];
        const WaitForAvailableWorker = async () => await new Promise<Worker>(resolve => waitingPromises.push(resolve));

        const NotifyWorkerBecameAvailable = (worker: Worker) =>
        {
            if (waitingPromises.length !== 0)
            {
                // there is more stuff to do
                waitingPromises.pop()!(worker);
            }
            else
            {
                // nothing to do for now
                availableWorkers.push(worker);
            }
        }

        DoWorkerJobWrapper = async (data: any) =>
        {
            async function GetAvailableWorker()
            {
                if (availableWorkers.length !== 0)
                {
                    return availableWorkers.pop()!
                }
                else
                {
                    return await WaitForAvailableWorker();
                }
            }

            const worker = await GetAvailableWorker();
            const result = await new Promise<any>(resolve =>
            {
                worker.onmessage = message =>
                {
                    worker.onmessage = null;
                    resolve(message.data);
                };
                worker.postMessage(data);
            });

            NotifyWorkerBecameAvailable(worker);

            return result;
        };

        ForEveryWorkerWrapper = async (data: any) =>
        {
            const allPromises: Promise<void>[] = [];
            availableWorkers.length = 0;
            for (let worker of allWorkers)
            {
                allPromises.push(new Promise<void>(resolve =>
                {
                    worker.onmessage = () =>
                    {
                        worker.onmessage = null;
                        resolve();
                    };

                    worker.postMessage(data);
                }));
            }

            await Promise.all(allPromises);

            for (let worker of allWorkers)
            {
                NotifyWorkerBecameAvailable(worker);
            }
        };
    }

    WorkerInterface = {
        SetEntropy: async (entropy: number[]) =>
        {
            await ForEveryWorkerWrapper({
                functionName: "WorkerUtils.SetEntropy",
                functionParams: [entropy]
            });
        },
        SetIsTestnet: async (isTestnet: boolean) =>
        {
            await ForEveryWorkerWrapper({
                functionName: "WorkerUtils.SetIsTestnet",
                functionParams: [isTestnet]
            });
        },

        GenerateRandomAddress: async (addressType: AddressType) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "AddressUtil.GenerateNewRandomAddress",
                functionParams: [addressType]
            });
        },
        GetPrivateKeyDetails: async (privateKey: string) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "AddressUtil.GetPrivateKeyDetails",
                functionParams: [privateKey]
            });
        },

        BIP38DecryptPrivateKey: async (privateKey: string, password: string) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "BIP38Util.DecryptPrivateKey",
                functionParams: [privateKey, password]
            });
        },
        GenerateRandomBIP38EncryptionData: async (password: string, addressType: AddressType) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "BIP38Util.GenerateRandomBIP38EncryptionData",
                functionParams: [password, addressType]
            });
        },
        GenerateRandomBIP38EncryptedAddress: async (encryptionData: BIP38EncryptionData) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "BIP38Util.GenerateRandomBIP38EncryptedAddress",
                functionParams: [encryptionData]
            });
        },
        BIP38EncryptPrivateKey: async (privateKey: string, password: string) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "BIP38Util.EncryptPrivateKey",
                functionParams: [privateKey, password]
            });
        },

        GenerateMnemonicSeed: async (wordCount: 12 | 15 | 18 | 21 | 24) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "BIP39Util.GenerateSeedPhrase",
                functionParams: [wordCount]
            });
        },
        GetBIP32RootKeyFromSeed: async (seed: string, password?: string) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "BIP39Util.GetBIP32RootKeyFromSeed",
                functionParams: [seed, password ?? ""]
            });
        },
        DeriveBIP32ExtendedKey: async (rootKey: string, path: string, derivedKeyPurpose: BIP32Purpose, hardened: boolean, changeAddresses: boolean) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "BIP32Util.DeriveBIP32ExtendedKey",
                functionParams: [rootKey, path, derivedKeyPurpose, hardened, changeAddresses]
            });
        },
        DeriveBIP32Address: async (path: string, publicKey: string, privateKey: string | null, index: number, purpose: BIP32Purpose, hardened: boolean) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "BIP32Util.DeriveBIP32Address",
                functionParams: [path, publicKey, privateKey, index, purpose, hardened]
            });
        },

        GenerateQRCode: async (data: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel,
            mode?: "Byte" | "Numeric" | "Alphanumeric" | "Kanji", cellSize?: number, margin?: number) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "WorkerUtils.GenerateQRCode",
                functionParams: [data, errorCorrectionLevel, mode, cellSize, margin]
            });
        },

        Base58CheckDecode: async (data: string) =>
        {
            return await DoWorkerJobWrapper({
                functionName: "WorkerUtils.Base58CheckDecode",
                functionParams: [data]
            });
        }
    };
};
