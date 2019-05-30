
// wrapper for native bigint class
(function()
{
    if (typeof BigInt !== "function")
        return;
    
    var bigint_zero = BigInt(0);
    var bigint_one = BigInt(1);
    
    function BN(value, base)
    {
        if (!base || base === 10)
            this.value = BigInt(value);
        else if (base === 16)
            this.value = BigInt("0x" + value);
        else if (base === 2)
            this.value = BigInt("0b" + value);
        else
            throw new Error("Unsupported base");
    }
    
    function ConvertNumber(num)
    {
        if (num instanceof BN)
            return num.value;
        else
            return BigInt(num);
    }
    
    BN.prototype.add = function(num)
    {
        return new BN(this.value + ConvertNumber(num));
    }
    
    BN.prototype.sub = function(num)
    {
        return new BN(this.value - ConvertNumber(num));
    }
    
    BN.prototype.mul = function(num)
    {
        return new BN(this.value * ConvertNumber(num));
    }
    
    BN.prototype.div = function(num)
    {
        return new BN(this.value / ConvertNumber(num));
    }
    
    BN.prototype.mod = function(num)
    {
        return new BN(this.value % ConvertNumber(num));
    }
    
    BN.prototype.shrn = function(num)
    {
        return new BN(this.value >> ConvertNumber(num));
    }
    
    BN.prototype.shln = function(num)
    {
        return new BN(this.value << ConvertNumber(num));
    }
    
    BN.prototype.and = function(num)
    {
        return new BN(this.value & ConvertNumber(num));
    }
    
    BN.prototype.or = function(num)
    {
        return new BN(this.value | ConvertNumber(num));
    }
    
    BN.prototype.isZero = function()
    {
        return this.value === bigint_zero;
    }
    
    BN.prototype.isNeg = function()
    {
        return this.value < bigint_zero;
    }
    
    BN.prototype.isOdd = function()
    {
        return (this.value & bigint_one) === bigint_one;
    }
    
    BN.prototype.gt = function(num)
    {
        return this.value > ConvertNumber(num);
    }
    
    BN.prototype.gte = function(num)
    {
        return this.value >= ConvertNumber(num);
    }
    
    BN.prototype.lt = function(num)
    {
        return this.value < ConvertNumber(num);
    }
    
    BN.prototype.lte = function(num)
    {
        return this.value <= ConvertNumber(num);
    }
    
    BN.prototype.toNumber = function()
    {
        return Number(this.value);
    }
    
    window["BN"] = BN;
})();
