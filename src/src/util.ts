
// lazy evaluation, trying to achieve a behavior similar to imports
function Lazy<T, TArgs extends unknown[]>(fn: (...args: TArgs) => T)
{
    let evaluated: T | null = null;
    return (...a: TArgs) => (evaluated ??= fn(...a));
}

var Util = (() => Lazy(() =>
{
    const { HasQueryKey, GetQueryValue, GetAllQueryValues } = Query();

    let isDarkMode = (() =>
    {
        // check if browser supports prefers-color-scheme
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme)").matches)
        {
            // media query supported, check preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches)
            {
                // use dark mode
                return true;
            }
            else if (window.matchMedia("(prefers-color-scheme: light)").matches)
            {
                // use light mode
                return false;
            }
        }

        // use dark mode based on time
        const hour = new Date().getHours();
        return hour < 7 || hour > 18;
    })();

    function SetDarkMode(isDark: boolean)
    {
        isDarkMode = isDark;
        document.body.classList.remove(isDark ? "light" : "dark");
        document.body.classList.add(isDark ? "dark" : "light");
    }

    const isTestnet = HasQueryKey("testnet");

    return {
        IsDarkMode: () => isDarkMode,
        SetDarkMode,
        IsTestnet: () => isTestnet
    };
}))();

type Result<TResult, TError> = ResultOK<TResult> | ResultErr<TError>;
interface ResultOK<T>
{
    type: "ok";
    result: T;
}

interface ResultErr<T>
{
    type: "err";
    error: T;
}

declare var WorkerUtils: ReturnType<typeof INIT_WorkerUtils>;

