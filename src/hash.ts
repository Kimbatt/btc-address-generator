// SHA256, RIPEMD160
// source: http://code.google.com/p/crypto-js/

let SHA256: (input: string | number[]) => number[];
let RIPEMD160: (input: string | number[]) => number[];

interface CryptoJSEncoding
{
    stringToBytes: (r: string) => number[];
    bytesToString: (r: number[]) => string;
}

interface CryptoJS
{
    util: {
        rotl: (r: number, t: number) => number;
        rotr: (r: number, t: number) => number;
        endianVal: (r: number) => number;
        endianArr: (r: number[]) => number[];
        randomBytes: (r: number) => number[];
        bytesToWords: (r: number[]) => number[];
        wordsToBytes: (r: number[]) => number[];
        bytesToHex: (r: number[]) => string;
        hexToBytes: (r: string) => number[];
        bytesToBase64: (r: number[]) => string;
        base64ToBytes: (r: string) => number[];
        bytesToLWords: (r: number[]) => number[];
        lWordsToBytes: (r: number[]) => number[];
    };
    charenc: {
        UTF8: CryptoJSEncoding;
        Binary: CryptoJSEncoding;
    }
}

const base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const cryptoJS: CryptoJS = {
    util: {
        rotl: function(r: number, t: number) {
            return r << t | r >>> 32 - t;
        },
        rotr: function(r: number, t: number) {
            return r << 32 - t | r >>> t;
        },
        endianVal: function(r: number) {
            return 16711935 & cryptoJS.util.rotl(r, 8) | 4278255360 & cryptoJS.util.rotl(r, 24);
        },
        endianArr: function(r: number[]) {
            for (let t = 0; t < r.length; t++)
                r[t] = cryptoJS.util.endianVal(r[t]);

            return r;
        },
        randomBytes: function(r: number) {
            const t: number[] = [];
            for (; r > 0; r--)
                t.push(Math.floor(256 * Math.random()));

            return t;
        },
        bytesToWords: function(r: number[]) {
            const t: number[] = [];
            for (let n = 0, e = 0; n < r.length; n++, e += 8)
                t[e >>> 5] |= (255 & r[n]) << 24 - e % 32;

            return t;
        },
        wordsToBytes: function(r: number[]) {
            const t: number[] = [];
            for (let n = 0; n < 32 * r.length; n += 8)
                t.push(r[n >>> 5] >>> 24 - n % 32 & 255);

            return t;
        },
        bytesToHex: function(r: number[]) {
            const t: string[] = [];
            for (let n = 0; n < r.length; n++)
            {
                t.push((r[n] >>> 4).toString(16));
                t.push((15 & r[n]).toString(16));
            }

            return t.join("");
        },
        hexToBytes: function(r: string) {
            const t: number[] = [];
            for (let n = 0; n < r.length; n += 2)
                t.push(parseInt(r.substr(n, 2), 16));

            return t;
        },
        bytesToBase64: function(r: number[]) {
            const t: string[] = [];
            for (let n = 0; n < r.length; n += 3)
            {
                for (let e = r[n] << 16 | r[n + 1] << 8 | r[n + 2], o = 0; o < 4; o++)
                    t.push(8 * n + 6 * o <= 8 * r.length ? base64map.charAt(e >>> 6 * (3 - o) & 63) : "=");
            }

            return t.join("");
        },
        base64ToBytes: function(r: string) {
            r = r.replace(/[^A-Z0-9+\/]/gi, "");
            const t: number[] = [];
            for (let n = 0, e = 0; n < r.length; e = ++n % 4)
            {
                if (e !== 0)
                    t.push((base64map.indexOf(r.charAt(n - 1)) & Math.pow(2, -2 * e + 8) - 1) << 2 * e | base64map.indexOf(r.charAt(n)) >>> 6 - 2 * e);
            }

            return t;
        },
        bytesToLWords: function(r: number[]) {
            const t = new Array<number>(r.length >> 2);
            for (let n = 0; n < t.length; n++)
                t[n] = 0;

            for (let n = 0; n < 8 * r.length; n += 8)
                t[n >> 5] |= (255 & r[n / 8]) << n % 32;

            return t;
        },
        lWordsToBytes: function(r: number[]) {
            const t: number[] = [];
            for (let n = 0; n < 32 * r.length; n += 8)
                t.push(r[n >> 5] >>> n % 32 & 255);

            return t;
        }
    },
    charenc: {
        UTF8: {
            stringToBytes: function(r: string) {
                return cryptoJS.charenc.Binary.stringToBytes(unescape(encodeURIComponent(r)));
            },
            bytesToString: function(r: number[]) {
                return decodeURIComponent(escape(cryptoJS.charenc.Binary.bytesToString(r)));
            }
        },
        Binary: {
            stringToBytes: function(r: string) {
                const t: number[] = [];
                for (let n = 0; n < r.length; n++)
                    t.push(255 & r.charCodeAt(n));

                return t;
            },
            bytesToString: function(r: number[]) {
                const t: string[] = [];
                for (let n = 0; n < r.length; n++)
                    t.push(String.fromCharCode(r[n]));

                return t.join("");
            }
        }
    }
};

