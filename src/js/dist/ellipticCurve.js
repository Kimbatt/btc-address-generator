"use strict";
function INIT_EllipticCurve() {
    var bn_0 = new BN(0);
    function BigintToBitArray(bigint) {
        if (bigint.isNeg()) {
            return [false];
        }
        var values = [];
        while (bigint.gt(bn_0)) {
            values.push(bigint.isOdd());
            bigint = bigint.shrn(1);
        }
        return values.reverse();
    }
    // secp256k1 parameters
    var ecc_p = new BN("0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16);
    var ecc_a = new BN(0);
    var ecc_Gx = new BN("079BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", 16);
    var ecc_Gy = new BN("0483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", 16);
    var ecc_n = new BN("0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16);
    var bn_1 = new BN(1);
    var bn_2 = new BN(2);
    var bn_3 = new BN(3);
    function Modinv(a, n) {
        var lm = new BN(1);
        var hm = new BN(0);
        var low = a.mod(n);
        var high = n;
        var ratio;
        var nm;
        var nnew;
        while (low.isNeg()) {
            low = low.add(n);
        }
        while (low.gt(bn_1)) {
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
    function EcAdd(ax, ay, bx, by) {
        var lambda = ((by.sub(ay)).mul(Modinv(bx.sub(ax), ecc_p))).mod(ecc_p);
        var x = (lambda.mul(lambda).sub(ax).sub(bx)).mod(ecc_p);
        var y = (lambda.mul(ax.sub(x)).sub(ay)).mod(ecc_p);
        return {
            x: x,
            y: y
        };
    }
    function EcDouble(ax, ay) {
        var lambda = ((bn_3.mul(ax).mul(ax).add(ecc_a)).mul(Modinv(bn_2.mul(ay), ecc_p))).mod(ecc_p);
        var x = (lambda.mul(lambda).sub(bn_2.mul(ax))).mod(ecc_p);
        var y = (lambda.mul(ax.sub(x)).sub(ay)).mod(ecc_p);
        return {
            x: x,
            y: y
        };
    }
    function EccMultiply(gx, gy, scalar) {
        var qx = gx;
        var qy = gy;
        var bits = BigintToBitArray(scalar);
        for (var i = 1; i < bits.length; ++i) {
            var ret = EcDouble(qx, qy);
            qx = ret.x;
            qy = ret.y;
            if (bits[i]) {
                var ret2 = EcAdd(qx, qy, gx, gy);
                qx = ret2.x;
                qy = ret2.y;
            }
        }
        while (qy.isNeg()) {
            qy = qy.add(ecc_p);
        }
        return {
            x: qx,
            y: qy,
        };
    }
    function GetECCKeypair(val) {
        if (val.isZero() || val.gte(ecc_n)) {
            console.log("invalid value");
            throw new Error("Invalid EC value");
        }
        return EccMultiply(ecc_Gx, ecc_Gy, val);
    }
    return {
        GetECCKeypair: GetECCKeypair,
        EcAdd: EcAdd,
        EcDouble: EcDouble,
        EccMultiply: EccMultiply,
        ecc_Gx: ecc_Gx, ecc_Gy: ecc_Gy, ecc_n: ecc_n, ecc_p: ecc_p, ecc_a: ecc_a
    };
}
