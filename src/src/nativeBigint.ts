
// wrapper for native bigint class
(function()
{
    const BigInt: (value: number | string | bigint) => bigint = (<any>window).BigInt;
    if (typeof BigInt !== "function")
        return;

    (<any>self)["INIT_BN"] = () =>
    {
        type NumberSource = BN_ | string | number;
        class BN_
        {
            private value: bigint;

            private static zero = BigInt(0);
            private static one = BigInt(1);

            constructor(value: number | string | bigint, base?: number)
            {
                if (base === undefined || base === 10)
                    this.value = BigInt(value);
                else if (base === 16)
                    this.value = BigInt("0x" + value);
                else if (base === 2)
                    this.value = BigInt("0b" + value);
                else
                    throw new Error("Unsupported base");
            }

            static ConvertNumber(num: NumberSource): bigint
            {
                if (num instanceof BN_)
                    return num.value;
                else
                    return BigInt(num);
            }

            toString()
            {
                return this.value.toString();
            }

            add(num: NumberSource)
            {
                return new BN_(this.value + BN_.ConvertNumber(num));
            }

            sub(num: NumberSource)
            {
                return new BN_(this.value - BN_.ConvertNumber(num));
            }

            mul(num: NumberSource)
            {
                return new BN_(this.value * BN_.ConvertNumber(num));
            }

            div(num: NumberSource)
            {
                return new BN_(this.value / BN_.ConvertNumber(num));
            }

            mod(num: NumberSource)
            {
                return new BN_(this.value % BN_.ConvertNumber(num));
            }

            shrn(num: number)
            {
                return new BN_(this.value >> BN_.ConvertNumber(num));
            }

            shln(num: number)
            {
                return new BN_(this.value << BN_.ConvertNumber(num));
            }

            and(num: NumberSource)
            {
                return new BN_(this.value & BN_.ConvertNumber(num));
            }

            or(num: NumberSource)
            {
                return new BN_(this.value | BN_.ConvertNumber(num));
            }

            isZero()
            {
                return this.value === BN_.zero;
            }

            isNeg()
            {
                return this.value < BN_.zero;
            }

            isOdd()
            {
                return (this.value & BN_.one) === BN_.one;
            }

            gt(num: NumberSource)
            {
                return this.value > BN_.ConvertNumber(num);
            }

            gte(num: NumberSource)
            {
                return this.value >= BN_.ConvertNumber(num);
            }

            lt(num: NumberSource)
            {
                return this.value < BN_.ConvertNumber(num);
            }

            lte(num: NumberSource)
            {
                return this.value <= BN_.ConvertNumber(num);
            }

            toNumber()
            {
                return Number(this.value);
            }
        }

        (<any>self)["BN"] = BN_;
    }

    INIT_BN();
})();
