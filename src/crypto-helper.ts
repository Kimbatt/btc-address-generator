
interface WordArray
{
    words: number[];
    sigBytes: number;
}

function BytesToWordArray(bytes: number[] | Uint8Array)
{
    return <WordArray>(new (<any>window).CryptoJS.lib.WordArray.init(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), bytes.length));
}

function WordArrayToBytes(...wordArrays: WordArray[])
{
    let totalCount = 0;
    wordArrays.forEach(e => totalCount += e.sigBytes);

    const ret = new Array<number>(totalCount);
    let totalIndex = 0;

    for (let i = 0; i < wordArrays.length; ++i)
    {
        const currentWordArray = wordArrays[i];
        const words = currentWordArray.words;
        const count = currentWordArray.sigBytes;

        let index = 0;
        let offset = 0;

        for (let j = 0; j < count; ++j)
        {
            ret[totalIndex++] = words[index] >> ((3 - offset) << 3) & 0xff;

            if (++offset === 4)
            {
                offset = 0;
                ++index;
            }
        }
    }

    return ret;
}

function SHA256(msg: number[] | string | Uint8Array)
{
    const result = (<any>window).CryptoJS.SHA256(typeof msg === "string" ? msg : BytesToWordArray(msg));
    return WordArrayToBytes(result);
}

function SHA256Hex(msg: number[] | string | Uint8Array)
{
    const result = (<any>window).CryptoJS.SHA256(typeof msg === "string" ? msg : BytesToWordArray(msg));
    return <string>result.toString((<any>window).CryptoJS.enc.Hex);
}

function RIPEMD160(bytes: number[])
{
    const result = (<any>window).CryptoJS.RIPEMD160(BytesToWordArray(bytes));
    return WordArrayToBytes(result);
}

function HmacSHA512(msg: number[] | string, key: number[] | string)
{
    return WordArrayToBytes((<any>window).CryptoJS.HmacSHA512(
        typeof msg === "string" ? msg : BytesToWordArray(msg),
        typeof key === "string" ? key : BytesToWordArray(key)
    ));
}

function AES_Encrypt_ECB_NoPadding(msg: number[], password: number[])
{
    const result = (<any>window).CryptoJS.AES.encrypt(BytesToWordArray(msg), BytesToWordArray(password), {
        mode: (<any>window).CryptoJS.mode.ECB,
        padding: (<any>window).CryptoJS.pad.NoPadding
    });

    return WordArrayToBytes(result.ciphertext);
}

function AES_Decrypt_ECB_NoPadding(ciphertext: number[], password: number[])
{
    const result = (<any>window).CryptoJS.AES.decrypt({ ciphertext: BytesToWordArray(ciphertext) }, BytesToWordArray(password), {
        mode: (<any>window).CryptoJS.mode.ECB,
        padding: (<any>window).CryptoJS.pad.NoPadding
    });

    return WordArrayToBytes(result);
}

function PBKDF2(password: number[] | string, salt: number[] | string, iterations: number = 2048, dklen: number = 512/32)
{
    return WordArrayToBytes((<any>window).CryptoJS.PBKDF2(
        typeof password === "string" ? password : BytesToWordArray(password),
        typeof salt === "string" ? salt : BytesToWordArray(salt), {
            iterations: iterations,
            keySize: dklen,
            hasher: (<any>window).CryptoJS.algo.SHA512
        }
    ));
}
