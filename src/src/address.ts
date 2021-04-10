
function INIT_AddressUtil()
{
    // Creates base58 encoded private key in string format from bigint
    function MakePrivateKey(bigint: BN, isTestnet: boolean)
    {
        const privkey: number[] = [];
        privkey.push(0x01);

        const temp = WorkerUtils.BigintToByteArray(bigint);
        while (temp.length < 32)
        {
           temp.push(0);
        }

        privkey.push(...temp);
        privkey.push(isTestnet ? 0xEF : 0x80);
        privkey.reverse();
        privkey.push.apply(privkey, CryptoHelper.SHA256(CryptoHelper.SHA256(privkey)).slice(0, 4));
        return WorkerUtils.Base58Encode(privkey);
    }

    // make legacy address from public key
    function MakeLegacyAddress(keypair: EcKeypair, isTestnet: boolean)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
        {
            bytes_public_x.push(0);
        }

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
        {
            key_bytes.push(0x03);
        }
        else
        {
            key_bytes.push(0x02);
        }

        key_bytes.reverse();
        const sha_result_1 = CryptoHelper.SHA256(key_bytes);
        const ripemd_result_2 = CryptoHelper.RIPEMD160(sha_result_1);
        const ripemd_extended = [isTestnet ? 0x6F : 0x00];
        ripemd_extended.push(...ripemd_result_2);
        const sha_result_3 = CryptoHelper.SHA256(ripemd_extended);
        const sha_result_4 = CryptoHelper.SHA256(sha_result_3);
        ripemd_extended.push.apply(ripemd_extended, sha_result_4.slice(0, 4));

        return WorkerUtils.Base58Encode(ripemd_extended);
    }

    // make segwit address from public key
    function makeSegwitAddress(keypair: EcKeypair, isTestnet: boolean)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = CryptoHelper.SHA256(key_bytes);
        const keyhash = CryptoHelper.RIPEMD160(sha_result_1);

        const redeemscript = [0x00, 0x14];
        redeemscript.push(...keyhash);

        const redeemscripthash = [isTestnet ? 0xC4 : 0x05];

        redeemscripthash.push(...CryptoHelper.RIPEMD160(CryptoHelper.SHA256(redeemscript)));
        redeemscripthash.push.apply(redeemscripthash, CryptoHelper.SHA256(CryptoHelper.SHA256(redeemscripthash)).slice(0, 4));

        return WorkerUtils.Base58Encode(redeemscripthash);
    }

    const bech32Chars = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

    function bech32HrpExpand(hrp: string)
    {
        const ret = [];
        for (let i = 0; i < hrp.length; ++i)
            ret.push(hrp.charCodeAt(i) >> 5);

        ret.push(0);

        for (let i = 0; i < hrp.length; ++i)
            ret.push(hrp.charCodeAt(i) & 0x1f);

        return ret;
    }

    function bech32Polymod(values: number[])
    {
        const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
        let chk = 1;

        for (let i = 0; i < values.length; ++i)
        {
            const b = chk >> 25;
            chk = ((chk & 0x1ffffff) << 5) ^ values[i];

            for (let j = 0; j < 5; ++j)
            {
                if ((b >> j) & 1)
                    chk ^= GEN[j];
            }
        }

        return chk;
    }

    function bech32CreateChecksum(hrp: string, data: number[])
    {
        const hrpExpanded = bech32HrpExpand(hrp);
        hrpExpanded.push(...data);
        hrpExpanded.push.apply(hrpExpanded, [0, 0, 0, 0, 0, 0]);

        const polymod = bech32Polymod(hrpExpanded) ^ 1;

        const ret = [];
        for (let i = 0; i < 6; ++i)
            ret.push((polymod >> 5 * (5 - i)) & 31);

        return ret;
    }

    // create bech32 address from public key
    function makeBech32Address(keypair: EcKeypair, isTestnet: boolean)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = WorkerUtils.BigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = CryptoHelper.SHA256(key_bytes);
        const keyhash = CryptoHelper.RIPEMD160(sha_result_1);

        const redeemscript = [0x00, 0x14];
        redeemscript.push(...keyhash);

        let value = 0;
        let bits = 0;

        const result = [0];
        for (let i = 0; i < 20; ++i)
        {
            value = ((value << 8) | keyhash[i]) & 0xFFFFFF;
            bits += 8;

            while (bits >= 5)
            {
                bits -= 5;
                result.push((value >> bits) & 0x1F);
            }
        }

        let address = isTestnet ? "tb1" : "bc1";
        for (let i = 0; i < result.length; ++i)
            address += bech32Chars[result[i]];

        const checksum = bech32CreateChecksum(isTestnet ? "tb" : "bc", result);
        for (let i = 0; i < checksum.length; ++i)
            address += bech32Chars[checksum[i]];

        return address;
    }


    function GenerateNewRandomAddress(addressType: "legacy" | "segwit" | "bech32", isTestnet: boolean, password?: string)
    {
        if (typeof password !== "undefined")
        {
            throw new Error("not implemented yet");
        }

        const bytes = WorkerUtils.Get32SecureRandomBytes();

        let bigint = new BN(0);
        for (let j = 0; j < bytes.length; ++j)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[j]));
        }

        const keypair = EllipticCurve.GetECCKeypair(bigint);
        const privateKey = MakePrivateKey(bigint, isTestnet);

        let address: string;
        switch (addressType)
        {
            case "segwit":
                address = makeSegwitAddress(keypair, isTestnet);
                break;
            case "bech32":
                address = makeBech32Address(keypair, isTestnet);
                break;
            case "legacy":
                address = MakeLegacyAddress(keypair, isTestnet);
                break;
        }

        return {
            address,
            privateKey
        };
    }

    return {
        GenerateNewRandomAddress
    };
}
