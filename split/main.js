
(function()
{
var randomnessCanvasResizerFunction;
var randomnessBytes = undefined;

var BN = window["BN"];

var hour = new Date().getHours();
var darkMode = hour < 7 || hour > 18;

var isTestnet = window.location.search == "?testnet";
if (isTestnet)
    document.getElementById("testnet_text").style.display = "";

function setDarkMode(isDark)
{
    darkMode = isDark;
    document.body.className = isDark ? "dark" : "light";
}

window.addEventListener("load", function()
{
    var newLink = document.createElement("link");
    newLink.rel = "shortcut icon";
    newLink.type = "image/png";
    newLink.href = "data:image/png;base64,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";
    document.getElementsByTagName("head")[0].appendChild(newLink);
    
    document.getElementById("view_address_privkey_textbox").addEventListener("keydown", function(event)
    {
        if (event.keyCode === 13)
        {
            event.preventDefault();
            view_address_details();
        }
    });
    
    document.getElementById("view_address_bip38_password_textbox").addEventListener("keydown", function(event)
    {
        if (event.keyCode === 13)
        {
            event.preventDefault();
            bip38decrypt_button();
        }
    });
    
    document.getElementById("bulk_count").addEventListener("keydown", function(event)
    {
        if (event.keyCode === 13)
        {
            event.preventDefault();
            bulk_generate();
        }
    });
    
    bulkTextarea = document.getElementById("bulk_addresses");
    paperWalletTextArea = document.getElementById("paperwallet_generate_progress_text");
    
    
    document.getElementById("randomness_overlay2").style.display = "table";
    var randomnessCanvas = document.getElementById("randomness_canvas");
    var ctx = randomnessCanvas.getContext("2d");
    var randomnessText = document.getElementById("randomness_div");
    
    randomnessCanvasResizerFunction = function()
    {
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        var canvasWidth = width * 0.7;
        var canvasHeight = height * 0.6;
        
        var imageData = undefined;
        if (randomnessCanvas.width > 0 && randomnessCanvas.height > 0)
            imageData = ctx.getImageData(0, 0, randomnessCanvas.width, randomnessCanvas.height);
        
        var prevFillStyle = ctx.fillStyle;
        
        randomnessCanvas.width = canvasWidth;
        randomnessCanvas.height = canvasHeight;
        randomnessCanvas.style.left = (width / 2 - canvasWidth / 2) + "px";
        randomnessCanvas.style.top = (height / 2 - canvasHeight / 1.5) + "px";
        
        ctx.fillStyle = darkMode ? "#323639" : "#ffffff";
        ctx.fillRect(0, 0, randomnessCanvas.width, randomnessCanvas.height);
        ctx.fillStyle = prevFillStyle;
        
        if (imageData !== undefined)
            ctx.putImageData(imageData, 0, 0);
        
        randomnessText.style.left = (width / 2 - randomnessText.clientWidth / 2) + "px";
        randomnessText.style.top = (height / 2 - canvasHeight / 1.5) + "px";
        
        var randomnessContainer = document.getElementById("randomness_container");
        randomnessContainer.style.width = canvasWidth + "px";
        randomnessContainer.style.left = (width / 2 - canvasWidth / 2) + "px";
        randomnessContainer.style.top = (height / 2 + canvasHeight / 3 + 10) + "px";
    }
    
    window.addEventListener("resize", randomnessCanvasResizerFunction);
    randomnessCanvasResizerFunction();
    
    ctx.fillStyle = darkMode ? "#323639" : "#ffffff";
    ctx.fillRect(0, 0, randomnessCanvas.width, randomnessCanvas.height);
    var tempRandomnessBytes = [];
    var randomnessIndex = 0;
    var randomnessMax = 1000;
    randomnessCanvas.onmousemove = function(e)
    {
        if (randomnessIndex > randomnessMax)
        {
            window.removeEventListener("resize", randomnessCanvasResizerFunction);
            
            randomnessBytes = [];
            randomnessBytes.push.apply(randomnessBytes, crypto.getRandomValues(new Uint32Array(32)));
            randomnessBytes.push.apply(randomnessBytes, tempRandomnessBytes);
            randomnessCanvas.onmousemove = null;
            randomnessIndex = 0;
            tempRandomnessBytes = undefined;
            generate_address();
            document.getElementById("randomness_overlay").style.display = "none";
            return;
        }
        
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        //randomnessCanvas.fillRect(x - 3, y - 3, 6, 6);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 6.3);
        ctx.fill();
        randomnessText.innerHTML = "Move your mouse around here for randomness<br />" + Math.floor(randomnessIndex / randomnessMax * 100) + "%";
        
        tempRandomnessBytes[randomnessIndex++] = e.clientX + e.clientY * document.documentElement.clientWidth;
    };
    
    ctx.fillStyle = "#5b96f7";
    
    
    if (window.location.protocol !== "file:")
    {
        var warningText = document.createElement("div");
        warningText.innerHTML = "Warning: it seems you're running this generator from a live website. For valuable wallets, it is highly recommended to run the site from an offline computer. You can save this website by pressing CTRL-S or right click -> Save website (or something)<br /><br /><div class=\"linkStyle\" onclick=\"document.getElementById('warning_text').innerHTML=''\">Hide warning</div>";
        warningText.style.cssText = "font-size: 21px; color: #ff0000; margin-top: 30px;";
        warningText.id = "warning_text";
        document.getElementById("button_container").appendChild(warningText);
    }
    
    layoutPrintAreas = 
    {
        "generate":
        {
            "address_div": "print_visible",
        },
        "details":
        {
            "view_address_div": "print_visible",
        },
        "bulk":
        {
            "bulk_addresses": "print_visible",
        },
        "paper":
        {
            "paperwallet_canvas_print_container": "print_container",
            "paperwallet_print_area": "print_visible",
        },
        "info":
        {
            "main_info": "print_visible",
        },
    };
    
    currentLayout = "generate";
    
    setDarkMode(darkMode);
});

// secp256k1 parameters
var ecc_p =  new BN("0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16);
var ecc_a =  new BN(0);
var ecc_b =  new BN(7);
var ecc_Gx = new BN("079BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", 16);
var ecc_Gy = new BN("0483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", 16);
var ecc_n =  new BN("0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16);

var bn_0 = new BN(0);
var bn_1 = new BN(1);
var bn_2 = new BN(2);
var bn_3 = new BN(3);
var bn_58 = new BN(58);
var bn_255 = new BN(255);

function modinv(a, n)
{
    var lm = new BN(1);
    var hm = new BN(0);
    var low = a.mod(n);
    var high = n;
    var ratio;
    var nm;
    var nnew;

    while (low.isNeg())
        low = low.add(n);

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

function ecAdd(ax, ay, bx, by)
{
    var lambda = ((by.sub(ay)).mul(modinv(bx.sub(ax), ecc_p))).mod(ecc_p);
    var x = (lambda.mul(lambda).sub(ax).sub(bx)).mod(ecc_p);
    var y = (lambda.mul(ax.sub(x)).sub(ay)).mod(ecc_p);
    return [x, y];
}

function ecDouble(ax, ay)
{
    var lambda = ((bn_3.mul(ax).mul(ax).add(ecc_a)).mul(modinv(bn_2.mul(ay), ecc_p))).mod(ecc_p);
    var x = (lambda.mul(lambda).sub(bn_2.mul(ax))).mod(ecc_p);
    var y = (lambda.mul(ax.sub(x)).sub(ay)).mod(ecc_p);
    return [x, y];
}

// convert bigint to bool array (bits)
function bigintToBoolArray(bigint)
{
    if (bigint.isNeg())
        return [false];
    
    var values = [];
    while (bigint.gt(bn_0))
    {
        values.push(bigint.isOdd());
        bigint = bigint.shrn(1);
    }
    return values.reverse();
}

function EccMultiply(gx, gy, scalar)
{
    var qx = gx;
    var qy = gy;
    
    var bits = bigintToBoolArray(scalar);
    for (var i = 1; i < bits.length; ++i)
    {
        var ret = ecDouble(qx, qy);
        qx = ret[0];
        qy = ret[1];
        if (bits[i])
        {
            var ret2 = ecAdd(qx, qy, gx, gy);
            qx = ret2[0];
            qy = ret2[1];
        }
    }
    
    while (qy.isNeg())
        qy = qy.add(ecc_p);
    
    return [qx, qy];
}

// convert bigint to byte array (uint8)
function bigintToByteArray(bigint)
{
    var ret = [];
    
    while (bigint.gt(bn_0))
    {
        ret.push(bigint.and(bn_255).toNumber());
        bigint = bigint.shrn(8);
    }
    
    return ret;
}

function byteArrayToBigint(bytes)
{
    var bigint = new BN(0);
    for (var i = 0; i < bytes.length; ++i)
    {
        bigint = bigint.shln(8);
        bigint = bigint.or(new BN(bytes[i]));
    }
    
    return bigint;
}

function byteArrayXOR(b1, b2)
{
    var ret = [];
    for (var i = 0; i < b1.length; ++i)
        ret.push(b1[i] ^ b2[i]);
    
    return ret;
}

function skipRandomness()
{
    document.getElementById("randomness_overlay").style.display = "none";
    window.removeEventListener("resize", randomnessCanvasResizerFunction);
    generate_address();
}

function get32SecureRandomBytes()
{
    if (randomnessBytes !== undefined)
    {
        var tempArray = [];
        tempArray.push.apply(tempArray, window.crypto.getRandomValues(new Uint8Array(8)));
        tempArray.push.apply(tempArray, randomnessBytes);
        
        var tempArray2 = SHA256(tempArray, { asBytes: true });
        tempArray2.push.apply(tempArray2, window.crypto.getRandomValues(new Uint8Array(8)));
        
        return SHA256(tempArray2, { asBytes: true });
    }
    
    return window.crypto.getRandomValues(new Uint8Array(32));
}

function showBip38Info()
{
    document.getElementById("bip38_info").style.display = "table";
}

function bip38changed(event, layout)
{
    var element;
    switch (layout)
    {
        case "bulk":
            element = "bip38_password_box_div_bulk";
            break;
        case "paper":
            element = "bip38_password_box_div_paper";
            var customPaperWalletDummyPrivkey = document.getElementById("paperwallet_custom_preview_privkey");
            if (customPaperWalletDummyPrivkey)
            {
                var lineLength = Number(document.getElementById("paperwallet_custom_privkey_length").value);
                if (isNaN(lineLength) || lineLength < 0)
                    lineLength = 0;
                
                customPaperWalletDummyPrivkey.innerHTML = splitTextLength((event.target.checked) ? "6Pnabcdefghijkmnopqrstuvwxyz1234567ABCDEFGHJKLMNPQRSTUVXYZ" : "K1abcdefghijkmnopqrstuvwxyzabcdefghijkmnopqrstuvwxyz", lineLength);
            }
            
            break;
        default:
            return;
    }
    
    document.getElementById(element).style.display = event.target.checked ? "table" : "none";
    
}

var bip38generate_type = "bech32";
var bip38generate_maxcount = 0;
var bip38generate_currentcount = 0;
var bip38generate_data = undefined;
var bip38generate_callback = undefined;
var bip38generate_progress = undefined;
var bip38generate_keypair = undefined;
var bip38generate_passpoint = undefined;
var bip38generate_ownersalt = undefined;
function bip38generate(password, count, type, progress, callback)
{
    if (!password || password == "")
    {
        callback("Password must not be empty");
        return;
    }

    var ownersalt = get32SecureRandomBytes().slice(0, 8);
    
    var passfactor = scrypt(password, ownersalt, 14, 8, 8, 32, "binary");

    var bigint = byteArrayToBigint(passfactor);

    var keypair = EccMultiply(ecc_Gx, ecc_Gy, bigint);
    var bytes_public_x = bigintToByteArray(keypair[0]);
    while (bytes_public_x.length < 32)
        bytes_public_x.push(0);
    
    var passpoint = [];
    passpoint.push.apply(passpoint, bytes_public_x);
    
    if (keypair[1].isOdd())
        passpoint.push(0x03);
    else
        passpoint.push(0x02);
        
    passpoint.reverse();
    
    /*
    var magic_bytes = [0x2C, 0xE9, 0xB3, 0xE1, 0xFF, 0x39, 0xE2, 0x53];
    var intermediate = [];
    intermediate.push.apply(intermediate, magic_bytes);
    intermediate.push.apply(intermediate, ownersalt);
    intermediate.push.apply(intermediate, passpoint);
    var checksum = SHA256(SHA256(intermediate, { asBytes: true }), { asBytes: true }).slice(0, 4);
    intermediate.push.apply(intermediate, checksum);
    */
    
    bip38generate_data = new Array(count);
    bip38generate_type = type;
    bip38generate_currentcount = 0;
    bip38generate_maxcount = count;
    bip38generate_callback = callback;
    bip38generate_progress = progress;
    bip38generate_keypair = keypair;
    bip38generate_passpoint = passpoint;
    bip38generate_ownersalt = ownersalt;
    setImmediate(bip38generate_timeout);
}

function bip38generate_timeout()
{
    if (bip38generate_currentcount < bip38generate_maxcount)
    {
        var seedb = get32SecureRandomBytes().slice(0, 24);
        
        var factorb = SHA256(SHA256(seedb, { asBytes: true }), { asBytes: true });
        
        var ecpoint = EccMultiply(bip38generate_keypair[0], bip38generate_keypair[1], byteArrayToBigint(factorb));
        var generatedaddress = makeAddress(ecpoint);
        var address_with_type;
        switch (bip38generate_type)
        {
            case "segwit":
                address_with_type = makeSegwitAddress(ecpoint);
                break;
            case "bech32":
                address_with_type = makeBech32Address(ecpoint);
                break;
            case "legacy":
                address_with_type = generatedaddress;
                break;
        }
        var addresshash = SHA256(SHA256(generatedaddress, { asBytes: true }), { asBytes: true }).slice(0, 4);
        
        var salt = [];
        salt.push.apply(salt, addresshash);
        salt.push.apply(salt, bip38generate_ownersalt);
        
        var encrypted = scrypt(bip38generate_passpoint, salt, 10, 1, 1, 64, "binary");
        var derivedhalf1 = encrypted.slice(0, 32);
        var derivedhalf2 = encrypted.slice(32, 64);
        
        var AES_opts = { mode: new Crypto.mode.ECB(Crypto.pad.NoPadding), asBytes: true };
        var encryptedpart1 = Crypto.AES.encrypt(byteArrayXOR(seedb.slice(0, 16), derivedhalf1.slice(0, 16)), derivedhalf2, AES_opts);
        
        var block2 = [];
        block2.push.apply(block2, encryptedpart1.slice(8, 16));
        block2.push.apply(block2, seedb.slice(16, 24));
        var encryptedpart2 = Crypto.AES.encrypt(byteArrayXOR(block2, derivedhalf1.slice(16, 32)), derivedhalf2, AES_opts);
        
        var finalprivkey = [0x01, 0x43, 0x20];
        finalprivkey.push.apply(finalprivkey, addresshash);
        finalprivkey.push.apply(finalprivkey, bip38generate_ownersalt);
        finalprivkey.push.apply(finalprivkey, encryptedpart1.slice(0, 8));
        finalprivkey.push.apply(finalprivkey, encryptedpart2);
        finalprivkey.push.apply(finalprivkey, SHA256(SHA256(finalprivkey, { asBytes: true }), { asBytes: true }).slice(0, 4));
        
        bip38generate_data[bip38generate_currentcount] = [address_with_type, base58encode(finalprivkey)];
        /*"" + (bip38generate_currentcount + 1) + ", \"" + address_with_type + "\", \"" + base58encode(finalprivkey) + "\"";*/
        ++bip38generate_currentcount;
        
        bip38generate_progress(bip38generate_currentcount, bip38generate_maxcount);
        setImmediate(bip38generate_timeout);
    }
    else
    {
        bip38generate_currentcount = 0;
        bip38generate_maxcount = 0;
        bip38generate_keypair = undefined;
        bip38generate_passpoint = undefined;
        bip38generate_ownersalt = undefined;
        bip38generate_callback(bip38generate_data);
        bip38generate_callback = undefined;
        bip38generate_progress = undefined;
        bip38generate_data = undefined;
    }
}

function bip38decrypt_button()
{
    document.getElementById("view_address_information").innerHTML = "Decrypting...";
    window.setTimeout(function()
    {
        var privkey = document.getElementById("view_address_privkey_textbox").value;
        var password = document.getElementById("view_address_bip38_password_textbox").value;
        var result = bip38decrypt(privkey, password);
        
        if (typeof result == "string")
        {
            document.getElementById("view_address_information").innerHTML = "Cannot decrypt address (" + result + ")";
            document.getElementById("view_address_segwitaddress").innerHTML = "";
            document.getElementById("view_address_bech32address").innerHTML = "";
            document.getElementById("view_address_legacyaddress").innerHTML = "";
            document.getElementById("view_address_segwitaddress_qr").innerHTML = "";
            document.getElementById("view_address_bech32address_qr").innerHTML = "";
            document.getElementById("view_address_legacyaddress_qr").innerHTML = "";
            document.getElementById("view_address_container").style.cssText = "display: none;";
            return;
        }
        
        var result2 = view_address_details_result(result[1]);
        if (typeof result2 == "string")
        {
            document.getElementById("view_address_information").innerHTML = "Error decoding private key (" + result + ")";
            document.getElementById("view_address_segwitaddress").innerHTML = "";
            document.getElementById("view_address_bech32address").innerHTML = "";
            document.getElementById("view_address_legacyaddress").innerHTML = "";
            document.getElementById("view_address_segwitaddress_qr").innerHTML = "";
            document.getElementById("view_address_bech32address_qr").innerHTML = "";
            document.getElementById("view_address_legacyaddress_qr").innerHTML = "";
            document.getElementById("view_address_container").style.cssText = "display: none;";
            return;
        }
        
        document.getElementById("view_address_information").innerHTML = "Details for encrypted private key: <strong>" + privkey + "</strong><br /><br />Decrypted private key: <strong>" + result[1] + "</strong>";
        
        
        document.getElementById("view_address_segwitaddress").innerHTML = "Segwit address: " + result2[0];
        document.getElementById("view_address_bech32address").innerHTML = "Segwit (bech32) address: " + result2[1];
        document.getElementById("view_address_legacyaddress").innerHTML = "Legacy address: " + result2[2];
        
        var qr = qrcode(0, qrErrorCorrectionLevel);
        qr.addData(result2[0]);
        qr.make();
        document.getElementById("view_address_segwitaddress_qr").innerHTML = qr.createImgTag(4, 8);
        
        qr = qrcode(0, qrErrorCorrectionLevel);
        qr.addData(result2[1].toUpperCase(), "Alphanumeric");
        qr.make();
        document.getElementById("view_address_bech32address_qr").innerHTML = qr.createImgTag(4, 8);
        
        qr = qrcode(0, qrErrorCorrectionLevel);
        qr.addData(result2[2]);
        qr.make();
        document.getElementById("view_address_legacyaddress_qr").innerHTML = qr.createImgTag(4, 8);
        
        document.getElementById("view_address_container").style.cssText = "display: table; border: 2px solid #bbbbbb; border-radius: 3px;";
    }, 50);
}

function bip38decrypt(privkey, password)
{
    if (!password || password == "")
        return "password must not be empty";
    
    var newstring = privkey.split('').reverse().join('');
    for (var i = 0; i < privkey.length; ++i)
    {
        if (privkey[i] == base58Characters[0])
            newstring = newstring.substr(0, newstring.length - 1);
        else
            break;
    }

    var bigint = new BN(0);
    for (var i = newstring.length - 1; i >= 0; --i)
        bigint = bigint.mul(bn_58).add(new BN(base58CharsIndices[newstring[i]]));
    
    var bytes = bigintToByteArray(bigint);
    
    if (bytes.length != 43)
        return "invalid length";
    
    bytes.reverse();
    
    var checksum = bytes.slice(bytes.length - 4, bytes.length);
    bytes.splice(bytes.length - 4, 4);
    var sha_result = SHA256(SHA256(bytes, { asBytes: true }), { asBytes: true });
    
    for (var i = 0; i < 4; ++i)
    {
        if (sha_result[i] != checksum[i])
            return "invalid checksum";
    }
    
    bytes.shift();
    
    var AES_opts = { mode: new Crypto.mode.ECB(Crypto.pad.NoPadding), asBytes: true };
    
    if (bytes[0] == 0x43)
    {
        if ((bytes[1] & 0x20) == 0)
            return "only compressed private keys are supported";
        
        if (typeof password == "number")
            return 1; // dummy return value, only for checking if the private key is in the correct format
        
        var ownersalt = bytes.slice(6, 14);
        var scrypt_result = scrypt(password, ownersalt, 14, 8, 8, 32, "binary");
        var bigint2 = byteArrayToBigint(scrypt_result);
        var keypair = getECCKeypair(bigint2);
        
        var bytes_public_x = bigintToByteArray(keypair[0]);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);
        
        var passpoint = [];
        passpoint.push.apply(passpoint, bytes_public_x);
        
        if (keypair[1].isOdd())
            passpoint.push(0x03);
        else
            passpoint.push(0x02);
            
        passpoint.reverse();
        var encryptedpart2 = bytes.slice(22, 38);
        var addresshash = bytes.slice(2, 14);
        var scrypt_result_2 = scrypt(passpoint, addresshash, 10, 1, 1, 64, "binary");
        
        var derivedhalf1 = scrypt_result_2.slice(0, 32);
        var derivedhalf2 = scrypt_result_2.slice(32, 64);
        
        var decrypted2 = Crypto.AES.decrypt(encryptedpart2, derivedhalf2, AES_opts);
        
        var encryptedpart1 = bytes.slice(14, 22);
        encryptedpart1.push.apply(encryptedpart1, byteArrayXOR(decrypted2.slice(0, 8), scrypt_result_2.slice(16, 24)));
        var decrypted1 = Crypto.AES.decrypt(encryptedpart1, derivedhalf2, AES_opts);
        var seedb = byteArrayXOR(decrypted1.slice(0, 16), derivedhalf1.slice(0, 16));
        seedb.push.apply(seedb, byteArrayXOR(decrypted2.slice(8, 16), derivedhalf1.slice(24, 32)));
        var factorb = SHA256(SHA256(seedb, { asBytes: true }), { asBytes: true });
        
        var finalprivkeybigint = byteArrayToBigint(scrypt_result).mul(byteArrayToBigint(factorb)).mod(ecc_n);
        
        var finalkeypair = getECCKeypair(finalprivkeybigint);
        var finaladdress = makeAddress(finalkeypair);
        var finaladdresshash = SHA256(SHA256(finaladdress, { asBytes: true }), { asBytes: true });
        
        for (var i = 0; i < 4; ++i)
        {
            if (addresshash[i] != finaladdresshash[i])
                return "invalid password";
        }
        
        var finalprivkey = makePrivateKey(finalprivkeybigint);
        
        return [finaladdress, finalprivkey];
    }
    else if (bytes[0] == 0x42)
        return "only EC multiplied key decryption is supported";
    else
        return "invalid byte at EC multiply flag";
}

var base58Characters = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var base58CharsIndices = 
{
    '1': 0, '2': 1, '3': 2, '4': 3,
    '5': 4, '6': 5, '7': 6, '8': 7,
    '9': 8, 'A': 9, 'B': 10, 'C': 11,
    'D': 12, 'E': 13, 'F': 14, 'G': 15,
    'H': 16, 'J': 17, 'K': 18, 'L': 19,
    'M': 20, 'N': 21, 'P': 22, 'Q': 23,
    'R': 24, 'S': 25, 'T': 26, 'U': 27,
    'V': 28, 'W': 29, 'X': 30, 'Y': 31,
    'Z': 32, 'a': 33, 'b': 34, 'c': 35,
    'd': 36, 'e': 37, 'f': 38, 'g': 39,
    'h': 40, 'i': 41, 'j': 42, 'k': 43,
    'm': 44, 'n': 45, 'o': 46, 'p': 47,
    'q': 48, 'r': 49, 's': 50, 't': 51,
    'u': 52, 'v': 53, 'w': 54, 'x': 55,
    'y': 56, 'z': 57,
}

function base58encode(bytes)
{
    var leading_zeroes = 0;
    while (bytes[leading_zeroes] == 0) // count leading zeroes
        ++leading_zeroes;
    
    var bigint = new BN(0);
    // convert bytes to bigint
    for (var i = 0; i < bytes.length; ++i)
    {
        bigint = bigint.shln(8);
        bigint = bigint.or(new BN(bytes[i]));
    }
    
    bytes.reverse();
    
    var ret = "";
    while (bigint.gt(bn_0))
    {
        // get base58 character
        var remainder = bigint.mod(bn_58);
        bigint = bigint.div(bn_58);
        ret += base58Characters[remainder.toNumber()];
    }
    
    for (var i = 0; i < leading_zeroes; ++i) // add padding if necessary
        ret += base58Characters[0];
    
    return ret.split("").reverse().join("");
}

// get ECC public key from bigint
function getECCKeypair(val)
{
    if (val.isZero() || val.gte(ecc_n))
    {
        console.log("invalid value");
        return;
    }
    
    return EccMultiply(ecc_Gx, ecc_Gy, val);
}

// make legacy address from public key
function makeAddress(keypair)
{
    var key_bytes = [];
    
    var bytes_public_x = bigintToByteArray(keypair[0]);
    while (bytes_public_x.length < 32)
        bytes_public_x.push(0);
    
    key_bytes.push.apply(key_bytes, bytes_public_x);
    
    if (keypair[1].isOdd())
        key_bytes.push(0x03);
    else
        key_bytes.push(0x02);
            
    key_bytes.reverse();
    var sha_result_1 = SHA256(key_bytes, { asBytes: true });
    var ripemd_result_2 = RIPEMD160(sha_result_1, { asBytes: true });
    var ripemd_extended = [isTestnet ? 0x6F : 0x00];
    ripemd_extended.push.apply(ripemd_extended, ripemd_result_2);
    var sha_result_3 = SHA256(ripemd_extended, { asBytes: true });
    var sha_result_4 = SHA256(sha_result_3, { asBytes: true });
    ripemd_extended.push.apply(ripemd_extended, sha_result_4.slice(0, 4));
        
    return base58encode(ripemd_extended);
}

// make segwit address from public key
function makeSegwitAddress(keypair)
{
    var key_bytes = [];
    
    var bytes_public_x = bigintToByteArray(keypair[0]);
    while (bytes_public_x.length < 32)
        bytes_public_x.push(0);
    
    key_bytes.push.apply(key_bytes, bytes_public_x);
    
    if (keypair[1].isOdd())
        key_bytes.push(0x03);
    else
        key_bytes.push(0x02);
    
    key_bytes.reverse();
    var sha_result_1 = SHA256(key_bytes, { asBytes: true });
    var keyhash = RIPEMD160(sha_result_1, { asBytes: true });
    
    var redeemscript = [0x00, 0x14];
    redeemscript.push.apply(redeemscript, keyhash);
    
    var redeemscripthash = [isTestnet ? 0xC4 : 0x05];
    redeemscripthash.push.apply(redeemscripthash, RIPEMD160(SHA256(redeemscript, { asBytes: true }), { asBytes: true }));
    
    redeemscripthash.push.apply(redeemscripthash, SHA256(SHA256(redeemscripthash, { asBytes: true }), { asBytes: true }).slice(0, 4));
    
    return base58encode(redeemscripthash);
}


var bech32Chars = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

function bech32HrpExpand(hrp)
{
    var ret = [];
    for (var i = 0; i < hrp.length; ++i)
        ret.push(hrp.charCodeAt(i) >> 5);

    ret.push(0);

    for (var i = 0; i < hrp.length; ++i)
        ret.push(hrp.charCodeAt(i) & 0x1f);

    return ret;
}

function bech32Polymod(values)
{
    var GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    var chk = 1;

    for (var i = 0; i < values.length; ++i)
    {
        var b = chk >> 25;
        chk = ((chk & 0x1ffffff) << 5) ^ values[i];

        for (var j = 0; j < 5; ++j)
        {
            if ((b >> j) & 1)
                chk ^= GEN[j];
        }
    }

    return chk;
}

function bech32CreateChecksum(hrp, data)
{
    var asd = bech32HrpExpand(hrp);
    asd.push.apply(asd, data);
    asd.push.apply(asd, [0, 0, 0, 0, 0, 0]);

    var polymod = bech32Polymod(asd) ^ 1;

    var ret = [];
    for (var i = 0; i < 6; ++i)
        ret.push((polymod >> 5 * (5 - i)) & 31);

    return ret;
}

// create bech32 address from public key
function makeBech32Address(keypair)
{
    var key_bytes = [];
    
    var bytes_public_x = bigintToByteArray(keypair[0]);
    while (bytes_public_x.length < 32)
        bytes_public_x.push(0);
    key_bytes.push.apply(key_bytes, bytes_public_x);
    
    if (keypair[1].isOdd())
        key_bytes.push(0x03);
    else
        key_bytes.push(0x02);
    
    key_bytes.reverse();
    var sha_result_1 = SHA256(key_bytes, { asBytes: true });
    var keyhash = RIPEMD160(sha_result_1, { asBytes: true });
    
    var redeemscript = [0x00, 0x14];
    redeemscript.push.apply(redeemscript, keyhash);
    
    var value = 0;
    var bits = 0;

    var result = [0];
    for (var i = 0; i < 20; ++i)
    {
        value = ((value << 8) | keyhash[i]) & 0xFFFFFF;
        bits += 8;

        while (bits >= 5)
        {
            bits -= 5;
            result.push((value >> bits) & 0x1F);
        }
    }
    
    var address = isTestnet ? "tb1" : "bc1";
    for (var i = 0; i < result.length; ++i)
        address += bech32Chars[result[i]];

    var checksum = bech32CreateChecksum(isTestnet ? "tb" : "bc", result);
    for (var i = 0; i < checksum.length; ++i)
        address += bech32Chars[checksum[i]];

    return address;
}

// create base58 encoded private key from bigint
function makePrivateKey(bigint)
{
    var privkey = [];
    privkey.push(0x01);
    
    var temp = bigintToByteArray(bigint);
    while (temp.length < 32)
        temp.push(0);
    
    privkey.push.apply(privkey, temp);
    privkey.push(isTestnet ? 0xEF : 0x80);
    privkey.reverse();
    privkey.push.apply(privkey, SHA256(SHA256(privkey, { asBytes: true }), { asBytes: true }).slice(0, 4));
    return base58encode(privkey);
}

var addressType = "bech32";
// set generated address type (single address)
function setAddressType(type)
{
    addressType = type;
}

var qrErrorCorrectionLevel = "H";
// set qr code error correction level (single address)
function setQRErrorCorrectionLevel(level)
{
    qrErrorCorrectionLevel = level;
    
    // update qr codes
    var privkey = document.getElementById("privkey_privkey").innerHTML;
    var qr = qrcode(0, qrErrorCorrectionLevel);
    qr.addData(privkey);
    qr.make();
    
    document.getElementById("privkey_qr").src = qr.createDataURL(6, 12);
    
    var address = document.getElementById("address_address").innerHTML;
    qr = qrcode(0, qrErrorCorrectionLevel);
    if (addressType == "bech32")
        qr.addData(address.toUpperCase(), "Alphanumeric");
    else
        qr.addData(address);
    
    qr.make();
    
    document.getElementById("address_qr").src = qr.createDataURL(6, 12);
}

// generate one address (single address)
function generate_address()
{
    var bytes = get32SecureRandomBytes();
    
    var result = generate_address_result(bytes, addressType, true, qrErrorCorrectionLevel);
    document.getElementById("privkey_privkey").innerHTML = result[0];
    var qr_div_privkey = document.getElementById("privkey_qr");
    qr_div_privkey.src = result[1].createDataURL(6, 12);
    qr_div_privkey.style.cssText = "display:block; margin-left: auto; margin-right: auto;";
    
    document.getElementById("address_address").innerHTML = result[3];
    
    var qr_div_address = document.getElementById("address_qr");
    qr_div_address.src = result[4].createDataURL(6, 12);
    qr_div_address.style.cssText = "display:block; margin-left: auto; margin-right: auto;";
    
    document.getElementById("address_div").style.cssText = "display: table;";
}

// generates address from bytes, then returns the address and qr code if necessary
function generate_address_result(bytes, type, generateQR, paramQRErrorCorrectionLevel)
{
    var bigint = new BN(0);
    for (var j = 0; j < bytes.length; ++j)
    {
        bigint = bigint.shln(8);
        bigint = bigint.or(new BN(bytes[j]));
    }
    
    var keypair = getECCKeypair(bigint);
    var privkey = makePrivateKey(bigint);
    
    var address;
    var return_address_type;
    switch (type)
    {
        case "segwit":
            return_address_type = "Segwit address:";
            address = makeSegwitAddress(keypair);
            break;
        case "bech32":
            return_address_type = "Segwit (bech32) address:";
            address = makeBech32Address(keypair);
            break;
        case "legacy":
            return_address_type = "Legacy address:";
            address = makeAddress(keypair);
            break;
    }
    
    if (generateQR)
    {
        var qr = qrcode(0, paramQRErrorCorrectionLevel);
        qr.addData(privkey);
        qr.make();
        var return_privkey_qr = qr;
        
        qr = qrcode(0, paramQRErrorCorrectionLevel);
        if (type == "bech32")
            qr.addData(address.toUpperCase(), "Alphanumeric");
        else
            qr.addData(address);
        
        qr.make();
        var return_address_qr = qr;
        
        return [privkey, return_privkey_qr, return_address_type, address, return_address_qr];
    }
    return [privkey, return_address_type, address];
}

var bulkTextarea;
var paperWalletTextArea;

// returns addresses generated from the private key
function view_address_details_result(privkey)
{
    if (privkey.length == 58 && privkey[0] == "6" && privkey[1] == "P")
    {
        // maybe a bip38 encrypted key
        var bip38_result = bip38decrypt(privkey, 1);
        if (bip38_result === 1)
        {
            document.getElementById("bip38_decrypt_div").style.display = "block";
            return 1;
        }
        else if (typeof bip38_result == "string")
            return bip38_result;
        else
            document.getElementById("bip38_decrypt_div").style.display = "none";
    }
    else
        document.getElementById("bip38_decrypt_div").style.display = "none";
    
    var newstring = privkey.split("").reverse().join("");
    for (var i = 0; i < privkey.length; ++i)
    {
        if (privkey[i] == base58Characters[0])
            newstring = newstring.substr(0, newstring.length - 1);
        else
            break;
    }

    var bigint = new BN(0);
    for (var i = newstring.length - 1; i >= 0; --i)
        bigint = bigint.mul(bn_58).add(new BN(base58CharsIndices[newstring[i]]));
    
    var bytes = bigintToByteArray(bigint);
    if (bytes[bytes.length - 1] == 0)
        bytes.pop();
    
    bytes.reverse();
    
    var checksum = bytes.slice(bytes.length - 4, bytes.length);
    bytes.splice(bytes.length - 4, 4);
    var sha_result = SHA256(SHA256(bytes, { asBytes: true }), { asBytes: true });
    
    for (var i = 0; i < 4; ++i)
    {
        if (sha_result[i] != checksum[i])
            return "invalid checksum";
    }
    
    if (bytes.pop() != 1)
        return "only compressed private keys are supported, they start with 'L' or 'K'";
    
    bytes.reverse();
    bytes.pop();
    
    if (bytes.length != 32)
        return "invalid length";
    
    bigint = new BN(0);
    for (var j = bytes.length - 1; j >= 0; --j)
    {
        bigint = bigint.shln(8);
        bigint = bigint.or(new BN(bytes[j]));
    }
    
    var keypair = getECCKeypair(bigint);
    
    var privkey2 = makePrivateKey(bigint);
    if (privkey != privkey2)
        return "cannot decode private key";
    
    return [makeSegwitAddress(keypair), makeBech32Address(keypair), makeAddress(keypair)];
}

// shows addresses generated from the given private key
function view_address_details()
{
    var privkey = document.getElementById("view_address_privkey_textbox").value.trim();
    if (privkey == "")
        return;
    
    var result = view_address_details_result(privkey);
    if (typeof result == "string")
    {
        document.getElementById("view_address_information").innerHTML = "Invalid private key (" + result + ")";
        document.getElementById("view_address_segwitaddress").innerHTML = "";
        document.getElementById("view_address_bech32address").innerHTML = "";
        document.getElementById("view_address_legacyaddress").innerHTML = "";
        document.getElementById("view_address_segwitaddress_qr").innerHTML = "";
        document.getElementById("view_address_bech32address_qr").innerHTML = "";
        document.getElementById("view_address_legacyaddress_qr").innerHTML = "";
        document.getElementById("view_address_container").style.cssText = "display: none;";
        return;
    }
    else if (typeof result == "number" && result == 1)
    {
        //bip38 encrypted
        document.getElementById("view_address_information").innerHTML = "";
        document.getElementById("view_address_segwitaddress").innerHTML = "";
        document.getElementById("view_address_bech32address").innerHTML = "";
        document.getElementById("view_address_legacyaddress").innerHTML = "";
        document.getElementById("view_address_segwitaddress_qr").innerHTML = "";
        document.getElementById("view_address_bech32address_qr").innerHTML = "";
        document.getElementById("view_address_legacyaddress_qr").innerHTML = "";
        document.getElementById("view_address_container").style.cssText = "display: none;";
        return;
    }
    
    document.getElementById("view_address_information").innerHTML = "Details for private key: <strong>" + privkey + "</strong>";
    document.getElementById("view_address_segwitaddress").innerHTML = "Segwit address: " + result[0];
    document.getElementById("view_address_bech32address").innerHTML = "Segwit (bech32) address: " + result[1];
    document.getElementById("view_address_legacyaddress").innerHTML = "Legacy address: " + result[2];
    
    var qr = qrcode(0, qrErrorCorrectionLevel);
    qr.addData(result[0]);
    qr.make();
    document.getElementById("view_address_segwitaddress_qr").innerHTML = qr.createImgTag(4, 8);
    
    qr = qrcode(0, qrErrorCorrectionLevel);
    qr.addData(result[1].toUpperCase(), "Alphanumeric");
    qr.make();
    document.getElementById("view_address_bech32address_qr").innerHTML = qr.createImgTag(4, 8);
    
    qr = qrcode(0, qrErrorCorrectionLevel);
    qr.addData(result[2]);
    qr.make();
    document.getElementById("view_address_legacyaddress_qr").innerHTML = qr.createImgTag(4, 8);
    
    document.getElementById("view_address_container").style.cssText = "display: table; border: 2px solid #bbbbbb; border-radius: 3px;";
}

var bulkAddressType = "bech32";
// set address type for bulk generate
function setBulkAddressType(type, event)
{
    bulkAddressType = type;
}

var bulkArray = undefined;
var bulkCount = 0;
// start bulk generate
function bulk_generate()
{
    if (bulkArray)
        return;
    
    var num = Number.parseInt(document.getElementById("bulk_count").value);
    if (isNaN(num))
    {
        bulkTextarea.innerHTML = "Enter a number";
        return;
    }
    if (num < 1)
    {
        bulkTextarea.innerHTML = "Number must be greater than zero";
        return;
    }
    if (num > 1000)
    {
        bulkTextarea.innerHTML = "Number must be 1000 at most";
        return;
    }
    
    document.getElementById("bulk_radio_type_segwit").disabled = true;
    document.getElementById("bulk_radio_type_bech32").disabled = true;
    document.getElementById("bulk_radio_type_legacy").disabled = true;
    
    if (document.getElementById("bip38enabled_bulk").checked)
    {
        bulkTextarea.innerHTML = "Generating initial values";
        bulkArray = [];
        window.setTimeout(function()
        {
            bip38generate(document.getElementById("bip38_password_box_bulk").value, num, bulkAddressType,
            function(counter, maxcount)
            {
                bulkTextarea.innerHTML = "Generating: " + counter + "/" + maxcount;
            },
            function(data)
            {
                if (typeof data == "string")
                    bulkTextarea.innerHTML = data;
                else
                {
                    var temp = new Array(data.length);
                    for (var i = 0; i < data.length; ++i)
                        temp[i] = "" + (i + 1) + ", \"" + data[i][0] + "\", \"" + data[i][1] + "\"";
                    
                    bulkTextarea.innerHTML = temp.join("&#13;&#10;");
                }
                    
                document.getElementById("bulk_radio_type_segwit").disabled = false;
                document.getElementById("bulk_radio_type_bech32").disabled = false;
                document.getElementById("bulk_radio_type_legacy").disabled = false;
                bulkArray = undefined;
            });
        }, 50);
        return;
    }
    bulkCount = num;
    bulkCurrentCount = 0;
    bulkArray = new Array(bulkCount);
    
    setImmediate(bulk_generate_timeout);
}

var bulkCurrentCount = 0;
// generate 1 address periodically, so the page won't freeze while generating
function bulk_generate_timeout()
{
    if (bulkCurrentCount < bulkCount)
    {
        var bytes = get32SecureRandomBytes();
        var data = generate_address_result(bytes, bulkAddressType, false);
        bulkArray[bulkCurrentCount] = "" + (bulkCurrentCount + 1) + ", \"" + data[2] + "\", \"" + data[0] + "\"";
        ++bulkCurrentCount;
        bulkTextarea.innerHTML = "Generating: " + bulkCurrentCount + "/" + bulkCount;
        setImmediate(bulk_generate_timeout);
    }
    else
    {
        bulkCount = 0;
        bulkCurrentCount = 0;
        bulkTextarea.innerHTML = bulkArray.join("&#13;&#10;");
        bulkArray = undefined;
        
        document.getElementById("bulk_radio_type_segwit").disabled = false;
        document.getElementById("bulk_radio_type_bech32").disabled = false;
        document.getElementById("bulk_radio_type_legacy").disabled = false;
    }
}

// split text into given number of rows
function splitText(text, rows)
{
    var len = text.length;
    var textarray = [];
    var lineLength = Math.ceil(len / rows);
    
    var i = 0;
    while (i < len)
    {
        textarray.push(text.substr(i, lineLength));
        i += lineLength;
    }
    
    return textarray.join("<br />");
}

// split text into rows, with each row having a max length
function splitTextLength(text, length)
{
    if (length == 0)
        return text;
    
    var len = text.length;
    var textarray = [];
    
    var i = 0;
    while (i < len)
    {
        textarray.push(text.substr(i, length));
        i += length;
    }
    
    return textarray.join("<br />");
}

var paperAddressType = "bech32";
// set address type for paper wallet generate
function setPaperAddressType(type)
{
    paperAddressType = type;
}

var paperQRErrorCorrectionLevel = "H";
// set qr code error correction level for paper wallet generate
function setPaperQRErrorCorrectionLevel(level)
{
    paperQRErrorCorrectionLevel = level;
}

function paperWalletBip38Start()
{
    bip38generate(document.getElementById("bip38_password_box_paper").value, paperWalletCount, paperWalletAddressType,
    function(counter, maxcount)
    {
        paperWalletTextArea.innerHTML = "Generating: " + counter + "/" + maxcount;
    },
    function(data)
    {
        if (typeof data == "string")
            paperWalletTextArea.innerHTML = data;
        else
        {
            paperWalletTextArea.innerHTML = "";

            var newData = new Array(data.length);
            
            for (var i = 0; i < data.length; ++i)
            {
                var currentAddress = data[i][0];
                var currentPrivkey = data[i][1];
                
                var addressQR = qrcode(0, paperWalletQRErrorCorrectionLevel);
                if (paperWalletAddressType == "bech32")
                    addressQR.addData(currentAddress.toUpperCase(), "Alphanumeric");
                else
                    addressQR.addData(currentAddress);
                    
                addressQR.make();
                
                var privkeyQR = qrcode(0, paperWalletQRErrorCorrectionLevel);
                privkeyQR.addData(currentPrivkey);
                privkeyQR.make();
                
                newData[i] = [currentPrivkey, privkeyQR, undefined, currentAddress, addressQR];
            }
            
            paperWalletCreate(newData, true);
        }
        
        paperWalletCount = 0;
        paperwalletCurrentCount = 0;
        paperWalletArray = undefined;
        
    });
}

var paperWalletStyle = "design0";
var paperWalletArray = undefined;
var paperWalletCount = 0;
var paperWalletAddressType;
var paperWalletQRErrorCorrectionLevel;
// start generating paper wallets
function paperWallet()
{
    if (paperWalletArray)
        return;
    
    if (document.getElementById("use_custom_addresses_paper").checked)
    {
        paperWalletFromUserAddresses();
        return;
    }
    
    var num = Number.parseInt(document.getElementById("paperwallet_generate_count").value);
    if (isNaN(num))
    {
        paperWalletTextArea.innerHTML = "Enter a number for count";
        return;
    }
    else if (num < 1)
    {
        paperWalletTextArea.innerHTML = "Count must be greater than zero";
        return;
    }
    else if (num > 20)
    {
        paperWalletTextArea.innerHTML = "Count must be 20 at most";
        return;
    }
    
    paperWalletCount = num;
    paperwalletCurrentCount = 0;
    
    paperWalletAddressType = paperAddressType;
    paperWalletQRErrorCorrectionLevel = paperQRErrorCorrectionLevel;
    
    if (document.getElementById("bip38enabled_paper").checked)
    {
        paperWalletTextArea.innerHTML = "Generating initial values";
        paperWalletArray = [];
        window.setTimeout(paperWalletBip38Start, 50);
        return;
    }
    
    paperWalletArray = new Array(paperWalletCount);
    setImmediate(paperwallet_generate_timeout);
}

var paperwalletCurrentCount = 0;
// periodically generate 1 paper wallet, so the page won't freeze while generating
function paperwallet_generate_timeout()
{
    if (paperwalletCurrentCount < paperWalletCount)
    {
        var bytes = get32SecureRandomBytes();
        var data = generate_address_result(bytes, paperWalletAddressType, true, paperWalletQRErrorCorrectionLevel);
            
        paperWalletArray[paperwalletCurrentCount] = data;
        ++paperwalletCurrentCount;
        paperWalletTextArea.innerHTML = "Generating: " + paperwalletCurrentCount + "/" + paperWalletCount;

        setImmediate(paperwallet_generate_timeout);
    }
    else
    {
        paperWalletTextArea.innerHTML = "";
        paperWalletCount = 0;
        paperwalletCurrentCount = 0;
        paperWalletCreate(paperWalletArray, false);
        paperWalletArray = undefined;
    }
}

var paperWalletCustomImageData = "";
var paperWalletCustomImageWidth = 0;
var paperWalletCustomImageHeight = 0;
// load user image for paper wallet background
function paperWalletCustomImageSelected(event)
{
    var reader = new FileReader();
    reader.onload = function(e)
    {
        paperWalletCustomImageData = e.target.result;
        var tempIMG = new Image();
        tempIMG.src = paperWalletCustomImageData;
        tempIMG.onload = function()
        {
            paperWalletCustomImageWidth = tempIMG.width;
            paperWalletCustomImageHeight = tempIMG.height;
        };
        paperwallet_update_preview();
    };
    
    var files = event.files;
    if (!files || !files[0])
    {
        paperWalletTextArea.innerHTML = "No background image selected";
        return;
    }
    
    try
    {
        reader.readAsDataURL(files[0]);
    }
    catch (ex)
    {
        paperWalletTextArea.innerHTML = "Error opening background image";
    }
}

// create paper wallets with the given addresses and private keys
// the position of address, private key, and qr codes are set for each layout
function paperWalletCreate(addressData, bip38)
{
    var container = document.getElementById("paperwallet_print_area");
    container.innerHTML = "";
    
    var verticalGap = Number(document.getElementById("paperwallet_vertical_gap").value);
    if (isNaN(verticalGap) || verticalGap < 0)
        verticalGap = 0;
    
    switch (paperWalletStyle)
    {
        case "design0":
        {
            var targetSize = 100;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(targetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 10px; left: 10px; width: " + targetSize + "px; height: " + targetSize + "px;";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(targetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; bottom: 10px; right: 10px; width: " + targetSize + "px; height: " + targetSize + "px;";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1000px; height: 200px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = currentAddress;
                addressDiv.style.cssText = "position: absolute; top: 50px; left: 120px; font-family: roboto-mono; font-weight: normal; font-size: 18px;";
                
                var privkeyDiv = document.createElement("div");
                privkeyDiv.innerHTML = currentPrivkey;
                privkeyDiv.style.cssText = "position: absolute; bottom: 10px; right: 120px; font-family: roboto-mono; font-weight: normal; font-size: 18px;";
                
                var addressText = document.createElement("div");
                addressText.innerHTML = "Address:";
                addressText.style.cssText = "position: absolute; top: 15px; left: 120px; font-family: Verdana; font-weight: bold; font-size: 25px;";
                
                var privkeyText = document.createElement("div");
                privkeyText.innerHTML = bip38 ? "Encrypted private key:" : "Private key:";
                privkeyText.style.cssText = "position: absolute; bottom: 40px; right: " + (bip38 ? "430" : "514") + "px; font-family: Verdana; font-weight: bold; font-size: 25px;";
                
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(addressText);
                parentDiv.appendChild(privkeyDiv);
                parentDiv.appendChild(privkeyText);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                
                container.appendChild(parentDiv);
            }
            break;
        }
        case "custom":
        {
            var addressTargetSize = Number(document.getElementById("paperwallet_custom_address_qr_size").value);
            var privkeyTargetSize = Number(document.getElementById("paperwallet_custom_privkey_qr_size").value);
            
            var backgroundImageScale = Number(document.getElementById("paperwallet_custom_background_scale").value) / 100;
            
            var addressPosX = Number(document.getElementById("paperwallet_custom_address_posx").value);
            var addressPosY = Number(document.getElementById("paperwallet_custom_address_posy").value);
            var privkeyPosX = Number(document.getElementById("paperwallet_custom_privkey_posx").value);
            var privkeyPosY = Number(document.getElementById("paperwallet_custom_privkey_posy").value);
            
            var addressQRPosX = Number(document.getElementById("paperwallet_custom_address_qr_posx").value);
            var addressQRPosY = Number(document.getElementById("paperwallet_custom_address_qr_posy").value);
            var addressQRRot = Number(document.getElementById("paperwallet_custom_address_qr_rotation").value);
            var privkeyQRPosX = Number(document.getElementById("paperwallet_custom_privkey_qr_posx").value);
            var privkeyQRPosY = Number(document.getElementById("paperwallet_custom_privkey_qr_posy").value);
            var privkeyQRRot = Number(document.getElementById("paperwallet_custom_privkey_qr_rotation").value);
            
            var addressLineLength = Number(document.getElementById("paperwallet_custom_address_length").value);
            var privkeyLineLength = Number(document.getElementById("paperwallet_custom_privkey_length").value);
            
            var addressFontSize = Number(document.getElementById("paperwallet_custom_address_size").value);
            var addressFontRot = Number(document.getElementById("paperwallet_custom_address_rotation").value);
            var privkeyFontSize = Number(document.getElementById("paperwallet_custom_privkey_size").value);
            var privkeyFontRot = Number(document.getElementById("paperwallet_custom_privkey_rotation").value);
            
            for (var i = 0; i < addressData.length; ++i)
            {
                var backgroundImage = new Image();
                backgroundImage.style.cssText = "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                backgroundImage.src = paperWalletCustomImageData;
                
                backgroundImage.paperWalletIdx = i;
                backgroundImage.onload = function()
                {
                    var currentData = addressData[this.paperWalletIdx];
                    var currentAddress = currentData[3];
                    var currentPrivkey = currentData[0];
                    
                    var currentAddressQR = currentData[4];
                    var addressSize = currentAddressQR.getModuleCount() + 4;
                    var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    var addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.cssText = "position: absolute; top: " + addressQRPosY + "px; left: " + addressQRPosX + "px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px; transform: rotate(" +addressQRRot + "deg);";
                    
                    var currentPrivkeyQR = currentData[1];
                    var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    var privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.cssText = "position: absolute; top: " + privkeyQRPosY + "px; left: " + privkeyQRPosX + "px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px; transform: rotate(" +privkeyQRRot + "deg);";
                    
                    var parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    
                    parentDiv.style.cssText = "position: relative; border: 2px solid black; width: " + this.width * backgroundImageScale + "px; height: " + this.height * backgroundImageScale + "px; margin-bottom: " + verticalGap + "px;";
                    
                    var addressDiv = document.createElement("div");
                    addressDiv.innerHTML = splitTextLength(currentAddress, addressLineLength);
                    addressDiv.style.cssText = "position: absolute; top: " + addressPosY + "px; left: " + addressPosX + "px; font-family: roboto-mono; font-weight: normal; font-size: " + addressFontSize + "px; transform: rotate(" + addressFontRot + "deg); transform-origin: 0% 0%;";
                    
                    var privkeyDiv = document.createElement("div");
                    privkeyDiv.innerHTML = splitTextLength(currentPrivkey, privkeyLineLength);
                    privkeyDiv.style.cssText = "position: absolute; top: " + privkeyPosY + "px; left: " + privkeyPosX + "px; font-family: roboto-mono; font-weight: normal; font-size: " + privkeyFontSize + "px; transform: rotate(" + privkeyFontRot + "deg); transform-origin: 0% 0%;";
                    
                    parentDiv.appendChild(this);
                    parentDiv.appendChild(addressDiv);
                    parentDiv.appendChild(privkeyDiv);
                    parentDiv.appendChild(addressQRImg);
                    parentDiv.appendChild(privkeyQRImg);
                    
                    container.appendChild(parentDiv);
                }
            }
            
            break;
        }
        case "design1":
        {
            var addressTargetSize = 90;
            var privkeyTargetSize = 117;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 110px; left: 50px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px;";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; top: 93px; left: 816px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px;";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1000px; height: 300px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = currentAddress;
                addressDiv.style.cssText = "position: absolute; top: 257px; left: 43px; font-family: roboto-mono; font-weight: bold; font-size: 11px;";
                
                var privkeyDiv = document.createElement("div");
                privkeyDiv.innerHTML = currentPrivkey;
                privkeyDiv.style.cssText = "position: absolute; top: 225px; left: " + (bip38 ? "582" : "600") + "px; font-family: roboto-mono; font-weight: bold; font-size: 11px;";
                
                var addressDiv2 = document.createElement("div");
                addressDiv2.innerHTML = currentAddress;
                addressDiv2.style.cssText = "position: absolute; top: 32px; right: 681px; font-family: roboto-mono; font-weight: bold; font-size: 11px; transform: rotate(180deg);";
                
                var privkeyDiv2 = document.createElement("div");
                privkeyDiv2.innerHTML = currentPrivkey;
                privkeyDiv2.style.cssText = "position: absolute; top: 65px; left: " + (bip38 ? "582" : "600") + "px; font-family: roboto-mono; font-weight: bold; font-size: 11px; transform: rotate(180deg);";
                
                var backgroundGraphic = new Image();
                backgroundGraphic.src = window["imageSources"]["bitcoinpaperwalletcom.jpg"];
                backgroundGraphic.style.cssText = "position:absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                
                parentDiv.appendChild(backgroundGraphic);
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(privkeyDiv);
                parentDiv.appendChild(addressDiv2);
                parentDiv.appendChild(privkeyDiv2);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                
                container.appendChild(parentDiv);
            }
            break;
        }
        case "design2":
        {
            var addressTargetSize = 135;
            var privkeyTargetSize = 135;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 265px; left: 29px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px;";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; top: 32px; left: 839px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px;";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1002px; height: 426px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = currentAddress;
                addressDiv.style.cssText = "position: absolute; top: 384px; left: 197px; font-family: roboto-mono; font-weight: bold; font-size: 14.5px;";
                
                var privkeyDiv = document.createElement("div");
                privkeyDiv.innerHTML = splitText(currentPrivkey, 2);
                privkeyDiv.style.cssText = "position: absolute; top: 25px; left: 575px; font-family: roboto-mono; font-weight: bold; font-size: " + (bip38 ? "13" : "14.5") + "px;";
                
                var backgroundGraphic = new Image();
                backgroundGraphic.src = window["imageSources"]["dorian.jpg"];
                backgroundGraphic.style.cssText = "position:absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                
                parentDiv.appendChild(backgroundGraphic);
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(privkeyDiv);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                
                container.appendChild(parentDiv);
            }
            break;
        }
        case "design3":
        {
            var addressTargetSize = 120;
            var privkeyTargetSize = 120;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 265px; left: 780px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px; transform: rotate(270deg);";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; top: 40px; left: 442px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px; transform: rotate(90deg);";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1001px; height: 425px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = splitTextLength(currentAddress, 17);
                addressDiv.style.cssText = "position: absolute; top: 391px; left: 905px; font-family: roboto-mono; font-weight: normal; font-size: 13px; transform: rotate(270deg); transform-origin: 0% 0%;";
                
                var privkeyDiv = document.createElement("div");
                privkeyDiv.innerHTML = splitTextLength(currentPrivkey, bip38 ? 20 : 18);
                privkeyDiv.style.cssText = "position: absolute; top: 30px; left: 434px; font-family: roboto-mono; font-weight: normal; font-size: " + (bip38 ? "12" : "13") + "px; transform: rotate(90deg); transform-origin: 0% 0%;";
                
                var backgroundGraphic = new Image();
                backgroundGraphic.src = window["imageSources"]["walletgeneratornet.jpg"];
                backgroundGraphic.style.cssText = "position:absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                
                parentDiv.appendChild(backgroundGraphic);
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(privkeyDiv);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                
                container.appendChild(parentDiv);
            }
            break;
        }
        case "design4":
        {
            var addressTargetSize = 135;
            var privkeyTargetSize = 135;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 265px; left: 29px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px;";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; top: 32px; left: 839px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px;";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1002px; height: 426px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = currentAddress;
                addressDiv.style.cssText = "position: absolute; top: 384px; left: 197px; font-family: roboto-mono; font-weight: bold; font-size: 14.6px;";
                
                var privkeyDiv = document.createElement("div");
                privkeyDiv.innerHTML = splitText(currentPrivkey, 2);
                privkeyDiv.style.cssText = "position: absolute; top: " + (bip38 ? "26" : "25") + "px; left: 575px; font-family: roboto-mono; font-weight: bold; font-size: " + (bip38 ? "13" : "14.5") + "px;";
                
                var backgroundGraphic = new Image();
                backgroundGraphic.src = window["imageSources"]["currencynote.jpg"];
                backgroundGraphic.style.cssText = "position:absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                
                parentDiv.appendChild(backgroundGraphic);
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(privkeyDiv);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                
                container.appendChild(parentDiv);
            }
            break;
        }
        case "design5":
        {
            var addressTargetSize = 116;
            var privkeyTargetSize = 116;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 34px; left: 42px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px;";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; top: 186px; left: 622px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px;";
                
                var addressQRImg2 = new Image();
                addressQRImg2.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg2.style.cssText = "position: absolute; top: 34px; left: 867px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px; transform: rotate(270deg);";
                
                var privkeyQRImg2 = new Image();
                privkeyQRImg2.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg2.style.cssText = "position: absolute; top: 186px; left: 867px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px; transform: rotate(270deg);";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1020px; height: 340px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = currentAddress;
                addressDiv.style.cssText = "position: absolute; top: 29px; left: 213px; font-family: roboto-mono; font-weight: normal; font-size: 14px;";
                
                var addressDiv2 = document.createElement("div");
                addressDiv2.innerHTML = currentAddress.substr(0, 14);
                addressDiv2.style.cssText = "position: absolute; top: 82px; left: 761px; font-family: roboto-mono; font-weight: normal; font-size: 14px; transform: rotate(270deg);";
                
                var backgroundGraphic = new Image();
                backgroundGraphic.src = window["imageSources"]["design_by_mark_and_barbara_messer.jpg"];
                backgroundGraphic.style.cssText = "position:absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                
                parentDiv.appendChild(backgroundGraphic);
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(addressDiv2);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                parentDiv.appendChild(addressQRImg2);
                parentDiv.appendChild(privkeyQRImg2);
                
                container.appendChild(parentDiv);
            }
            break;
        }
        case "design6":
        {
            var addressTargetSize = 184;
            var privkeyTargetSize = 210;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 118px; left: 55px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px;";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; top: 226px; left: 755px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px;";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1004px; height: 538px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = currentAddress;
                addressDiv.style.cssText = "position: absolute; top: 480px; left: 291px; font-family: roboto-mono; font-weight: bold; font-size: 18px; transform: rotate(270deg); transform-origin: 0% 0%;";
                
                var privkeyDiv = document.createElement("div");
                privkeyDiv.innerHTML = currentPrivkey;
                privkeyDiv.style.cssText = "position: absolute; top: 483px; left: 702px; font-family: roboto-mono; font-weight: bold; font-size: " + (bip38 ? "13" : "15") + "px; transform: rotate(270deg); transform-origin: 0% 0%;";
                
                var backgroundGraphic = new Image();
                backgroundGraphic.src = window["imageSources"]["bitaddressorg.jpg"];
                backgroundGraphic.style.cssText = "position:absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                
                parentDiv.appendChild(backgroundGraphic);
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(privkeyDiv);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                
                container.appendChild(parentDiv);
            }
            break;
        }
        case "design7":
        {
            var addressTargetSize = 116;
            var privkeyTargetSize = 116;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 34px; left: 40px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px;";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; top: 182px; left: 610px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px;";
                
                var privkeyQRImg2 = new Image();
                privkeyQRImg2.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg2.style.cssText = "position: absolute; top: 182px; left: 852px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px;";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1002px; height: 334px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = currentAddress;
                addressDiv.style.cssText = "position: absolute; top: 25px; left: 205px; font-family: roboto-mono; font-weight: bold; font-size: 18px;";
                
                var addressDiv2 = document.createElement("div");
                addressDiv2.innerHTML = currentAddress.substr(0, 11);
                addressDiv2.style.cssText = "position: absolute; top: 152px; left: 794px; font-family: roboto-mono; font-weight: bold; font-size: 18px; transform: rotate(270deg); transform-origin: 0% 0%;";
                
                var privkeyDiv = document.createElement("div");
                privkeyDiv.innerHTML = splitTextLength(currentPrivkey, bip38 ? 12 : 11);
                privkeyDiv.style.cssText = "position: absolute; top: 30px; left: " + (bip38 ? "848" : "850") + "px; font-family: roboto-mono; font-weight: bold; font-size: " + (bip38 ? "17" : "18") + "px;";
                
                var backgroundGraphic = new Image();
                backgroundGraphic.src = window["imageSources"]["design_by_timbo925.svg"];
                backgroundGraphic.style.cssText = "position:absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                
                parentDiv.appendChild(backgroundGraphic);
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(addressDiv2);
                parentDiv.appendChild(privkeyDiv);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                parentDiv.appendChild(privkeyQRImg2);
                
                container.appendChild(parentDiv);
            }
            break;
        }
        case "design8":
        {
            var addressTargetSize = 116;
            var privkeyTargetSize = 116;
            for (var i = 0; i < addressData.length; ++i)
            {
                var currentData = addressData[i];
                var currentAddress = currentData[3];
                var currentPrivkey = currentData[0];
                
                var currentAddressQR = currentData[4];
                var addressSize = currentAddressQR.getModuleCount() + 4;
                var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                var addressQRImg = new Image();
                addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg.style.cssText = "position: absolute; top: 35px; left: 44px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px;";
                
                var currentPrivkeyQR = currentData[1];
                var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                var privkeyQRImg = new Image();
                privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg.style.cssText = "position: absolute; top: 186px; left: 622px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px;";
                
                var addressQRImg2 = new Image();
                addressQRImg2.src = currentAddressQR.createDataURL(finalSize, 0);
                addressQRImg2.style.cssText = "position: absolute; top: 35px; left: 868px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px; transform: rotate(270deg);";
                
                var privkeyQRImg2 = new Image();
                privkeyQRImg2.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                privkeyQRImg2.style.cssText = "position: absolute; top: 186px; left: 868px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px; transform: rotate(270deg);";
                
                var parentDiv = document.createElement("div");
                parentDiv.className = "parent_div";
                parentDiv.style.cssText = "background: white; color: black; position: relative; border: 2px solid black; width: 1020px; height: 340px; margin-bottom: " + verticalGap + "px;";
                
                var addressDiv = document.createElement("div");
                addressDiv.innerHTML = currentAddress;
                addressDiv.style.cssText = "position: absolute; top: 29px; left: 208px; font-family: roboto-mono; font-weight: normal; font-size: 14.5px;";
                
                var addressDiv2 = document.createElement("div");
                addressDiv2.innerHTML = currentAddress.substr(0, 14);
                addressDiv2.style.cssText = "position: absolute; top: 84px; left: 757px; font-family: roboto-mono; font-weight: normal; font-size: 15px; transform: rotate(270deg);";
                
                var backgroundGraphic = new Image();
                backgroundGraphic.src = window["imageSources"]["design_by_75rtuga.jpg"];
                backgroundGraphic.style.cssText = "position:absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
                
                parentDiv.appendChild(backgroundGraphic);
                parentDiv.appendChild(addressDiv);
                parentDiv.appendChild(addressDiv2);
                parentDiv.appendChild(addressQRImg);
                parentDiv.appendChild(privkeyQRImg);
                parentDiv.appendChild(addressQRImg2);
                parentDiv.appendChild(privkeyQRImg2);
                
                container.appendChild(parentDiv);
            }
            break;
        }
    }
}

