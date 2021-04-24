
function InitTests()
{
    const { IsTestnet } = Util();

    interface Addresses
    {
        segwitAddress: string;
        bech32Address: string;
        legacyAddress: string;
    }

    interface TestAddressAndPrivateKey
    {
        privateKey: string;
        addresses: Addresses;
    }

    interface Bip38Test
    {
        encryptedPrivateKey: string;
        encryptedPrivateKeyFromPrivateKey: string;
        decryptedPrivateKey: string;
        password: string;
        addresses: Addresses;
    }

    interface Bip39Test
    {
        seed: string;
        password: string;
        rootKey: string;
    }

    interface Bip32Test
    {
        rootKey: string;
        path: string;
        extendedPubkey: string;
        extendedPrivateKey: string;
    }

    async function RunAllTests(onProgress: (current: number, total: number) => void): Promise<string[]>
    {
        if (IsTestnet())
        {
            alert("No tests are implemented for testnet!");
            return [];
        }

        const totalNumTests = 42;
        let numCompletedTests = 0;

        function UpdateProgress()
        {
            onProgress(numCompletedTests++, totalNumTests);
        }

        const failedTestMessages: string[] = [];

        function AssertEqual(actual: any, expected: any, errorMessage: string)
        {
            if (actual !== expected)
            {
                failedTestMessages.push(`Assertion failed: ${errorMessage}\nExpected: ${expected}\nActual: ${actual}`);
            }
        }

        function Assert(actual: boolean, errorMessage: string)
        {
            AssertEqual(actual, true, errorMessage);
        }

        async function TestAddressesAndPrivateKeys()
        {
            const testAddresses: TestAddressAndPrivateKey[] = [];

            testAddresses.push({
                privateKey: "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn",
                addresses: {
                    segwitAddress: "3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN",
                    bech32Address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
                    legacyAddress: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"
                }
            });
            testAddresses.push({
                privateKey: "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU74NMTptX4",
                addresses: {
                    segwitAddress: "3FWHHE3RVgyv5vYmMrcoRdA25uugWvQbso",
                    bech32Address: "bc1qq6hag67dl53wl99vzg42z8eyzfz2xlkvxechjp",
                    legacyAddress: "1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP"
                }
            });
            testAddresses.push({
                privateKey: "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFVataoFKobq",
                addresses: {
                    segwitAddress: "353cGFY5KZqdJzT2nGd8UQEbqWNZi1W5f5",
                    bech32Address: "bc1qyjjuy86mks2v8a3fm6zcqxcw3jut5630gfwqza",
                    legacyAddress: "14LmtzeME8JH1g4iY8EdPa1LJXDMRp6jQw"
                }
            });
            testAddresses.push({
                privateKey: "L5oLkpV3aqBjhki6LmvChTCV6odsp4SXM6FfU2Gppt5kFLaHLuZ9",
                addresses: {
                    segwitAddress: "38Kw57SDszoUEikRwJNBpypPSdpbAhToeD",
                    bech32Address: "bc1q4h0ycu78h88wzldxc7e79vhw5xsde0n8jk4wl5",
                    legacyAddress: "1GrLCmVQXoyJXaPJQdqssNqwxvha1eUo2E"
                }
            });
            testAddresses.push({
                privateKey: "KwHsVCDX7GDN2x5tMdCE4d4L6i1VQVpRSMQTUtxbF9seAHXQ2JFp",
                addresses: {
                    segwitAddress: "38sCjQfEzBJcddzytxzLHmZXwbP1Ex66TS",
                    bech32Address: "bc1qqyhqsgv38809lpslgsnwhayjreqfnzpwx6tudn",
                    legacyAddress: "17EpY1ruRApr75McHJvNuhCwz5ejYxWrn"
                }
            });
            testAddresses.push({
                privateKey: "L5T7dMSZUN8PYKvS6XHnQ13ZVk89NqAoz4JS64crWGRNZsbCa84M",
                addresses: {
                    segwitAddress: "39TDgxXFcrt9X8Bg3aqL1bNVUZeM28fWj3",
                    bech32Address: "bc1q8feskrfllvh86yzcz4t7az2nk7zxkypqqzdkd6",
                    legacyAddress: "16L41U1ziesozpWkdzxxC4mdi6WTmyBtLn"
                }
            });
            testAddresses.push({
                privateKey: "L3J8PFqgpi2J3YBLvJTfV49JB7qgoa5o6RcxR29S7RGJHiNfq25N",
                addresses: {
                    segwitAddress: "3LmWEpDsTzAKeyTBzbLV9X2hZxCNu5c4Ee",
                    bech32Address: "bc1q288xdhjzxf9kxrwt5v2wf09mka473pmndajcpv",
                    legacyAddress: "18TYzb9ZS5ygYgPpkYkkiKgUGhKXmu3JL4"
                }
            });
            testAddresses.push({
                privateKey: "L15ycE1apf8bfbSDejRGjTHseLTsPz42DvNSmwLWzQWUEj2kmZ4v",
                addresses: {
                    segwitAddress: "3GW7MbQhRvVD4p3eCmZ1ERFNnaKfB6UEyr",
                    bech32Address: "bc1q89rje8nfzl82s06ahc7mpa298uqhee5j0q2jw9",
                    legacyAddress: "16DrnDEJDF4BYfH5JKnVjLdkV9htUa4e8D"
                }
            });
            testAddresses.push({
                privateKey: "KxwkgKZFewyhfeF5rng34CdF5txPhNiHzeTZ1PZPR6VWWW89ZLRB",
                addresses: {
                    segwitAddress: "34QojgxrZpmzECK3zhvtStKgn8YcJm8kTG",
                    bech32Address: "bc1q7dlxstp28p6fhz3qxa6l663hdzkczvdruhvlj6",
                    legacyAddress: "1PCUdXGU9KEbD8HHFPqcYVmnDeo97365d5"
                }
            });
            testAddresses.push({
                privateKey: "L3prx7sM6pSdRwZqZFh72jg51i7iMFkSgHDJ4Nq46q7MokbEG4so",
                addresses: {
                    segwitAddress: "35BLqQBNMdf7VhfsNjPj4yku2vcUBquBpy",
                    bech32Address: "bc1qjevfy9qw9s8uq6mlva62kq0tusu7wquld8djt0",
                    legacyAddress: "1EhxTmbzuuYsroxfMKCiMsVMn64YrgxotN"
                }
            });
            testAddresses.push({
                privateKey: "L13UtmXsEcixzLvc92EAvrLntqaUwBkp9HhEuSmvaFC8F5Pj3y5v",
                addresses: {
                    segwitAddress: "3AXWsE37BrQLvpM8iZD6roV7sHDAXiYE6Q",
                    bech32Address: "bc1qz3rr53mekdpcapdwrugs0q82f5uult8ps532c8",
                    legacyAddress: "12rCeLh3oGj4WFVFDjZ8FotawSnQKv2GXy"
                }
            });
            testAddresses.push({
                privateKey: "Kz1tTAmpTTipzTfFd1C34LztLuewicPRnB4M6Dmo9Fabw7UbVbH1",
                addresses: {
                    segwitAddress: "36YNDqVJnBTXjTtDvxFKQmu6H82TgfMBHh",
                    bech32Address: "bc1q492c95pvek8s6f9cex6y2wcsdh4psd3yrcu0w4",
                    legacyAddress: "1GSMdpy5pwThM1eVbeqmdSJ3jC7nUaB995"
                }
            });
            testAddresses.push({
                privateKey: "L4xVng3JmnEZVP9osSc25SCgd7zSpAzHswNDrVQ2AG1Su4B6XGmH",
                addresses: {
                    segwitAddress: "3CJaCvJee7B2C1fSnTUUgQZf8zKU7tridN",
                    bech32Address: "bc1qcmp56dz268sgs5g7xnymnsymmwea3tw5z22nha",
                    legacyAddress: "1K7xkmts75mEz3dXEe6uDV8WFEP7QNYoJg"
                }
            });
            testAddresses.push({
                privateKey: "L2dx2MkKdgKHRZNuP9M8FZvx4CovCGiGSt4GJfVBLeYcqwPQ3D3N",
                addresses: {
                    segwitAddress: "36XnTodxfdsTm8U23pSVzxizfMJQaCqLsH",
                    bech32Address: "bc1qpauj6up0cz6fjfhequ43jvaywc55nkjr9z2j6p",
                    legacyAddress: "12QpJSN1eCCpAB8McXZfvEXcQi93iWds5x"
                }
            });

            await Promise.all(testAddresses.map(testCase => (async () =>
            {
                try
                {
                    const privateKeyResult = await WorkerInterface.GetPrivateKeyDetails(testCase.privateKey);
                    if (privateKeyResult.type !== "ok")
                    {
                        Assert(false, `Address generation error for private key: ${testCase.privateKey}`);
                        return;
                    }

                    const { segwitAddress, bech32Address, legacyAddress } = privateKeyResult;

                    AssertEqual(segwitAddress, testCase.addresses.segwitAddress, "Segwit address does not match");
                    AssertEqual(bech32Address, testCase.addresses.bech32Address, "Bech32 address does not match");
                    AssertEqual(legacyAddress, testCase.addresses.legacyAddress, "Legacy address does not match");
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        async function TestBip38()
        {
            const testCases: Bip38Test[] = [];

            testCases.push({
                password: "a",
                encryptedPrivateKey: "6PnW1PdhwyuwyGRVHPBNhZTRy8MdCcUGU5vpKQZbZU8JL7ri2GQW19acDj",
                encryptedPrivateKeyFromPrivateKey: "6PYTvmU4NwNMgdT4ibYvRkAnZe3tWAMUXhvR9AxDziriJ6fWusqRo1BfaN",
                decryptedPrivateKey: "KyaXDTGN2znu9iHX8hKcnLit5vYsc4HdvJSdMHBcYiKnVKQdAcrW",
                addresses: {
                    segwitAddress: "3EzuqmCFnWopyDSM14MvEDmHKrwvYzLyde",
                    bech32Address: "bc1qa06qmevctj2vhe07ydmwvqg9gd4cgtrngysm4k",
                    legacyAddress: "1NWcAGcKsjp2wMJZkJYgR9H4N4rBSn38ph"
                }
            });
            testCases.push({
                password: "a",
                encryptedPrivateKey: "6PnNubLWkatUwokXjjH4vSdacztW1bvNL5oFqrypnULWnm6ssDs5sCbaJK",
                encryptedPrivateKeyFromPrivateKey: "6PYLpyAsCpquTahxC96c5BJtW7ZQjMLJCyd2Fw4BpQutjArJTzkrXB7Piv",
                decryptedPrivateKey: "L4batR1BPtG4BwRcATq6F3iRV3tJLLD3jk7xK5dJKHsSbURC3AQv",
                addresses: {
                    segwitAddress: "3JQGpJJiBzrTWHTAjokpfFcB81yr4U8D3o",
                    bech32Address: "bc1qs6ud3py63fp2yk8vxdfp9cg753n2pj4z7z9lj5",
                    legacyAddress: "1DHLz1rgVmo3EQYCCtLq4MSzyEE6TWhs2R"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivateKey: "6PnXbmzLH2x8dwPvpECwngEkf4fLboB9xbWPWP5NBK4QE5odnV6nVUv8Ar",
                encryptedPrivateKeyFromPrivateKey: "6PYVX9pgijT18gua44qWPypmzsoHCe8pPXCNQZpghSGg7oS6PUPMQ7G1uJ",
                decryptedPrivateKey: "Kxbkxhq1qCdCScvCyYKgvNo5HjJL3dbp7cipLngWVaLYKYJ4ghyt",
                addresses: {
                    segwitAddress: "31sBmB1Ad69388VvDQELZF1ACYaGoBhTeT",
                    bech32Address: "bc1qw58y7scvgt6yqpjxmevxujlj6fyapwn558jqgs",
                    legacyAddress: "1BfwChEq6GTn7g8zZmHTYoM75sFtPXvrRd"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivateKey: "6PnYqiahSyjzFCu3eECKSQrqVozpXWj7g3WarnMp1oNYX18m9bP7jyncS5",
                encryptedPrivateKeyFromPrivateKey: "6PYWm6R3tdgAaJKna9veriFkCcMeoLLWVTnpcznxot1Xqwi4TtWHhnXXxk",
                decryptedPrivateKey: "KwkLbkYUZwxYHe5nozJz6gxmrGhrDrgiZHc87omKZcVyZYw8fgBf",
                addresses: {
                    segwitAddress: "3GLHhj6aNqqnui8Y72KbcmUxt7xL7ZbBhx",
                    bech32Address: "bc1q2he8uu69fd977gchrq0gkfm5q23rk0y3dexp5m",
                    legacyAddress: "18qSw5fLA7i3J2Zgmz3jMiL5nmM872c9L8"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivateKey: "6PnV6kdAWBYp53troJeaesPN7xrsFn7uyTSEXxkGi25CqG7sHCTHxBkX5s",
                encryptedPrivateKeyFromPrivateKey: "6PYT28TWz92xdoTBoFeo7jF4xyi69wENqHmSgjJyAxxC3gMHathn17MLfh",
                decryptedPrivateKey: "L2QgX6EkcTh9x8uH3hKbSo1sms7aGoqaQnDmF79KgTsvTWQ7Pcoa",
                addresses: {
                    segwitAddress: "3NUyzUng1iQogrHKZ8zQoQ3dGu9CqjmeqC",
                    bech32Address: "bc1qhntqxpnkvp6u68v47qclryazqy65gutkm5ecz4",
                    legacyAddress: "1JDUQsDoRn675ZQpWP6yE3bC93ifv55Lwc"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivateKey: "6PnVA1kcZktzR4VW76HKU62f4D6dfTpghKSnszrRPXn5ggnumnK3nBdwsm",
                encryptedPrivateKeyFromPrivateKey: "6PYT5Pay1zNPJKLheQTknQAdTX7PZC4aaUGwm85D3m4GXVLyoL6asAaymA",
                decryptedPrivateKey: "L4h2QmyA1UQHjmkG2j4tF67u8JsQquQrC2EX9mkSRNUVCBFqWy21",
                addresses: {
                    segwitAddress: "3BQmwBdHWY7S9yLGESZSq65RxAQVxG24Ws",
                    bech32Address: "bc1qq3awtma7xqsamuwralanr7rfvxxuh2hf36zkfj",
                    legacyAddress: "1QgvtEAhUvuRRKeF52ZMfwpC1LcAjkWYe"
                }
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                async function TestDecrypt(privateKey: string, password: string)
                {
                    try
                    {
                        const decrypted = await WorkerInterface.BIP38DecryptPrivateKey(privateKey, password);
                        if (decrypted.type === "err")
                        {
                            Assert(false, `Bip38 decrypt error for private key "${privateKey}" with password "${password}"`);
                        }
                        else
                        {
                            const decryptedPrivateKey = decrypted.result;
                            AssertEqual(decryptedPrivateKey, testCase.decryptedPrivateKey, "Decrypted private keys do not match");

                            const addressResult = await WorkerInterface.GetPrivateKeyDetails(decryptedPrivateKey);
                            if (addressResult.type !== "ok")
                            {
                                Assert(false, `Cannot get addresses from private key: ${decryptedPrivateKey}`);
                            }
                            else
                            {
                                AssertEqual(addressResult.segwitAddress, testCase.addresses.segwitAddress, "Decrypted segwit address does not match");
                                AssertEqual(addressResult.bech32Address, testCase.addresses.bech32Address, "Decrypted bech32 address does not match");
                                AssertEqual(addressResult.legacyAddress, testCase.addresses.legacyAddress, "Decrypted legacy address does not match");
                            }
                        }
                    }
                    catch (e)
                    {
                        Assert(false, "Unexpected error: " + e.message);
                    }
                }

                await TestDecrypt(testCase.encryptedPrivateKey, testCase.password);
                await TestDecrypt(testCase.encryptedPrivateKeyFromPrivateKey, testCase.password);

                async function TestEncrypt(privateKey: string, password: string)
                {
                    try
                    {
                        const encrypted = await WorkerInterface.BIP38EncryptPrivateKey(privateKey, password);
                        if (encrypted.type === "err")
                        {
                            Assert(false, `Cannot encrypt private key: ${privateKey} (using password: "${password}")`)
                        }
                        else
                        {
                            AssertEqual(encrypted.result, testCase.encryptedPrivateKeyFromPrivateKey, "Encrypted private key does not match");
                        }
                    }
                    catch (e)
                    {
                        Assert(false, "Unexpected error: " + e.message);
                    }
                }

                await TestEncrypt(testCase.decryptedPrivateKey, testCase.password);

                UpdateProgress();
            })()));
        }

        async function TestBip39()
        {
            const testCases: Bip39Test[] = [];
            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "",
                rootKey: "xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "a",
                rootKey: "xprv9s21ZrQH143K2TDcPeVnyE7Txn71rTGhYsXrdQBVMqYjubbSV4pCGMQXzim3ayzK46pURGRCG5r6KbkDN9NLQUTCDwZk9WU3tkSRZj6k6Gm"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "Test Password 1234",
                rootKey: "xprv9s21ZrQH143K2Y2XSuzBQaznCBg9AaRH2S25oKUAjmQEsEccMs8Ze85oGXge9xadr9vJv3r8CCtjgTGWFSjm6cHHAfGYJriZt43JgKVxDe1"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "😂👌🔥💯💯💯🅱",
                rootKey: "xprv9s21ZrQH143K3GPCDEC6aPqoyLsG2u3k1Lm98EuPJX6F92WXrU4BPKdjkabyje5myuDWhyzUxa8ibSzUSJAb3ULLYLLdwMrxLH48dQunkpr"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "",
                rootKey: "xprv9s21ZrQH143K3vkVeVcLG5PeVoexN6hpu9r4mS2j3uVeZo7vBrRNGHENDZXwYBgbQ5eMvHCX9YRL8V7aykC7a4UNkvJCuBacLRHwsdMGhNF"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "a",
                rootKey: "xprv9s21ZrQH143K3Fh1GnR64eBTs2WRhNz7Fc7NSXheWAnurFqLLjNRD7FNJXbdWm7Ky3B3hS3Lob6vSJd1PY6eZ7XUmTR6PCfCGzyt4Z4FRaM"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "Test Password 1234",
                rootKey: "xprv9s21ZrQH143K2MRhDJs9Qk6iSxHhezBbDGE1GFQqWy5zyw9P32GbXeM387p61HcQKdN93eL2W5Z3vF9ty9Gmr3ZtedcFLsDMZ3fkMcKBK2s"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "😂👌🔥💯💯💯🅱",
                rootKey: "xprv9s21ZrQH143K26EJnA1yj46hTFK85x2X2JeghGeichfdSdLAoQfgA5fQHvSo556Qjme7mXN3AbvDPhioe9C5GhmFAzQWdaSvnvkyuHy5mQa"
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                try
                {
                    if (!(<any>String.prototype).normalize)
                    {
                        // string normalize not available, skip this test
                        return;
                    }

                    const seedResult = await WorkerInterface.GetBIP32RootKeyFromSeed(testCase.seed, testCase.password);
                    if (seedResult.type === "err")
                    {
                        Assert(false, `Cannot get root key from seed: "${testCase.seed}" (using password: "${testCase.password}")`);
                    }
                    else
                    {
                        AssertEqual(seedResult.result, testCase.rootKey, "Root key derived from mnemonic seed does not match");
                    }
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        async function TestBip32()
        {
            const testCases: Bip32Test[] = [];
            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8",
                extendedPrivateKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'",
                extendedPubkey: "xpub68Gmy5EdvgibQVfPdqkBBCHxA5htiqg55crXYuXoQRKfDBFA1WEjWgP6LHhwBZeNK1VTsfTFUHCdrfp1bgwQ9xv5ski8PX9rL2dZXvgGDnw",
                extendedPrivateKey: "xprv9uHRZZhk6KAJC1avXpDAp4MDc3sQKNxDiPvvkX8Br5ngLNv1TxvUxt4cV1rGL5hj6KCesnDYUhd7oWgT11eZG7XnxHrnYeSvkzY7d2bhkJ7"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1",
                extendedPubkey: "xpub6ASuArnXKPbfEwhqN6e3mwBcDTgzisQN1wXN9BJcM47sSikHjJf3UFHKkNAWbWMiGj7Wf5uMash7SyYq527Hqck2AxYysAA7xmALppuCkwQ",
                extendedPrivateKey: "xprv9wTYmMFdV23N2TdNG573QoEsfRrWKQgWeibmLntzniatZvR9BmLnvSxqu53Kw1UmYPxLgboyZQaXwTCg8MSY3H2EU4pWcQDnRnrVA1xe8fs"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'",
                extendedPubkey: "xpub6D4BDPcP2GT577Vvch3R8wDkScZWzQzMMUm3PWbmWvVJrZwQY4VUNgqFJPMM3No2dFDFGTsxxpG5uJh7n7epu4trkrX7x7DogT5Uv6fcLW5",
                extendedPrivateKey: "xprv9z4pot5VBttmtdRTWfWQmoH1taj2axGVzFqSb8C9xaxKymcFzXBDptWmT7FwuEzG3ryjH4ktypQSAewRiNMjANTtpgP4mLTj34bhnZX7UiM"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'/2",
                extendedPubkey: "xpub6FHa3pjLCk84BayeJxFW2SP4XRrFd1JYnxeLeU8EqN3vDfZmbqBqaGJAyiLjTAwm6ZLRQUMv1ZACTj37sR62cfN7fe5JnJ7dh8zL4fiyLHV",
                extendedPrivateKey: "xprvA2JDeKCSNNZky6uBCviVfJSKyQ1mDYahRjijr5idH2WwLsEd4Hsb2Tyh8RfQMuPh7f7RtyzTtdrbdqqsunu5Mm3wDvUAKRHSC34sJ7in334"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'/2/1000000000",
                extendedPubkey: "xpub6H1LXWLaKsWFhvm6RVpEL9P4KfRZSW7abD2ttkWP3SSQvnyA8FSVqNTEcYFgJS2UaFcxupHiYkro49S8yGasTvXEYBVPamhGW6cFJodrTHy",
                extendedPrivateKey: "xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcEZVB4dScxMAdx6d4nFc9nvyvH3v4gJL378CSRZiYmhRoP7mBy6gSPSCYk6SzXPTf3ND1cZAceL7SfJ1Z3GC8vBgp2epUt13",
                extendedPrivateKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6",
                path: "m/0'",
                extendedPubkey: "xpub68NZiKmJWnxxS6aaHmn81bvJeTESw724CRDs6HbuccFQN9Ku14VQrADWgqbhhTHBaohPX4CjNLf9fq9MYo6oDaPPLPxSb7gwQN3ih19Zm4Y",
                extendedPrivateKey: "xprv9uPDJpEQgRQfDcW7BkF7eTya6RPxXeJCqCJGHuCJ4GiRVLzkTXBAJMu2qaMWPrS7AANYqdq6vcBcBUdJCVVFceUvJFjaPdGZ2y9WACViL4L"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB",
                extendedPrivateKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0",
                extendedPubkey: "xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH",
                extendedPrivateKey: "xprv9vHkqa6EV4sPZHYqZznhT2NPtPCjKuDKGY38FBWLvgaDx45zo9WQRUT3dKYnjwih2yJD9mkrocEZXo1ex8G81dwSM1fwqWpWkeS3v86pgKt"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'",
                extendedPubkey: "xpub6ASAVgeehLbnwdqV6UKMHVzgqAG8Gr6riv3Fxxpj8ksbH9ebxaEyBLZ85ySDhKiLDBrQSARLq1uNRts8RuJiHjaDMBU4Zn9h8LZNnBC5y4a",
                extendedPrivateKey: "xprv9wSp6B7kry3Vj9m1zSnLvN3xH8RdsPP1Mh7fAaR7aRLcQMKTR2vidYEeEg2mUCTAwCd6vnxVrcjfy2kRgVsFawNzmjuHc2YmYRmagcEPdU9"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1",
                extendedPubkey: "xpub6DF8uhdarytz3FWdA8TvFSvvAh8dP3283MY7p2V4SeE2wyWmG5mg5EwVvmdMVCQcoNJxGoWaU9DCWh89LojfZ537wTfunKau47EL2dhHKon",
                extendedPrivateKey: "xprv9zFnWC6h2cLgpmSA46vutJzBcfJ8yaJGg8cX1e5StJh45BBciYTRXSd25UEPVuesF9yog62tGAQtHjXajPPdbRCHuWS6T8XA2ECKADdw4Ef"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1/2147483646'",
                extendedPubkey: "xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL",
                extendedPrivateKey: "xprvA1RpRA33e1JQ7ifknakTFpgNXPmW2YvmhqLQYMmrj4xJXXWYpDPS3xz7iAxn8L39njGVyuoseXzU6rcxFLJ8HFsTjSyQbLYnMpCqE2VbFWc"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1/2147483646'/2",
                extendedPubkey: "xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt",
                extendedPrivateKey: "xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j"
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                try
                {
                    const deriveResult = await WorkerInterface.DeriveBIP32ExtendedKey(testCase.rootKey, testCase.path, "32", false, false);
                    if (deriveResult.type === "err")
                    {
                        Assert(false, `Cannot derive extended key from root key: "${testCase.rootKey}", path: ${testCase.path}`);
                    }
                    else
                    {
                        Assert(deriveResult.result.privateKey !== null, "Could not derive private key");
                        AssertEqual(deriveResult.result.privateKey, testCase.extendedPrivateKey, "Extended private keys don't match");
                        AssertEqual(deriveResult.result.publicKey, testCase.extendedPubkey, "Extended public keys don't match");
                    }
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        UpdateProgress();

        await Promise.all([
            TestAddressesAndPrivateKeys(),
            TestBip38(),
            TestBip39(),
            TestBip32()
        ]);

        return failedTestMessages;
    }

    return RunAllTests;
}
