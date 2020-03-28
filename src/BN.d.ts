
type NumberSource = BN | string | number;
declare class BN
{
    constructor(value: number | string | bigint, base?: number);
    add(num: NumberSource): BN;
    sub(num: NumberSource): BN;
    mul(num: NumberSource): BN;
    div(num: NumberSource): BN;
    mod(num: NumberSource): BN;
    shrn(num: number): BN;
    shln(num: number): BN;
    and(num: NumberSource): BN;
    or(num: NumberSource): BN;
    isZero(): boolean;
    isNeg(): boolean;
    isOdd(): boolean;
    gt(num: NumberSource): boolean;
    gte(num: NumberSource): boolean;
    lt(num: NumberSource): boolean;
    lte(num: NumberSource): boolean;
    toNumber(): number;
}
