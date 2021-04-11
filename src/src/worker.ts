
var WorkerInterface: {
    SetEntropy: (entropy: number[]) => Promise<void>;
    SetIsTestnet: (isTestnet: boolean) => Promise<void>;

    GenerateRandomAddress: (addressType: AddressType) => Promise<{ address: string, privateKey: string }>;
    GetPrivateKeyDetails: (privateKey: string) => Promise<GetPrivateKeyDetailsResult>;

    GetBIP38EncryptedPrivateKeyDetails: (privateKey: string, password: string) => Promise<unknown>;
    GenerateRandomBIP38EncryptionData: (password: string, addressType: AddressType) => Promise<Result<BIP38EncryptionData, string>>;
    GenerateRandomBIP38EncryptedAddress: (encryptionData: BIP38EncryptionData) => Promise<AddressWithPrivateKey>;
    BIP38EncryptPrivateKey: (privateKey: string, password: string) => Promise<unknown>;

    GenerateMnemonicSeed: (wordCount: 12 | 15 | 18 | 21 | 24) => Promise<unknown>;
    GetBIP32RootKeyFromSeed: (seed: string, password?: string | undefined) => Promise<unknown>;
    DeriveBIP32: (extendedKey: string, derivationPath: string, offset: number, count: number, hardenedAddresses: boolean, changeAddresses: boolean) => Promise<unknown>;
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
    ];

    const workersAvailable = typeof Worker !== "undefined";

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

        ForEveryWorkerWrapper = DoWorkerJobWrapper = async (data: any) =>
        {
            const functionPath = data.functionName.split(".");
            let fn = (<any>self)[functionPath[0]];
            for (let i = 1; i < functionPath.length; ++i)
            {
                fn = fn[functionPath[i]];
            }

            return await new Promise(resolve => window.setTimeout(() => resolve(fn(...data.functionParams)), 0));
        };
    }
    else
    {
        const CreateSources = () =>
        {
            return sources.map(source => "var " + source.functionName + " = " + source.fn.toString() + ";").join("\n\n") + "\n";
        };

        const InitializeSources = () =>
        {
            return sources.map(source => ((source.variableName !== undefined) ? "var " + source.variableName + " = " : "") + source.functionName + "();").join("\n");
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

        const blobContents = [CreateSources() + "\n\n\n" + InitializeSources() + "\n\n\n(", WorkerCreatorFunction.toString(), ")();\n" ];
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
            for (let worker of allWorkers)
            {
                worker.postMessage(data);
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

        GetBIP38EncryptedPrivateKeyDetails: async (privateKey: string, password: string) =>
        {

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

        },

        GenerateMnemonicSeed: async (wordCount: 12 | 15 | 18 | 21 | 24) =>
        {

        },
        GetBIP32RootKeyFromSeed: async (seed: string, password?: string) =>
        {

        },
        DeriveBIP32: async (extendedKey: string, derivationPath: string, offset: number, count: number, hardenedAddresses: boolean, changeAddresses: boolean) =>
        {
            // return {
            //     extendedPublicKey,
            //     extendedPrivateKey,
            //     addressData: { path, address, private key }[]
            // }
        },
    };
};