function paperWalletFromUserAddresses()
{
    var errorMessageDiv = document.getElementById("paper_custom_address_error");
    var raw = document.getElementById("paper_custom_addresses").value.replace(/\"/g, "").replace(/\n/g, " ").replace(/\s+/g, " ");
    
    var trim = raw.trim();
    if (trim == "")
    {
        errorMessageDiv.innerHTML = "No data entered";
        return;
    }
    
    var data = trim.split(',');
    var addressData = [];
    var isBip38 = false;
    for (var i = 0; i < data.length; ++i)
    {
        var split = data[i].trim().split(' ');
        if (split.length == 0 || split == "")
            continue;
        else if (split.length != 2)
        {
            errorMessageDiv.innerHTML = "Invalid format: " + data[i];
            return;
        }
        
        var address = split[0];
        var privkey = split[1];
        
        if (privkey.length == 58)
            isBip38 = true;
        else if (privkey.length != 52)
        {
            errorMessageDiv.innerHTML = "Invalid private key: " + privkey;
            return;
        }
        
        var currentAddressQR = qrcode(0, paperQRErrorCorrectionLevel);
        if (address.indexOf("bc1") == 0)
            currentAddressQR.addData(address.toUpperCase(), "Alphanumeric");
        else
            currentAddressQR.addData(address);
            
        currentAddressQR.make();
        
        var currentPrivkeyQR = qrcode(0, paperQRErrorCorrectionLevel);
        currentPrivkeyQR.addData(privkey);
        currentPrivkeyQR.make();
        
        addressData.push([privkey, currentPrivkeyQR, undefined, address, currentAddressQR]);
    }
    
    errorMessageDiv.innerHTML = "";
    
    paperWalletCreate(addressData, isBip38)
}

// sources of the paper wallet designs
var paperWalletStyleSources = 
{
    "design0" : "",
    "design1" : "Design source: <a href=\"https://bitcoinpaperwallet.com\">https://bitcoinpaperwallet.com</a>",
    "design2" : "Design source: <a href=\"https://redd.it/20rml2\">https://redd.it/20rml2</a>",
    "design3" : "Design source: <a href=\"https://walletgenerator.net\">https://walletgenerator.net</a>",
    "design4" : "Design source: <a href=\"https://steemit.com/bitcoin/@bunnychum/bitcoin-paper-wallet-redesigned-as-currency-note-free-psd-to-download\">https://steemit.com/bitcoin/@bunnychum/...</a>",
    "design5" : "Design source: <a href=\"https://i.pinimg.com/originals/a3/89/89/a38989778a3e113a657016f5fab1803b.png\">https://i.pinimg.com/originals/a3/89/89/...</a>",
    "design6" : "Design source: <a href=\"https://bitaddress.org\">https://bitaddress.org</a>",
    "design7" : "Design source: <a href=\"https://github.com/Timbo925/walletprinter/blob/d8ae0eab0c5ef09b0ade59009d544ae5f78b12f8/img/wallet_designs/timbo-grey.svg\">https://github.com/Timbo925/walletprinter/...</a>",
    "design8" : "Design source: <a href=\"https://github.com/nieldlr/walletprinter/blob/master/img/wallet_designs/75RTUGA.jpg\">https://github.com/nieldlr/walletprinter/.../75RTUGA.jpg</a>",
    "custom": "",
};

// selected paper wallet style changed, update link to the design source
function paperWalletStyleChange(event)
{
    paperWalletStyle = event.target.value;
    var linkElement = document.getElementById("paperwallet_source_link");
    linkElement.innerHTML = paperWalletStyleSources[paperWalletStyle];
    if (linkElement.childNodes.length > 1)
        linkElement.childNodes[1].classList.add(darkMode ? "dark" : "light");
    
    if (paperWalletStyle == "custom")
        document.getElementById("paperwallet_custom_parameters").style.cssText = "display: table; border-bottom: 2px solid #bbbbbb; padding-bottom: 20px; margin-bottom: 20px;";
    else
        document.getElementById("paperwallet_custom_parameters").style.cssText = "display: none;";
}

function paperwallet_vertical_gap_changed(event)
{
    var height = Number(event.target.value);
    if (isNaN(height) || height < 0)
        height = 0;
    
    var elements = document.getElementsByClassName("parent_div");
    for (var i = 0; i < elements.length; ++i)
        elements[i].style.marginBottom = "" + height + "px";
}

var paperWallet_div_custom_preview_address = document.getElementById("paperwallet_custom_preview_address");
var paperWallet_div_custom_preview_addressqr = document.getElementById("paperwallet_custom_preview_addressqr");
var paperWallet_div_custom_preview_privkey = document.getElementById("paperwallet_custom_preview_privkey");
var paperWallet_div_custom_preview_privkeyqr = document.getElementById("paperwallet_custom_preview_privkeyqr");
function paperwallet_update_element(event)
{
    if (paperWalletCustomImageData == "")
        return;
    
    var val = Number(event.target.value);
    if (isNaN(val))
        return;
    
    switch (event.target.id)
    {
        case "paperwallet_custom_background_scale":
            var w = (paperWalletCustomImageWidth * val / 100) + "px";
            var h = (paperWalletCustomImageHeight * val / 100) + "px";
            
            var st = document.getElementById("paperwallet_preview_div").style;
            st.width = w;
            st.height = h;
            
            var st2 = document.getElementById("paperwallet_preview_parentdiv").style;
            st2.width = w;
            st2.height = h;
            break;
        case "paperwallet_custom_address_posx":
            paperWallet_div_custom_preview_address.style.left = val + "px";
            break;
        case "paperwallet_custom_address_posy":
            paperWallet_div_custom_preview_address.style.top = val + "px";
            break;
        case "paperwallet_custom_address_size":
            paperWallet_div_custom_preview_address.style.fontSize = val + "px";
            break;
        case "paperwallet_custom_address_length":
            paperWallet_div_custom_preview_address.innerHTML = splitTextLength("bc1qacdefghjklmnopqrstuvwxyz023456789acdef", val);
            break;
        case "paperwallet_custom_address_rotation":
            paperWallet_div_custom_preview_address.style.transform = "rotate(" + val + "deg)";
            break;
        case "paperwallet_custom_address_qr_posx":
            paperWallet_div_custom_preview_addressqr.style.left = val + "px";
            break;
        case "paperwallet_custom_address_qr_posy":
            paperWallet_div_custom_preview_addressqr.style.top = val + "px";
            break;
        case "paperwallet_custom_address_qr_size":
            var st = paperWallet_div_custom_preview_addressqr.style;
            st.width = val + "px";
            st.height = val + "px";
            break;
        case "paperwallet_custom_address_qr_rotation":
            paperWallet_div_custom_preview_addressqr.style.transform = "rotate(" + val + "deg)";
            break;
        case "paperwallet_custom_privkey_posx":
            paperWallet_div_custom_preview_privkey.style.left = val + "px";
            break;
        case "paperwallet_custom_privkey_posy":
            paperWallet_div_custom_preview_privkey.style.top = val + "px";
            break;
        case "paperwallet_custom_privkey_size":
            paperWallet_div_custom_preview_privkey.style.fontSize = val + "px";
            break;
        case "paperwallet_custom_privkey_length":
            var dummyPrivkey = document.getElementById("bip38enabled_paper").checked ? "6Pnabcdefghijkmnopqrstuvwxyz1234567ABCDEFGHJKLMNPQRSTUVXYZ" : "K1abcdefghijkmnopqrstuvwxyzabcdefghijkmnopqrstuvwxyz";
            paperWallet_div_custom_preview_privkey.innerHTML = splitTextLength(dummyPrivkey, val);
            break;
        case "paperwallet_custom_privkey_rotation":
            paperWallet_div_custom_preview_privkey.style.transform = "rotate(" + val + "deg)";
            break;
        case "paperwallet_custom_privkey_qr_posx":
            paperWallet_div_custom_preview_privkeyqr.style.left = val + "px";
            break;
        case "paperwallet_custom_privkey_qr_posy":
            paperWallet_div_custom_preview_privkeyqr.style.top = val + "px";
            break;
        case "paperwallet_custom_privkey_qr_size":
            var st = paperWallet_div_custom_preview_privkeyqr.style;
            st.width = val + "px";
            st.height = val + "px";
            break;
        case "paperwallet_custom_privkey_qr_rotation":
            paperWallet_div_custom_preview_privkeyqr.style.transform = "rotate(" + val + "deg)";
            break;
    }
}

function paperwallet_update_preview()
{
    if (paperWalletCustomImageData == "")
        return;
    
    var container = document.getElementById("paperwallet_preview_div");
    container.innerHTML = "";
    
    var addressTargetSize = Number(document.getElementById("paperwallet_custom_address_qr_size").value);
    var privkeyTargetSize = Number(document.getElementById("paperwallet_custom_privkey_qr_size").value);
    
    var backgroundImageScale = Number(document.getElementById("paperwallet_custom_background_scale").value) / 100;
    
    var addressPosX = Number(document.getElementById("paperwallet_custom_address_posx").value);
    var addressPosY = Number(document.getElementById("paperwallet_custom_address_posy").value);
    var privkeyPosX = Number(document.getElementById("paperwallet_custom_privkey_posx").value);
    var privkeyPosY = Number(document.getElementById("paperwallet_custom_privkey_posy").value);
    
    var addressQRPosX = Number(document.getElementById("paperwallet_custom_address_qr_posx").value);
    var addressQRPosY = Number(document.getElementById("paperwallet_custom_address_qr_posy").value);
    var addressQRRot = Number(document.getElementById("paperwallet_custom_address_qr_rotation").value);
    var privkeyQRPosX = Number(document.getElementById("paperwallet_custom_privkey_qr_posx").value);
    var privkeyQRPosY = Number(document.getElementById("paperwallet_custom_privkey_qr_posy").value);
    var privkeyQRRot = Number(document.getElementById("paperwallet_custom_privkey_qr_rotation").value);
    
    var addressLineLength = Number(document.getElementById("paperwallet_custom_address_length").value);
    var privkeyLineLength = Number(document.getElementById("paperwallet_custom_privkey_length").value);
    
    var addressFontSize = Number(document.getElementById("paperwallet_custom_address_size").value);
    var addressFontRot = Number(document.getElementById("paperwallet_custom_address_rotation").value);
    var privkeyFontSize = Number(document.getElementById("paperwallet_custom_privkey_size").value);
    var privkeyFontRot = Number(document.getElementById("paperwallet_custom_privkey_rotation").value);
    
    var backgroundImage = new Image();
    backgroundImage.src = paperWalletCustomImageData;

    var currentAddress = "bc1qacdefghjklmnopqrstuvwxyz023456789acdef";
    var currentPrivkey = document.getElementById("bip38enabled_paper").checked ? "6Pnabcdefghijkmnopqrstuvwxyz1234567ABCDEFGHJKLMNPQRSTUVXYZ" : "K1abcdefghijkmnopqrstuvwxyzabcdefghijkmnopqrstuvwxyz";
    
    var currentAddressQR = qrcode(0, "H");
    currentAddressQR.addData(currentAddress);
    currentAddressQR.make();
    var addressSize = currentAddressQR.getModuleCount() + 4;
    var finalSize = Math.floor(addressTargetSize / addressSize) + 1;
    var addressQRImg = new Image();
    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
    addressQRImg.style.cssText = "position: absolute; top: " + addressQRPosY + "px; left: " + addressQRPosX + "px; width: " + addressTargetSize + "px; height: " + addressTargetSize + "px; transform: rotate(" +addressQRRot + "deg);";
    addressQRImg.id = "paperwallet_custom_preview_addressqr";
    
    var currentPrivkeyQR = qrcode(0, "H");
    currentPrivkeyQR.addData(currentPrivkey);
    currentPrivkeyQR.make();
    var privkeySize = currentPrivkeyQR.getModuleCount() + 4;
    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
    var privkeyQRImg = new Image();
    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
    privkeyQRImg.style.cssText = "position: absolute; top: " + privkeyQRPosY + "px; left: " + privkeyQRPosX + "px; width: " + privkeyTargetSize + "px; height: " + privkeyTargetSize + "px; transform: rotate(" +privkeyQRRot + "deg);";
    privkeyQRImg.id = "paperwallet_custom_preview_privkeyqr";
    
    var parentDiv = document.createElement("div");
    parentDiv.id = "paperwallet_preview_parentdiv";
    
    backgroundImage.onload = function()
    {
        parentDiv.style.cssText = "position: relative; width: " + backgroundImage.width * backgroundImageScale + "px; height: " + backgroundImage.height * backgroundImageScale + "px;";
        container.style.width = backgroundImage.width * backgroundImageScale + "px";
        container.style.height = backgroundImage.height * backgroundImageScale + "px";
        backgroundImage.style.cssText = "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;";
    };
    
    var addressDiv = document.createElement("div");
    addressDiv.innerHTML = splitTextLength(currentAddress, addressLineLength);
    addressDiv.style.cssText = "position: absolute; top: " + addressPosY + "px; left: " + addressPosX + "px; font-family: roboto-mono; font-weight: normal; font-size: " + addressFontSize + "px; transform: rotate(" + addressFontRot + "deg); transform-origin: 0% 0%;";
    addressDiv.id = "paperwallet_custom_preview_address";
    
    var privkeyDiv = document.createElement("div");
    privkeyDiv.innerHTML = splitTextLength(currentPrivkey, privkeyLineLength);
    privkeyDiv.style.cssText = "position: absolute; top: " + privkeyPosY + "px; left: " + privkeyPosX + "px; font-family: roboto-mono; font-weight: normal; font-size: " + privkeyFontSize + "px; transform: rotate(" + privkeyFontRot + "deg); transform-origin: 0% 0%;";
    privkeyDiv.id = "paperwallet_custom_preview_privkey";
    
    parentDiv.appendChild(backgroundImage);
    parentDiv.appendChild(addressDiv);
    parentDiv.appendChild(privkeyDiv);
    parentDiv.appendChild(addressQRImg);
    parentDiv.appendChild(privkeyQRImg);
    
    container.appendChild(parentDiv);
}

var currentLayout;
var layoutPrintAreas;
function set_layout(newLayout)
{
    if (currentLayout == newLayout)
        return;
    
    var prevLayout = currentLayout;
    
    document.getElementById("button_layout_" + prevLayout).disabled = false;
    document.getElementById("button_layout_" + newLayout).disabled = true;
    
    document.getElementById("main_" + prevLayout).style.cssText = "display: none";
    document.getElementById("main_" + newLayout).style.cssText = "display: table; width: 80%; padding-left: 10px;";
    
    var prevPrintAreas = layoutPrintAreas[prevLayout];
    for (var c in prevPrintAreas)
        document.getElementById(c).classList.remove(prevPrintAreas[c]);
        
    var values = layoutPrintAreas[newLayout];
    for (var c in values)
        document.getElementById(c).classList.add(values[c]);
    
    currentLayout = newLayout;
}

// closure compiler exports (functions that are called from html)
window["set_layout"] = set_layout;
window["setAddressType"] = setAddressType;
window["setQRErrorCorrectionLevel"] = setQRErrorCorrectionLevel;
window["generate_address"] = generate_address;
window["view_address_details"] = view_address_details;
window["bip38decrypt_button"] = bip38decrypt_button;
window["setBulkAddressType"] = setBulkAddressType;
window["bip38changed"] = bip38changed;
window["showBip38Info"] = showBip38Info;
window["bulk_generate"] = bulk_generate;
window["setPaperAddressType"] = setPaperAddressType;
window["setPaperQRErrorCorrectionLevel"] = setPaperQRErrorCorrectionLevel;
window["paperWallet"] = paperWallet;
window["paperwallet_vertical_gap_changed"] = paperWallet;
window["paperWalletStyleChange"] = paperWalletStyleChange;
window["paperWalletCustomImageSelected"] = paperWalletCustomImageSelected;
window["paperwallet_update_element"] = paperwallet_update_element;
window["skipRandomness"] = skipRandomness
window["setDarkMode"] = setDarkMode;

})();
