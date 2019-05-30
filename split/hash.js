// SHA256, RIPEMD160
// source: http://code.google.com/p/crypto-js/

function rmd160_f(r, t, n, e) {
    return 0 <= r && r <= 15 ? t ^ n ^ e : 16 <= r && r <= 31 ? t & n | ~t & e : 32 <= r && r <= 47 ? (t | ~n) ^ e : 48 <= r && r <= 63 ? t & e | n & ~e : 64 <= r && r <= 79 ? t ^ (n | ~e) : "rmd160_f: j out of range"
}
function rmd160_K1(r) {
    return 0 <= r && r <= 15 ? 0 : 16 <= r && r <= 31 ? 1518500249 : 32 <= r && r <= 47 ? 1859775393 : 48 <= r && r <= 63 ? 2400959708 : 64 <= r && r <= 79 ? 2840853838 : "rmd160_K1: j out of range"
}
function rmd160_K2(r) {
    return 0 <= r && r <= 15 ? 1352829926 : 16 <= r && r <= 31 ? 1548603684 : 32 <= r && r <= 47 ? 1836072691 : 48 <= r && r <= 63 ? 2053994217 : 64 <= r && r <= 79 ? 0 : "rmd160_K2: j out of range"
}
function safe_add(r, t) {
    var n = (65535 & r) + (65535 & t);
    return (r >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n
}
function bit_rol(r, t) {
    return r << t | r >>> 32 - t
}
var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  , Crypto = window.Crypto = {}
  , util = Crypto.util = {
    rotl: function(r, t) {
        return r << t | r >>> 32 - t
    },
    rotr: function(r, t) {
        return r << 32 - t | r >>> t
    },
    endian: function(r) {
        if (r.constructor == Number)
            return 16711935 & util.rotl(r, 8) | 4278255360 & util.rotl(r, 24);
        for (var t = 0; t < r.length; t++)
            r[t] = util.endian(r[t]);
        return r
    },
    randomBytes: function(r) {
        for (var t = []; r > 0; r--)
            t.push(Math.floor(256 * Math.random()));
        return t
    },
    bytesToWords: function(r) {
        for (var t = [], n = 0, e = 0; n < r.length; n++,
        e += 8)
            t[e >>> 5] |= (255 & r[n]) << 24 - e % 32;
        return t
    },
    wordsToBytes: function(r) {
        for (var t = [], n = 0; n < 32 * r.length; n += 8)
            t.push(r[n >>> 5] >>> 24 - n % 32 & 255);
        return t
    },
    bytesToHex: function(r) {
        for (var t = [], n = 0; n < r.length; n++)
            t.push((r[n] >>> 4).toString(16)),
            t.push((15 & r[n]).toString(16));
        return t.join("")
    },
    hexToBytes: function(r) {
        for (var t = [], n = 0; n < r.length; n += 2)
            t.push(parseInt(r.substr(n, 2), 16));
        return t
    },
    bytesToBase64: function(r) {
        for (var t = [], n = 0; n < r.length; n += 3)
            for (var e = r[n] << 16 | r[n + 1] << 8 | r[n + 2], o = 0; o < 4; o++)
                8 * n + 6 * o <= 8 * r.length ? t.push(base64map.charAt(e >>> 6 * (3 - o) & 63)) : t.push("=");
        return t.join("")
    },
    base64ToBytes: function(r) {
        r = r.replace(/[^A-Z0-9+\/]/gi, "");
        for (var t = [], n = 0, e = 0; n < r.length; e = ++n % 4)
            0 != e && t.push((base64map.indexOf(r.charAt(n - 1)) & Math.pow(2, -2 * e + 8) - 1) << 2 * e | base64map.indexOf(r.charAt(n)) >>> 6 - 2 * e);
        return t
    }
}
  , charenc = Crypto.charenc = {}
  , UTF8 = charenc.UTF8 = {
    stringToBytes: function(r) {
        return Binary.stringToBytes(unescape(encodeURIComponent(r)))
    },
    bytesToString: function(r) {
        return decodeURIComponent(escape(Binary.bytesToString(r)))
    }
}
  , Binary = charenc.Binary = {
    stringToBytes: function(r) {
        for (var t = [], n = 0; n < r.length; n++)
            t.push(255 & r.charCodeAt(n));
        return t
    },
    bytesToString: function(r) {
        for (var t = [], n = 0; n < r.length; n++)
            t.push(String.fromCharCode(r[n]));
        return t.join("")
    }
}
  , C = Crypto
  , K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]
  , SHA256 = C.SHA256 = function(r, t) {
    var n = util.wordsToBytes(SHA256._sha256(r));
    return t && t.asBytes ? n : t && t.asString ? Binary.bytesToString(n) : util.bytesToHex(n)
}
;
SHA256._sha256 = function(r) {
    r.constructor == String && (r = UTF8.stringToBytes(r));
    var t, n, e, o, a, s, u, i, d, f = util.bytesToWords(r), c = 8 * r.length, h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], l = [];
    f[c >> 5] |= 128 << 24 - c % 32,
    f[15 + (c + 64 >> 9 << 4)] = c;
    for (var _ = 0; _ < f.length; _ += 16) {
        t = h[0],
        n = h[1],
        e = h[2],
        o = h[3],
        a = h[4],
        s = h[5],
        u = h[6],
        i = h[7];
        for (var y = 0; y < 64; y++) {
            if (y < 16)
                l[y] = f[y + _];
            else {
                var g = l[y - 15]
                  , m = l[y - 2]
                  , T = (g << 25 | g >>> 7) ^ (g << 14 | g >>> 18) ^ g >>> 3
                  , p = (m << 15 | m >>> 17) ^ (m << 13 | m >>> 19) ^ m >>> 10;
                l[y] = T + (l[y - 7] >>> 0) + p + (l[y - 16] >>> 0)
            }
            var v = t & n ^ t & e ^ n & e
              , b = (t << 30 | t >>> 2) ^ (t << 19 | t >>> 13) ^ (t << 10 | t >>> 22);
            d = (i >>> 0) + ((a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 | a >>> 25)) + (a & s ^ ~a & u) + K[y] + (l[y] >>> 0),
            i = u,
            u = s,
            s = a,
            a = o + d >>> 0,
            o = e,
            e = n,
            n = t,
            t = d + (b + v) >>> 0
        }
        h[0] += t,
        h[1] += n,
        h[2] += e,
        h[3] += o,
        h[4] += a,
        h[5] += s,
        h[6] += u,
        h[7] += i
    }
    return h
}
,
SHA256._blocksize = 16,
SHA256._digestsize = 32,
util.bytesToLWords = function(r) {
    for (var t = Array(r.length >> 2), n = 0; n < t.length; n++)
        t[n] = 0;
    for (n = 0; n < 8 * r.length; n += 8)
        t[n >> 5] |= (255 & r[n / 8]) << n % 32;
    return t
}
,
util.lWordsToBytes = function(r) {
    for (var t = [], n = 0; n < 32 * r.length; n += 8)
        t.push(r[n >> 5] >>> n % 32 & 255);
    return t
}
;
var RIPEMD160 = C.RIPEMD160 = function(r, t) {
    var n = util.lWordsToBytes(RIPEMD160._rmd160(r));
    return t && t.asBytes ? n : t && t.asString ? Binary.bytesToString(n) : util.bytesToHex(n)
}
;
RIPEMD160._rmd160 = function(r) {
    r.constructor == String && (r = UTF8.stringToBytes(r));
    var t = util.bytesToLWords(r)
      , n = 8 * r.length;
    t[n >> 5] |= 128 << n % 32,
    t[14 + (n + 64 >>> 9 << 4)] = n;
    for (var e = 1732584193, o = 4023233417, a = 2562383102, s = 271733878, u = 3285377520, i = 0; i < t.length; i += 16) {
        for (var d, f = e, c = o, h = a, l = s, _ = u, y = e, g = o, m = a, T = s, p = u, v = 0; v <= 79; ++v)
            d = safe_add(bit_rol(d = safe_add(d = safe_add(d = safe_add(f, rmd160_f(v, c, h, l)), t[i + rmd160_r1[v]]), rmd160_K1(v)), rmd160_s1[v]), _),
            f = _,
            _ = l,
            l = bit_rol(h, 10),
            h = c,
            c = d,
            d = safe_add(bit_rol(d = safe_add(d = safe_add(d = safe_add(y, rmd160_f(79 - v, g, m, T)), t[i + rmd160_r2[v]]), rmd160_K2(v)), rmd160_s2[v]), p),
            y = p,
            p = T,
            T = bit_rol(m, 10),
            m = g,
            g = d;
        d = safe_add(o, safe_add(h, T)),
        o = safe_add(a, safe_add(l, p)),
        a = safe_add(s, safe_add(_, y)),
        s = safe_add(u, safe_add(f, g)),
        u = safe_add(e, safe_add(c, m)),
        e = d
    }
    return [e, o, a, s, u]
}
;
var rmd160_r1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]
  , rmd160_r2 = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]
  , rmd160_s1 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]
  , rmd160_s2 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
