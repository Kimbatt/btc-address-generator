
interface EcKeypair
{
    x: BN;
    y: BN;
}

interface EcKeypairString
{
    x: string;
    y: string;
}

declare var EllipticCurve: ReturnType<typeof INIT_EllipticCurve>;

function INIT_EllipticCurve()
{
    const bn_0 = new BN(0);

    function BigintToBitArray(bigint: BN)
    {
        if (bigint.isNeg())
        {
            return [false];
        }

        const values: boolean[] = [];
        while (bigint.gt(bn_0))
        {
            values.push(bigint.isOdd());
            bigint = bigint.shrn(1);
        }

        return values.reverse();
    }


    // secp256k1 parameters
    const ecc_p =  new BN("0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16);
    const ecc_a =  new BN(0);
    const ecc_Gx = new BN("079BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", 16);
    const ecc_Gy = new BN("0483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", 16);
    const ecc_n =  new BN("0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16);

    const bn_1 = new BN(1);
    const bn_2 = new BN(2);
    const bn_3 = new BN(3);

    function Modinv(a: BN, n: BN)
    {
        let lm = new BN(1);
        let hm = new BN(0);
        let low = a.mod(n);
        let high = n;
        let ratio: BN;
        let nm: BN;
        let nnew: BN;

        while (low.isNeg())
        {
            low = low.add(n);
        }

        while (low.gt(bn_1))
        {
            ratio = high.div(low);
            nm = hm.sub(lm.mul(ratio));
            nnew = high.sub(low.mul(ratio));
            hm = lm;
            high = low;
            lm = nm;
            low = nnew;
        }

        return lm.mod(n);
    }

    function EcAdd(ax: BN, ay: BN, bx: BN, by: BN): EcKeypair
    {
        const lambda = ((by.sub(ay)).mul(Modinv(bx.sub(ax), ecc_p))).mod(ecc_p);
        const x = (lambda.mul(lambda).sub(ax).sub(bx)).mod(ecc_p);
        const y = (lambda.mul(ax.sub(x)).sub(ay)).mod(ecc_p);
        return {
            x: x,
            y: y
        };
    }

    function EcDouble(ax: BN, ay: BN): EcKeypair
    {
        const lambda = ((bn_3.mul(ax).mul(ax).add(ecc_a)).mul(Modinv(bn_2.mul(ay), ecc_p))).mod(ecc_p);
        const x = (lambda.mul(lambda).sub(bn_2.mul(ax))).mod(ecc_p);
        const y = (lambda.mul(ax.sub(x)).sub(ay)).mod(ecc_p);
        return {
            x: x,
            y: y
        };
    }

    function EccMultiply(gx: BN, gy: BN, scalar: BN): EcKeypair
    {
        let qx = gx;
        let qy = gy;

        const bits = BigintToBitArray(scalar);
        for (let i = 1; i < bits.length; ++i)
        {
            const ret = EcDouble(qx, qy);
            qx = ret.x;
            qy = ret.y;
            if (bits[i])
            {
                const ret2 = EcAdd(qx, qy, gx, gy);
                qx = ret2.x;
                qy = ret2.y;
            }
        }

        while (qy.isNeg())
        {
            qy = qy.add(ecc_p);
        }

        return {
            x: qx,
            y: qy,
        };
    }

    function GetECCKeypair(val: BN)
    {
        if (val.isZero() || val.gte(ecc_n))
        {
            console.log("invalid value");
            throw new Error("Invalid EC value");
        }

        return EccMultiply(ecc_Gx, ecc_Gy, val);
    }

    return {
        GetECCKeypair,
        EcAdd,
        EcDouble,
        EccMultiply,
        ecc_Gx, ecc_Gy, ecc_n, ecc_p, ecc_a
    };
}
