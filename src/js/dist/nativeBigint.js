"use strict";
// wrapper for native bigint class
(function () {
    var BigInt = window.BigInt;
    if (typeof BigInt !== "function")
        return;
    self["INIT_BN"] = function () {
        var BN_ = /** @class */ (function () {
            function BN_(value, base) {
                if (base === undefined || base === 10)
                    this.value = BigInt(value);
                else if (base === 16)
                    this.value = BigInt("0x" + value);
                else if (base === 2)
                    this.value = BigInt("0b" + value);
                else
                    throw new Error("Unsupported base");
            }
            BN_.ConvertNumber = function (num) {
                if (num instanceof BN_)
                    return num.value;
                else
                    return BigInt(num);
            };
            BN_.prototype.toString = function () {
                return this.value.toString();
            };
            BN_.prototype.add = function (num) {
                return new BN_(this.value + BN_.ConvertNumber(num));
            };
            BN_.prototype.sub = function (num) {
                return new BN_(this.value - BN_.ConvertNumber(num));
            };
            BN_.prototype.mul = function (num) {
                return new BN_(this.value * BN_.ConvertNumber(num));
            };
            BN_.prototype.div = function (num) {
                return new BN_(this.value / BN_.ConvertNumber(num));
            };
            BN_.prototype.mod = function (num) {
                return new BN_(this.value % BN_.ConvertNumber(num));
            };
            BN_.prototype.shrn = function (num) {
                return new BN_(this.value >> BN_.ConvertNumber(num));
            };
            BN_.prototype.shln = function (num) {
                return new BN_(this.value << BN_.ConvertNumber(num));
            };
            BN_.prototype.and = function (num) {
                return new BN_(this.value & BN_.ConvertNumber(num));
            };
            BN_.prototype.or = function (num) {
                return new BN_(this.value | BN_.ConvertNumber(num));
            };
            BN_.prototype.isZero = function () {
                return this.value === BN_.zero;
            };
            BN_.prototype.isNeg = function () {
                return this.value < BN_.zero;
            };
            BN_.prototype.isOdd = function () {
                return (this.value & BN_.one) === BN_.one;
            };
            BN_.prototype.gt = function (num) {
                return this.value > BN_.ConvertNumber(num);
            };
            BN_.prototype.gte = function (num) {
                return this.value >= BN_.ConvertNumber(num);
            };
            BN_.prototype.lt = function (num) {
                return this.value < BN_.ConvertNumber(num);
            };
            BN_.prototype.lte = function (num) {
                return this.value <= BN_.ConvertNumber(num);
            };
            BN_.prototype.toNumber = function () {
                return Number(this.value);
            };
            BN_.zero = BigInt(0);
            BN_.one = BigInt(1);
            return BN_;
        }());
        self["BN"] = BN_;
    };
    INIT_BN();
})();