function INIT_WorkerUtils()
{
    let entropy: number[] | null = null;
    function SetEntropy(values: number[])
    {
        entropy = [];

        for (let value of values)
        {
            value = Math.abs(value | 0);
            do
            {
                entropy.push(value & 0xff);
                value >>>= 8;
            }
            while (value !== 0);
        }

        console.log("entropy set to:", entropy);
    }

    let isTestnet = false;
    function SetIsTestnet(testnet: boolean)
    {
        isTestnet = testnet;
    }

    function IsTestnet()
    {
        return isTestnet;
    }

    function TypedArrayPush(targetArray: number[], srcArray: Uint8Array | Uint32Array)
    {
        for (let i = 0; i < srcArray.length; ++i)
        {
            targetArray.push(srcArray[i]);
        }
    }

    function ArrayConcat<T>(...arrays: T[][])
    {
        const result: T[] = [];
        for (let array of arrays)
        {
            for (let element of array)
            {
                result.push(element);
            }
        }

        return result;
    }

    function Get32SecureRandomBytes()
    {
        if (entropy !== null)
        {
            const tempArray: number[] = [];
            TypedArrayPush(tempArray, self.crypto.getRandomValues(new Uint8Array(8)));
            tempArray.push(...entropy);

            const tempArray2 = CryptoHelper.SHA256(tempArray);
            TypedArrayPush(tempArray2, self.crypto.getRandomValues(new Uint8Array(8)));

            return CryptoHelper.SHA256(tempArray2);
        }

        // skipped randomness generation
        const bytes = self.crypto.getRandomValues(new Uint8Array(32));
        const ret = new Array<number>(32);
        for (let i = 0; i < 32; ++i)
        {
            ret[i] = bytes[i];
        }

        return ret;
    }

    const bn_0 = new BN(0);
    const bn_255 = new BN(255);
    function BigintToByteArray(bigint: BN)
    {
        const ret: number[] = [];

        while (bigint.gt(bn_0))
        {
            ret.push(bigint.and(bn_255).toNumber());
            bigint = bigint.shrn(8);
        }

        return ret;
    }

    function ByteArrayToBigint(bytes: number[])
    {
        let bigint = new BN(0);
        for (let i = 0; i < bytes.length; ++i)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[i]));
        }

        return bigint;
    }

    function BigintToBitArray(bigint: BN)
    {
        if (bigint.isNeg())
            return [false];

        const values: boolean[] = [];
        while (bigint.gt(bn_0))
        {
            values.push(bigint.isOdd());
            bigint = bigint.shrn(1);
        }
        return values.reverse();
    }

    function ByteArrayXOR(b1: number[], b2: number[])
    {
        const ret: number[] = [];
        for (let i = 0; i < b1.length; ++i)
            ret.push(b1[i] ^ b2[i]);

        return ret;
    }


    const base58Characters = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const base58CharsIndices: { [key: string]: number } = {
        "1": 0, "2": 1, "3": 2, "4": 3,
        "5": 4, "6": 5, "7": 6, "8": 7,
        "9": 8, "A": 9, "B": 10, "C": 11,
        "D": 12, "E": 13, "F": 14, "G": 15,
        "H": 16, "J": 17, "K": 18, "L": 19,
        "M": 20, "N": 21, "P": 22, "Q": 23,
        "R": 24, "S": 25, "T": 26, "U": 27,
        "V": 28, "W": 29, "X": 30, "Y": 31,
        "Z": 32, "a": 33, "b": 34, "c": 35,
        "d": 36, "e": 37, "f": 38, "g": 39,
        "h": 40, "i": 41, "j": 42, "k": 43,
        "m": 44, "n": 45, "o": 46, "p": 47,
        "q": 48, "r": 49, "s": 50, "t": 51,
        "u": 52, "v": 53, "w": 54, "x": 55,
        "y": 56, "z": 57,
    }

    const bn_58 = new BN(58);
    function Base58Encode(bytes: number[])
    {
        let leading_zeroes = 0;
        while (bytes[leading_zeroes] === 0)
        {
            // count leading zeroes
            ++leading_zeroes;
        }

        let bigint = new BN(0);
        // convert bytes to bigint
        for (let i = 0; i < bytes.length; ++i)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[i]));
        }

        bytes.reverse();

        const ret: string[] = [];
        while (bigint.gt(bn_0))
        {
            // get base58 character
            const remainder = bigint.mod(bn_58);
            bigint = bigint.div(bn_58);
            ret.push(base58Characters[remainder.toNumber()]);
        }

        for (let i = 0; i < leading_zeroes; ++i)
        {
            // add padding if necessary
            ret.push(base58Characters[0]);
        }

        return ret.reverse().join("");
    }

    function Base58CheckEncode(bytes: number[])
    {
        let leading_zeroes = 0;
        while (bytes[leading_zeroes] === 0)
        {
            // count leading zeroes
            ++leading_zeroes;
        }

        bytes.push.apply(bytes, CryptoHelper.SHA256(CryptoHelper.SHA256(bytes)).slice(0, 4));

        let bigint = new BN(0);
        // convert bytes to bigint
        for (let i = 0; i < bytes.length; ++i)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[i]));
        }

        bytes.reverse();

        const ret: string[] = [];
        while (bigint.gt(bn_0))
        {
            // get base58 character
            const remainder = bigint.mod(bn_58);
            bigint = bigint.div(bn_58);
            ret.push(base58Characters[remainder.toNumber()]);
        }

        for (let i = 0; i < leading_zeroes; ++i)
        {
            // add padding if necessary
            ret.push(base58Characters[0]);
        }

        return ret.reverse().join("");
    }

    function Base58CheckDecode(text: string): Result<number[], string>
    {
        let newstring = text.split("").reverse().join("");
        for (let i = 0; i < text.length; ++i)
        {
            if (text[i] == base58Characters[0])
                newstring = newstring.substr(0, newstring.length - 1);
            else
                break;
        }

        let bigint = bn_0;
        for (let i = newstring.length - 1; i >= 0; --i)
        {
            const charIndex = base58CharsIndices[newstring[i]];
            if (charIndex === undefined)
            {
                return { type: "err", error: "invalid character: " + newstring[i] };
            }

            bigint = (bigint.mul(bn_58)).add(new BN(charIndex));
        }

        const bytes = BigintToByteArray(bigint);
        if (bytes[bytes.length - 1] == 0)
            bytes.pop();

        bytes.reverse();

        const checksum = bytes.slice(bytes.length - 4, bytes.length);
        bytes.splice(bytes.length - 4, 4);
        const sha_result = CryptoHelper.SHA256(CryptoHelper.SHA256(bytes));

        for (var i = 0; i < 4; ++i)
        {
            if (sha_result[i] != checksum[i])
            {
                return { type: "err", error: "invalid checksum" };
            }
        }

        return { type: "ok", result: bytes };
    }


    return {
        SetEntropy,
        SetIsTestnet,
        IsTestnet,
        ArrayConcat,
        Get32SecureRandomBytes,
        BigintToBitArray,
        BigintToByteArray,
        ByteArrayToBigint,
        ByteArrayXOR,
        Base58Encode,
        Base58CheckEncode,
        Base58CheckDecode
    };
}
