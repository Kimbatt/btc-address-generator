"use strict";
// wrapper for native bigint class
(function () {
    var BigInt = window.BigInt;
    if (typeof BigInt !== "function")
        return;
    var bigint_zero = BigInt(0);
    var bigint_one = BigInt(1);
    var BN = /** @class */ (function () {
        function BN(value, base) {
            if (base === undefined || base === 10)
                this.value = BigInt(value);
            else if (base === 16)
                this.value = BigInt("0x" + value);
            else if (base === 2)
                this.value = BigInt("0b" + value);
            else
                throw new Error("Unsupported base");
        }
        BN.ConvertNumber = function (num) {
            if (num instanceof BN)
                return num.value;
            else
                return BigInt(num);
        };
        BN.prototype.add = function (num) {
            return new BN(this.value + BN.ConvertNumber(num));
        };
        BN.prototype.sub = function (num) {
            return new BN(this.value - BN.ConvertNumber(num));
        };
        BN.prototype.mul = function (num) {
            return new BN(this.value * BN.ConvertNumber(num));
        };
        BN.prototype.div = function (num) {
            return new BN(this.value / BN.ConvertNumber(num));
        };
        BN.prototype.mod = function (num) {
            return new BN(this.value % BN.ConvertNumber(num));
        };
        BN.prototype.shrn = function (num) {
            return new BN(this.value >> BN.ConvertNumber(num));
        };
        BN.prototype.shln = function (num) {
            return new BN(this.value << BN.ConvertNumber(num));
        };
        BN.prototype.and = function (num) {
            return new BN(this.value & BN.ConvertNumber(num));
        };
        BN.prototype.or = function (num) {
            return new BN(this.value | BN.ConvertNumber(num));
        };
        BN.prototype.isZero = function () {
            return this.value === bigint_zero;
        };
        BN.prototype.isNeg = function () {
            return this.value < bigint_zero;
        };
        BN.prototype.isOdd = function () {
            return (this.value & bigint_one) === bigint_one;
        };
        BN.prototype.gt = function (num) {
            return this.value > BN.ConvertNumber(num);
        };
        BN.prototype.gte = function (num) {
            return this.value >= BN.ConvertNumber(num);
        };
        BN.prototype.lt = function (num) {
            return this.value < BN.ConvertNumber(num);
        };
        BN.prototype.lte = function (num) {
            return this.value <= BN.ConvertNumber(num);
        };
        BN.prototype.toNumber = function () {
            return Number(this.value);
        };
        return BN;
    }());
    window["BN"] = BN;
})();