(() =>
{
    function rmd160_f(r: number, t: number, n: number, e: number) {
        if (r < 16)
            return t ^ n ^ e;
        else if (r < 32)
            return t & n | ~t & e;
        else if (r < 48)
            return (t | ~n) ^ e;
        else if (r < 64)
            return t & e | n & ~e;
        else
            return t ^ (n | ~e);
    }
    function rmd160_K1(r: number) {
        if (r < 16)
            return 0;
        else if (r < 32)
            return 1518500249;
        else if (r < 48)
            return 1859775393;
        else if (r < 64)
            return 2400959708;
        else
            return 2840853838;
    }
    function rmd160_K2(r: number) {
        if (r < 16)
            return 1352829926;
        else if (r < 32)
            return 1548603684;
        else if (r < 48)
            return 1836072691;
        else if (r < 64)
            return 2053994217;
        else
            return 0;
    }
    function safe_add(r: number, t: number) {
        var n = (65535 & r) + (65535 & t);
        return (r >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
    }
    function bit_rol(r: number, t: number) {
        return r << t | r >>> 32 - t;
    }

    const K = [
        1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
        3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
        3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
        2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
        666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
        2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
        430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
        1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298
    ];

    SHA256 = function(r) {
        return cryptoJS.util.wordsToBytes(_sha256(r));
    }

    function _sha256(r: string | number[]) {
        if (typeof r === "string")
            r = cryptoJS.charenc.UTF8.stringToBytes(r);

        // var t, n, e, o, a, s, u, i, d;
        const f = cryptoJS.util.bytesToWords(r);
        const c = 8 * r.length;
        const h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
        const l: number[] = [];

        f[c >> 5] |= 128 << 24 - c % 32,
        f[15 + (c + 64 >> 9 << 4)] = c;
        for (var idx = 0; idx < f.length; idx += 16) {
            let t = h[0];
            let n = h[1];
            let e = h[2];
            let o = h[3];
            let a = h[4];
            let s = h[5];
            let u = h[6];
            let i = h[7];

            for (var y = 0; y < 64; y++) {
                if (y < 16)
                    l[y] = f[y + idx];
                else {
                    const g = l[y - 15];
                    const m = l[y - 2];
                    const T = (g << 25 | g >>> 7) ^ (g << 14 | g >>> 18) ^ g >>> 3;
                    const p = (m << 15 | m >>> 17) ^ (m << 13 | m >>> 19) ^ m >>> 10;
                    l[y] = T + (l[y - 7] >>> 0) + p + (l[y - 16] >>> 0)
                }
                const v = t & n ^ t & e ^ n & e;
                const b = (t << 30 | t >>> 2) ^ (t << 19 | t >>> 13) ^ (t << 10 | t >>> 22);
                const d = (i >>> 0) + ((a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 | a >>> 25)) + (a & s ^ ~a & u) + K[y] + (l[y] >>> 0);
                i = u;
                u = s;
                s = a;
                a = o + d >>> 0;
                o = e;
                e = n;
                n = t;
                t = d + (b + v) >>> 0;
            }

            h[0] += t;
            h[1] += n;
            h[2] += e;
            h[3] += o;
            h[4] += a;
            h[5] += s;
            h[6] += u;
            h[7] += i;
        }
        return h;
    }

    RIPEMD160 = function(r) {
        return cryptoJS.util.lWordsToBytes(_rmd160(r));
    };
    
    const rmd160_r1 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
        3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
        1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
        4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
    ];
    const rmd160_r2 = [
        5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
        6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
        15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
        8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
        12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
    ];
    const rmd160_s1 = [
        11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
        7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
        11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
        11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
        9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
    ];
    const rmd160_s2 = [
        8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
        9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
        9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
        15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
        8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
    ];

    function _rmd160(r: string | number[]) {
        if (typeof r === "string")
            r = cryptoJS.charenc.UTF8.stringToBytes(r);

        const t = cryptoJS.util.bytesToLWords(r);
        const n = 8 * r.length;

        t[n >> 5] |= 128 << n % 32,
        t[14 + (n + 64 >>> 9 << 4)] = n;

        let e = 1732584193, o = 4023233417, a = 2562383102, s = 271733878, u = 3285377520;
        for (let i = 0; i < t.length; i += 16) {
            let d: number;
            let f = e, c = o, h = a, l = s, _ = u, y = e, g = o, m = a, T = s, p = u;
            for (let v = 0; v <= 79; ++v)
            {
                d = safe_add(bit_rol(d = safe_add(d = safe_add(d = safe_add(f, rmd160_f(v, c, h, l)), t[i + rmd160_r1[v]]), rmd160_K1(v)), rmd160_s1[v]), _);
                f = _;
                _ = l;
                l = bit_rol(h, 10);
                h = c;
                c = d;
                d = safe_add(bit_rol(d = safe_add(d = safe_add(d = safe_add(y, rmd160_f(79 - v, g, m, T)), t[i + rmd160_r2[v]]), rmd160_K2(v)), rmd160_s2[v]), p);
                y = p;
                p = T;
                T = bit_rol(m, 10);
                m = g;
                g = d;
            }

            d = safe_add(o, safe_add(h, T));
            o = safe_add(a, safe_add(l, p));
            a = safe_add(s, safe_add(_, y));
            s = safe_add(u, safe_add(f, g));
            u = safe_add(e, safe_add(c, m));
            e = d;
        }

        return [e, o, a, s, u];
    }
})();
