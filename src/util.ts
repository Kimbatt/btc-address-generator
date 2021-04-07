
var Util = (() =>
{
    const isDarkMode = (() =>
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

        console.log(entropy);
    }

    function TypedArrayPush(targetArray: number[], srcArray: Uint8Array | Uint32Array)
    {
        for (let i = 0; i < srcArray.length; ++i)
        {
            targetArray.push(srcArray[i]);
        }
    }

    function Get32SecureRandomBytes()
    {
        if (entropy !== null)
        {
            const tempArray: number[] = [];
            TypedArrayPush(tempArray, window.crypto.getRandomValues(new Uint8Array(8)));
            tempArray.push(...entropy);

            const tempArray2 = SHA256(tempArray);
            TypedArrayPush(tempArray2, window.crypto.getRandomValues(new Uint8Array(8)));

            return SHA256(tempArray2);
        }

        // skipped randomness generation
        const bytes = window.crypto.getRandomValues(new Uint8Array(32));
        const ret = new Array<number>(32);
        for (let i = 0; i < 32; ++i)
        {
            ret[i] = bytes[i];
        }

        return ret;
    }

    return {
        isDarkMode: isDarkMode,
        SetEntropy: SetEntropy,
        Get32SecureRandomBytes: Get32SecureRandomBytes
    };
});
