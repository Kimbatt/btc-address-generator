
// wrapper for native bigint class
(function()
{
    const BigInt: (value: number | string | bigint) => bigint = (<any>window).BigInt;
    if (typeof BigInt !== "function")
        return;
    
    const bigint_zero = BigInt(0);
    const bigint_one = BigInt(1);
    
    type NumberSource = BN | string | number;
    
    class BN
    {
        private value: bigint;

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
        
        static ConvertNumber(num: NumberSource)
        {
            if (num instanceof BN)
                return num.value;
            else
                return BigInt(num);
        }

        add(num: NumberSource)
        {
            return new BN(this.value + BN.ConvertNumber(num));
        }
    
        sub(num: NumberSource)
        {
            return new BN(this.value - BN.ConvertNumber(num));
        }
        
        mul(num: NumberSource)
        {
            return new BN(this.value * BN.ConvertNumber(num));
        }
        
        div(num: NumberSource)
        {
            return new BN(this.value / BN.ConvertNumber(num));
        }
        
        mod(num: NumberSource)
        {
            return new BN(this.value % BN.ConvertNumber(num));
        }
        
        shrn(num: number)
        {
            return new BN(this.value >> BN.ConvertNumber(num));
        }
        
        shln(num: number)
        {
            return new BN(this.value << BN.ConvertNumber(num));
        }
        
        and(num: NumberSource)
        {
            return new BN(this.value & BN.ConvertNumber(num));
        }
        
        or(num: NumberSource)
        {
            return new BN(this.value | BN.ConvertNumber(num));
        }
        
        isZero()
        {
            return this.value === bigint_zero;
        }
        
        isNeg()
        {
            return this.value < bigint_zero;
        }
        
        isOdd()
        {
            return (this.value & bigint_one) === bigint_one;
        }
        
        gt(num: NumberSource)
        {
            return this.value > BN.ConvertNumber(num);
        }
        
        gte(num: NumberSource)
        {
            return this.value >= BN.ConvertNumber(num);
        }
        
        lt(num: NumberSource)
        {
            return this.value < BN.ConvertNumber(num);
        }
        
        lte(num: NumberSource)
        {
            return this.value <= BN.ConvertNumber(num);
        }
        
        toNumber()
        {
            return Number(this.value);
        }
    }

    (<any>window)["BN"] = BN;
})();
