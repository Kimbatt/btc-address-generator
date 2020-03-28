
(function()
{
    const randomnessCanvas = <HTMLCanvasElement>document.getElementById("randomness_canvas");
    const randomnessCanvasCTX = randomnessCanvas.getContext("2d")!;
    const randomnessText = document.getElementById("randomness_div")!;

    function randomnessCanvasResizerFunction()
    {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const canvasWidth = width * 0.7;
        const canvasHeight = height * 0.6;

        let imageData = null;
        if (randomnessCanvas.width > 0 && randomnessCanvas.height > 0)
            imageData = randomnessCanvasCTX.getImageData(0, 0, randomnessCanvas.width, randomnessCanvas.height);

        const prevFillStyle = randomnessCanvasCTX.fillStyle;

        randomnessCanvas.width = canvasWidth;
        randomnessCanvas.height = canvasHeight;
        randomnessCanvas.style.left = (width / 2 - canvasWidth / 2) + "px";
        randomnessCanvas.style.top = (height / 2 - canvasHeight / 1.5) + "px";

        randomnessCanvasCTX.fillStyle = darkMode ? "#323639" : "#ffffff";
        randomnessCanvasCTX.fillRect(0, 0, randomnessCanvas.width, randomnessCanvas.height);
        randomnessCanvasCTX.fillStyle = prevFillStyle;

        if (imageData !== null)
            randomnessCanvasCTX.putImageData(imageData, 0, 0);

        randomnessText.style.left = (width / 2 - randomnessText.clientWidth / 2) + "px";
        randomnessText.style.top = (height / 2 - canvasHeight / 1.5) + "px";

        const randomnessContainer = document.getElementById("randomness_container")!;
        randomnessContainer.style.width = canvasWidth + "px";
        randomnessContainer.style.left = (width / 2 - canvasWidth / 2) + "px";
        randomnessContainer.style.top = (height / 2 + canvasHeight / 3 + 10) + "px";
    };

    const randomnessNumbers: number[] = [];

    function initDarkMode()
    {
        // check if browser supports prefers-color-scheme
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme)").matches)
        {
            // media query supported, check preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches)
            {
                // use dark mode
                return true;
            }
            else if (window.matchMedia("(prefers-color-scheme: light)").matches)
            {
                // use light mode
                return false;
            }
        }

        // use dark mode based on time
        const hour = new Date().getHours();
        return hour < 7 || hour > 18;
    }

    let darkMode = initDarkMode();


    function hasQueryKey(key: string)
    {
        return getQueryValue(key) !== null;
    }

    function getQueryValue(key: string)
    {
        if (window.location.search.length === 0 || window.location.search[0] !== "?")
            return null;

        const queryValues = window.location.search.substr(1).split("&");
        for (let i = 0; i < queryValues.length; ++i)
        {
            const match = queryValues[i].match(/([a-zA-Z0-9]+)(=([a-zA-Z0-9]+))?/);
            if (match)
            {
                if (match[1] === key)
                    return match[3] ?? "";
            }
        }

        return null;
    }

    function getAllQueryValues()
    {
        if (window.location.search.length === 0 || window.location.search[0] !== "?")
            return {};

        const result: { [key: string]: string | null } = {};
        const queryValues = window.location.search.substr(1).split("&");
        for (let i = 0; i < queryValues.length; ++i)
        {
            const match = queryValues[i].match(/([a-zA-Z0-9]+)(=([a-zA-Z0-9]+))?/);
            if (match)
                result[match[1]] = match[3] ?? null;
        }

        return result;
    }

    const isTestnet = hasQueryKey("testnet");
    if (isTestnet)
    {
        document.getElementById("testnet_text")!.style.display = "";
        document.getElementById("run_tests_link")!.style.display = "none";
    }

    document.getElementById("testnet_link_li")!.style.display = isTestnet ? "none" : "";
    document.getElementById("mainnet_link_li")!.style.display = isTestnet ? "" : "none";

    function setDarkMode(isDark: boolean)
    {
        darkMode = isDark;
        document.body.className = isDark ? "dark" : "light";
    }

    window.addEventListener("load", () =>
    {
        const newLink = document.createElement("link");
        newLink.rel = "shortcut icon";
        newLink.type = "image/png";
        newLink.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACbUlEQVR42myTS0iUURTHf+fO9803M04+hlQw0VAqg1IyMqGsRRlS0KYnURRUm4ggCFoG0aZNKxehGxeSm8CdkAQG0UITS4qoQKKHUjPlNOl88/get8XM5KSezeVefv9z//ece6ShJcOqaI/UyW03yyE3rWs1YEaIi5LxXEo/AGbLYSlLEIrUy1Amoc9ov3AQjgleRpMvIYK2KmUkl9JXARvAKInDG+Wl/UPvKIKgoeOWgb/sYc8JmQVh7rkruZQ+F9zA9vwS+4CMAohukuHMz4I4VKO4MGnR2x+ktUeRjSu2XTRxKlZs55fYFYwyWHpCuyhmS7aVAQ3dwtEhq+CkGJ/HfKbuuyS/+ZS53K0qm+ROSQzgu7A0JyCQeOsy3JVj6r5HU5/i+GgQq7qYVYNZwQ2VX+bg6jbUdxbWhRcK+5fm9YBD+quPFYOaZilHjxj5lK5ZnaB2bwFqO6mItVgYUSHaDH8+ahLvV+y6GeqUZm007g+AholrDokZn+qtGjS8GfTwcv+zyqqSZGkTbVQ0dAWoalYsv4Mv0x7TAw7j110Q6L5rIIEVsREmbpgVPMsucgLgwD2Txh4p/Rla+wzSCx6bjxVU+TSUF1xrxqWhJdOB8AqNBCyo6whw+KGJ8x02bAFR/Kv65D2P2SGnvI17DGA2UiuP7bg+5eUg+cHHqoDRy3nOTgQZO+9ihuDPJ5/FL365/UeuzbQBYMf1pVC1tGV/651eXvP0ikswqpkf18xPumuKbEaYcWyurh6mcCgmQ9mkPs16rSnaNsOMODZXSsMk64xzp1UlN7Wve500G4s3JnyfJ65NPzBdDv8dAPwl9qfQLkNMAAAAAElFTkSuQmCC";
        document.getElementsByTagName("head")[0].appendChild(newLink);

        document.getElementById("view_address_privkey_textbox")!.addEventListener("keydown", event =>
        {
            if (event.keyCode === 13)
            {
                event.preventDefault();
                view_address_details();
            }
        });

        document.getElementById("view_address_bip38_password_textbox")!.addEventListener("keydown", event =>
        {
            if (event.keyCode === 13)
            {
                event.preventDefault();
                bip38decrypt_button();
            }
        });

        document.getElementById("bulk_count")!.addEventListener("keydown", event =>
        {
            if (event.keyCode === 13)
            {
                event.preventDefault();
                bulk_generate();
            }
        });

        document.getElementById("randomness_overlay2")!.style.display = "table";

        window.addEventListener("resize", randomnessCanvasResizerFunction);
        randomnessCanvasResizerFunction();

        randomnessCanvasCTX.fillStyle = darkMode ? "#323639" : "#ffffff";
        randomnessCanvasCTX.fillRect(0, 0, randomnessCanvas.width, randomnessCanvas.height);

        const randomnessMax = 1000;
        let randomnessIndex = 0;
        const tempRandomnessBytes = new Array<number>(randomnessMax);
        randomnessCanvas.onmousemove = event =>
        {
            if (randomnessIndex > randomnessMax)
            {
                window.removeEventListener("resize", randomnessCanvasResizerFunction);

                randomnessNumbers.length = 0;
                const cryptoRandomNumbers = crypto.getRandomValues(new Uint32Array(32));
                typedArrayPush(randomnessNumbers, cryptoRandomNumbers);

                randomnessNumbers.push(...tempRandomnessBytes);
                randomnessCanvas.onmousemove = null;
                randomnessIndex = 0;
                tempRandomnessBytes.length = 0;
                generate_address();
                document.getElementById("randomness_overlay")!.style.display = "none";
                return;
            }

            const rect = (<HTMLElement>event.target).getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            randomnessCanvasCTX.beginPath();
            randomnessCanvasCTX.arc(x, y, 4, 0, Math.PI * 2);
            randomnessCanvasCTX.fill();
            randomnessText.textContent = "Move your mouse around here for randomness\n" + Math.floor(randomnessIndex / randomnessMax * 100) + "%";

            tempRandomnessBytes[randomnessIndex++] = event.clientX + event.clientY * document.documentElement.clientWidth;
        };

        randomnessCanvasCTX.fillStyle = "#5b96f7";

        if (window.location.protocol !== "file:")
            document.getElementById("warning_text")!.style.display = "";

        setDarkMode(darkMode);
    });

    // secp256k1 parameters
    const ecc_p =  new BN("0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16);
    const ecc_a =  new BN(0);
    const ecc_Gx = new BN("079BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", 16);
    const ecc_Gy = new BN("0483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", 16);
    const ecc_n =  new BN("0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16);

    const bn_0 = new BN(0);
    const bn_1 = new BN(1);
    const bn_2 = new BN(2);
    const bn_3 = new BN(3);
    const bn_58 = new BN(58);
    const bn_255 = new BN(255);

    function modinv(a: BN, n: BN)
    {
        let lm = new BN(1);
        let hm = new BN(0);
        let low = a.mod(n);
        let high = n;
        let ratio: BN;
        let nm: BN;
        let nnew: BN;

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

    function ecAdd(ax: BN, ay: BN, bx: BN, by: BN)
    {
        const lambda = ((by.sub(ay)).mul(modinv(bx.sub(ax), ecc_p))).mod(ecc_p);
        const x = (lambda.mul(lambda).sub(ax).sub(bx)).mod(ecc_p);
        const y = (lambda.mul(ax.sub(x)).sub(ay)).mod(ecc_p);
        return <EcKeypair>{
            x: x,
            y: y
        };
    }

    function ecDouble(ax: BN, ay: BN)
    {
        const lambda = ((bn_3.mul(ax).mul(ax).add(ecc_a)).mul(modinv(bn_2.mul(ay), ecc_p))).mod(ecc_p);
        const x = (lambda.mul(lambda).sub(bn_2.mul(ax))).mod(ecc_p);
        const y = (lambda.mul(ax.sub(x)).sub(ay)).mod(ecc_p);
        return <EcKeypair>{
            x: x,
            y: y
        };
    }

    // convert bigint to bool array (bits)
    function bigintToBitArray(bigint: BN)
    {
        if (bigint.isNeg())
            return [false];

        const values: boolean[] = [];
        while (bigint.gt(bn_0))
        {
            values.push(bigint.isOdd());
            bigint = bigint.shrn(1);
        }
        return values.reverse();
    }

    interface EcKeypair
    {
        x: BN;
        y: BN;
    }

    function EccMultiply(gx: BN, gy: BN, scalar: BN)
    {
        let qx = gx;
        let qy = gy;

        const bits = bigintToBitArray(scalar);
        for (let i = 1; i < bits.length; ++i)
        {
            const ret = ecDouble(qx, qy);
            qx = ret.x;
            qy = ret.y;
            if (bits[i])
            {
                const ret2 = ecAdd(qx, qy, gx, gy);
                qx = ret2.x;
                qy = ret2.y;
            }
        }

        while (qy.isNeg())
            qy = qy.add(ecc_p);

        return <EcKeypair>{
            x: qx,
            y: qy,
        };
    }

    // convert bigint to byte array (uint8)
    function bigintToByteArray(bigint: BN)
    {
        const ret: number[] = [];

        while (bigint.gt(bn_0))
        {
            ret.push(bigint.and(bn_255).toNumber());
            bigint = bigint.shrn(8);
        }

        return ret;
    }

    function byteArrayToBigint(bytes: number[])
    {
        let bigint = new BN(0);
        for (let i = 0; i < bytes.length; ++i)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[i]));
        }

        return bigint;
    }

    function byteArrayXOR(b1: number[], b2: number[])
    {
        const ret: number[] = [];
        for (let i = 0; i < b1.length; ++i)
            ret.push(b1[i] ^ b2[i]);

        return ret;
    }

    function typedArrayPush(targetArray: number[], srcArray: Uint8Array | Uint32Array)
    {
        for (let i = 0; i < srcArray.length; ++i)
            targetArray.push(srcArray[i]);
    }

    function skipRandomness()
    {
        document.getElementById("randomness_overlay")!.style.display = "none";
        window.removeEventListener("resize", randomnessCanvasResizerFunction);
        generate_address();
    }

    function get32SecureRandomBytes()
    {
        if (randomnessNumbers !== undefined)
        {
            const tempArray: number[] = [];
            typedArrayPush(tempArray, window.crypto.getRandomValues(new Uint8Array(8)));
            tempArray.push(...randomnessNumbers);

            const tempArray2 = SHA256(tempArray);
            typedArrayPush(tempArray2, window.crypto.getRandomValues(new Uint8Array(8)));

            return SHA256(tempArray2);
        }

        const bytes = window.crypto.getRandomValues(new Uint8Array(32));
        const ret = new Array<number>(32);
        for (let i = 0; i < 32; ++i)
            ret[i] = bytes[i];

        return ret;
    }

    function showBip38Info()
    {
        document.getElementById("bip38_info")!.style.display = "table";
    }

    function bip38changed(checkbox: HTMLInputElement, layout: string)
    {
        let element: string;
        switch (layout)
        {
            case "bulk":
                element = "bip38_password_box_div_bulk";
                break;
            case "paperwallet":
                element = "bip38_password_box_div_paper";
                const customPaperWalletDummyPrivkey = document.getElementById("paperwallet_custom_preview_privkey");
                if (customPaperWalletDummyPrivkey)
                {
                    let lineLength = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_length")).value);
                    if (isNaN(lineLength) || lineLength < 0)
                        lineLength = 0;

                    customPaperWalletDummyPrivkey.innerHTML = splitTextLength((checkbox.checked) ? "6Pnabcdefghijkmnopqrstuvwxyz1234567ABCDEFGHJKLMNPQRSTUVXYZ" : "K1abcdefghijkmnopqrstuvwxyzabcdefghijkmnopqrstuvwxyz", lineLength);
                }

                document.getElementById("paper_custom_privkeys_bip38")!.style.display = checkbox.checked ? "" : "none";
                document.getElementById("paper_custom_addresses_no_bip38")!.style.display = checkbox.checked ? "none" : "";

                break;
            default:
                return;
        }

        document.getElementById(element)!.style.display = checkbox.checked ? "table" : "none";
    }

    type bip38ProgressCallback = (currentCount: number, maxCount: number) => void;
    type bip38Callback = (data: AddressAndPrivkey[] | string) => void;
    type AddressType = "bech32" | "segwit" | "legacy";

    let bip38generate_type: AddressType = "bech32";
    let bip38generate_maxcount = 0;
    let bip38generate_currentcount = 0;
    let bip38generate_data: AddressAndPrivkey[] | null = null;
    let bip38generate_callback: bip38Callback | null = null;
    let bip38generate_progress: bip38ProgressCallback | null = null;
    let bip38generate_keypair: EcKeypair | null = null;
    let bip38generate_passpoint: number[] | null = null;
    let bip38generate_ownersalt: number[] | null = null;
    function bip38generate(password: string, count: number, type: AddressType, progress: bip38ProgressCallback, callback: bip38Callback)
    {
        if (password === "")
        {
            callback("Password must not be empty");
            return;
        }

        const ownersalt = get32SecureRandomBytes().slice(0, 8);

        const passfactor = <number[]>scrypt(password, ownersalt, 14, 8, 8, 32);

        const bigint = byteArrayToBigint(passfactor);

        const keypair = EccMultiply(ecc_Gx, ecc_Gy, bigint);
        const bytes_public_x = bigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);

        const passpoint = bytes_public_x.slice(); // copy

        if (keypair.y.isOdd())
            passpoint.push(0x03);
        else
            passpoint.push(0x02);

        passpoint.reverse();

        bip38generate_data = new Array<AddressAndPrivkey>(count);
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

    interface AddressAndPrivkey
    {
        address: string;
        privkey: string;
    }

    function bip38generate_timeout()
    {
        if (bip38generate_currentcount < bip38generate_maxcount)
        {
            const seedb = get32SecureRandomBytes().slice(0, 24);

            const factorb = SHA256(SHA256(seedb));

            const ecpoint = EccMultiply(bip38generate_keypair!.x, bip38generate_keypair!.y, byteArrayToBigint(factorb));
            const generatedaddress = makeAddress(ecpoint);
            let address_with_type;
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

            const addresshash = SHA256(SHA256(generatedaddress)).slice(0, 4);

            const salt: number[] = [];
            salt.push(...addresshash);
            salt.push(...bip38generate_ownersalt!);

            const encrypted = <number[]>scrypt(bip38generate_passpoint!, salt, 10, 1, 1, 64);
            const derivedhalf1 = encrypted.slice(0, 32);
            const derivedhalf2 = encrypted.slice(32, 64);

            const encryptedpart1 = AES_Encrypt_ECB_NoPadding(byteArrayXOR(seedb.slice(0, 16), derivedhalf1.slice(0, 16)), derivedhalf2);

            const block2: number[] = [];
            block2.push.apply(block2, encryptedpart1.slice(8, 16));
            block2.push.apply(block2, seedb.slice(16, 24));
            const encryptedpart2 = AES_Encrypt_ECB_NoPadding(byteArrayXOR(block2, derivedhalf1.slice(16, 32)), derivedhalf2);

            const finalprivkey = [0x01, 0x43, 0x20];
            finalprivkey.push(...addresshash);
            finalprivkey.push(...bip38generate_ownersalt!);
            finalprivkey.push.apply(finalprivkey, encryptedpart1.slice(0, 8));
            finalprivkey.push(...encryptedpart2);
            finalprivkey.push.apply(finalprivkey, SHA256(SHA256(finalprivkey)).slice(0, 4));

            bip38generate_data![bip38generate_currentcount] = <AddressAndPrivkey>{
                address: address_with_type,
                privkey: base58encode(finalprivkey)
            };
            /*"" + (bip38generate_currentcount + 1) + ", \"" + address_with_type + "\", \"" + base58encode(finalprivkey) + "\"";*/
            ++bip38generate_currentcount;

            bip38generate_progress!(bip38generate_currentcount, bip38generate_maxcount);
            setImmediate(bip38generate_timeout);
        }
        else
        {
            bip38generate_currentcount = 0;
            bip38generate_maxcount = 0;
            bip38generate_keypair = null;
            bip38generate_passpoint = null;
            bip38generate_ownersalt = null;
            bip38generate_callback!(bip38generate_data!);
            bip38generate_callback = null;
            bip38generate_progress = null;
            bip38generate_data = null;
        }
    }

    function bip38decrypt_button()
    {
        document.getElementById("view_address_information")!.textContent = "Decrypting...";
        setImmediate(function()
        {
            const privkey = (<HTMLInputElement>document.getElementById("view_address_privkey_textbox")).value;
            const password = (<HTMLInputElement>document.getElementById("view_address_bip38_password_textbox")).value;
            const result = bip38decrypt(privkey, password);

            if (typeof result === "string")
            {
                document.getElementById("view_address_information")!.textContent = "Cannot decrypt address (" + result + ")";
                document.getElementById("view_address_segwitaddress")!.textContent = "";
                document.getElementById("view_address_bech32address")!.textContent = "";
                document.getElementById("view_address_legacyaddress")!.textContent = "";
                document.getElementById("view_address_segwitaddress_qr")!.textContent = "";
                document.getElementById("view_address_bech32address_qr")!.textContent = "";
                document.getElementById("view_address_legacyaddress_qr")!.textContent = "";
                document.getElementById("view_address_container")!.style.display = "none";
                return;
            }

            if (typeof result === "number")
                return;

            const result2 = view_address_details_result(result.privkey);
            if (typeof result2 === "string")
            {
                document.getElementById("view_address_information")!.textContent = "Error decoding private key (" + result + ")";
                document.getElementById("view_address_segwitaddress")!.textContent = "";
                document.getElementById("view_address_bech32address")!.textContent = "";
                document.getElementById("view_address_legacyaddress")!.textContent = "";
                document.getElementById("view_address_segwitaddress_qr")!.textContent = "";
                document.getElementById("view_address_bech32address_qr")!.textContent = "";
                document.getElementById("view_address_legacyaddress_qr")!.textContent = "";
                document.getElementById("view_address_container")!.style.display = "none";
                return;
            }

            if (typeof result2 === "number")
                return;

            document.getElementById("view_address_information")!.innerHTML = "Details for encrypted private key: <strong>" +
                privkey + "</strong><br /><br />Decrypted private key: <strong>" + result.privkey + "</strong>";

            document.getElementById("view_address_segwitaddress")!.textContent = "Segwit address: " + result2.segwitAddress;
            document.getElementById("view_address_bech32address")!.textContent = "Segwit (bech32) address: " + result2.bech32Address;
            document.getElementById("view_address_legacyaddress")!.textContent = "Legacy address: " + result2.legacyAddress;

            const segwitQR = qrcode(0, qrErrorCorrectionLevel);
            segwitQR.addData(result2.segwitAddress);
            segwitQR.make();
            document.getElementById("view_address_segwitaddress_qr")!.innerHTML = segwitQR.createImgTag(4, 8);

            const bech32QR = qrcode(0, qrErrorCorrectionLevel);
            bech32QR.addData(result2.bech32Address.toUpperCase(), "Alphanumeric");
            bech32QR.make();
            document.getElementById("view_address_bech32address_qr")!.innerHTML = bech32QR.createImgTag(4, 8);

            const legacyQR = qrcode(0, qrErrorCorrectionLevel);
            legacyQR.addData(result2.legacyAddress);
            legacyQR.make();
            document.getElementById("view_address_legacyaddress_qr")!.innerHTML = legacyQR.createImgTag(4, 8);

            const viewAddressContainerStyle = document.getElementById("view_address_container")!.style;
            viewAddressContainerStyle.display = "table";
            viewAddressContainerStyle.border = "2px solid #bbbbbb";
            viewAddressContainerStyle.borderRadius = "3px";
        });
    }

    function bip38decrypt(privkey: string, password: string, dummyTest: boolean = false)
    {
        if (password === "" && !dummyTest)
            return "password must not be empty";

        let newstring = privkey.split("").reverse().join("");
        for (let i = 0; i < privkey.length; ++i)
        {
            if (privkey[i] === base58Characters[0])
                newstring = newstring.substr(0, newstring.length - 1);
            else
                break;
        }

        let bigint = new BN(0);
        for (let i = newstring.length - 1; i >= 0; --i)
            bigint = bigint.mul(bn_58).add(new BN(base58CharsIndices[newstring[i]]));

        const bytes = bigintToByteArray(bigint);

        if (bytes.length !== 43)
            return "invalid length";

        bytes.reverse();

        const checksum = bytes.slice(bytes.length - 4, bytes.length);
        bytes.splice(bytes.length - 4, 4);
        const sha_result = SHA256(SHA256(bytes));

        for (let i = 0; i < 4; ++i)
        {
            if (sha_result[i] !== checksum[i])
                return "invalid checksum";
        }

        if (bytes[0] !== 0x01)
            return "invalid byte at position 0";

        bytes.shift();

        // typescript will show an error if I have (bytes[0] === 0x43) here, because it doesn't know that bytes.shift() changes the array
        // see https://github.com/microsoft/TypeScript/issues/35795
        // putting any here so it works
        if (<any>bytes[0] === 0x43)
        {
            if ((bytes[1] & 0x20) === 0)
                return "only compressed private keys are supported";

            if (dummyTest)
                return 1; // dummy return value, only for checking if the private key is in the correct format

            const ownersalt = bytes.slice(6, 14);
            const scrypt_result = <number[]>scrypt(password, ownersalt, 14, 8, 8, 32);
            const bigint2 = byteArrayToBigint(scrypt_result);
            const keypair = getECCKeypair(bigint2);

            const bytes_public_x = bigintToByteArray(keypair.x);
            while (bytes_public_x.length < 32)
                bytes_public_x.push(0);

            const passpoint: number[] = [];
            passpoint.push(...bytes_public_x);

            if (keypair.y.isOdd())
                passpoint.push(0x03);
            else
                passpoint.push(0x02);

            passpoint.reverse();
            const encryptedpart2 = bytes.slice(22, 38);
            const addresshash = bytes.slice(2, 14);
            const scrypt_result_2 = <number[]>scrypt(passpoint, addresshash, 10, 1, 1, 64);

            const derivedhalf1 = scrypt_result_2.slice(0, 32);
            const derivedhalf2 = scrypt_result_2.slice(32, 64);

            const decrypted2 = AES_Decrypt_ECB_NoPadding(encryptedpart2, derivedhalf2);

            const encryptedpart1 = bytes.slice(14, 22);
            encryptedpart1.push.apply(encryptedpart1, byteArrayXOR(decrypted2.slice(0, 8), scrypt_result_2.slice(16, 24)));
            const decrypted1 = AES_Decrypt_ECB_NoPadding(encryptedpart1, derivedhalf2);
            const seedb = byteArrayXOR(decrypted1.slice(0, 16), derivedhalf1.slice(0, 16));
            seedb.push.apply(seedb, byteArrayXOR(decrypted2.slice(8, 16), derivedhalf1.slice(24, 32)));
            const factorb = SHA256(SHA256(seedb));

            const finalprivkeybigint = byteArrayToBigint(scrypt_result).mul(byteArrayToBigint(factorb)).mod(ecc_n);

            const finalkeypair = getECCKeypair(finalprivkeybigint);
            const finaladdress = makeAddress(finalkeypair);
            const finaladdresshash = SHA256(SHA256(finaladdress));

            for (let i = 0; i < 4; ++i)
            {
                if (addresshash[i] !== finaladdresshash[i])
                    return "invalid password";
            }

            const finalprivkey = makePrivateKey(finalprivkeybigint);

            return <AddressAndPrivkey>{
                address: finaladdress,
                privkey: finalprivkey
            };
        }
        else if (<any>bytes[0] === 0x42)
        {
            if (bytes[1] !== 0xe0)
                return "only compressed private keys are supported";

            if (dummyTest)
                return 1;

            const addresshash = bytes.slice(2, 6);
            const derivedBytes = <number[]>scrypt(password, addresshash, 14, 8, 8, 64);
            const decrypted = AES_Decrypt_ECB_NoPadding(bytes.slice(6, 38), derivedBytes.slice(32));
            const privkeyBytes = byteArrayXOR(decrypted, derivedBytes);

            const finalprivkeybigint = byteArrayToBigint(privkeyBytes);
            const finalkeypair = getECCKeypair(finalprivkeybigint);
            const finaladdress = makeAddress(finalkeypair);
            const finaladdresshash = SHA256(SHA256(finaladdress));

            for (let i = 0; i < 4; ++i)
            {
                if (addresshash[i] !== finaladdresshash[i])
                    return "invalid password";
            }

            const finalprivkey = makePrivateKey(finalprivkeybigint);

            return <AddressAndPrivkey>{
                address: finaladdress,
                privkey: finalprivkey
            };
        }
        else
            return "invalid byte at EC multiply flag";
    }

    const base58Characters = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const base58CharsIndices: { [key: string]: number } = {
        "1": 0, "2": 1, "3": 2, "4": 3,
        "5": 4, "6": 5, "7": 6, "8": 7,
        "9": 8, "A": 9, "B": 10, "C": 11,
        "D": 12, "E": 13, "F": 14, "G": 15,
        "H": 16, "J": 17, "K": 18, "L": 19,
        "M": 20, "N": 21, "P": 22, "Q": 23,
        "R": 24, "S": 25, "T": 26, "U": 27,
        "V": 28, "W": 29, "X": 30, "Y": 31,
        "Z": 32, "a": 33, "b": 34, "c": 35,
        "d": 36, "e": 37, "f": 38, "g": 39,
        "h": 40, "i": 41, "j": 42, "k": 43,
        "m": 44, "n": 45, "o": 46, "p": 47,
        "q": 48, "r": 49, "s": 50, "t": 51,
        "u": 52, "v": 53, "w": 54, "x": 55,
        "y": 56, "z": 57,
    }

    function base58encode(bytes: number[])
    {
        let leading_zeroes = 0;
        while (bytes[leading_zeroes] === 0) // count leading zeroes
            ++leading_zeroes;

        let bigint = new BN(0);
        // convert bytes to bigint
        for (let i = 0; i < bytes.length; ++i)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[i]));
        }

        bytes.reverse();

        let ret = "";
        while (bigint.gt(bn_0))
        {
            // get base58 character
            const remainder = bigint.mod(bn_58);
            bigint = bigint.div(bn_58);
            ret += base58Characters[remainder.toNumber()];
        }

        for (let i = 0; i < leading_zeroes; ++i) // add padding if necessary
            ret += base58Characters[0];

        return ret.split("").reverse().join("");
    }

    function base58checkEncode(bytes: number[])
    {
        let leading_zeroes = 0;
        while (bytes[leading_zeroes] === 0) // count leading zeroes
            ++leading_zeroes;

        bytes.push.apply(bytes, SHA256(SHA256(bytes)).slice(0, 4));

        let bigint = new BN(0);
        // convert bytes to bigint
        for (let i = 0; i < bytes.length; ++i)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[i]));
        }

        bytes.reverse();

        let ret = "";
        while (bigint.gt(bn_0))
        {
            // get base58 character
            const remainder = bigint.mod(bn_58);
            bigint = bigint.div(bn_58);
            ret += base58Characters[remainder.toNumber()];
        }

        for (let i = 0; i < leading_zeroes; ++i) // add padding if necessary
            ret += base58Characters[0];

        return ret.split("").reverse().join("");
    }

    function base58checkDecode(text: string)
    {
        let newstring = text.split("").reverse().join("");
        for (let i = 0; i < text.length; ++i)
        {
            if (text[i] == base58Characters[0])
                newstring = newstring.substr(0, newstring.length - 1);
            else
                break;
        }

        let bigint = bn_0;
        for (let i = newstring.length - 1; i >= 0; --i)
        {
            const charIndex = base58CharsIndices[newstring[i]]
            if (charIndex === undefined)
                throw new Error("invalid character: " + newstring[i]);

            bigint = (bigint.mul(bn_58)).add(new BN(charIndex));
        }

        let bytes = bigintToByteArray(bigint);
        if (bytes[bytes.length - 1] == 0)
            bytes.pop();

        bytes.reverse();

        const checksum = bytes.slice(bytes.length - 4, bytes.length);
        bytes.splice(bytes.length - 4, 4);
        const sha_result = SHA256(SHA256(bytes));

        for (var i = 0; i < 4; ++i)
        {
            if (sha_result[i] != checksum[i])
                throw new Error("invalid checksum");
        }

        return bytes;
    }

    // get ECC public key from bigint
    function getECCKeypair(val: BN)
    {
        if (val.isZero() || val.gte(ecc_n))
        {
            console.log("invalid value");
            throw new Error("Invalid EC value");
        }

        return EccMultiply(ecc_Gx, ecc_Gy, val);
    }

    // make legacy address from public key
    function makeAddress(keypair: EcKeypair)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = bigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = SHA256(key_bytes);
        const ripemd_result_2 = RIPEMD160(sha_result_1);
        const ripemd_extended = [isTestnet ? 0x6F : 0x00];
        ripemd_extended.push(...ripemd_result_2);
        const sha_result_3 = SHA256(ripemd_extended);
        const sha_result_4 = SHA256(sha_result_3);
        ripemd_extended.push.apply(ripemd_extended, sha_result_4.slice(0, 4));

        return base58encode(ripemd_extended);
    }

    // make segwit address from public key
    function makeSegwitAddress(keypair: EcKeypair)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = bigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = SHA256(key_bytes);
        const keyhash = RIPEMD160(sha_result_1);

        const redeemscript = [0x00, 0x14];
        redeemscript.push(...keyhash);

        const redeemscripthash = [isTestnet ? 0xC4 : 0x05];

        redeemscripthash.push(...RIPEMD160(SHA256(redeemscript)));
        redeemscripthash.push.apply(redeemscripthash, SHA256(SHA256(redeemscripthash)).slice(0, 4));

        return base58encode(redeemscripthash);
    }

    const bech32Chars = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

    function bech32HrpExpand(hrp: string)
    {
        const ret = [];
        for (let i = 0; i < hrp.length; ++i)
            ret.push(hrp.charCodeAt(i) >> 5);

        ret.push(0);

        for (let i = 0; i < hrp.length; ++i)
            ret.push(hrp.charCodeAt(i) & 0x1f);

        return ret;
    }

    function bech32Polymod(values: number[])
    {
        const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
        let chk = 1;

        for (let i = 0; i < values.length; ++i)
        {
            const b = chk >> 25;
            chk = ((chk & 0x1ffffff) << 5) ^ values[i];

            for (let j = 0; j < 5; ++j)
            {
                if ((b >> j) & 1)
                    chk ^= GEN[j];
            }
        }

        return chk;
    }

    function bech32CreateChecksum(hrp: string, data: number[])
    {
        const hrpExpanded = bech32HrpExpand(hrp);
        hrpExpanded.push(...data);
        hrpExpanded.push.apply(hrpExpanded, [0, 0, 0, 0, 0, 0]);

        const polymod = bech32Polymod(hrpExpanded) ^ 1;

        const ret = [];
        for (let i = 0; i < 6; ++i)
            ret.push((polymod >> 5 * (5 - i)) & 31);

        return ret;
    }

    // create bech32 address from public key
    function makeBech32Address(keypair: EcKeypair)
    {
        const key_bytes: number[] = [];

        const bytes_public_x = bigintToByteArray(keypair.x);
        while (bytes_public_x.length < 32)
            bytes_public_x.push(0);

        key_bytes.push(...bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = SHA256(key_bytes);
        const keyhash = RIPEMD160(sha_result_1);

        const redeemscript = [0x00, 0x14];
        redeemscript.push(...keyhash);

        let value = 0;
        let bits = 0;

        const result = [0];
        for (let i = 0; i < 20; ++i)
        {
            value = ((value << 8) | keyhash[i]) & 0xFFFFFF;
            bits += 8;

            while (bits >= 5)
            {
                bits -= 5;
                result.push((value >> bits) & 0x1F);
            }
        }

        let address = isTestnet ? "tb1" : "bc1";
        for (let i = 0; i < result.length; ++i)
            address += bech32Chars[result[i]];

        const checksum = bech32CreateChecksum(isTestnet ? "tb" : "bc", result);
        for (let i = 0; i < checksum.length; ++i)
            address += bech32Chars[checksum[i]];

        return address;
    }

    // create base58 encoded private key from bigint
    function makePrivateKey(bigint: BN)
    {
        const privkey: number[] = [];
        privkey.push(0x01);

        const temp = bigintToByteArray(bigint);
        while (temp.length < 32)
           temp.push(0);

        privkey.push(...temp);
        privkey.push(isTestnet ? 0xEF : 0x80);
        privkey.reverse();
        privkey.push.apply(privkey, SHA256(SHA256(privkey)).slice(0, 4));
        return base58encode(privkey);
    }

    let singleAddressType: AddressType = "bech32";
    // set generated address type (single address)
    function setAddressType(type: AddressType)
    {
        singleAddressType = type;
    }

    type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";
    let qrErrorCorrectionLevel: QRCodeErrorCorrectionLevel = "H";
    // set qr code error correction level (single address)
    function setQRErrorCorrectionLevel(level: QRCodeErrorCorrectionLevel)
    {
        qrErrorCorrectionLevel = level;

        // update qr codes
        const privkey = document.getElementById("single_address_privkey")!.textContent!;
        const privkeyQR = qrcode(0, qrErrorCorrectionLevel);
        privkeyQR.addData(privkey);
        privkeyQR.make();

        (<HTMLImageElement>document.getElementById("single_address_privkey_qr")).src = privkeyQR.createDataURL(6, 12);

        const address = document.getElementById("single_address_address")!.textContent!;
        const addressQR = qrcode(0, qrErrorCorrectionLevel);
        if (singleAddressType === "bech32")
            addressQR.addData(address.toUpperCase(), "Alphanumeric");
        else
            addressQR.addData(address);

        addressQR.make();

        (<HTMLImageElement>document.getElementById("single_address_qr")).src = addressQR.createDataURL(6, 12);
    }

    interface AddressAndPrivkeyWithTypeAndQR
    {
        address: string;
        privkey: string;
        addressType?: AddressType;
        addressQR?: qrcode;
        privkeyQR?: qrcode;
    }

    // generate one address (single address)
    function generate_address()
    {
        const bytes = get32SecureRandomBytes();

        const result = generate_address_result(bytes, singleAddressType, true, qrErrorCorrectionLevel);

        document.getElementById("single_address_privkey")!.textContent = result.privkey;
        const qr_div_privkey = <HTMLImageElement>document.getElementById("single_address_privkey_qr");
        qr_div_privkey.src = result.privkeyQR!.createDataURL(6, 12);
        qr_div_privkey.style.display = "block";
        qr_div_privkey.style.marginLeft = "auto";
        qr_div_privkey.style.marginRight = "auto";

        document.getElementById("single_address_address")!.textContent = result.address;
        const qr_div_address = <HTMLImageElement>document.getElementById("single_address_qr");
        qr_div_address.src = result.addressQR!.createDataURL(6, 12);
        qr_div_address.style.display = "block";
        qr_div_address.style.marginLeft = "auto";
        qr_div_address.style.marginRight = "auto";

        document.getElementById("address_div")!.style.display = "table";
    }

    // generates address from bytes, then returns the address and qr code if necessary
    function generate_address_result(bytes: number[], type: AddressType, generateQR: boolean, paramQRErrorCorrectionLevel?: QRCodeErrorCorrectionLevel)
    {
        let bigint = new BN(0);
        for (let j = 0; j < bytes.length; ++j)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[j]));
        }

        const keypair = getECCKeypair(bigint);
        const privkey = makePrivateKey(bigint);

        let address;
        let return_address_type;
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
            const privkeyQR = qrcode(0, paramQRErrorCorrectionLevel!);
            privkeyQR.addData(privkey);
            privkeyQR.make();

            const addressQR = qrcode(0, paramQRErrorCorrectionLevel!);
            if (type === "bech32")
                addressQR.addData(address.toUpperCase(), "Alphanumeric");
            else
                addressQR.addData(address);

            addressQR.make();

            return <AddressAndPrivkeyWithTypeAndQR>{
                address: address,
                privkey: privkey,
                addressType: return_address_type,
                addressQR: addressQR,
                privkeyQR: privkeyQR
            };
        }

        return <AddressAndPrivkeyWithTypeAndQR>{
            address: address,
            privkey: privkey,
            addressType: return_address_type
        };
    }

    const bulkTextarea = <HTMLTextAreaElement>document.getElementById("bulk_addresses");
    const paperWalletProgressText = document.getElementById("paperwallet_generate_progress_text")!;

    interface ViewAddressResult
    {
        segwitAddress: string;
        bech32Address: string;
        legacyAddress: string;
    }

    // returns addresses generated from the private key
    function view_address_details_result(privkey: string)
    {
        if (privkey.length === 58 && privkey[0] === "6" && privkey[1] === "P")
        {
            // maybe a bip38 encrypted key
            const bip38_result = bip38decrypt(privkey, "", true);
            if (typeof bip38_result === "number")
            {
                document.getElementById("bip38_decrypt_div")!.style.display = "block";
                return 1;
            }
            else if (typeof bip38_result === "string")
                return bip38_result;
            else
                document.getElementById("bip38_decrypt_div")!.style.display = "none";
        }
        else
            document.getElementById("bip38_decrypt_div")!.style.display = "none";

        const keypair = privkeyStringToKeyPair(privkey);
        if (typeof keypair === "string")
            return keypair;

        return <ViewAddressResult>{
            segwitAddress: makeSegwitAddress(keypair.keypair),
            bech32Address: makeBech32Address(keypair.keypair),
            legacyAddress: makeAddress(keypair.keypair)
        };
    }

    interface PrivateKeyWithKeypair
    {
        privkey: BN;
        keypair: EcKeypair;
    }

    function privkeyStringToKeyPair(privkey: string)
    {
        let newstring = privkey.split("").reverse().join("");
        for (let i = 0; i < privkey.length; ++i)
        {
            if (privkey[i] === base58Characters[0])
                newstring = newstring.substr(0, newstring.length - 1);
            else
                break;
        }

        let bigint = new BN(0);
        for (let i = newstring.length - 1; i >= 0; --i)
            bigint = bigint.mul(bn_58).add(new BN(base58CharsIndices[newstring[i]]));

        const bytes = bigintToByteArray(bigint);
        if (bytes[bytes.length - 1] === 0)
            bytes.pop();

        bytes.reverse();

        const checksum = bytes.slice(bytes.length - 4, bytes.length);
        bytes.splice(bytes.length - 4, 4);
        const sha_result = SHA256(SHA256(bytes));

        for (let i = 0; i < 4; ++i)
        {
            if (sha_result[i] !== checksum[i])
                return "invalid checksum";
        }

        if (bytes.pop() !== 1)
            return "only compressed private keys are supported, they start with 'L' or 'K'";

        bytes.reverse();
        bytes.pop();

        if (bytes.length !== 32)
            return "invalid length";

        bigint = new BN(0);
        for (let j = bytes.length - 1; j >= 0; --j)
        {
            bigint = bigint.shln(8);
            bigint = bigint.or(new BN(bytes[j]));
        }

        const keypair = getECCKeypair(bigint);

        const privkey2 = makePrivateKey(bigint);
        if (privkey !== privkey2)
            return "cannot decode private key";

        return <PrivateKeyWithKeypair>{
            privkey: bigint,
            keypair: keypair
        };
    }

    // shows addresses generated from the given private key
    function view_address_details()
    {
        const privkey = (<HTMLInputElement>document.getElementById("view_address_privkey_textbox")).value.trim();
        if (privkey === "")
            return;

        const result = view_address_details_result(privkey);
        if (typeof result === "string" || typeof result === "number")
        {
            if (typeof result === "string")
            {
                // error
                document.getElementById("view_address_information")!.textContent = "Invalid private key (" + result + ")";
            }
            else
            {
                // bip38 encrypted
                document.getElementById("view_address_information")!.textContent = "";
            }

            document.getElementById("view_address_segwitaddress")!.textContent = "";
            document.getElementById("view_address_bech32address")!.textContent = "";
            document.getElementById("view_address_legacyaddress")!.textContent = "";
            document.getElementById("view_address_segwitaddress_qr")!.textContent = "";
            document.getElementById("view_address_bech32address_qr")!.textContent = "";
            document.getElementById("view_address_legacyaddress_qr")!.textContent = "";
            document.getElementById("view_address_container")!.style.display = "none";
            return;
        }

        document.getElementById("view_address_information")!.innerHTML = "Details for private key: <strong>" + privkey + "</strong>";
        document.getElementById("view_address_segwitaddress")!.textContent = "Segwit address: " + result.segwitAddress;
        document.getElementById("view_address_bech32address")!.textContent = "Segwit (bech32) address: " + result.bech32Address;
        document.getElementById("view_address_legacyaddress")!.textContent = "Legacy address: " + result.legacyAddress;

        const segwitQR = qrcode(0, qrErrorCorrectionLevel);
        segwitQR.addData(result.segwitAddress);
        segwitQR.make();
        document.getElementById("view_address_segwitaddress_qr")!.innerHTML = segwitQR.createImgTag(4, 8);

        const bech32QR = qrcode(0, qrErrorCorrectionLevel);
        bech32QR.addData(result.bech32Address.toUpperCase(), "Alphanumeric");
        bech32QR.make();
        document.getElementById("view_address_bech32address_qr")!.innerHTML = bech32QR.createImgTag(4, 8);

        const legacyQR = qrcode(0, qrErrorCorrectionLevel);
        legacyQR.addData(result.legacyAddress);
        legacyQR.make();
        document.getElementById("view_address_legacyaddress_qr")!.innerHTML = legacyQR.createImgTag(4, 8);

        const containerStyle = document.getElementById("view_address_container")!.style;
        containerStyle.display = "table";
        containerStyle.border = "2px solid #bbbbbb";
        containerStyle.borderRadius = "3px";
    }

    let bulkAddressType: AddressType = "bech32";
    // set address type for bulk generate
    function setBulkAddressType(type: AddressType)
    {
        bulkAddressType = type;
    }

    let bulkArray: string[] | null = null;
    let bulkCount = 0;
    // start bulk generate
    function bulk_generate()
    {
        if (bulkArray)
            return;

        const num = Number((<HTMLInputElement>document.getElementById("bulk_count")).value) | 0;
        if (isNaN(num))
        {
            bulkTextarea.value = "Enter a number";
            return;
        }
        if (num < 1)
        {
            bulkTextarea.value = "Number must be greater than zero";
            return;
        }
        if (num > 1000)
        {
            bulkTextarea.value = "Number must be 1000 at most";
            return;
        }

        (<HTMLInputElement>document.getElementById("bulk_radio_type_segwit")).disabled = true;
        (<HTMLInputElement>document.getElementById("bulk_radio_type_bech32")).disabled = true;
        (<HTMLInputElement>document.getElementById("bulk_radio_type_legacy")).disabled = true;

        if ((<HTMLInputElement>document.getElementById("bip38enabled_bulk")).checked)
        {
            bulkTextarea.value = "Generating initial values";
            bulkArray = [];
            setImmediate(function()
            {
                bip38generate((<HTMLInputElement>document.getElementById("bip38_password_box_bulk")).value, num, bulkAddressType,
                function(counter, maxcount)
                {
                    bulkTextarea.value = "Generating: " + counter + "/" + maxcount;
                },
                function(data)
                {
                    if (typeof data === "string")
                        bulkTextarea.value = data;
                    else
                    {
                        const temp = new Array(data.length);
                        for (let i = 0; i < data.length; ++i)
                            temp[i] = "" + (i + 1) + ", \"" + data[i].address + "\", \"" + data[i].privkey + "\"";

                        bulkTextarea.value = temp.join("\n");
                    }

                    (<HTMLInputElement>document.getElementById("bulk_radio_type_segwit")).disabled = false;
                    (<HTMLInputElement>document.getElementById("bulk_radio_type_bech32")).disabled = false;
                    (<HTMLInputElement>document.getElementById("bulk_radio_type_legacy")).disabled = false;
                    bulkArray = null;
                });
            });
            return;
        }

        bulkCount = num;
        bulkCurrentCount = 0;
        bulkArray = new Array(bulkCount);

        setImmediate(bulk_generate_timeout);
    }

    let bulkCurrentCount = 0;
    // generate 1 address periodically, so the page won't freeze while generating
    function bulk_generate_timeout()
    {
        if (bulkCurrentCount < bulkCount)
        {
            const bytes = get32SecureRandomBytes();
            const data = generate_address_result(bytes, bulkAddressType, false);
            bulkArray![bulkCurrentCount] = "" + (bulkCurrentCount + 1) + ", \"" + data.address + "\", \"" + data.privkey + "\"";
            ++bulkCurrentCount;
            bulkTextarea.value = "Generating: " + bulkCurrentCount + "/" + bulkCount;
            setImmediate(bulk_generate_timeout);
        }
        else
        {
            bulkCount = 0;
            bulkCurrentCount = 0;
            bulkTextarea.value = bulkArray!.join("\n");
            bulkArray = null;

            (<HTMLInputElement>document.getElementById("bulk_radio_type_segwit")).disabled = false;
            (<HTMLInputElement>document.getElementById("bulk_radio_type_bech32")).disabled = false;
            (<HTMLInputElement>document.getElementById("bulk_radio_type_legacy")).disabled = false;
        }
    }

    // split text into given number of rows
    function splitText(text: string, rows: number)
    {
        const len = text.length;
        const textarray: string[] = [];
        const lineLength = Math.ceil(len / rows);

        for (let i = 0; i < len; i += lineLength)
            textarray.push(text.substr(i, lineLength));

        return textarray.join("<br />");
    }

    // split text into rows, with each row having a max length
    function splitTextLength(text: string, length: number)
    {
        if (length === 0)
            return text;

        const len = text.length;
        const textarray: string[] = [];

        for (let i = 0; i < len; i += length)
            textarray.push(text.substr(i, length));

        return textarray.join("<br />");
    }

    let paperAddressType: AddressType = "bech32";
    // set address type for paper wallet generate
    function setPaperAddressType(type: AddressType)
    {
        paperAddressType = type;
    }

    let paperQRErrorCorrectionLevel: QRCodeErrorCorrectionLevel = "H";
    // set qr code error correction level for paper wallet generate
    function setPaperQRErrorCorrectionLevel(level: QRCodeErrorCorrectionLevel)
    {
        paperQRErrorCorrectionLevel = level;
    }

    function paperWalletBip38Start()
    {
        bip38generate((<HTMLInputElement>document.getElementById("bip38_password_box_paper")).value, paperWalletCount, paperWalletAddressType,
        function(counter, maxcount)
        {
            paperWalletProgressText.textContent = "Generating: " + counter + "/" + maxcount;
        },
        function(data)
        {
            if (typeof data === "string")
                paperWalletProgressText.textContent = data;
            else
            {
                paperWalletProgressText.textContent = "";

                const newData = new Array<AddressAndPrivkeyWithTypeAndQR>(data.length);

                for (let i = 0; i < data.length; ++i)
                {
                    const currentAddress = data[i].address;
                    const currentPrivkey = data[i].privkey;

                    const addressQR = qrcode(0, paperWalletQRErrorCorrectionLevel);
                    if (paperWalletAddressType === "bech32")
                        addressQR.addData(currentAddress.toUpperCase(), "Alphanumeric");
                    else
                        addressQR.addData(currentAddress);

                    addressQR.make();

                    const privkeyQR = qrcode(0, paperWalletQRErrorCorrectionLevel);
                    privkeyQR.addData(currentPrivkey);
                    privkeyQR.make();

                    newData[i] = <AddressAndPrivkeyWithTypeAndQR>{
                        address: currentAddress,
                        privkey: currentPrivkey,
                        addressQR: addressQR,
                        privkeyQR: privkeyQR
                    };
                }

                paperWalletCreate(newData, true);
            }

            paperWalletCount = 0;
            paperwalletCurrentCount = 0;
            paperWalletArray = null;

        });
    }

    let paperWalletStyle = "design0";
    let paperWalletArray: AddressAndPrivkeyWithTypeAndQR[] | null = null;
    let paperWalletCount = 0;
    let paperWalletAddressType: AddressType;
    let paperWalletQRErrorCorrectionLevel: QRCodeErrorCorrectionLevel;
    // start generating paper wallets
    function paperWallet()
    {
        if (paperWalletArray)
            return;

        const isBip38 = (<HTMLInputElement>document.getElementById("bip38enabled_paper")).checked;

        if (isBip38)
        {
            if ((<HTMLInputElement>document.getElementById("use_custom_privkeys_bip38_paper")).checked)
            {
                paperWalletBip38FromUserPrivkeys();
                return;
            }
        }
        else
        {
            if ((<HTMLInputElement>document.getElementById("use_custom_addresses_paper")).checked)
            {
                paperWalletFromUserAddresses();
                return;
            }
        }

        const num = Number((<HTMLInputElement>document.getElementById("paperwallet_generate_count")).value) | 0;
        if (isNaN(num))
        {
            paperWalletProgressText.textContent = "Enter a number for count";
            return;
        }
        else if (num < 1)
        {
            paperWalletProgressText.textContent = "Count must be greater than zero";
            return;
        }
        else if (num > 20)
        {
            paperWalletProgressText.textContent = "Count must be 20 at most";
            return;
        }

        paperWalletCount = num;
        paperwalletCurrentCount = 0;

        paperWalletAddressType = paperAddressType;
        paperWalletQRErrorCorrectionLevel = paperQRErrorCorrectionLevel;

        if (isBip38)
        {
            paperWalletProgressText.textContent = "Generating initial values";
            paperWalletArray = [];
            setImmediate(paperWalletBip38Start);
            return;
        }

        paperWalletArray = new Array(paperWalletCount);
        setImmediate(paperwallet_generate_timeout);
    }

    let paperwalletCurrentCount = 0;
    // periodically generate 1 paper wallet, so the page won't freeze while generating
    function paperwallet_generate_timeout()
    {
        if (paperwalletCurrentCount < paperWalletCount)
        {
            const bytes = get32SecureRandomBytes();
            const data = generate_address_result(bytes, paperWalletAddressType, true, paperWalletQRErrorCorrectionLevel);

            paperWalletArray![paperwalletCurrentCount] = data;
            ++paperwalletCurrentCount;
            paperWalletProgressText.textContent = "Generating: " + paperwalletCurrentCount + "/" + paperWalletCount;

            setImmediate(paperwallet_generate_timeout);
        }
        else
        {
            paperWalletProgressText.textContent = "";
            paperWalletCount = 0;
            paperwalletCurrentCount = 0;
            paperWalletCreate(paperWalletArray!, false);
            paperWalletArray = null;
        }
    }

    let paperWalletCustomImageData = "";
    let paperWalletCustomImageWidth = 0;
    let paperWalletCustomImageHeight = 0;
    // load user image for paper wallet background
    function paperWalletCustomImageSelected(fileSelector: HTMLInputElement)
    {
        const reader = new FileReader();
        reader.onload = function(e)
        {
            if (!e.target || !e.target.result)
                return;

            paperWalletCustomImageData = e.target.result.toString();
            const tempIMG = new Image();
            tempIMG.onload = function()
            {
                paperWalletCustomImageWidth = tempIMG.width;
                paperWalletCustomImageHeight = tempIMG.height;
            };

            tempIMG.src = paperWalletCustomImageData;
            paperwallet_update_preview();
        };

        const files = fileSelector.files;
        if (!files || !files[0])
        {
            paperWalletProgressText.textContent = "No background image selected";
            return;
        }

        try
        {
            reader.readAsDataURL(files[0]);
        }
        catch (ex)
        {
            paperWalletProgressText.textContent = "Error opening background image";
        }
    }

    // create paper wallets with the given addresses and private keys
    // the position of address, private key, and qr codes are set for each layout
    function paperWalletCreate(addressData: AddressAndPrivkeyWithTypeAndQR[], bip38: boolean)
    {
        const container = document.getElementById("paperwallet_print_area")!;
        while (container.lastChild)
            container.removeChild(container.lastChild);

        let verticalGap = Number((<HTMLInputElement>document.getElementById("paperwallet_vertical_gap")).value);
        if (isNaN(verticalGap) || verticalGap < 0)
            verticalGap = 0;

        switch (paperWalletStyle)
        {
            case "design0":
            {
                const targetSize = 100;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;
                    const currentPrivkey = currentData.privkey;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(targetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "10px";
                    addressQRImg.style.left = "10px";
                    addressQRImg.style.width = targetSize + "px";
                    addressQRImg.style.height = targetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(targetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.bottom = "10px";
                    privkeyQRImg.style.right = "10px"
                    privkeyQRImg.style.width = targetSize + "px";
                    privkeyQRImg.style.height = targetSize + "px";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1000px";
                    parentDiv.style.height = "200px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.textContent = currentAddress;
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "50px";
                    addressDiv.style.left = "120px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "normal";
                    addressDiv.style.fontSize = "18px";

                    const privkeyDiv = document.createElement("div");
                    privkeyDiv.textContent = currentPrivkey;
                    privkeyDiv.style.position = "absolute";
                    privkeyDiv.style.bottom = "10px";
                    privkeyDiv.style.right = "120px";
                    privkeyDiv.style.fontFamily = "roboto-mono";
                    privkeyDiv.style.fontWeight = "normal";
                    privkeyDiv.style.fontSize = "18px";

                    const addressText = document.createElement("div");
                    addressText.textContent = "Address:";
                    addressText.style.position = "absolute";
                    addressText.style.top = "15px";
                    addressText.style.left = "120px";
                    addressText.style.fontFamily = "Verdana";
                    addressText.style.fontWeight = "bold";
                    addressText.style.fontSize = "25px";

                    const privkeyText = document.createElement("div");
                    privkeyText.textContent = bip38 ? "Encrypted private key:" : "Private key:";
                    privkeyText.style.position = "absolute";
                    privkeyText.style.bottom = "40px";
                    privkeyText.style.right = bip38 ? "430px" : "514px";
                    privkeyText.style.fontFamily = "Verdana";
                    privkeyText.style.fontWeight = "bold";
                    privkeyText.style.fontSize = "25px";

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
                const addressTargetSize = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_qr_size")).value);
                const privkeyTargetSize = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_qr_size")).value);

                const backgroundImageScale = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_background_scale")).value) / 100;

                const addressPosX = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_posx")).value);
                const addressPosY = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_posy")).value);
                const privkeyPosX = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_posx")).value);
                const privkeyPosY = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_posy")).value);

                const addressQRPosX = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_qr_posx")).value);
                const addressQRPosY = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_qr_posy")).value);
                const addressQRRot = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_qr_rotation")).value);
                const privkeyQRPosX = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_qr_posx")).value);
                const privkeyQRPosY = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_qr_posy")).value);
                const privkeyQRRot = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_qr_rotation")).value);

                const addressLineLength = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_length")).value);
                const privkeyLineLength = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_length")).value);

                const addressFontSize = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_size")).value);
                const addressFontRot = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_rotation")).value);
                const privkeyFontSize = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_size")).value);
                const privkeyFontRot = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_rotation")).value);

                for (let i = 0; i < addressData.length; ++i)
                {
                    const backgroundImage = new Image();
                    backgroundImage.src = paperWalletCustomImageData;
                    backgroundImage.style.position = "absolute";
                    backgroundImage.style.top = "0px";
                    backgroundImage.style.left = "0px";
                    backgroundImage.style.width = "100%";
                    backgroundImage.style.height = "100%";

                    backgroundImage.onload = function()
                    {
                        const currentData = addressData[i];
                        const currentAddress = currentData.address;
                        const currentPrivkey = currentData.privkey;

                        const currentAddressQR = currentData.addressQR!;
                        const addressSize = currentAddressQR.getModuleCount() + 4;
                        let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                        const addressQRImg = new Image();
                        addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                        addressQRImg.style.position = "absolute";
                        addressQRImg.style.top = addressQRPosY + "px";
                        addressQRImg.style.left = addressQRPosX + "px";
                        addressQRImg.style.width = addressTargetSize + "px";
                        addressQRImg.style.height = addressTargetSize + "px"
                        addressQRImg.style.transform = "rotate(" + addressQRRot + "deg)";

                        const currentPrivkeyQR = currentData.privkeyQR!;
                        const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                        finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                        const privkeyQRImg = new Image();
                        privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                        privkeyQRImg.style.position = "absolute";
                        privkeyQRImg.style.top = privkeyQRPosY + "px";
                        privkeyQRImg.style.left = privkeyQRPosX + "px";
                        privkeyQRImg.style.width = privkeyTargetSize + "px";
                        privkeyQRImg.style.height = privkeyTargetSize + "px"
                        privkeyQRImg.style.transform = "rotate(" + privkeyQRRot + "deg)";

                        const parentDiv = document.createElement("div");
                        parentDiv.className = "parent_div";
                        parentDiv.style.position = "relative";
                        parentDiv.style.border = "2px solid black";
                        parentDiv.style.width = backgroundImage.width * backgroundImageScale + "px";
                        parentDiv.style.height = backgroundImage.height * backgroundImageScale + "px";
                        parentDiv.style.marginBottom = verticalGap + "px";

                        const addressDiv = document.createElement("div");
                        addressDiv.innerHTML = splitTextLength(currentAddress, addressLineLength);
                        addressDiv.style.position = "absolute";
                        addressDiv.style.top = addressPosY + "px";
                        addressDiv.style.left = addressPosX + "px";
                        addressDiv.style.fontFamily = "roboto-mono";
                        addressDiv.style.fontWeight = "normal";
                        addressDiv.style.fontSize = addressFontSize + "px";
                        addressDiv.style.transform = "rotate(" + addressFontRot + "deg)";
                        addressDiv.style.transformOrigin = "0% 0%";

                        const privkeyDiv = document.createElement("div");
                        privkeyDiv.innerHTML = splitTextLength(currentPrivkey, privkeyLineLength);
                        privkeyDiv.style.position = "absolute";
                        privkeyDiv.style.top = privkeyPosY + "px";
                        privkeyDiv.style.left = privkeyPosX + "px";
                        privkeyDiv.style.fontFamily = "roboto-mono";
                        privkeyDiv.style.fontWeight = "normal";
                        privkeyDiv.style.fontSize = privkeyFontSize + "px";
                        privkeyDiv.style.transform = "rotate(" + privkeyFontRot + "deg)";
                        privkeyDiv.style.transformOrigin = "0% 0%";

                        parentDiv.appendChild(backgroundImage);
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
                const addressTargetSize = 90;
                const privkeyTargetSize = 117;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;
                    const currentPrivkey = currentData.privkey;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "110px"
                    addressQRImg.style.left = "50px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "93px";
                    privkeyQRImg.style.left = "816px";
                    privkeyQRImg.style.width = privkeyTargetSize + "px";
                    privkeyQRImg.style.height = privkeyTargetSize + "px";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1000px";
                    parentDiv.style.height = "300px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.textContent = currentAddress;
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "257px";
                    addressDiv.style.left = "43px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "bold";
                    addressDiv.style.fontSize = "11px";

                    const privkeyDiv = document.createElement("div");
                    privkeyDiv.textContent = currentPrivkey;
                    privkeyDiv.style.position = "absolute";
                    privkeyDiv.style.top = "225px";
                    privkeyDiv.style.left = bip38 ? "582px" : "600px";
                    privkeyDiv.style.fontFamily = "roboto-mono";
                    privkeyDiv.style.fontWeight = "bold";
                    privkeyDiv.style.fontSize = "11px";

                    const addressDiv2 = document.createElement("div");
                    addressDiv2.textContent = currentAddress;
                    addressDiv2.style.position = "absolute";
                    addressDiv2.style.top = "32px";
                    addressDiv2.style.right = "681px";
                    addressDiv2.style.fontFamily = "roboto-mono";
                    addressDiv2.style.fontWeight = "bold";
                    addressDiv2.style.fontSize = "11px";
                    addressDiv2.style.transform = "rotate(180deg)";

                    const privkeyDiv2 = document.createElement("div");
                    privkeyDiv2.textContent = currentPrivkey;
                    privkeyDiv2.style.position = "absolute";
                    privkeyDiv2.style.top = "65px";
                    privkeyDiv2.style.left = bip38 ? "582px" : "600px";
                    privkeyDiv2.style.fontFamily = "roboto-mono";
                    privkeyDiv2.style.fontWeight = "bold";
                    privkeyDiv2.style.fontSize = "11px";
                    privkeyDiv2.style.transform = "rotate(180deg)";

                    const backgroundGraphic = new Image();
                    backgroundGraphic.src = (<any>window)["imageSources"]["bitcoinpaperwalletcom.jpg"];
                    backgroundGraphic.style.position = "absolute";
                    backgroundGraphic.style.top = "0px";
                    backgroundGraphic.style.left = "0px";
                    backgroundGraphic.style.width = "100%";
                    backgroundGraphic.style.height = "100%";

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
                const addressTargetSize = 135;
                const privkeyTargetSize = 135;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;
                    const currentPrivkey = currentData.privkey;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "265px"
                    addressQRImg.style.left = "29px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "32px";
                    privkeyQRImg.style.left = "839px";
                    privkeyQRImg.style.width = privkeyTargetSize + "px";
                    privkeyQRImg.style.height = privkeyTargetSize + "px";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1002px";
                    parentDiv.style.height = "426px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.textContent = currentAddress;
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "385px";
                    addressDiv.style.left = "197px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "bold";
                    addressDiv.style.fontSize = "14.5px";

                    const privkeyDiv = document.createElement("div");
                    privkeyDiv.innerHTML = splitText(currentPrivkey, 2);
                    privkeyDiv.style.fontSize = bip38 ? "13px" : "14.5px";
                    privkeyDiv.style.position = "absolute";
                    privkeyDiv.style.top = "24px";
                    privkeyDiv.style.left = "577px";
                    privkeyDiv.style.fontFamily = "roboto-mono";
                    privkeyDiv.style.fontWeight = "bold";

                    const backgroundGraphic = new Image();
                    backgroundGraphic.src = (<any>window)["imageSources"]["dorian.jpg"];
                    backgroundGraphic.style.position = "absolute";
                    backgroundGraphic.style.top = "0px";
                    backgroundGraphic.style.left = "0px";
                    backgroundGraphic.style.width = "100%";
                    backgroundGraphic.style.height = "100%";                    

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
                const addressTargetSize = 120;
                const privkeyTargetSize = 120;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;
                    const currentPrivkey = currentData.privkey;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "265px"
                    addressQRImg.style.left = "780px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";
                    addressQRImg.style.transform = "rotate(270deg)";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "40px";
                    privkeyQRImg.style.left = "442px";
                    privkeyQRImg.style.width = privkeyTargetSize + "px";
                    privkeyQRImg.style.height = privkeyTargetSize + "px";
                    privkeyQRImg.style.transform = "rotate(90deg)";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1001px";
                    parentDiv.style.height = "425px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.innerHTML = splitTextLength(currentAddress, 17);
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "391px";
                    addressDiv.style.left = "905px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "normal";
                    addressDiv.style.fontSize = "13px";
                    addressDiv.style.transform = "rotate(270deg)";
                    addressDiv.style.transformOrigin = "0% 0%";

                    const privkeyDiv = document.createElement("div");
                    privkeyDiv.innerHTML = splitTextLength(currentPrivkey, bip38 ? 20 : 18);
                    privkeyDiv.style.position = "absolute";
                    privkeyDiv.style.top = "30px";
                    privkeyDiv.style.left = "434px";
                    privkeyDiv.style.fontFamily = "roboto-mono";
                    privkeyDiv.style.fontWeight = "normal";
                    privkeyDiv.style.fontSize = bip38 ? "12px" : "13px";
                    privkeyDiv.style.transform = "rotate(90deg)";
                    privkeyDiv.style.transformOrigin = "0% 0%";

                    const backgroundGraphic = new Image();
                    backgroundGraphic.src = (<any>window)["imageSources"]["walletgeneratornet.jpg"];
                    backgroundGraphic.style.position = "absolute";
                    backgroundGraphic.style.top = "0px";
                    backgroundGraphic.style.left = "0px";
                    backgroundGraphic.style.width = "100%";
                    backgroundGraphic.style.height = "100%";

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
                const addressTargetSize = 135;
                const privkeyTargetSize = 135;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;
                    const currentPrivkey = currentData.privkey;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "265px"
                    addressQRImg.style.left = "29px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "32px";
                    privkeyQRImg.style.left = "839px";
                    privkeyQRImg.style.width = privkeyTargetSize + "px";
                    privkeyQRImg.style.height = privkeyTargetSize + "px";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1002px";
                    parentDiv.style.height = "426px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.textContent = currentAddress;
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "384px";
                    addressDiv.style.left = "197px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "bold";
                    addressDiv.style.fontSize = "14.6px";

                    const privkeyDiv = document.createElement("div");
                    privkeyDiv.innerHTML = splitText(currentPrivkey, 2);
                    privkeyDiv.style.position = "absolute";
                    privkeyDiv.style.top = bip38 ? "26px" : "25px";
                    privkeyDiv.style.left = "575px";
                    privkeyDiv.style.fontFamily = "roboto-mono";
                    privkeyDiv.style.fontWeight = "bold";
                    privkeyDiv.style.fontSize = bip38 ? "13px" : "14.5px";

                    const backgroundGraphic = new Image();
                    backgroundGraphic.src = (<any>window)["imageSources"]["currencynote.jpg"];
                    backgroundGraphic.style.position = "absolute";
                    backgroundGraphic.style.top = "0px";
                    backgroundGraphic.style.left = "0px";
                    backgroundGraphic.style.width = "100%";
                    backgroundGraphic.style.height = "100%";

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
                const addressTargetSize = 116;
                const privkeyTargetSize = 116;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "34px"
                    addressQRImg.style.left = "42px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "186px";
                    privkeyQRImg.style.left = "622px";
                    privkeyQRImg.style.width = privkeyTargetSize + "px";
                    privkeyQRImg.style.height = privkeyTargetSize + "px";

                    const addressQRImg2 = new Image();
                    addressQRImg2.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg2.style.position = "absolute";
                    addressQRImg2.style.top = "34px";
                    addressQRImg2.style.left = "867px";
                    addressQRImg2.style.width = addressTargetSize + "px";
                    addressQRImg2.style.height = addressTargetSize + "px";
                    addressQRImg2.style.transform = "rotate(270deg)";

                    const privkeyQRImg2 = new Image();
                    privkeyQRImg2.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg2.style.position = "absolute";
                    privkeyQRImg2.style.top = "186px";
                    privkeyQRImg2.style.left = "867px";
                    privkeyQRImg2.style.width = privkeyTargetSize + "px";
                    privkeyQRImg2.style.height = privkeyTargetSize + "px";
                    privkeyQRImg2.style.transform = "rotate(270deg)";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1020px";
                    parentDiv.style.height = "340px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.textContent = currentAddress;
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "29px";
                    addressDiv.style.left = "213px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "normal";
                    addressDiv.style.fontSize = "14px";

                    const addressDiv2 = document.createElement("div");
                    addressDiv2.textContent = currentAddress.substr(0, 14);
                    addressDiv2.style.position = "absolute";
                    addressDiv2.style.top = "82px";
                    addressDiv2.style.left = "761px";
                    addressDiv2.style.fontFamily = "roboto-mono";
                    addressDiv2.style.fontWeight = "normal";
                    addressDiv2.style.fontSize = "14px";
                    addressDiv2.style.transform = "rotate(270deg)";

                    const backgroundGraphic = new Image();
                    backgroundGraphic.src = (<any>window)["imageSources"]["design_by_mark_and_barbara_messer.jpg"];
                    backgroundGraphic.style.position = "absolute";
                    backgroundGraphic.style.top = "0px";
                    backgroundGraphic.style.left = "0px";
                    backgroundGraphic.style.width = "100%";
                    backgroundGraphic.style.height = "100%";

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
                const addressTargetSize = 184;
                const privkeyTargetSize = 210;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;
                    const currentPrivkey = currentData.privkey;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "110px"
                    addressQRImg.style.left = "53px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "228px";
                    privkeyQRImg.style.left = "757px";
                    privkeyQRImg.style.width = privkeyTargetSize + "px";
                    privkeyQRImg.style.height = privkeyTargetSize + "px";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1004px";
                    parentDiv.style.height = "538px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.textContent = currentAddress;
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "480px";
                    addressDiv.style.left = "291px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "bold";
                    addressDiv.style.fontSize = "18px";
                    addressDiv.style.transform = "rotate(270deg)";
                    addressDiv.style.transformOrigin = "0% 0%";

                    const privkeyDiv = document.createElement("div");
                    privkeyDiv.textContent = currentPrivkey;
                    privkeyDiv.style.position = "absolute";
                    privkeyDiv.style.top = "483px";
                    privkeyDiv.style.left = "702px";
                    privkeyDiv.style.fontFamily = "roboto-mono";
                    privkeyDiv.style.fontWeight = "bold";
                    privkeyDiv.style.fontSize = bip38 ? "13px" : "15px";
                    privkeyDiv.style.transform = "rotate(270deg)";
                    privkeyDiv.style.transformOrigin = "0% 0%";

                    const backgroundGraphic = new Image();
                    backgroundGraphic.src = (<any>window)["imageSources"]["bitaddressorg.jpg"];
                    backgroundGraphic.style.position = "absolute";
                    backgroundGraphic.style.top = "0px";
                    backgroundGraphic.style.left = "0px";
                    backgroundGraphic.style.width = "100%";
                    backgroundGraphic.style.height = "100%";

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
                const addressTargetSize = 116;
                const privkeyTargetSize = 116;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;
                    const currentPrivkey = currentData.privkey;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "34px"
                    addressQRImg.style.left = "40px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "182px";
                    privkeyQRImg.style.left = "610px";
                    privkeyQRImg.style.width = privkeyTargetSize + "px";
                    privkeyQRImg.style.height = privkeyTargetSize + "px";

                    const privkeyQRImg2 = new Image();
                    privkeyQRImg2.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg2.style.position = "absolute";
                    privkeyQRImg2.style.top = "182px";
                    privkeyQRImg2.style.left = "852px";
                    privkeyQRImg2.style.width = privkeyTargetSize + "px";
                    privkeyQRImg2.style.height = privkeyTargetSize + "px";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1004px";
                    parentDiv.style.height = "334px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.textContent = currentAddress;
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "25px";
                    addressDiv.style.left = "205px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "bold";
                    addressDiv.style.fontSize = "18px";

                    const addressDiv2 = document.createElement("div");
                    addressDiv2.textContent = currentAddress.substr(0, 11);
                    addressDiv2.style.position = "absolute";
                    addressDiv2.style.top = "152px";
                    addressDiv2.style.left = "794px";
                    addressDiv2.style.fontFamily = "roboto-mono";
                    addressDiv2.style.fontWeight = "bold";
                    addressDiv2.style.fontSize = "18px";
                    addressDiv2.style.transform = "rotate(270deg)";
                    addressDiv2.style.transformOrigin = "0% 0%";

                    const privkeyDiv = document.createElement("div");
                    privkeyDiv.innerHTML = splitTextLength(currentPrivkey, bip38 ? 12 : 11);
                    privkeyDiv.style.position = "absolute";
                    privkeyDiv.style.top = "30px";
                    privkeyDiv.style.left = bip38 ? "848px" : "850px";
                    privkeyDiv.style.fontFamily = "roboto-mono";
                    privkeyDiv.style.fontWeight = "bold";
                    privkeyDiv.style.fontSize = bip38 ? "17px" : "18px";

                    const backgroundGraphic = new Image();
                    backgroundGraphic.src = (<any>window)["imageSources"]["design_by_timbo925.svg"];
                    backgroundGraphic.style.top = "0px";
                    backgroundGraphic.style.left = "0px";
                    backgroundGraphic.style.width = "100%";
                    backgroundGraphic.style.height = "100%";

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
                const addressTargetSize = 116;
                const privkeyTargetSize = 116;
                for (let i = 0; i < addressData.length; ++i)
                {
                    const currentData = addressData[i];
                    const currentAddress = currentData.address;

                    const currentAddressQR = currentData.addressQR!;
                    const addressSize = currentAddressQR.getModuleCount() + 4;
                    let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
                    const addressQRImg = new Image();
                    addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg.style.position = "absolute";
                    addressQRImg.style.top = "35px"
                    addressQRImg.style.left = "44px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "186px";
                    privkeyQRImg.style.left = "622px";
                    privkeyQRImg.style.width = privkeyTargetSize + "px";
                    privkeyQRImg.style.height = privkeyTargetSize + "px";

                    const addressQRImg2 = new Image();
                    addressQRImg2.src = currentAddressQR.createDataURL(finalSize, 0);
                    addressQRImg2.style.position = "absolute";
                    addressQRImg2.style.top = "35px"
                    addressQRImg2.style.left = "868px";
                    addressQRImg2.style.width = addressTargetSize + "px";
                    addressQRImg2.style.height = addressTargetSize + "px";
                    addressQRImg2.style.transform = "rotate(270deg)";

                    const privkeyQRImg2 = new Image();
                    privkeyQRImg2.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg2.style.position = "absolute";
                    privkeyQRImg2.style.top = "186px";
                    privkeyQRImg2.style.left = "868px";
                    privkeyQRImg2.style.width = privkeyTargetSize + "px";
                    privkeyQRImg2.style.height = privkeyTargetSize + "px";
                    privkeyQRImg2.style.transform = "rotate(270deg)";

                    const parentDiv = document.createElement("div");
                    parentDiv.className = "parent_div";
                    parentDiv.style.background = "white";
                    parentDiv.style.color = "black";
                    parentDiv.style.position = "relative";
                    parentDiv.style.border = "2px solid black";
                    parentDiv.style.width = "1020px";
                    parentDiv.style.height = "340px";
                    parentDiv.style.marginBottom = verticalGap + "px";

                    const addressDiv = document.createElement("div");
                    addressDiv.textContent = currentAddress;
                    addressDiv.style.position = "absolute";
                    addressDiv.style.top = "29px";
                    addressDiv.style.left = "208px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "normal";
                    addressDiv.style.fontSize = "14.5px";

                    const addressDiv2 = document.createElement("div");
                    addressDiv2.textContent = currentAddress.substr(0, 14);
                    addressDiv2.style.position = "absolute";
                    addressDiv2.style.top = "84px";
                    addressDiv2.style.left = "757px";
                    addressDiv2.style.fontFamily = "roboto-mono";
                    addressDiv2.style.fontWeight = "normal";
                    addressDiv2.style.fontSize = "15px";
                    addressDiv2.style.transform = "rotate(270deg)";

                    const backgroundGraphic = new Image();
                    backgroundGraphic.src = (<any>window)["imageSources"]["design_by_75rtuga.jpg"];
                    backgroundGraphic.style.position = "absolute";
                    backgroundGraphic.style.top = "0px";
                    backgroundGraphic.style.left = "0px";
                    backgroundGraphic.style.width = "100%";
                    backgroundGraphic.style.height = "100%";

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
        const errorMessageDiv = document.getElementById("paper_custom_address_error")!;
        const raw = (<HTMLTextAreaElement>document.getElementById("paper_custom_addresses")).value.replace(/\"/g, "").replace(/\n/g, " ").replace(/\s+/g, " ");

        const trim = raw.trim();
        if (trim === "")
        {
            errorMessageDiv.textContent = "No data entered";
            return;
        }

        const data = trim.split(",");
        const addressData: AddressAndPrivkeyWithTypeAndQR[] = [];
        let isBip38 = false;
        for (let i = 0; i < data.length; ++i)
        {
            const split = data[i].trim().split(" ");
            if (split.length === 0)
                continue;
            else if (split.length !== 2)
            {
                errorMessageDiv.textContent = "Invalid format: " + data[i];
                return;
            }

            const address = split[0];
            const privkey = split[1];

            if (privkey.length === 58)
                isBip38 = true;
            else if (privkey.length !== 52)
            {
                errorMessageDiv.textContent = "Invalid private key: " + privkey;
                return;
            }

            const currentAddressQR = qrcode(0, paperQRErrorCorrectionLevel);
            if (address.indexOf("bc1") === 0)
                currentAddressQR.addData(address.toUpperCase(), "Alphanumeric");
            else
                currentAddressQR.addData(address);

            currentAddressQR.make();

            const currentPrivkeyQR = qrcode(0, paperQRErrorCorrectionLevel);
            currentPrivkeyQR.addData(privkey);
            currentPrivkeyQR.make();

            addressData.push(<AddressAndPrivkeyWithTypeAndQR>{
                address: address,
                privkey: privkey,
                addressQR: currentAddressQR,
                privkeyQR: currentPrivkeyQR 
            });
        }

        errorMessageDiv.textContent = "";

        paperWalletCreate(addressData, isBip38);
    }

    let paper_custom_privkeys_bigints_with_keypair: PrivateKeyWithKeypair[] | null = null;
    let paper_custom_privkeys_index = 0;
    let paper_custom_privkeys_password = "";
    let paper_custom_privkeys_encrypted: AddressAndPrivkeyWithTypeAndQR[] | null = null;
    function paperWalletBip38FromUserPrivkeys()
    {
        if (paper_custom_privkeys_bigints_with_keypair !== null)
            return;

        const errorMessageDiv = document.getElementById("paper_custom_privkey_bip38_error")!;

        const password = (<HTMLInputElement>document.getElementById("bip38_password_box_paper")).value;
        if (password === "")
        {
            errorMessageDiv.textContent = "Password must not be empty";
            return;
        }

        const privkeys = (<HTMLTextAreaElement>document.getElementById("paper_custom_privkeys_bip38_textarea")).value.split(/\s+/g);
        if (privkeys.length === 0) 
        {
            errorMessageDiv.textContent = "No private keys entered";
            return;
        }

        paperWalletProgressText.textContent = "Checking private keys";
        setImmediate(function()
        {
            function ShowError(privkey: string, reason: string)
            {
                paperWalletProgressText.textContent = "";
                errorMessageDiv.textContent = "Private key \"" +
                    (privkey.length < 8 ? privkey : privkey.substr(0, 8) + "...") +
                    "\" is not valid: " + reason;
            }

            const privkeyBigints: PrivateKeyWithKeypair[] = [];
            for (let i = 0; i < privkeys.length; ++i)
            {
                const currentPrivkey = privkeys[i];

                if (currentPrivkey === "")
                    continue;

                if (/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/.test(currentPrivkey))
                {
                    ShowError(currentPrivkey, "private key contains invalid characters");
                    return;
                }

                const keypair = privkeyStringToKeyPair(currentPrivkey);
                if (typeof keypair === "string")
                {
                    ShowError(currentPrivkey, keypair);
                    return;
                }

                if (keypair.privkey.isZero() || keypair.privkey.gte(ecc_n))
                {
                    ShowError(currentPrivkey, "invalid private key value");
                    return;
                }

                privkeyBigints.push(keypair);
            }

            if (privkeyBigints.length === 0)
            {
                paperWalletProgressText.textContent = "";
                errorMessageDiv.textContent = "No private keys entered";
                return;
            }

            errorMessageDiv.textContent = "";
            paper_custom_privkeys_index = 0;
            paper_custom_privkeys_password = password;
            paper_custom_privkeys_bigints_with_keypair = privkeyBigints;
            paper_custom_privkeys_encrypted = [];
            setImmediate(paperWalletBip38FromUserPrivkeys_timeout);
        });
    }

    function bip38encrypt(privkeyWithKeypair: PrivateKeyWithKeypair, password: string)
    {
        const privkeyBytes = bigintToByteArray(privkeyWithKeypair.privkey);
        while (privkeyBytes.length < 32)
            privkeyBytes.push(0);

        privkeyBytes.reverse();

        const address = makeAddress(privkeyWithKeypair.keypair); // legacy address

        const salt = SHA256(SHA256(address)).slice(0, 4);
        const derivedBytes = <number[]>scrypt(password, salt, 14, 8, 8, 64);

        const firstHalf = byteArrayXOR(privkeyBytes, derivedBytes.slice(0, 32));
        const secondHalf = derivedBytes.slice(32);

        const finalprivkey = [0x01, 0x42, 0xe0];
        finalprivkey.push(...salt);

        const encrypted = AES_Encrypt_ECB_NoPadding(firstHalf, secondHalf);
        finalprivkey.push(...encrypted);

        const checksum = SHA256(SHA256(finalprivkey)).slice(0, 4);
        finalprivkey.push(...checksum);

        return <AddressAndPrivkey>{
            privkey: base58encode(finalprivkey),
            address: address
        }
    }

    function paperWalletBip38FromUserPrivkeys_timeout()
    {
        if (paper_custom_privkeys_bigints_with_keypair === null || paper_custom_privkeys_encrypted === null)
            return;

        const index = paper_custom_privkeys_index++;
        if (index === paper_custom_privkeys_bigints_with_keypair.length)
        {
            // finished
            paper_custom_privkeys_index = 0;
            paper_custom_privkeys_password = "";
            paper_custom_privkeys_bigints_with_keypair = null;
            paperWalletProgressText.textContent = "";

            paperWalletCreate(paper_custom_privkeys_encrypted, true);
            return;
        }

        paperWalletProgressText.textContent = "Encrypting private keys: " + (index + 1) + " / " + paper_custom_privkeys_bigints_with_keypair.length;

        const currentPrivkey = paper_custom_privkeys_bigints_with_keypair[index];
        const privKeyAndAddress = bip38encrypt(currentPrivkey, paper_custom_privkeys_password);

        let finaladdress;
        switch (paperAddressType)
        {
            case "segwit":
                finaladdress = makeSegwitAddress(currentPrivkey.keypair);
                break;
            case "bech32":
                finaladdress = makeBech32Address(currentPrivkey.keypair);
                break;
            case "legacy":
                finaladdress = privKeyAndAddress.address;
                break;
        }

        const privKeyString = privKeyAndAddress.privkey;
        const privkeyQR = qrcode(0, paperQRErrorCorrectionLevel);
        privkeyQR.addData(privKeyString);
        privkeyQR.make();

        const addressQR = qrcode(0, paperQRErrorCorrectionLevel);
        if (paperAddressType === "bech32")
            addressQR.addData(finaladdress.toUpperCase(), "Alphanumeric");
        else
            addressQR.addData(finaladdress);

        addressQR.make();

        paper_custom_privkeys_encrypted.push(<AddressAndPrivkeyWithTypeAndQR>{
            address: finaladdress,
            privkey: privKeyString,
            addressType: paperAddressType,
            addressQR: addressQR,
            privkeyQR: privkeyQR
        });

        setImmediate(paperWalletBip38FromUserPrivkeys_timeout);
    }

    // sources of the paper wallet designs
    const paperWalletStyleSources: { [key: string]: string } = {
        "design0": "",
        "design1": "Design source: <a href=\"https://bitcoinpaperwallet.com\">https://bitcoinpaperwallet.com</a>",
        "design2": "Design source: <a href=\"https://redd.it/20rml2\">https://redd.it/20rml2</a>",
        "design3": "Design source: <a href=\"https://walletgenerator.net\">https://walletgenerator.net</a>",
        "design4": "Design source: <a href=\"https://steemit.com/bitcoin/@bunnychum/bitcoin-paper-wallet-redesigned-as-currency-note-free-psd-to-download\">https://steemit.com/bitcoin/@bunnychum/...</a>",
        "design5": "Design source: <a href=\"https://i.pinimg.com/originals/a3/89/89/a38989778a3e113a657016f5fab1803b.png\">https://i.pinimg.com/originals/a3/89/89/...</a>",
        "design6": "Design source: <a href=\"https://bitaddress.org\">https://bitaddress.org</a>",
        "design7": "Design source: <a href=\"https://github.com/Timbo925/walletprinter/blob/d8ae0eab0c5ef09b0ade59009d544ae5f78b12f8/img/wallet_designs/timbo-grey.svg\">https://github.com/Timbo925/walletprinter/...</a>",
        "design8": "Design source: <a href=\"https://github.com/nieldlr/walletprinter/blob/master/img/wallet_designs/75RTUGA.jpg\">https://github.com/nieldlr/walletprinter/.../75RTUGA.jpg</a>",
        "custom": "",
    };

    // selected paper wallet style changed, update link to the design source
    function paperWalletStyleChange(elem: HTMLSelectElement)
    {
        paperWalletStyle = elem.value;
        const linkElement = document.getElementById("paperwallet_source_link")!;
        linkElement.innerHTML = paperWalletStyleSources[paperWalletStyle];

        document.getElementById("paperwallet_custom_parameters")!.style.display = paperWalletStyle === "custom" ? "table" : "none";
    }

    function paperwallet_vertical_gap_changed(elem: HTMLInputElement)
    {
        let height = Number(elem.value);
        if (isNaN(height) || height < 0)
            height = 0;

        const elements = document.getElementsByClassName("parent_div");
        for (let i = 0; i < elements.length; ++i)
            (<HTMLElement>elements[i]).style.marginBottom = height + "px";
    }


    function paperwallet_update_element(elem: HTMLInputElement)
    {
        if (paperWalletCustomImageData === "")
            return;

        const val = Number(elem.value);
        if (isNaN(val))
            return;

        const paperWallet_div_custom_preview_address = document.getElementById("paperwallet_custom_preview_address")!;
        const paperWallet_div_custom_preview_addressqr = document.getElementById("paperwallet_custom_preview_addressqr")!;
        const paperWallet_div_custom_preview_privkey = document.getElementById("paperwallet_custom_preview_privkey")!;
        const paperWallet_div_custom_preview_privkeyqr = document.getElementById("paperwallet_custom_preview_privkeyqr")!;

        switch (elem.id)
        {
            case "paperwallet_custom_background_scale":
            {
                const w = (paperWalletCustomImageWidth * val / 100) + "px";
                const h = (paperWalletCustomImageHeight * val / 100) + "px";

                const st = document.getElementById("paperwallet_preview_div")!.style;
                st.width = w;
                st.height = h;

                const st2 = document.getElementById("paperwallet_preview_parentdiv")!.style;
                st2.width = w;
                st2.height = h;
                break;
            }
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
            {
                const st = paperWallet_div_custom_preview_addressqr.style;
                st.width = val + "px";
                st.height = val + "px";
                break;
            }
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
            {
                const dummyPrivkey = (<HTMLInputElement>document.getElementById("bip38enabled_paper")).checked
                    ? "6Pnabcdefghijkmnopqrstuvwxyz1234567ABCDEFGHJKLMNPQRSTUVXYZ"
                    : "K1abcdefghijkmnopqrstuvwxyzabcdefghijkmnopqrstuvwxyz";

                paperWallet_div_custom_preview_privkey.innerHTML = splitTextLength(dummyPrivkey, val);
                break;
            }
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
            {
                const st = paperWallet_div_custom_preview_privkeyqr.style;
                st.width = val + "px";
                st.height = val + "px";
                break;
            }
            case "paperwallet_custom_privkey_qr_rotation":
                paperWallet_div_custom_preview_privkeyqr.style.transform = "rotate(" + val + "deg)";
                break;
        }
    }

    function paperwallet_update_preview()
    {
        if (paperWalletCustomImageData === "")
            return;

        const container = document.getElementById("paperwallet_preview_div")!;
        while (container.lastChild)
            container.removeChild(container.lastChild);

        const addressTargetSize = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_qr_size")).value);
        const privkeyTargetSize = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_qr_size")).value);

        const backgroundImageScale = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_background_scale")).value) / 100;

        const addressPosX = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_posx")).value);
        const addressPosY = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_posy")).value);
        const privkeyPosX = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_posx")).value);
        const privkeyPosY = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_posy")).value);

        const addressQRPosX = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_qr_posx")).value);
        const addressQRPosY = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_qr_posy")).value);
        const addressQRRot = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_qr_rotation")).value);
        const privkeyQRPosX = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_qr_posx")).value);
        const privkeyQRPosY = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_qr_posy")).value);
        const privkeyQRRot = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_qr_rotation")).value);

        const addressLineLength = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_length")).value);
        const privkeyLineLength = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_length")).value);

        const addressFontSize = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_size")).value);
        const addressFontRot = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_address_rotation")).value);
        const privkeyFontSize = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_size")).value);
        const privkeyFontRot = Number((<HTMLInputElement>document.getElementById("paperwallet_custom_privkey_rotation")).value);

        const backgroundImage = new Image();
        backgroundImage.src = paperWalletCustomImageData;

        const currentAddress = "bc1qacdefghjklmnopqrstuvwxyz023456789acdef";
        const currentPrivkey = (<HTMLInputElement>document.getElementById("bip38enabled_paper")).checked
            ? "6Pnabcdefghijkmnopqrstuvwxyz1234567ABCDEFGHJKLMNPQRSTUVXYZ"
            : "K1abcdefghijkmnopqrstuvwxyzabcdefghijkmnopqrstuvwxyz";

        const currentAddressQR = qrcode(0, "H");
        currentAddressQR.addData(currentAddress);
        currentAddressQR.make();
        const addressSize = currentAddressQR.getModuleCount() + 4;
        let finalSize = Math.floor(addressTargetSize / addressSize) + 1;
        const addressQRImg = new Image();
        addressQRImg.src = currentAddressQR.createDataURL(finalSize, 0);
        addressQRImg.style.position = "absolute";
        addressQRImg.style.top = addressQRPosY + "px";
        addressQRImg.style.left = addressQRPosX + "px";
        addressQRImg.style.width = addressTargetSize + "px";
        addressQRImg.style.height = addressTargetSize + "px";
        addressQRImg.style.transform = "rotate(" + addressQRRot + "deg)";
        addressQRImg.id = "paperwallet_custom_preview_addressqr";

        const currentPrivkeyQR = qrcode(0, "H");
        currentPrivkeyQR.addData(currentPrivkey);
        currentPrivkeyQR.make();
        const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
        finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
        const privkeyQRImg = new Image();
        privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
        privkeyQRImg.style.position = "absolute";
        privkeyQRImg.style.top = privkeyQRPosY + "px";
        privkeyQRImg.style.left = privkeyQRPosX + "px";
        privkeyQRImg.style.width = privkeyTargetSize + "px";
        privkeyQRImg.style.height = privkeyTargetSize + "px";
        privkeyQRImg.style.transform = "rotate(" + privkeyQRRot + "deg)";
        privkeyQRImg.id = "paperwallet_custom_preview_privkeyqr";

        const parentDiv = document.createElement("div");
        parentDiv.id = "paperwallet_preview_parentdiv";

        backgroundImage.onload = function()
        {
            parentDiv.style.position = "relative";
            parentDiv.style.width = backgroundImage.width * backgroundImageScale + "px";
            parentDiv.style.height = backgroundImage.height * backgroundImageScale + "px";
            container.style.width = backgroundImage.width * backgroundImageScale + "px";
            container.style.height = backgroundImage.height * backgroundImageScale + "px";
            backgroundImage.style.position = "absolute";
            backgroundImage.style.top = "0px";
            backgroundImage.style.left = "0px";
            backgroundImage.style.width = "100%";
            backgroundImage.style.height = "100%";
        };

        const addressDiv = document.createElement("div");
        addressDiv.innerHTML = splitTextLength(currentAddress, addressLineLength);
        addressDiv.style.position = "absolute";
        addressDiv.style.top = addressPosY + "px";
        addressDiv.style.left = addressPosX + "px";
        addressDiv.style.fontFamily = "roboto-mono";
        addressDiv.style.fontWeight = "normal";
        addressDiv.style.fontSize = addressFontSize + "px";
        addressDiv.style.transform = "rotate(" + addressFontRot + "deg)";
        addressDiv.style.transformOrigin = "0% 0%";
        addressDiv.id = "paperwallet_custom_preview_address";

        const privkeyDiv = document.createElement("div");
        privkeyDiv.innerHTML = splitTextLength(currentPrivkey, privkeyLineLength);
        privkeyDiv.style.position = "absolute";
        privkeyDiv.style.top = privkeyPosY + "px";
        privkeyDiv.style.left = privkeyPosX + "px";
        privkeyDiv.style.fontFamily = "roboto-mono";
        privkeyDiv.style.fontWeight = "normal";
        privkeyDiv.style.fontSize = privkeyFontSize + "px";
        privkeyDiv.style.transform = "rotate(" + privkeyFontRot + "deg)";
        privkeyDiv.style.transformOrigin = "0% 0%";
        privkeyDiv.id = "paperwallet_custom_preview_privkey";

        parentDiv.appendChild(backgroundImage);
        parentDiv.appendChild(addressDiv);
        parentDiv.appendChild(privkeyDiv);
        parentDiv.appendChild(addressQRImg);
        parentDiv.appendChild(privkeyQRImg);

        container.appendChild(parentDiv);
    }

    function bigintToByteArray_littleEndian(bigint: BN)
    {
        const array = bigintToByteArray(bigint);
        while (array.length < 32)
            array.push(0);

        return array.reverse();
    }

    function Uint32ToBytes(num: number)
    {
        return [num >>> 24, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff];
    }

    function BytesToUint32(bytes: number[])
    {
        return ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
    }

    function SerializeECCKeypairCompressed(keypair: EcKeypair)
    {
        return [0x2 + keypair.y.and(bn_1).toNumber(), ...bigintToByteArray_littleEndian(keypair.x)];
    }

    function ModPow(num: BN, exponent: BN, mod: BN)
    {
        let ret = bn_1;

        while (!exponent.isZero())
        {
            if (!(exponent.and(bn_1)).isZero())
                ret = (ret.mul(num)).mod(mod);

            exponent = exponent.shrn(1);
            num = (num.mul(num)).mod(mod);
        }

        return ret;
    }

    interface KeyData
    {
        key: number[];
        chainCode: number[];
    }

    interface DerivedPrivKey
    {
        key: BN;
        chainCode: number[];
    }

    function CKD_Priv(parent: KeyData, index: number): DerivedPrivKey
    {
        const isHardened = (index & 0x80000000) !== 0;
        const parentKey = parent.key;
        const parentKeyBigint = byteArrayToBigint(parentKey);
        const parentChainCode = parent.chainCode;

        let I;
        if (isHardened)
            I = HmacSHA512([0x00, ...parentKey, ...Uint32ToBytes(index)], parentChainCode);
        else
            I = HmacSHA512([...SerializeECCKeypairCompressed(getECCKeypair(parentKeyBigint)), ...Uint32ToBytes(index)], parentChainCode);

        const IL = I.slice(0, 32);
        const IR = I.slice(32, 64);

        const parsed256IL = byteArrayToBigint(IL);
        const childKey = (parsed256IL.add(parentKeyBigint)).mod(ecc_n);

        // In case parse256(IL) >= n or ki == 0, the resulting key is invalid, and one should proceed with the next value for i. (Note: this has probability lower than 1 in 2^127.)
        if (parsed256IL.gte(ecc_n) || childKey.isZero())
            return CKD_Priv(parent, index + 1);

        return <DerivedPrivKey>{
            key: childKey,
            chainCode: IR
        };
    }

    interface CompressedEcKeypair
    {
        x: number[];
        isOdd: boolean;
    }

    interface DerivedPubKey
    {
        keypair: EcKeypair;
        chainCode: number[];
    }

    function CKD_Pub(parent: { keypair: CompressedEcKeypair, chainCode: number[] }, index: number): DerivedPubKey
    {
        const isHardened = (index & 0x80000000) !== 0;
        if (isHardened)
            throw new Error("Cannot derive hardened child key of extended public key");

        const parentKeyPair = parent.keypair;
        const pointX = byteArrayToBigint(parentKeyPair.x);
        const isOdd = parentKeyPair.isOdd;

        const val = (pointX.mul(pointX).mul(pointX)).add(new BN(7));
        let pointY = ModPow(val, (ecc_p.add(bn_1)).shrn(2), ecc_p);
        if (pointY.lt(bn_0))
            pointY = pointY.add(ecc_p);

        if (pointY.isOdd() !== isOdd)
            pointY = ecc_p.sub(pointY);

        const parentKeyPairBigint = <EcKeypair>{ x: pointX, y: pointY };
        const parentChainCode = parent.chainCode;

        const I = HmacSHA512([...SerializeECCKeypairCompressed(parentKeyPairBigint), ...Uint32ToBytes(index)], parentChainCode);

        const IL = I.slice(0, 32);
        const IR = I.slice(32, 64);

        const tempBigint = byteArrayToBigint(IL);
        const multiplied = getECCKeypair(tempBigint);
        const childKeyPair = ecAdd(multiplied.x, multiplied.y, parentKeyPairBigint.x, parentKeyPairBigint.y);
        if (childKeyPair.y.lt(bn_0))
            childKeyPair.y = childKeyPair.y.add(ecc_p);

        // In case parse256(IL) >= n or Ki is the point at infinity, the resulting key is invalid, and one should proceed with the next value for i.
        if (tempBigint.gte(ecc_n) || tempBigint.isZero())
            return CKD_Pub(parent, index + 1);

        return <DerivedPubKey>{
            keypair: childKeyPair,
            chainCode: IR
        };
    }

    function GetExtendedKeyFingerprint(key: number[])
    {
        return RIPEMD160(SHA256(key)).slice(0, 4);
    }

    function GetMasterKeyFromSeed(seed: number[])
    {
        const I = HmacSHA512(seed, "Bitcoin seed");

        const IL = I.slice(0, 32);
        const IR = I.slice(32, 64);

        return <DerivedPrivKey>{
            key: byteArrayToBigint(IL),
            chainCode: IR
        };
    }

    type Bip32Purpose = "44" | "49" | "84" | "32";
    function SerializeExtendedKey(isPrivate: boolean, depth: number, parentKeyFingerprint: number[],
        childIndex: number, chainCode: number[], keyData: number[], purpose: Bip32Purpose)
    {
        let versionBytes;
        switch (purpose)
        {
            case "49":
                // ypub yprv
                if (isPrivate)
                    versionBytes = [0x04, 0x9D, 0x78, 0x78];
                else
                    versionBytes = [0x04, 0x9D, 0x7C, 0xB2];
                break;
            case "84":
                // zpub zprv
                if (isPrivate)
                    versionBytes = [0x04, 0xB2, 0x43, 0x0C];
                else
                    versionBytes = [0x04, 0xB2, 0x47, 0x46];
                break;
            case "44":
            case "32":
                if (isPrivate)
                    versionBytes = [0x04, 0x88, 0xAD, 0xE4];
                else
                    versionBytes = [0x04, 0x88, 0xB2, 0x1E];
                break;
        }

        if (depth > 255)
            throw new Error("Depth must be 255 at most");

        const finalResult = [...versionBytes, depth, ...parentKeyFingerprint, ...Uint32ToBytes(childIndex), ...chainCode, ...keyData];
        return base58checkEncode(finalResult);
    }

    function UnextendKey(extendedKey: string)
    {
        const decodedKey = base58checkDecode(extendedKey);
        const keyData = decodedKey.slice(45);
        const key = byteArrayToBigint(keyData.slice(1));

        if (keyData[0] === 0)
            return makePrivateKey(key);
        else
        {
            const keypair = <EcKeypair>{ x: key, y: new BN(keyData[0]) };
            switch (extendedKey[0])
            {
                case "x":
                    return makeAddress(keypair);
                case "y":
                    return makeSegwitAddress(keypair);
                case "z":
                    return makeBech32Address(keypair);
                default:
                    throw new Error("Unknown key type");
            }
        }
    }

    function DeriveKey(extendedKey: string, path: string, toPrivate: boolean, type: Bip32Purpose = "44")
    {
        if (path[0] !== "m")
            throw new Error("Path must start with \"m\"");

        const segments = path.substr(2).split("/");
        const childIndices = [];

        for (let index of segments)
        {
            if (index === "")
                continue;

            const match = index.match(/^(\d+)(')?$/);
            if (match)
            {
                const index = parseInt(match[1]);
                const isHardened = match[2] !== undefined;
                childIndices.push((isHardened ? (index | 0x80000000) : index) >>> 0);
            }
            else
                throw new Error("Invalid path segment: " + index);
        }

        const decodedKey = base58checkDecode(extendedKey);

        let currentDepth = decodedKey[4];
        let chainCode = decodedKey.slice(13, 45);
        let keyData = decodedKey.slice(45);
        const fromPrivate = keyData[0] === 0;
        if (!fromPrivate && toPrivate)
            throw new Error("Cannot derive private key from public key");

        let parentKeyData: number[] | null = null;

        let lastIndex = BytesToUint32(decodedKey.slice(9, 13));
        for (let childIndex of childIndices)
        {
            parentKeyData = keyData;
            lastIndex = childIndex;
            let derivedKey;
            if (fromPrivate)
            {
                const privkey = keyData.slice(1);
                derivedKey = CKD_Priv(<KeyData>{ key: privkey, chainCode: chainCode}, childIndex);
                keyData = [0x00, ...bigintToByteArray_littleEndian(derivedKey.key)];
            }
            else
            {
                const keypair: CompressedEcKeypair = {
                    x: keyData.slice(1),
                    isOdd: (keyData[0] & 1) != 0
                };
                derivedKey = CKD_Pub({ keypair: keypair, chainCode: chainCode }, childIndex);
                keyData = SerializeECCKeypairCompressed(derivedKey.keypair);
            }

            chainCode = derivedKey.chainCode;
            ++currentDepth;
        }

        let fingerprint;
        const convertToPublic = !toPrivate && keyData[0] === 0;
        const convertParentToPublic = !toPrivate && parentKeyData !== null && parentKeyData[0] === 0;
        if (convertToPublic)
            keyData = SerializeECCKeypairCompressed(getECCKeypair(byteArrayToBigint(keyData.slice(1))));

        if (convertParentToPublic)
            parentKeyData = SerializeECCKeypairCompressed(getECCKeypair(byteArrayToBigint(parentKeyData!.slice(1))));

        if (parentKeyData)
        {
            if (toPrivate)
            {
                const pubkey = SerializeECCKeypairCompressed(getECCKeypair(byteArrayToBigint(parentKeyData.slice(1))));
                fingerprint = GetExtendedKeyFingerprint(pubkey);
            }
            else
                fingerprint = GetExtendedKeyFingerprint(parentKeyData);
        }
        else
            fingerprint = decodedKey.slice(5, 9);

        return SerializeExtendedKey(toPrivate, currentDepth, fingerprint, lastIndex, chainCode, keyData, type);
    }

    const bip39wordlist: { [key: string]: number } = {
        "abandon": 0, "ability": 1, "able": 2, "about": 3, "above": 4, "absent": 5, "absorb": 6, "abstract": 7, "absurd": 8, "abuse": 9, "access": 10, "accident": 11, "account": 12, "accuse": 13, "achieve": 14, "acid": 15, "acoustic": 16, "acquire": 17, "across": 18, "act": 19, "action": 20, "actor": 21, "actress": 22, "actual": 23, "adapt": 24, "add": 25, "addict": 26, "address": 27, "adjust": 28, "admit": 29, "adult": 30, "advance": 31, "advice": 32, "aerobic": 33, "affair": 34, "afford": 35, "afraid": 36, "again": 37, "age": 38, "agent": 39, "agree": 40, "ahead": 41, "aim": 42, "air": 43, "airport": 44, "aisle": 45, "alarm": 46, "album": 47, "alcohol": 48, "alert": 49, "alien": 50, "all": 51, "alley": 52, "allow": 53, "almost": 54, "alone": 55, "alpha": 56, "already": 57, "also": 58, "alter": 59, "always": 60, "amateur": 61, "amazing": 62, "among": 63, "amount": 64, "amused": 65, "analyst": 66, "anchor": 67, "ancient": 68, "anger": 69, "angle": 70, "angry": 71, "animal": 72, "ankle": 73, "announce": 74, "annual": 75, "another": 76, "answer": 77, "antenna": 78, "antique": 79, "anxiety": 80, "any": 81, "apart": 82, "apology": 83, "appear": 84, "apple": 85, "approve": 86, "april": 87, "arch": 88, "arctic": 89, "area": 90, "arena": 91, "argue": 92, "arm": 93, "armed": 94, "armor": 95, "army": 96, "around": 97, "arrange": 98, "arrest": 99, "arrive": 100, "arrow": 101, "art": 102, "artefact": 103, "artist": 104, "artwork": 105, "ask": 106, "aspect": 107, "assault": 108, "asset": 109, "assist": 110, "assume": 111, "asthma": 112, "athlete": 113, "atom": 114, "attack": 115, "attend": 116, "attitude": 117, "attract": 118, "auction": 119, "audit": 120, "august": 121, "aunt": 122, "author": 123, "auto": 124, "autumn": 125, "average": 126, "avocado": 127, "avoid": 128, "awake": 129, "aware": 130, "away": 131, "awesome": 132, "awful": 133, "awkward": 134, "axis": 135, "baby": 136, "bachelor": 137, "bacon": 138, "badge": 139, "bag": 140, "balance": 141, "balcony": 142, "ball": 143, "bamboo": 144, "banana": 145, "banner": 146, "bar": 147, "barely": 148, "bargain": 149, "barrel": 150, "base": 151, "basic": 152, "basket": 153, "battle": 154, "beach": 155, "bean": 156, "beauty": 157, "because": 158, "become": 159, "beef": 160, "before": 161, "begin": 162, "behave": 163, "behind": 164, "believe": 165, "below": 166, "belt": 167, "bench": 168, "benefit": 169, "best": 170, "betray": 171, "better": 172, "between": 173, "beyond": 174, "bicycle": 175, "bid": 176, "bike": 177, "bind": 178, "biology": 179, "bird": 180, "birth": 181, "bitter": 182, "black": 183, "blade": 184, "blame": 185, "blanket": 186, "blast": 187, "bleak": 188, "bless": 189, "blind": 190, "blood": 191, "blossom": 192, "blouse": 193, "blue": 194, "blur": 195, "blush": 196, "board": 197, "boat": 198, "body": 199, "boil": 200, "bomb": 201, "bone": 202, "bonus": 203, "book": 204, "boost": 205, "border": 206, "boring": 207, "borrow": 208, "boss": 209, "bottom": 210, "bounce": 211, "box": 212, "boy": 213, "bracket": 214, "brain": 215, "brand": 216, "brass": 217, "brave": 218, "bread": 219, "breeze": 220, "brick": 221, "bridge": 222, "brief": 223, "bright": 224, "bring": 225, "brisk": 226, "broccoli": 227, "broken": 228, "bronze": 229, "broom": 230, "brother": 231, "brown": 232, "brush": 233, "bubble": 234, "buddy": 235, "budget": 236, "buffalo": 237, "build": 238, "bulb": 239, "bulk": 240, "bullet": 241, "bundle": 242, "bunker": 243, "burden": 244, "burger": 245, "burst": 246, "bus": 247, "business": 248, "busy": 249, "butter": 250, "buyer": 251, "buzz": 252, "cabbage": 253, "cabin": 254, "cable": 255, "cactus": 256, "cage": 257, "cake": 258, "call": 259, "calm": 260, "camera": 261, "camp": 262, "can": 263, "canal": 264, "cancel": 265, "candy": 266, "cannon": 267, "canoe": 268, "canvas": 269, "canyon": 270, "capable": 271, "capital": 272, "captain": 273, "car": 274, "carbon": 275, "card": 276, "cargo": 277, "carpet": 278, "carry": 279, "cart": 280, "case": 281, "cash": 282, "casino": 283, "castle": 284, "casual": 285, "cat": 286, "catalog": 287, "catch": 288, "category": 289, "cattle": 290, "caught": 291, "cause": 292, "caution": 293, "cave": 294, "ceiling": 295, "celery": 296, "cement": 297, "census": 298, "century": 299, "cereal": 300, "certain": 301, "chair": 302, "chalk": 303, "champion": 304, "change": 305, "chaos": 306, "chapter": 307, "charge": 308, "chase": 309, "chat": 310, "cheap": 311, "check": 312, "cheese": 313, "chef": 314, "cherry": 315, "chest": 316, "chicken": 317, "chief": 318, "child": 319, "chimney": 320, "choice": 321, "choose": 322, "chronic": 323, "chuckle": 324, "chunk": 325, "churn": 326, "cigar": 327, "cinnamon": 328, "circle": 329, "citizen": 330, "city": 331, "civil": 332, "claim": 333, "clap": 334, "clarify": 335, "claw": 336, "clay": 337, "clean": 338, "clerk": 339, "clever": 340, "click": 341, "client": 342, "cliff": 343, "climb": 344, "clinic": 345, "clip": 346, "clock": 347, "clog": 348, "close": 349, "cloth": 350, "cloud": 351, "clown": 352, "club": 353, "clump": 354, "cluster": 355, "clutch": 356, "coach": 357, "coast": 358, "coconut": 359, "code": 360, "coffee": 361, "coil": 362, "coin": 363, "collect": 364, "color": 365, "column": 366, "combine": 367, "come": 368, "comfort": 369, "comic": 370, "common": 371, "company": 372, "concert": 373, "conduct": 374, "confirm": 375, "congress": 376, "connect": 377, "consider": 378, "control": 379, "convince": 380, "cook": 381, "cool": 382, "copper": 383, "copy": 384, "coral": 385, "core": 386, "corn": 387, "correct": 388, "cost": 389, "cotton": 390, "couch": 391, "country": 392, "couple": 393, "course": 394, "cousin": 395, "cover": 396, "coyote": 397, "crack": 398, "cradle": 399, "craft": 400, "cram": 401, "crane": 402, "crash": 403, "crater": 404, "crawl": 405, "crazy": 406, "cream": 407, "credit": 408, "creek": 409, "crew": 410, "cricket": 411, "crime": 412, "crisp": 413, "critic": 414, "crop": 415, "cross": 416, "crouch": 417, "crowd": 418, "crucial": 419, "cruel": 420, "cruise": 421, "crumble": 422, "crunch": 423, "crush": 424, "cry": 425, "crystal": 426, "cube": 427, "culture": 428, "cup": 429, "cupboard": 430, "curious": 431, "current": 432, "curtain": 433, "curve": 434, "cushion": 435, "custom": 436, "cute": 437, "cycle": 438, "dad": 439, "damage": 440, "damp": 441, "dance": 442, "danger": 443, "daring": 444, "dash": 445, "daughter": 446, "dawn": 447, "day": 448, "deal": 449, "debate": 450, "debris": 451, "decade": 452, "december": 453, "decide": 454, "decline": 455, "decorate": 456, "decrease": 457, "deer": 458, "defense": 459, "define": 460, "defy": 461, "degree": 462, "delay": 463, "deliver": 464, "demand": 465, "demise": 466, "denial": 467, "dentist": 468, "deny": 469, "depart": 470, "depend": 471, "deposit": 472, "depth": 473, "deputy": 474, "derive": 475, "describe": 476, "desert": 477, "design": 478, "desk": 479, "despair": 480, "destroy": 481, "detail": 482, "detect": 483, "develop": 484, "device": 485, "devote": 486, "diagram": 487, "dial": 488, "diamond": 489, "diary": 490, "dice": 491, "diesel": 492, "diet": 493, "differ": 494, "digital": 495, "dignity": 496, "dilemma": 497, "dinner": 498, "dinosaur": 499, "direct": 500, "dirt": 501, "disagree": 502, "discover": 503, "disease": 504, "dish": 505, "dismiss": 506, "disorder": 507, "display": 508, "distance": 509, "divert": 510, "divide": 511,
        "divorce": 512, "dizzy": 513, "doctor": 514, "document": 515, "dog": 516, "doll": 517, "dolphin": 518, "domain": 519, "donate": 520, "donkey": 521, "donor": 522, "door": 523, "dose": 524, "double": 525, "dove": 526, "draft": 527, "dragon": 528, "drama": 529, "drastic": 530, "draw": 531, "dream": 532, "dress": 533, "drift": 534, "drill": 535, "drink": 536, "drip": 537, "drive": 538, "drop": 539, "drum": 540, "dry": 541, "duck": 542, "dumb": 543, "dune": 544, "during": 545, "dust": 546, "dutch": 547, "duty": 548, "dwarf": 549, "dynamic": 550, "eager": 551, "eagle": 552, "early": 553, "earn": 554, "earth": 555, "easily": 556, "east": 557, "easy": 558, "echo": 559, "ecology": 560, "economy": 561, "edge": 562, "edit": 563, "educate": 564, "effort": 565, "egg": 566, "eight": 567, "either": 568, "elbow": 569, "elder": 570, "electric": 571, "elegant": 572, "element": 573, "elephant": 574, "elevator": 575, "elite": 576, "else": 577, "embark": 578, "embody": 579, "embrace": 580, "emerge": 581, "emotion": 582, "employ": 583, "empower": 584, "empty": 585, "enable": 586, "enact": 587, "end": 588, "endless": 589, "endorse": 590, "enemy": 591, "energy": 592, "enforce": 593, "engage": 594, "engine": 595, "enhance": 596, "enjoy": 597, "enlist": 598, "enough": 599, "enrich": 600, "enroll": 601, "ensure": 602, "enter": 603, "entire": 604, "entry": 605, "envelope": 606, "episode": 607, "equal": 608, "equip": 609, "era": 610, "erase": 611, "erode": 612, "erosion": 613, "error": 614, "erupt": 615, "escape": 616, "essay": 617, "essence": 618, "estate": 619, "eternal": 620, "ethics": 621, "evidence": 622, "evil": 623, "evoke": 624, "evolve": 625, "exact": 626, "example": 627, "excess": 628, "exchange": 629, "excite": 630, "exclude": 631, "excuse": 632, "execute": 633, "exercise": 634, "exhaust": 635, "exhibit": 636, "exile": 637, "exist": 638, "exit": 639, "exotic": 640, "expand": 641, "expect": 642, "expire": 643, "explain": 644, "expose": 645, "express": 646, "extend": 647, "extra": 648, "eye": 649, "eyebrow": 650, "fabric": 651, "face": 652, "faculty": 653, "fade": 654, "faint": 655, "faith": 656, "fall": 657, "false": 658, "fame": 659, "family": 660, "famous": 661, "fan": 662, "fancy": 663, "fantasy": 664, "farm": 665, "fashion": 666, "fat": 667, "fatal": 668, "father": 669, "fatigue": 670, "fault": 671, "favorite": 672, "feature": 673, "february": 674, "federal": 675, "fee": 676, "feed": 677, "feel": 678, "female": 679, "fence": 680, "festival": 681, "fetch": 682, "fever": 683, "few": 684, "fiber": 685, "fiction": 686, "field": 687, "figure": 688, "file": 689, "film": 690, "filter": 691, "final": 692, "find": 693, "fine": 694, "finger": 695, "finish": 696, "fire": 697, "firm": 698, "first": 699, "fiscal": 700, "fish": 701, "fit": 702, "fitness": 703, "fix": 704, "flag": 705, "flame": 706, "flash": 707, "flat": 708, "flavor": 709, "flee": 710, "flight": 711, "flip": 712, "float": 713, "flock": 714, "floor": 715, "flower": 716, "fluid": 717, "flush": 718, "fly": 719, "foam": 720, "focus": 721, "fog": 722, "foil": 723, "fold": 724, "follow": 725, "food": 726, "foot": 727, "force": 728, "forest": 729, "forget": 730, "fork": 731, "fortune": 732, "forum": 733, "forward": 734, "fossil": 735, "foster": 736, "found": 737, "fox": 738, "fragile": 739, "frame": 740, "frequent": 741, "fresh": 742, "friend": 743, "fringe": 744, "frog": 745, "front": 746, "frost": 747, "frown": 748, "frozen": 749, "fruit": 750, "fuel": 751, "fun": 752, "funny": 753, "furnace": 754, "fury": 755, "future": 756, "gadget": 757, "gain": 758, "galaxy": 759, "gallery": 760, "game": 761, "gap": 762, "garage": 763, "garbage": 764, "garden": 765, "garlic": 766, "garment": 767, "gas": 768, "gasp": 769, "gate": 770, "gather": 771, "gauge": 772, "gaze": 773, "general": 774, "genius": 775, "genre": 776, "gentle": 777, "genuine": 778, "gesture": 779, "ghost": 780, "giant": 781, "gift": 782, "giggle": 783, "ginger": 784, "giraffe": 785, "girl": 786, "give": 787, "glad": 788, "glance": 789, "glare": 790, "glass": 791, "glide": 792, "glimpse": 793, "globe": 794, "gloom": 795, "glory": 796, "glove": 797, "glow": 798, "glue": 799, "goat": 800, "goddess": 801, "gold": 802, "good": 803, "goose": 804, "gorilla": 805, "gospel": 806, "gossip": 807, "govern": 808, "gown": 809, "grab": 810, "grace": 811, "grain": 812, "grant": 813, "grape": 814, "grass": 815, "gravity": 816, "great": 817, "green": 818, "grid": 819, "grief": 820, "grit": 821, "grocery": 822, "group": 823, "grow": 824, "grunt": 825, "guard": 826, "guess": 827, "guide": 828, "guilt": 829, "guitar": 830, "gun": 831, "gym": 832, "habit": 833, "hair": 834, "half": 835, "hammer": 836, "hamster": 837, "hand": 838, "happy": 839, "harbor": 840, "hard": 841, "harsh": 842, "harvest": 843, "hat": 844, "have": 845, "hawk": 846, "hazard": 847, "head": 848, "health": 849, "heart": 850, "heavy": 851, "hedgehog": 852, "height": 853, "hello": 854, "helmet": 855, "help": 856, "hen": 857, "hero": 858, "hidden": 859, "high": 860, "hill": 861, "hint": 862, "hip": 863, "hire": 864, "history": 865, "hobby": 866, "hockey": 867, "hold": 868, "hole": 869, "holiday": 870, "hollow": 871, "home": 872, "honey": 873, "hood": 874, "hope": 875, "horn": 876, "horror": 877, "horse": 878, "hospital": 879, "host": 880, "hotel": 881, "hour": 882, "hover": 883, "hub": 884, "huge": 885, "human": 886, "humble": 887, "humor": 888, "hundred": 889, "hungry": 890, "hunt": 891, "hurdle": 892, "hurry": 893, "hurt": 894, "husband": 895, "hybrid": 896, "ice": 897, "icon": 898, "idea": 899, "identify": 900, "idle": 901, "ignore": 902, "ill": 903, "illegal": 904, "illness": 905, "image": 906, "imitate": 907, "immense": 908, "immune": 909, "impact": 910, "impose": 911, "improve": 912, "impulse": 913, "inch": 914, "include": 915, "income": 916, "increase": 917, "index": 918, "indicate": 919, "indoor": 920, "industry": 921, "infant": 922, "inflict": 923, "inform": 924, "inhale": 925, "inherit": 926, "initial": 927, "inject": 928, "injury": 929, "inmate": 930, "inner": 931, "innocent": 932, "input": 933, "inquiry": 934, "insane": 935, "insect": 936, "inside": 937, "inspire": 938, "install": 939, "intact": 940, "interest": 941, "into": 942, "invest": 943, "invite": 944, "involve": 945, "iron": 946, "island": 947, "isolate": 948, "issue": 949, "item": 950, "ivory": 951, "jacket": 952, "jaguar": 953, "jar": 954, "jazz": 955, "jealous": 956, "jeans": 957, "jelly": 958, "jewel": 959, "job": 960, "join": 961, "joke": 962, "journey": 963, "joy": 964, "judge": 965, "juice": 966, "jump": 967, "jungle": 968, "junior": 969, "junk": 970, "just": 971, "kangaroo": 972, "keen": 973, "keep": 974, "ketchup": 975, "key": 976, "kick": 977, "kid": 978, "kidney": 979, "kind": 980, "kingdom": 981, "kiss": 982, "kit": 983, "kitchen": 984, "kite": 985, "kitten": 986, "kiwi": 987, "knee": 988, "knife": 989, "knock": 990, "know": 991, "lab": 992, "label": 993, "labor": 994, "ladder": 995, "lady": 996, "lake": 997, "lamp": 998, "language": 999, "laptop": 1000, "large": 1001, "later": 1002, "latin": 1003, "laugh": 1004, "laundry": 1005, "lava": 1006, "law": 1007, "lawn": 1008, "lawsuit": 1009, "layer": 1010, "lazy": 1011, "leader": 1012, "leaf": 1013, "learn": 1014, "leave": 1015, "lecture": 1016, "left": 1017, "leg": 1018, "legal": 1019, "legend": 1020, "leisure": 1021, "lemon": 1022, "lend": 1023,
        "length": 1024, "lens": 1025, "leopard": 1026, "lesson": 1027, "letter": 1028, "level": 1029, "liar": 1030, "liberty": 1031, "library": 1032, "license": 1033, "life": 1034, "lift": 1035, "light": 1036, "like": 1037, "limb": 1038, "limit": 1039, "link": 1040, "lion": 1041, "liquid": 1042, "list": 1043, "little": 1044, "live": 1045, "lizard": 1046, "load": 1047, "loan": 1048, "lobster": 1049, "local": 1050, "lock": 1051, "logic": 1052, "lonely": 1053, "long": 1054, "loop": 1055, "lottery": 1056, "loud": 1057, "lounge": 1058, "love": 1059, "loyal": 1060, "lucky": 1061, "luggage": 1062, "lumber": 1063, "lunar": 1064, "lunch": 1065, "luxury": 1066, "lyrics": 1067, "machine": 1068, "mad": 1069, "magic": 1070, "magnet": 1071, "maid": 1072, "mail": 1073, "main": 1074, "major": 1075, "make": 1076, "mammal": 1077, "man": 1078, "manage": 1079, "mandate": 1080, "mango": 1081, "mansion": 1082, "manual": 1083, "maple": 1084, "marble": 1085, "march": 1086, "margin": 1087, "marine": 1088, "market": 1089, "marriage": 1090, "mask": 1091, "mass": 1092, "master": 1093, "match": 1094, "material": 1095, "math": 1096, "matrix": 1097, "matter": 1098, "maximum": 1099, "maze": 1100, "meadow": 1101, "mean": 1102, "measure": 1103, "meat": 1104, "mechanic": 1105, "medal": 1106, "media": 1107, "melody": 1108, "melt": 1109, "member": 1110, "memory": 1111, "mention": 1112, "menu": 1113, "mercy": 1114, "merge": 1115, "merit": 1116, "merry": 1117, "mesh": 1118, "message": 1119, "metal": 1120, "method": 1121, "middle": 1122, "midnight": 1123, "milk": 1124, "million": 1125, "mimic": 1126, "mind": 1127, "minimum": 1128, "minor": 1129, "minute": 1130, "miracle": 1131, "mirror": 1132, "misery": 1133, "miss": 1134, "mistake": 1135, "mix": 1136, "mixed": 1137, "mixture": 1138, "mobile": 1139, "model": 1140, "modify": 1141, "mom": 1142, "moment": 1143, "monitor": 1144, "monkey": 1145, "monster": 1146, "month": 1147, "moon": 1148, "moral": 1149, "more": 1150, "morning": 1151, "mosquito": 1152, "mother": 1153, "motion": 1154, "motor": 1155, "mountain": 1156, "mouse": 1157, "move": 1158, "movie": 1159, "much": 1160, "muffin": 1161, "mule": 1162, "multiply": 1163, "muscle": 1164, "museum": 1165, "mushroom": 1166, "music": 1167, "must": 1168, "mutual": 1169, "myself": 1170, "mystery": 1171, "myth": 1172, "naive": 1173, "name": 1174, "napkin": 1175, "narrow": 1176, "nasty": 1177, "nation": 1178, "nature": 1179, "near": 1180, "neck": 1181, "need": 1182, "negative": 1183, "neglect": 1184, "neither": 1185, "nephew": 1186, "nerve": 1187, "nest": 1188, "net": 1189, "network": 1190, "neutral": 1191, "never": 1192, "news": 1193, "next": 1194, "nice": 1195, "night": 1196, "noble": 1197, "noise": 1198, "nominee": 1199, "noodle": 1200, "normal": 1201, "north": 1202, "nose": 1203, "notable": 1204, "note": 1205, "nothing": 1206, "notice": 1207, "novel": 1208, "now": 1209, "nuclear": 1210, "number": 1211, "nurse": 1212, "nut": 1213, "oak": 1214, "obey": 1215, "object": 1216, "oblige": 1217, "obscure": 1218, "observe": 1219, "obtain": 1220, "obvious": 1221, "occur": 1222, "ocean": 1223, "october": 1224, "odor": 1225, "off": 1226, "offer": 1227, "office": 1228, "often": 1229, "oil": 1230, "okay": 1231, "old": 1232, "olive": 1233, "olympic": 1234, "omit": 1235, "once": 1236, "one": 1237, "onion": 1238, "online": 1239, "only": 1240, "open": 1241, "opera": 1242, "opinion": 1243, "oppose": 1244, "option": 1245, "orange": 1246, "orbit": 1247, "orchard": 1248, "order": 1249, "ordinary": 1250, "organ": 1251, "orient": 1252, "original": 1253, "orphan": 1254, "ostrich": 1255, "other": 1256, "outdoor": 1257, "outer": 1258, "output": 1259, "outside": 1260, "oval": 1261, "oven": 1262, "over": 1263, "own": 1264, "owner": 1265, "oxygen": 1266, "oyster": 1267, "ozone": 1268, "pact": 1269, "paddle": 1270, "page": 1271, "pair": 1272, "palace": 1273, "palm": 1274, "panda": 1275, "panel": 1276, "panic": 1277, "panther": 1278, "paper": 1279, "parade": 1280, "parent": 1281, "park": 1282, "parrot": 1283, "party": 1284, "pass": 1285, "patch": 1286, "path": 1287, "patient": 1288, "patrol": 1289, "pattern": 1290, "pause": 1291, "pave": 1292, "payment": 1293, "peace": 1294, "peanut": 1295, "pear": 1296, "peasant": 1297, "pelican": 1298, "pen": 1299, "penalty": 1300, "pencil": 1301, "people": 1302, "pepper": 1303, "perfect": 1304, "permit": 1305, "person": 1306, "pet": 1307, "phone": 1308, "photo": 1309, "phrase": 1310, "physical": 1311, "piano": 1312, "picnic": 1313, "picture": 1314, "piece": 1315, "pig": 1316, "pigeon": 1317, "pill": 1318, "pilot": 1319, "pink": 1320, "pioneer": 1321, "pipe": 1322, "pistol": 1323, "pitch": 1324, "pizza": 1325, "place": 1326, "planet": 1327, "plastic": 1328, "plate": 1329, "play": 1330, "please": 1331, "pledge": 1332, "pluck": 1333, "plug": 1334, "plunge": 1335, "poem": 1336, "poet": 1337, "point": 1338, "polar": 1339, "pole": 1340, "police": 1341, "pond": 1342, "pony": 1343, "pool": 1344, "popular": 1345, "portion": 1346, "position": 1347, "possible": 1348, "post": 1349, "potato": 1350, "pottery": 1351, "poverty": 1352, "powder": 1353, "power": 1354, "practice": 1355, "praise": 1356, "predict": 1357, "prefer": 1358, "prepare": 1359, "present": 1360, "pretty": 1361, "prevent": 1362, "price": 1363, "pride": 1364, "primary": 1365, "print": 1366, "priority": 1367, "prison": 1368, "private": 1369, "prize": 1370, "problem": 1371, "process": 1372, "produce": 1373, "profit": 1374, "program": 1375, "project": 1376, "promote": 1377, "proof": 1378, "property": 1379, "prosper": 1380, "protect": 1381, "proud": 1382, "provide": 1383, "public": 1384, "pudding": 1385, "pull": 1386, "pulp": 1387, "pulse": 1388, "pumpkin": 1389, "punch": 1390, "pupil": 1391, "puppy": 1392, "purchase": 1393, "purity": 1394, "purpose": 1395, "purse": 1396, "push": 1397, "put": 1398, "puzzle": 1399, "pyramid": 1400, "quality": 1401, "quantum": 1402, "quarter": 1403, "question": 1404, "quick": 1405, "quit": 1406, "quiz": 1407, "quote": 1408, "rabbit": 1409, "raccoon": 1410, "race": 1411, "rack": 1412, "radar": 1413, "radio": 1414, "rail": 1415, "rain": 1416, "raise": 1417, "rally": 1418, "ramp": 1419, "ranch": 1420, "random": 1421, "range": 1422, "rapid": 1423, "rare": 1424, "rate": 1425, "rather": 1426, "raven": 1427, "raw": 1428, "razor": 1429, "ready": 1430, "real": 1431, "reason": 1432, "rebel": 1433, "rebuild": 1434, "recall": 1435, "receive": 1436, "recipe": 1437, "record": 1438, "recycle": 1439, "reduce": 1440, "reflect": 1441, "reform": 1442, "refuse": 1443, "region": 1444, "regret": 1445, "regular": 1446, "reject": 1447, "relax": 1448, "release": 1449, "relief": 1450, "rely": 1451, "remain": 1452, "remember": 1453, "remind": 1454, "remove": 1455, "render": 1456, "renew": 1457, "rent": 1458, "reopen": 1459, "repair": 1460, "repeat": 1461, "replace": 1462, "report": 1463, "require": 1464, "rescue": 1465, "resemble": 1466, "resist": 1467, "resource": 1468, "response": 1469, "result": 1470, "retire": 1471, "retreat": 1472, "return": 1473, "reunion": 1474, "reveal": 1475, "review": 1476, "reward": 1477, "rhythm": 1478, "rib": 1479, "ribbon": 1480, "rice": 1481, "rich": 1482, "ride": 1483, "ridge": 1484, "rifle": 1485, "right": 1486, "rigid": 1487, "ring": 1488, "riot": 1489, "ripple": 1490, "risk": 1491, "ritual": 1492, "rival": 1493, "river": 1494, "road": 1495, "roast": 1496, "robot": 1497, "robust": 1498, "rocket": 1499, "romance": 1500, "roof": 1501, "rookie": 1502, "room": 1503, "rose": 1504, "rotate": 1505, "rough": 1506, "round": 1507, "route": 1508, "royal": 1509, "rubber": 1510, "rude": 1511, "rug": 1512, "rule": 1513, "run": 1514, "runway": 1515, "rural": 1516, "sad": 1517, "saddle": 1518, "sadness": 1519, "safe": 1520, "sail": 1521, "salad": 1522, "salmon": 1523, "salon": 1524, "salt": 1525, "salute": 1526, "same": 1527, "sample": 1528, "sand": 1529, "satisfy": 1530, "satoshi": 1531, "sauce": 1532, "sausage": 1533, "save": 1534, "say": 1535,
        "scale": 1536, "scan": 1537, "scare": 1538, "scatter": 1539, "scene": 1540, "scheme": 1541, "school": 1542, "science": 1543, "scissors": 1544, "scorpion": 1545, "scout": 1546, "scrap": 1547, "screen": 1548, "script": 1549, "scrub": 1550, "sea": 1551, "search": 1552, "season": 1553, "seat": 1554, "second": 1555, "secret": 1556, "section": 1557, "security": 1558, "seed": 1559, "seek": 1560, "segment": 1561, "select": 1562, "sell": 1563, "seminar": 1564, "senior": 1565, "sense": 1566, "sentence": 1567, "series": 1568, "service": 1569, "session": 1570, "settle": 1571, "setup": 1572, "seven": 1573, "shadow": 1574, "shaft": 1575, "shallow": 1576, "share": 1577, "shed": 1578, "shell": 1579, "sheriff": 1580, "shield": 1581, "shift": 1582, "shine": 1583, "ship": 1584, "shiver": 1585, "shock": 1586, "shoe": 1587, "shoot": 1588, "shop": 1589, "short": 1590, "shoulder": 1591, "shove": 1592, "shrimp": 1593, "shrug": 1594, "shuffle": 1595, "shy": 1596, "sibling": 1597, "sick": 1598, "side": 1599, "siege": 1600, "sight": 1601, "sign": 1602, "silent": 1603, "silk": 1604, "silly": 1605, "silver": 1606, "similar": 1607, "simple": 1608, "since": 1609, "sing": 1610, "siren": 1611, "sister": 1612, "situate": 1613, "six": 1614, "size": 1615, "skate": 1616, "sketch": 1617, "ski": 1618, "skill": 1619, "skin": 1620, "skirt": 1621, "skull": 1622, "slab": 1623, "slam": 1624, "sleep": 1625, "slender": 1626, "slice": 1627, "slide": 1628, "slight": 1629, "slim": 1630, "slogan": 1631, "slot": 1632, "slow": 1633, "slush": 1634, "small": 1635, "smart": 1636, "smile": 1637, "smoke": 1638, "smooth": 1639, "snack": 1640, "snake": 1641, "snap": 1642, "sniff": 1643, "snow": 1644, "soap": 1645, "soccer": 1646, "social": 1647, "sock": 1648, "soda": 1649, "soft": 1650, "solar": 1651, "soldier": 1652, "solid": 1653, "solution": 1654, "solve": 1655, "someone": 1656, "song": 1657, "soon": 1658, "sorry": 1659, "sort": 1660, "soul": 1661, "sound": 1662, "soup": 1663, "source": 1664, "south": 1665, "space": 1666, "spare": 1667, "spatial": 1668, "spawn": 1669, "speak": 1670, "special": 1671, "speed": 1672, "spell": 1673, "spend": 1674, "sphere": 1675, "spice": 1676, "spider": 1677, "spike": 1678, "spin": 1679, "spirit": 1680, "split": 1681, "spoil": 1682, "sponsor": 1683, "spoon": 1684, "sport": 1685, "spot": 1686, "spray": 1687, "spread": 1688, "spring": 1689, "spy": 1690, "square": 1691, "squeeze": 1692, "squirrel": 1693, "stable": 1694, "stadium": 1695, "staff": 1696, "stage": 1697, "stairs": 1698, "stamp": 1699, "stand": 1700, "start": 1701, "state": 1702, "stay": 1703, "steak": 1704, "steel": 1705, "stem": 1706, "step": 1707, "stereo": 1708, "stick": 1709, "still": 1710, "sting": 1711, "stock": 1712, "stomach": 1713, "stone": 1714, "stool": 1715, "story": 1716, "stove": 1717, "strategy": 1718, "street": 1719, "strike": 1720, "strong": 1721, "struggle": 1722, "student": 1723, "stuff": 1724, "stumble": 1725, "style": 1726, "subject": 1727, "submit": 1728, "subway": 1729, "success": 1730, "such": 1731, "sudden": 1732, "suffer": 1733, "sugar": 1734, "suggest": 1735, "suit": 1736, "summer": 1737, "sun": 1738, "sunny": 1739, "sunset": 1740, "super": 1741, "supply": 1742, "supreme": 1743, "sure": 1744, "surface": 1745, "surge": 1746, "surprise": 1747, "surround": 1748, "survey": 1749, "suspect": 1750, "sustain": 1751, "swallow": 1752, "swamp": 1753, "swap": 1754, "swarm": 1755, "swear": 1756, "sweet": 1757, "swift": 1758, "swim": 1759, "swing": 1760, "switch": 1761, "sword": 1762, "symbol": 1763, "symptom": 1764, "syrup": 1765, "system": 1766, "table": 1767, "tackle": 1768, "tag": 1769, "tail": 1770, "talent": 1771, "talk": 1772, "tank": 1773, "tape": 1774, "target": 1775, "task": 1776, "taste": 1777, "tattoo": 1778, "taxi": 1779, "teach": 1780, "team": 1781, "tell": 1782, "ten": 1783, "tenant": 1784, "tennis": 1785, "tent": 1786, "term": 1787, "test": 1788, "text": 1789, "thank": 1790, "that": 1791, "theme": 1792, "then": 1793, "theory": 1794, "there": 1795, "they": 1796, "thing": 1797, "this": 1798, "thought": 1799, "three": 1800, "thrive": 1801, "throw": 1802, "thumb": 1803, "thunder": 1804, "ticket": 1805, "tide": 1806, "tiger": 1807, "tilt": 1808, "timber": 1809, "time": 1810, "tiny": 1811, "tip": 1812, "tired": 1813, "tissue": 1814, "title": 1815, "toast": 1816, "tobacco": 1817, "today": 1818, "toddler": 1819, "toe": 1820, "together": 1821, "toilet": 1822, "token": 1823, "tomato": 1824, "tomorrow": 1825, "tone": 1826, "tongue": 1827, "tonight": 1828, "tool": 1829, "tooth": 1830, "top": 1831, "topic": 1832, "topple": 1833, "torch": 1834, "tornado": 1835, "tortoise": 1836, "toss": 1837, "total": 1838, "tourist": 1839, "toward": 1840, "tower": 1841, "town": 1842, "toy": 1843, "track": 1844, "trade": 1845, "traffic": 1846, "tragic": 1847, "train": 1848, "transfer": 1849, "trap": 1850, "trash": 1851, "travel": 1852, "tray": 1853, "treat": 1854, "tree": 1855, "trend": 1856, "trial": 1857, "tribe": 1858, "trick": 1859, "trigger": 1860, "trim": 1861, "trip": 1862, "trophy": 1863, "trouble": 1864, "truck": 1865, "true": 1866, "truly": 1867, "trumpet": 1868, "trust": 1869, "truth": 1870, "try": 1871, "tube": 1872, "tuition": 1873, "tumble": 1874, "tuna": 1875, "tunnel": 1876, "turkey": 1877, "turn": 1878, "turtle": 1879, "twelve": 1880, "twenty": 1881, "twice": 1882, "twin": 1883, "twist": 1884, "two": 1885, "type": 1886, "typical": 1887, "ugly": 1888, "umbrella": 1889, "unable": 1890, "unaware": 1891, "uncle": 1892, "uncover": 1893, "under": 1894, "undo": 1895, "unfair": 1896, "unfold": 1897, "unhappy": 1898, "uniform": 1899, "unique": 1900, "unit": 1901, "universe": 1902, "unknown": 1903, "unlock": 1904, "until": 1905, "unusual": 1906, "unveil": 1907, "update": 1908, "upgrade": 1909, "uphold": 1910, "upon": 1911, "upper": 1912, "upset": 1913, "urban": 1914, "urge": 1915, "usage": 1916, "use": 1917, "used": 1918, "useful": 1919, "useless": 1920, "usual": 1921, "utility": 1922, "vacant": 1923, "vacuum": 1924, "vague": 1925, "valid": 1926, "valley": 1927, "valve": 1928, "van": 1929, "vanish": 1930, "vapor": 1931, "various": 1932, "vast": 1933, "vault": 1934, "vehicle": 1935, "velvet": 1936, "vendor": 1937, "venture": 1938, "venue": 1939, "verb": 1940, "verify": 1941, "version": 1942, "very": 1943, "vessel": 1944, "veteran": 1945, "viable": 1946, "vibrant": 1947, "vicious": 1948, "victory": 1949, "video": 1950, "view": 1951, "village": 1952, "vintage": 1953, "violin": 1954, "virtual": 1955, "virus": 1956, "visa": 1957, "visit": 1958, "visual": 1959, "vital": 1960, "vivid": 1961, "vocal": 1962, "voice": 1963, "void": 1964, "volcano": 1965, "volume": 1966, "vote": 1967, "voyage": 1968, "wage": 1969, "wagon": 1970, "wait": 1971, "walk": 1972, "wall": 1973, "walnut": 1974, "want": 1975, "warfare": 1976, "warm": 1977, "warrior": 1978, "wash": 1979, "wasp": 1980, "waste": 1981, "water": 1982, "wave": 1983, "way": 1984, "wealth": 1985, "weapon": 1986, "wear": 1987, "weasel": 1988, "weather": 1989, "web": 1990, "wedding": 1991, "weekend": 1992, "weird": 1993, "welcome": 1994, "west": 1995, "wet": 1996, "whale": 1997, "what": 1998, "wheat": 1999, "wheel": 2000, "when": 2001, "where": 2002, "whip": 2003, "whisper": 2004, "wide": 2005, "width": 2006, "wife": 2007, "wild": 2008, "will": 2009, "win": 2010, "window": 2011, "wine": 2012, "wing": 2013, "wink": 2014, "winner": 2015, "winter": 2016, "wire": 2017, "wisdom": 2018, "wise": 2019, "wish": 2020, "witness": 2021, "wolf": 2022, "woman": 2023, "wonder": 2024, "wood": 2025, "wool": 2026, "word": 2027, "work": 2028, "world": 2029, "worry": 2030, "worth": 2031, "wrap": 2032, "wreck": 2033, "wrestle": 2034, "wrist": 2035, "write": 2036, "wrong": 2037, "yard": 2038, "year": 2039, "yellow": 2040, "you": 2041, "young": 2042, "youth": 2043, "zebra": 2044, "zero": 2045, "zone": 2046, "zoo": 2047
    };

    const bip39wordlist_list = Object.keys(bip39wordlist);

    function Utf8StringToBytes(text: string): number[]
    {
        const ret: number[] = [];
        for (let i = 0; i < text.length; ++i)
        {
            let charcode = text.charCodeAt(i);
            if (charcode < 0x80)
                ret.push(charcode);
            else if (charcode < 0x800)
            {
                ret.push(0xc0 | (charcode >> 6));
                ret.push(0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000)
            {
                ret.push(0xe0 | (charcode >> 12));
                ret.push(0x80 | ((charcode >> 6) & 0x3f));
                ret.push(0x80 | (charcode & 0x3f));
            }
            else
            {
                ++i;
                charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (text.charCodeAt(i) & 0x3ff));
                ret.push(0xf0 | (charcode >> 18));
                ret.push(0x80 | ((charcode >> 12) & 0x3f));
                ret.push(0x80 | ((charcode >> 6) & 0x3f));
                ret.push(0x80 | (charcode & 0x3f));
            }
        }

        return ret;
    }

    function PadStart(str: string, minLength: number, padChar: string)
    {
        if (padChar.length !== 1)
            throw new Error("Pad character must be 1 character long");

        while (str.length < minLength)
            str = padChar + str;

        return str;
    }

    function GenerateSeedPhrase(wordCount: number)
    {
        if (wordCount !== 12 && wordCount !== 15 && wordCount !== 18 && wordCount !== 21 && wordCount !== 24)
            throw new Error("Word count must be 12, 15, 18, 21 or 24");

        const byteCount = ((wordCount / 3) | 0) * 4;
        const randomBytes: number[] = [];
        for (let i = 0; i < byteCount; i += 32)
            randomBytes.push(...get32SecureRandomBytes());

        while (randomBytes.length > byteCount)
            randomBytes.pop();

        const checksumByte = SHA256(randomBytes)[0];
        const checksumLength = byteCount / 4; // in bits

        let bits = "";
        for (let i = 0; i < randomBytes.length; ++i)
            bits += PadStart(randomBytes[i].toString(2), 8, "0");

        bits += PadStart(((checksumByte >> (8 - checksumLength)) & ((1 << checksumLength) - 1)).toString(2), checksumLength, "0");

        const words = [];
        for (let i = 0; i < bits.length; i += 11)
        {
            const index = parseInt(bits.substr(i, 11), 2);
            words.push(bip39wordlist_list[index]);
        }

        return words.join(" ");
    }

    function VerifyMnemonic(mnemonic: string)
    {
        if (mnemonic.trim() === "")
            return "mnemonic seed is empty";

        const words = mnemonic.match(/\S+/g);
        if (words === null)
            return "mnemonic seed contains invalid characters";

        let bitString = "";
        for (let word of words)
        {
            const index = bip39wordlist[word];
            if (index === undefined)
                return "'" + word + "' is not in wordlist";

            bitString += PadStart(index.toString(2), 11, "0");
        }

        const wordCount = words.length;
        if (wordCount !== 12 && wordCount !== 15 && wordCount !== 18 && wordCount !== 21 && wordCount !== 24)
            return "invalid word count";

        const checksumLength = wordCount / 3;
        const bitCount = bitString.length - checksumLength;
        const seedBits = bitString.substr(0, bitCount);
        const checksumBits = bitString.substr(bitCount);
        const seedBytes = [];

        for (let i = 0; i < bitCount; i += 8)
            seedBytes.push(parseInt(seedBits.substr(i, 8), 2));

        const actualChecksumByte = SHA256(seedBytes)[0];
        const actualChecksumBits = PadStart(actualChecksumByte.toString(2), 8, "0").substr(0, checksumLength);

        if (checksumBits !== actualChecksumBits)
            return "invalid checksum";

        return true;
    }

    function NormalizeMnemonic(mnemonic: string)
    {
        const words = mnemonic.toLowerCase().match(/[a-z]+/g);
        if (words === null)
            return "";

        return words.join(" ");
    }

    function NormalizeStringIfPossibleNFKD(str: string)
    {
        if ((<any>String.prototype).normalize)
            return <string>(<any>str).normalize("NFKD");

        // older browser, string.normalize is not available
        if (/[^\x20-\x7e]/.test(str))
        {
            // might contain non-normalized characters
            return null;
        }

        return str;
    }

    function GetXprvFromMnemonic(mnemonic: string, password: string = "", purpose: Bip32Purpose = "44")
    {
        const passwordNormalized = NormalizeStringIfPossibleNFKD("mnemonic" + password);
        if (passwordNormalized === null)
            throw new Error("Error: password might contain non-normalized characters. Either use a modern browser (which can normalize the password), or use a password with english characters only.");

        const mnemonicBytes = Utf8StringToBytes(mnemonic);
        const passwordBytes = Utf8StringToBytes(passwordNormalized);

        const seed = PBKDF2(mnemonicBytes, passwordBytes, 2048, 512/32);
        const masterKey = GetMasterKeyFromSeed(seed);
        const masterPrivKey = [0, ...bigintToByteArray_littleEndian(masterKey.key)];
        const masterChainCode = masterKey.chainCode;
        return SerializeExtendedKey(true, 0, [0, 0, 0, 0], 0, masterChainCode, masterPrivKey, purpose);
    }

    function GenerateNewSeedButton()
    {
        const seedDiv = document.getElementById("seed_generate_result")!;
        seedDiv.classList.add("wide_spacing");
        seedDiv.style.display = "";

        const wordCount = Number((<HTMLSelectElement>document.getElementById("seed_generate_wordcount")).value);
        seedDiv.textContent = GenerateSeedPhrase(wordCount);
    }

    function SetSeedPage(isGeneratePage: boolean)
    {
        document.getElementById("seed_generate_page")!.style.display = isGeneratePage ? "" : "none";
        document.getElementById("seed_details_page")!.style.display = isGeneratePage ? "none" : "";

        (<HTMLButtonElement>document.getElementById("seed_generate_page_button")).disabled = isGeneratePage;
        (<HTMLButtonElement>document.getElementById("seed_details_page_button")).disabled = !isGeneratePage;
    }

    const bip32extendedKeyStartRegex = /^[xyz](pub|prv)/;
    function SeedChanged(textarea: HTMLTextAreaElement)
    {
        const seed = textarea.value;
        const isBIP32key = bip32extendedKeyStartRegex.test(seed);
        document.getElementById("seed_details_password_container")!.style.display = isBIP32key ? "none" : "";
        document.getElementById("seed_details_results")!.style.display = "none";
        document.getElementById("seed_details_addresses_error_text")!.style.display = "none";
    }

    function SeedPasswordChanged()
    {
        document.getElementById("seed_details_results")!.style.display = "none";
        document.getElementById("seed_details_addresses_error_text")!.style.display = "none";
    }

    function ViewSeedDetailsButton()
    {
        const seedTextArea = <HTMLTextAreaElement>document.getElementById("seed_details_seed_textarea");
        let seed = seedTextArea.value.trim();
        const errorTextDiv = document.getElementById("seed_details_error_text")!;
        const resultsContainerDiv = document.getElementById("seed_details_results")!;
        const rootKeyDiv = document.getElementById("seed_details_results_bip32_rootkey_container")!;
        const changeAddressesCheckboxLabel = document.getElementById("seed_details_results_change_addresses_checkbox")!;
        changeAddressesCheckboxLabel.style.display = "";
        const hardenedAddressesCheckboxLabel = document.getElementById("seed_details_results_hardened_addresses_checkbox")!;
        hardenedAddressesCheckboxLabel.style.display = "";

        function ShowError(text: string)
        {
            errorTextDiv.textContent = text;
            errorTextDiv.style.display = "";
            resultsContainerDiv.style.display = "none";
        }

        if (seed === "")
        {
            ShowError("Seed is empty");
            return;
        }

        let rootKey;
        if (bip32extendedKeyStartRegex.test(seed))
        {
            // extended key
            let decodedKey: number[];
            try
            {
                decodedKey = base58checkDecode(seed);
            }
            catch (err)
            {
                ShowError("Invalid BIP32 extended key: " + err.message);
                return;
            }

            if (decodedKey.length !== 78)
            {
                ShowError("Invalid BIP32 extended key: invalid length");
                return;
            }

            switch (seed[0])
            {
                case "x":
                    SeedDerivationPresetChanged("44");
                    break;
                case "y":
                    SeedDerivationPresetChanged("49");
                    break;
                case "z":
                    SeedDerivationPresetChanged("84");
                    break;
            }

            if (seed.substr(1, 3) === "pub")
            {
                changeAddressesCheckboxLabel.style.display = "none";
                hardenedAddressesCheckboxLabel.style.display = "none";
            }

            rootKeyDiv.style.display = "none";
            rootKey = seed;
        }
        else
        {
            // seed
            const result = VerifyMnemonic(seed);
            if (typeof result === "string")
            {
                ShowError("Invalid mnemonic seed: " + result);
                return;
            }

            seed = NormalizeMnemonic(seed);
            try
            {
                rootKey = GetXprvFromMnemonic(seed, (<HTMLTextAreaElement>document.getElementById("seed_details_seed_password")).value);
            }
            catch (e)
            {
                ShowError(e.message);
                return;
            }

            seedTextArea.value = seed;
            rootKeyDiv.style.display = "";
        }

        document.getElementById("seed_details_results_rootkey")!.textContent = rootKey;
        errorTextDiv.style.display = "none";
        resultsContainerDiv.style.display = "";
        document.getElementById("seed_details_results_addresses_container")!.style.display = "none";
    }

    function SeedDerivationPresetChanged(preset: string)
    {
        const input = <HTMLInputElement>document.getElementById("seed_details_results_derivation_path_input");
        const changeAddressesCheckboxLabel = document.getElementById("seed_details_results_change_addresses_checkbox")!;
        switch (preset)
        {
            case "44":
                input.value = "m/44'/0'/0'";
                break;
            case "49":
                input.value = "m/49'/0'/0'";
                break;
            case "84":
                input.value = "m/84'/0'/0'";
                break;
            case "32":
            default:
                input.value = "";
                break;
        }

        (<HTMLSelectElement>document.getElementById("derivation_path_preset")).value = preset;
        input.disabled = preset !== "32";

        // hide change addresses checkbox when using custom path
        changeAddressesCheckboxLabel.style.display = preset === "32" ? "none" : "";
    }

    function SeedCalculateAddressesButton()
    {
        const errorTextDiv = document.getElementById("seed_details_addresses_error_text")!;
        const resultsContainerDiv = document.getElementById("seed_details_results_addresses_container")!;
        function ShowError(text: string)
        {
            errorTextDiv.textContent = text;
            errorTextDiv.style.display = "";
            resultsContainerDiv.style.display = "none";
        }

        const rootKey = (<HTMLTextAreaElement>document.getElementById("seed_details_results_rootkey")).value;
        let path = (<HTMLInputElement>document.getElementById("seed_details_results_derivation_path_input")).value;
        const generateHardenedAddresses = (<HTMLInputElement>document.getElementById("seed_details_hardened_addresses_checkbox")).checked;
        let derivedKeyPurpose = <Bip32Purpose>(<HTMLSelectElement>document.getElementById("derivation_path_preset")).value;

        const addressCountInput = <HTMLInputElement>document.getElementById("seed_details_address_count");
        let count = Number(addressCountInput.value) | 0;
        if (isNaN(count) || count < 1)
        {
            count = 10;
            addressCountInput.value = count.toString();
        }

        const addressIndexOffsetInput = <HTMLInputElement>document.getElementById("seed_details_address_offset");
        let startIndex = Number(addressIndexOffsetInput.value) | 0;
        if (isNaN(startIndex) || startIndex < 0)
        {
            startIndex = 0;
            addressIndexOffsetInput.value = startIndex.toString();
        }

        const endIndex = startIndex + count;
        if (endIndex > 0x80000000)
        {
            ShowError("Start index + Count must be 2147483648 at most");
            return;
        }

        const isPrivate = rootKey.substr(1, 3) === "prv";
        if (derivedKeyPurpose !== "32")
        {
            const generateChangeAddresses = (<HTMLInputElement>document.getElementById("seed_details_change_addresses_checkbox")).checked;
            if (!isPrivate)
                path = "m";
            else
                path += (generateChangeAddresses ? "/1" : "/0");
        }
        else
        {
            if (rootKey[0] === "y")
                derivedKeyPurpose = "49";
            else if (rootKey[0] === "z")
                derivedKeyPurpose = "84";
        }

        if (!isPrivate && generateHardenedAddresses)
        {
            ShowError("Hardened addresses can only be derived from extended private keys");
            return;
        }

        let derivedExtendedPrivateKey: string | null = null;
        let derivedExtendedPublicKey: string;
        try
        {
            derivedExtendedPublicKey = DeriveKey(rootKey, path, false, derivedKeyPurpose);
            if (isPrivate)
                derivedExtendedPrivateKey = DeriveKey(rootKey, path, isPrivate, derivedKeyPurpose);
        }
        catch (e)
        {
            ShowError(e.message);
            return;
        }

        (<HTMLTextAreaElement>document.getElementById("seed_details_results_extended_pubkey")).value = derivedExtendedPublicKey;
        (<HTMLTextAreaElement>document.getElementById("seed_details_results_extended_privkey")).value = derivedExtendedPrivateKey ?? "???";

        const resultsTable = document.getElementById("seed_details_results_addresses_table")!;
        while (resultsTable.lastChild)
            resultsTable.removeChild(resultsTable.lastChild);

        function CreateRow(path: string, address: string, privkey: string)
        {
            const row = document.createElement("div");
            row.className = "seed_details_results_address_row";

            const pathDiv = document.createElement("div");
            pathDiv.textContent = path;

            const addressDiv = document.createElement("div");
            addressDiv.textContent = address;

            const privkeyDiv = document.createElement("div");
            privkeyDiv.textContent = privkey;

            row.appendChild(pathDiv);
            row.appendChild(addressDiv);
            row.appendChild(privkeyDiv);

            resultsTable.appendChild(row);
        }

        const progressTextDiv = document.getElementById("seed_details_address_calculate_progress")!;

        let i = startIndex;
        function CalculateRow()
        {
            if (i < endIndex)
            {
                const privkey = isPrivate
                    ? UnextendKey(DeriveKey(derivedExtendedPrivateKey!, "m/" + i + (generateHardenedAddresses ? "'" : ""), true, derivedKeyPurpose))
                    : "???";

                const address = UnextendKey(DeriveKey(isPrivate
                    ? derivedExtendedPrivateKey!
                    : derivedExtendedPublicKey, "m/" + i + (generateHardenedAddresses ? "'" : ""), false, derivedKeyPurpose));

                const addressPath = path + (path[path.length - 1] === "/" ? "" : "/") + i + (generateHardenedAddresses ? "'" : "");
                CreateRow(addressPath, address, privkey);
                ++i;

                progressTextDiv.textContent = "Calculating: " + i + "/" + count;
                setImmediate(CalculateRow);
            }
            else
            {
                document.body.style.pointerEvents = "";
                resultsContainerDiv.style.display = "";
                progressTextDiv.style.display = "none";
            }
        }

        resultsContainerDiv.style.display = "none";
        errorTextDiv.style.display = "none";
        document.body.style.pointerEvents = "none";
        progressTextDiv.textContent = "Calculating: 0/" + count;
        progressTextDiv.style.display = "inline";
        setImmediate(CalculateRow);
    }

    let seedExtendedKeysVisible = false;
    function SeedToggleExtendedKeys(button: HTMLButtonElement)
    {
        seedExtendedKeysVisible = !seedExtendedKeysVisible;
        document.getElementById("seed_details_results_extended_keys")!.style.display = seedExtendedKeysVisible ? "" : "none";
        button.textContent = seedExtendedKeysVisible ? "Hide extended keys" : "Show extended keys";
    }

    const layoutPrintAreas: { [key: string]: { [key: string]: string } } = {
        "singleaddress": {
            "address_div": "print_visible",
        },
        "details": {
            "view_address_div": "print_visible",
        },
        "bulk": {
            "bulk_addresses": "print_visible",
        },
        "paperwallet": {
            "paperwallet_canvas_print_container": "print_container",
            "paperwallet_print_area": "print_visible",
        },
        "seed": {
            "seed_generate_result": "print_visible",
            "seed_details_page": "print_visible",
        },
        "info": {
            "main_info": "print_visible",
        },
        "beginner": {
            "main_beginner": "print_visible",
        },
        "security": {
            "main_security": "print_visible",
        }
    };

    const initialPageState: { [key: string]: string | null } = getAllQueryValues();
    const pageState: { [key: string]: string | null } = { ...initialPageState };

    function setPageState(key: string, value: string | null)
    {
        pageState[key] = value;
        return pageState;
    }

    function pushPageState(key: string, value: string | null)
    {
        history.pushState(setPageState(key, value), "", getPageStateString());
    }

    const pageStatePopHandlers: { [key: string]: (newValue: string | null) => void } = {
        "page": layout =>
        {
            if (layout !== null)
                set_layout(layout, false);
        }
    };

    function popPageState(key: string, value: string | null)
    {
        if (pageStatePopHandlers.hasOwnProperty(key))
            pageStatePopHandlers[key](value);
    }

    function getPageStateString()
    {
        const stateStrings: string[] = [];
        for (let key in pageState)
        {
            const value = pageState[key];
            if (value !== null)
                stateStrings.push(key + "=" + value);
            else
                stateStrings.push(key);
        }

        return "?" + stateStrings.join("&");
    }

    let currentLayout = "singleaddress";
    function set_layout(newLayout: string, setState = true)
    {
        if (currentLayout === newLayout || !layoutPrintAreas.hasOwnProperty(newLayout))
            return;

        const prevLayout = currentLayout;
        if (prevLayout)
        {
            (<HTMLButtonElement>document.getElementById("button_layout_" + prevLayout)).disabled = false;
            document.getElementById("main_" + prevLayout)!.style.display = "none";

            const prevPrintAreas = layoutPrintAreas[prevLayout];
            for (let c in prevPrintAreas)
                document.getElementById(c)!.classList.remove(prevPrintAreas[c]);    
        }

        (<HTMLButtonElement>document.getElementById("button_layout_" + newLayout)).disabled = true;
        document.getElementById("main_" + newLayout)!.style.display = "table";
        const newPrintAreas = layoutPrintAreas[newLayout];
        for (let c in newPrintAreas)
            document.getElementById(c)!.classList.add(newPrintAreas[c]);

        currentLayout = newLayout;

        if (setState)
            pushPageState("page", currentLayout);
    }

    window.addEventListener("popstate", ev =>
    {
        if (ev.state !== null)
        {
            if (typeof ev.state === "object")
            {
                for (let key in ev.state)
                    popPageState(key, ev.state[key]);
            }
        }
        else
        {
            for (let key in initialPageState)
                popPageState(key, initialPageState[key]);
        }
    });

    const initialPage = getQueryValue("page");
    if (initialPage !== null)
    {
        initialPageState["page"] = initialPage;
        set_layout(initialPage, false);
    }
    else
        initialPageState["page"] = "singleaddress";

    interface TestAddressAndPrivkey
    {
        privKeyValue: BN;
        privKeyString: string;
        addresses: ViewAddressResult;
    }

    interface Bip38Test
    {
        encryptedPrivKey: string;
        encryptedPrivKeyFromPrivkey: string;
        decryptedPrivKey: string;
        password: string;
        addresses: ViewAddressResult;
    }

    interface Bip39Test
    {
        seed: string;
        password: string;
        rootKey: string;
    }

    interface Bip32Test
    {
        rootKey: string;
        path: string;
        extendedPubkey: string;
        extendedPrivkey: string;
    }

    function runTests()
    {
        if (isTestnet)
        {
            alert("No tests are implemented for testnet!");
            return;
        }

        if (!confirm("This can take up to 20-30 seconds, do you want to continue?"))
            return;

        const failedTestMessages: string[] = [];

        function assertEqual(actual: any, expected: any, errorMessage: string)
        {
            if (actual !== expected)
                failedTestMessages.push(`Assertion failed: ${errorMessage}\nExpected: ${expected}\nActual: ${actual}`);
        }

        function assert(actual: boolean, errorMessage: string)
        {
            assertEqual(actual, true, errorMessage);
        }

        function TestAddressesAndPrivkeys()
        {
            const testAddresses: TestAddressAndPrivkey[] = [];

            testAddresses.push({
                privKeyValue: new BN("1"),
                privKeyString: "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn",
                addresses: {
                    segwitAddress: "3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN",
                    bech32Address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
                    legacyAddress: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("2"),
                privKeyString: "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU74NMTptX4",
                addresses: {
                    segwitAddress: "3FWHHE3RVgyv5vYmMrcoRdA25uugWvQbso",
                    bech32Address: "bc1qq6hag67dl53wl99vzg42z8eyzfz2xlkvxechjp",
                    legacyAddress: "1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("9999"),
                privKeyString: "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFVataoFKobq",
                addresses: {
                    segwitAddress: "353cGFY5KZqdJzT2nGd8UQEbqWNZi1W5f5",
                    bech32Address: "bc1qyjjuy86mks2v8a3fm6zcqxcw3jut5630gfwqza",
                    legacyAddress: "14LmtzeME8JH1g4iY8EdPa1LJXDMRp6jQw"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("115792089237316195423570985008687907852837564279074904382605163141518161494336"),
                privKeyString: "L5oLkpV3aqBjhki6LmvChTCV6odsp4SXM6FfU2Gppt5kFLaHLuZ9",
                addresses: {
                    segwitAddress: "38Kw57SDszoUEikRwJNBpypPSdpbAhToeD",
                    bech32Address: "bc1q4h0ycu78h88wzldxc7e79vhw5xsde0n8jk4wl5",
                    legacyAddress: "1GrLCmVQXoyJXaPJQdqssNqwxvha1eUo2E"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("968066984802958354179990149668299687422979543751573541156660725792496007898"),
                privKeyString: "KwHsVCDX7GDN2x5tMdCE4d4L6i1VQVpRSMQTUtxbF9seAHXQ2JFp",
                addresses: {
                    segwitAddress: "38sCjQfEzBJcddzytxzLHmZXwbP1Ex66TS",
                    bech32Address: "bc1qqyhqsgv38809lpslgsnwhayjreqfnzpwx6tudn",
                    legacyAddress: "17EpY1ruRApr75McHJvNuhCwz5ejYxWrn"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("111085681658360822296712209857661389776346611154525451346128737545958832202155"),
                privKeyString: "L5T7dMSZUN8PYKvS6XHnQ13ZVk89NqAoz4JS64crWGRNZsbCa84M",
                addresses: {
                    segwitAddress: "39TDgxXFcrt9X8Bg3aqL1bNVUZeM28fWj3",
                    bech32Address: "bc1q8feskrfllvh86yzcz4t7az2nk7zxkypqqzdkd6",
                    legacyAddress: "16L41U1ziesozpWkdzxxC4mdi6WTmyBtLn"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("82002861013510623939929695451274116967705867134864292226506113828835769461410"),
                privKeyString: "L3J8PFqgpi2J3YBLvJTfV49JB7qgoa5o6RcxR29S7RGJHiNfq25N",
                addresses: {
                    segwitAddress: "3LmWEpDsTzAKeyTBzbLV9X2hZxCNu5c4Ee",
                    bech32Address: "bc1q288xdhjzxf9kxrwt5v2wf09mka473pmndajcpv",
                    legacyAddress: "18TYzb9ZS5ygYgPpkYkkiKgUGhKXmu3JL4"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("52183733446356795471428831662320629288126216510436677236013736302214876941158"),
                privKeyString: "L15ycE1apf8bfbSDejRGjTHseLTsPz42DvNSmwLWzQWUEj2kmZ4v",
                addresses: {
                    segwitAddress: "3GW7MbQhRvVD4p3eCmZ1ERFNnaKfB6UEyr",
                    bech32Address: "bc1q89rje8nfzl82s06ahc7mpa298uqhee5j0q2jw9",
                    legacyAddress: "16DrnDEJDF4BYfH5JKnVjLdkV9htUa4e8D"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("23278692215882691198196253583213917839733459332408032747802725491018242932686"),
                privKeyString: "KxwkgKZFewyhfeF5rng34CdF5txPhNiHzeTZ1PZPR6VWWW89ZLRB",
                addresses: {
                    segwitAddress: "34QojgxrZpmzECK3zhvtStKgn8YcJm8kTG",
                    bech32Address: "bc1q7dlxstp28p6fhz3qxa6l663hdzkczvdruhvlj6",
                    legacyAddress: "1PCUdXGU9KEbD8HHFPqcYVmnDeo97365d5"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("89154237271535974432741156986591038017194725284146520500353190025547916774077"),
                privKeyString: "L3prx7sM6pSdRwZqZFh72jg51i7iMFkSgHDJ4Nq46q7MokbEG4so",
                addresses: {
                    segwitAddress: "35BLqQBNMdf7VhfsNjPj4yku2vcUBquBpy",
                    bech32Address: "bc1qjevfy9qw9s8uq6mlva62kq0tusu7wquld8djt0",
                    legacyAddress: "1EhxTmbzuuYsroxfMKCiMsVMn64YrgxotN"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("51603160605553126192077311850577564992095898625792974852065097431708174529327"),
                privKeyString: "L13UtmXsEcixzLvc92EAvrLntqaUwBkp9HhEuSmvaFC8F5Pj3y5v",
                addresses: {
                    segwitAddress: "3AXWsE37BrQLvpM8iZD6roV7sHDAXiYE6Q",
                    bech32Address: "bc1qz3rr53mekdpcapdwrugs0q82f5uult8ps532c8",
                    legacyAddress: "12rCeLh3oGj4WFVFDjZ8FotawSnQKv2GXy"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("37736462560246939745832156071447838278457253065840269726200352575294394218196"),
                privKeyString: "Kz1tTAmpTTipzTfFd1C34LztLuewicPRnB4M6Dmo9Fabw7UbVbH1",
                addresses: {
                    segwitAddress: "36YNDqVJnBTXjTtDvxFKQmu6H82TgfMBHh",
                    bech32Address: "bc1q492c95pvek8s6f9cex6y2wcsdh4psd3yrcu0w4",
                    legacyAddress: "1GSMdpy5pwThM1eVbeqmdSJ3jC7nUaB995"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("104426667975315723068700327981415245276045146706153979201036672452989822460760"),
                privKeyString: "L4xVng3JmnEZVP9osSc25SCgd7zSpAzHswNDrVQ2AG1Su4B6XGmH",
                addresses: {
                    segwitAddress: "3CJaCvJee7B2C1fSnTUUgQZf8zKU7tridN",
                    bech32Address: "bc1qcmp56dz268sgs5g7xnymnsymmwea3tw5z22nha",
                    legacyAddress: "1K7xkmts75mEz3dXEe6uDV8WFEP7QNYoJg"
                }
            });
            testAddresses.push({
                privKeyValue: new BN("73119196411814191342876680191985156886396120652335740708612421238694286579228"),
                privKeyString: "L2dx2MkKdgKHRZNuP9M8FZvx4CovCGiGSt4GJfVBLeYcqwPQ3D3N",
                addresses: {
                    segwitAddress: "36XnTodxfdsTm8U23pSVzxizfMJQaCqLsH",
                    bech32Address: "bc1qpauj6up0cz6fjfhequ43jvaywc55nkjr9z2j6p",
                    legacyAddress: "12QpJSN1eCCpAB8McXZfvEXcQi93iWds5x"
                }
            });

            testAddresses.forEach(testCase =>
            {
                try
                {
                    const privKeyString = makePrivateKey(testCase.privKeyValue);
                    const addresses = view_address_details_result(privKeyString);

                    const keypair = getECCKeypair(testCase.privKeyValue);
                    const segwitAddress = makeSegwitAddress(keypair);
                    const bech32Address = makeBech32Address(keypair);
                    const legacyAddress = makeAddress(keypair);

                    assertEqual(privKeyString, testCase.privKeyString, "Private key string does not match");

                    if (typeof addresses !== "object")
                        assert(false, `Address generation error for privkey "${testCase.privKeyString}": ${addresses}`);
                    else
                    {
                        assertEqual(addresses.segwitAddress, testCase.addresses.segwitAddress, "Segwit address generated from private key string does not match");
                        assertEqual(addresses.bech32Address, testCase.addresses.bech32Address, "Bech32 address generated from private key string does not match");
                        assertEqual(addresses.legacyAddress, testCase.addresses.legacyAddress, "Legacy address generated from private key string does not match");
                    }

                    assertEqual(segwitAddress, testCase.addresses.segwitAddress, "Segwit address generated from private bigint value does not match");
                    assertEqual(bech32Address, testCase.addresses.bech32Address, "Bech32 address generated from private bigint value does not match");
                    assertEqual(legacyAddress, testCase.addresses.legacyAddress, "Legacy address generated from private bigint value does not match");
                }
                catch (e)
                {
                    assert(false, "Unexpected error: " + e.message);
                }
            });
        }

        function TestBip38()
        {
            const testCases: Bip38Test[] = [];

            testCases.push({
                password: "a",
                encryptedPrivKey: "6PnW1PdhwyuwyGRVHPBNhZTRy8MdCcUGU5vpKQZbZU8JL7ri2GQW19acDj",
                encryptedPrivKeyFromPrivkey: "6PYTvmU4NwNMgdT4ibYvRkAnZe3tWAMUXhvR9AxDziriJ6fWusqRo1BfaN",
                decryptedPrivKey: "KyaXDTGN2znu9iHX8hKcnLit5vYsc4HdvJSdMHBcYiKnVKQdAcrW",
                addresses: {
                    segwitAddress: "3EzuqmCFnWopyDSM14MvEDmHKrwvYzLyde",
                    bech32Address: "bc1qa06qmevctj2vhe07ydmwvqg9gd4cgtrngysm4k",
                    legacyAddress: "1NWcAGcKsjp2wMJZkJYgR9H4N4rBSn38ph"
                }
            });
            testCases.push({
                password: "a",
                encryptedPrivKey: "6PnNubLWkatUwokXjjH4vSdacztW1bvNL5oFqrypnULWnm6ssDs5sCbaJK",
                encryptedPrivKeyFromPrivkey: "6PYLpyAsCpquTahxC96c5BJtW7ZQjMLJCyd2Fw4BpQutjArJTzkrXB7Piv",
                decryptedPrivKey: "L4batR1BPtG4BwRcATq6F3iRV3tJLLD3jk7xK5dJKHsSbURC3AQv",
                addresses: {
                    segwitAddress: "3JQGpJJiBzrTWHTAjokpfFcB81yr4U8D3o",
                    bech32Address: "bc1qs6ud3py63fp2yk8vxdfp9cg753n2pj4z7z9lj5",
                    legacyAddress: "1DHLz1rgVmo3EQYCCtLq4MSzyEE6TWhs2R"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivKey: "6PnXbmzLH2x8dwPvpECwngEkf4fLboB9xbWPWP5NBK4QE5odnV6nVUv8Ar",
                encryptedPrivKeyFromPrivkey: "6PYVX9pgijT18gua44qWPypmzsoHCe8pPXCNQZpghSGg7oS6PUPMQ7G1uJ",
                decryptedPrivKey: "Kxbkxhq1qCdCScvCyYKgvNo5HjJL3dbp7cipLngWVaLYKYJ4ghyt",
                addresses: {
                    segwitAddress: "31sBmB1Ad69388VvDQELZF1ACYaGoBhTeT",
                    bech32Address: "bc1qw58y7scvgt6yqpjxmevxujlj6fyapwn558jqgs",
                    legacyAddress: "1BfwChEq6GTn7g8zZmHTYoM75sFtPXvrRd"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivKey: "6PnYqiahSyjzFCu3eECKSQrqVozpXWj7g3WarnMp1oNYX18m9bP7jyncS5",
                encryptedPrivKeyFromPrivkey: "6PYWm6R3tdgAaJKna9veriFkCcMeoLLWVTnpcznxot1Xqwi4TtWHhnXXxk",
                decryptedPrivKey: "KwkLbkYUZwxYHe5nozJz6gxmrGhrDrgiZHc87omKZcVyZYw8fgBf",
                addresses: {
                    segwitAddress: "3GLHhj6aNqqnui8Y72KbcmUxt7xL7ZbBhx",
                    bech32Address: "bc1q2he8uu69fd977gchrq0gkfm5q23rk0y3dexp5m",
                    legacyAddress: "18qSw5fLA7i3J2Zgmz3jMiL5nmM872c9L8"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivKey: "6PnV6kdAWBYp53troJeaesPN7xrsFn7uyTSEXxkGi25CqG7sHCTHxBkX5s",
                encryptedPrivKeyFromPrivkey: "6PYT28TWz92xdoTBoFeo7jF4xyi69wENqHmSgjJyAxxC3gMHathn17MLfh",
                decryptedPrivKey: "L2QgX6EkcTh9x8uH3hKbSo1sms7aGoqaQnDmF79KgTsvTWQ7Pcoa",
                addresses: {
                    segwitAddress: "3NUyzUng1iQogrHKZ8zQoQ3dGu9CqjmeqC",
                    bech32Address: "bc1qhntqxpnkvp6u68v47qclryazqy65gutkm5ecz4",
                    legacyAddress: "1JDUQsDoRn675ZQpWP6yE3bC93ifv55Lwc"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivKey: "6PnVA1kcZktzR4VW76HKU62f4D6dfTpghKSnszrRPXn5ggnumnK3nBdwsm",
                encryptedPrivKeyFromPrivkey: "6PYT5Pay1zNPJKLheQTknQAdTX7PZC4aaUGwm85D3m4GXVLyoL6asAaymA",
                decryptedPrivKey: "L4h2QmyA1UQHjmkG2j4tF67u8JsQquQrC2EX9mkSRNUVCBFqWy21",
                addresses: {
                    segwitAddress: "3BQmwBdHWY7S9yLGESZSq65RxAQVxG24Ws",
                    bech32Address: "bc1qq3awtma7xqsamuwralanr7rfvxxuh2hf36zkfj",
                    legacyAddress: "1QgvtEAhUvuRRKeF52ZMfwpC1LcAjkWYe"
                }
            });

            testCases.forEach(testCase =>
            {
                function TestDecrypt(privkey: string, password: string)
                {
                    try
                    {
                        const decrypted = bip38decrypt(privkey, password);
                        if (typeof decrypted !== "object")
                            assert(false, `Bip38 decrypt error for privkey "${privkey}": ${decrypted}`);
                        else
                        {
                            const decryptedPrivKey = decrypted.privkey;
                            const decryptedAddress = decrypted.address;

                            assertEqual(decryptedPrivKey, testCase.decryptedPrivKey, "Decrypted private keys do not match");
                            assertEqual(decryptedAddress, testCase.addresses.legacyAddress, "Decrypted addresses keys do not match");

                            const addresses = view_address_details_result(testCase.decryptedPrivKey);

                            if (typeof addresses !== "object")
                                assert(false, `Address generation error for privkey "${testCase.decryptedPrivKey}": ${addresses}`);
                            else
                            {
                                assertEqual(addresses.segwitAddress, testCase.addresses.segwitAddress, "Decrypted segwit address does not match");
                                assertEqual(addresses.bech32Address, testCase.addresses.bech32Address, "Decrypted bech32 address does not match");
                                assertEqual(addresses.legacyAddress, testCase.addresses.legacyAddress, "Decrypted legacy address does not match");
                            }
                        }
                    }
                    catch (e)
                    {
                        assert(false, "Unexpected error: " + e.message);
                    }
                }

                TestDecrypt(testCase.encryptedPrivKey, testCase.password);
                TestDecrypt(testCase.encryptedPrivKeyFromPrivkey, testCase.password);

                function TestEncrypt(privkey: string, password: string)
                {
                    try
                    {
                        const privkeyWithKeypair = privkeyStringToKeyPair(privkey);
                        if (typeof privkeyWithKeypair !== "object")
                            assert(false, `Bip38 encrypt error for privkey "${privkey}": ${testCase.decryptedPrivKey}`);
                        else
                        {
                            const encrypted = bip38encrypt(privkeyWithKeypair, password);
                            assertEqual(encrypted.privkey, testCase.encryptedPrivKeyFromPrivkey, "Encrypted private key does not match");
                            assertEqual(encrypted.address, testCase.addresses.legacyAddress, "Encrypted address does not match");
                        }
                    }
                    catch (e)
                    {
                        assert(false, "Unexpected error: " + e.message);
                    }
                }

                TestEncrypt(testCase.decryptedPrivKey, testCase.password);
            });
        }

        function TestBip39()
        {
            const testCases: Bip39Test[] = [];
            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "",
                rootKey: "xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "a",
                rootKey: "xprv9s21ZrQH143K2TDcPeVnyE7Txn71rTGhYsXrdQBVMqYjubbSV4pCGMQXzim3ayzK46pURGRCG5r6KbkDN9NLQUTCDwZk9WU3tkSRZj6k6Gm"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "Test Password 1234",
                rootKey: "xprv9s21ZrQH143K2Y2XSuzBQaznCBg9AaRH2S25oKUAjmQEsEccMs8Ze85oGXge9xadr9vJv3r8CCtjgTGWFSjm6cHHAfGYJriZt43JgKVxDe1"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "😂👌🔥💯💯💯🅱",
                rootKey: "xprv9s21ZrQH143K3GPCDEC6aPqoyLsG2u3k1Lm98EuPJX6F92WXrU4BPKdjkabyje5myuDWhyzUxa8ibSzUSJAb3ULLYLLdwMrxLH48dQunkpr"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "",
                rootKey: "xprv9s21ZrQH143K3vkVeVcLG5PeVoexN6hpu9r4mS2j3uVeZo7vBrRNGHENDZXwYBgbQ5eMvHCX9YRL8V7aykC7a4UNkvJCuBacLRHwsdMGhNF"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "a",
                rootKey: "xprv9s21ZrQH143K3Fh1GnR64eBTs2WRhNz7Fc7NSXheWAnurFqLLjNRD7FNJXbdWm7Ky3B3hS3Lob6vSJd1PY6eZ7XUmTR6PCfCGzyt4Z4FRaM"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "Test Password 1234",
                rootKey: "xprv9s21ZrQH143K2MRhDJs9Qk6iSxHhezBbDGE1GFQqWy5zyw9P32GbXeM387p61HcQKdN93eL2W5Z3vF9ty9Gmr3ZtedcFLsDMZ3fkMcKBK2s"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "😂👌🔥💯💯💯🅱",
                rootKey: "xprv9s21ZrQH143K26EJnA1yj46hTFK85x2X2JeghGeichfdSdLAoQfgA5fQHvSo556Qjme7mXN3AbvDPhioe9C5GhmFAzQWdaSvnvkyuHy5mQa"
            });

            testCases.forEach(testCase =>
            {
                try
                {
                    const password = NormalizeStringIfPossibleNFKD(testCase.password);
                    if (password === null)
                        return; // string normalize not available, skip this test 

                    try
                    {
                        assertEqual(GetXprvFromMnemonic(testCase.seed, password), testCase.rootKey, "Root key derived from seed phrase does not match");
                    }
                    catch (e)
                    {
                        assert(false, e.message);
                    }
                }
                catch (e)
                {
                    assert(false, "Unexpected error: " + e.message);
                }
            });
        }

        function TestBip32()
        {
            const testCases: Bip32Test[] = [];
            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8",
                extendedPrivkey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'",
                extendedPubkey: "xpub68Gmy5EdvgibQVfPdqkBBCHxA5htiqg55crXYuXoQRKfDBFA1WEjWgP6LHhwBZeNK1VTsfTFUHCdrfp1bgwQ9xv5ski8PX9rL2dZXvgGDnw",
                extendedPrivkey: "xprv9uHRZZhk6KAJC1avXpDAp4MDc3sQKNxDiPvvkX8Br5ngLNv1TxvUxt4cV1rGL5hj6KCesnDYUhd7oWgT11eZG7XnxHrnYeSvkzY7d2bhkJ7"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1",
                extendedPubkey: "xpub6ASuArnXKPbfEwhqN6e3mwBcDTgzisQN1wXN9BJcM47sSikHjJf3UFHKkNAWbWMiGj7Wf5uMash7SyYq527Hqck2AxYysAA7xmALppuCkwQ",
                extendedPrivkey: "xprv9wTYmMFdV23N2TdNG573QoEsfRrWKQgWeibmLntzniatZvR9BmLnvSxqu53Kw1UmYPxLgboyZQaXwTCg8MSY3H2EU4pWcQDnRnrVA1xe8fs"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'",
                extendedPubkey: "xpub6D4BDPcP2GT577Vvch3R8wDkScZWzQzMMUm3PWbmWvVJrZwQY4VUNgqFJPMM3No2dFDFGTsxxpG5uJh7n7epu4trkrX7x7DogT5Uv6fcLW5",
                extendedPrivkey: "xprv9z4pot5VBttmtdRTWfWQmoH1taj2axGVzFqSb8C9xaxKymcFzXBDptWmT7FwuEzG3ryjH4ktypQSAewRiNMjANTtpgP4mLTj34bhnZX7UiM"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'/2",
                extendedPubkey: "xpub6FHa3pjLCk84BayeJxFW2SP4XRrFd1JYnxeLeU8EqN3vDfZmbqBqaGJAyiLjTAwm6ZLRQUMv1ZACTj37sR62cfN7fe5JnJ7dh8zL4fiyLHV",
                extendedPrivkey: "xprvA2JDeKCSNNZky6uBCviVfJSKyQ1mDYahRjijr5idH2WwLsEd4Hsb2Tyh8RfQMuPh7f7RtyzTtdrbdqqsunu5Mm3wDvUAKRHSC34sJ7in334"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'/2/1000000000",
                extendedPubkey: "xpub6H1LXWLaKsWFhvm6RVpEL9P4KfRZSW7abD2ttkWP3SSQvnyA8FSVqNTEcYFgJS2UaFcxupHiYkro49S8yGasTvXEYBVPamhGW6cFJodrTHy",
                extendedPrivkey: "xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcEZVB4dScxMAdx6d4nFc9nvyvH3v4gJL378CSRZiYmhRoP7mBy6gSPSCYk6SzXPTf3ND1cZAceL7SfJ1Z3GC8vBgp2epUt13",
                extendedPrivkey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6",
                path: "m/0'",
                extendedPubkey: "xpub68NZiKmJWnxxS6aaHmn81bvJeTESw724CRDs6HbuccFQN9Ku14VQrADWgqbhhTHBaohPX4CjNLf9fq9MYo6oDaPPLPxSb7gwQN3ih19Zm4Y",
                extendedPrivkey: "xprv9uPDJpEQgRQfDcW7BkF7eTya6RPxXeJCqCJGHuCJ4GiRVLzkTXBAJMu2qaMWPrS7AANYqdq6vcBcBUdJCVVFceUvJFjaPdGZ2y9WACViL4L"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB",
                extendedPrivkey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0",
                extendedPubkey: "xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH",
                extendedPrivkey: "xprv9vHkqa6EV4sPZHYqZznhT2NPtPCjKuDKGY38FBWLvgaDx45zo9WQRUT3dKYnjwih2yJD9mkrocEZXo1ex8G81dwSM1fwqWpWkeS3v86pgKt"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'",
                extendedPubkey: "xpub6ASAVgeehLbnwdqV6UKMHVzgqAG8Gr6riv3Fxxpj8ksbH9ebxaEyBLZ85ySDhKiLDBrQSARLq1uNRts8RuJiHjaDMBU4Zn9h8LZNnBC5y4a",
                extendedPrivkey: "xprv9wSp6B7kry3Vj9m1zSnLvN3xH8RdsPP1Mh7fAaR7aRLcQMKTR2vidYEeEg2mUCTAwCd6vnxVrcjfy2kRgVsFawNzmjuHc2YmYRmagcEPdU9"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1",
                extendedPubkey: "xpub6DF8uhdarytz3FWdA8TvFSvvAh8dP3283MY7p2V4SeE2wyWmG5mg5EwVvmdMVCQcoNJxGoWaU9DCWh89LojfZ537wTfunKau47EL2dhHKon",
                extendedPrivkey: "xprv9zFnWC6h2cLgpmSA46vutJzBcfJ8yaJGg8cX1e5StJh45BBciYTRXSd25UEPVuesF9yog62tGAQtHjXajPPdbRCHuWS6T8XA2ECKADdw4Ef"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1/2147483646'",
                extendedPubkey: "xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL",
                extendedPrivkey: "xprvA1RpRA33e1JQ7ifknakTFpgNXPmW2YvmhqLQYMmrj4xJXXWYpDPS3xz7iAxn8L39njGVyuoseXzU6rcxFLJ8HFsTjSyQbLYnMpCqE2VbFWc"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1/2147483646'/2",
                extendedPubkey: "xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt",
                extendedPrivkey: "xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j"
            });

            testCases.forEach(testCase =>
            {
                try
                {
                    const extendedPrivkey = DeriveKey(testCase.rootKey, testCase.path, true);
                    const extendedPubkey = DeriveKey(testCase.rootKey, testCase.path, false);

                    assertEqual(extendedPrivkey, testCase.extendedPrivkey, "Extended private keys don't match");
                    assertEqual(extendedPubkey, testCase.extendedPubkey, "Extended public keys don't match");

                    const privkey = UnextendKey(extendedPrivkey);
                    const address = UnextendKey(extendedPubkey);
                    const privKeyPair = privkeyStringToKeyPair(privkey);
                    if (typeof privKeyPair === "string")
                        assert(false, privKeyPair);
                    else
                        assertEqual(makeAddress(privKeyPair.keypair), address, "Address derived from private key does not match");
                }
                catch (e)
                {
                    assert(false, "Unexpected error: " + e.message);
                }
            });
        }

        TestAddressesAndPrivkeys();
        TestBip38();
        TestBip39();
        TestBip32();

        if (failedTestMessages.length === 0)
        {
            alert("All tests OK");
            return;
        }

        failedTestMessages.forEach(err => console.error(err));

        alert(`${failedTestMessages.length} test${failedTestMessages.length === 1 ? "" : "s"} failed! Please report this issue! Check the console for details.`);
    }

    (<any>window)["set_layout"] = set_layout;
    (<any>window)["setAddressType"] = setAddressType;
    (<any>window)["setQRErrorCorrectionLevel"] = setQRErrorCorrectionLevel;
    (<any>window)["generate_address"] = generate_address;
    (<any>window)["view_address_details"] = view_address_details;
    (<any>window)["bip38decrypt_button"] = bip38decrypt_button;
    (<any>window)["setBulkAddressType"] = setBulkAddressType;
    (<any>window)["bip38changed"] = bip38changed;
    (<any>window)["showBip38Info"] = showBip38Info;
    (<any>window)["bulk_generate"] = bulk_generate;
    (<any>window)["setPaperAddressType"] = setPaperAddressType;
    (<any>window)["setPaperQRErrorCorrectionLevel"] = setPaperQRErrorCorrectionLevel;
    (<any>window)["paperWallet"] = paperWallet;
    (<any>window)["paperwallet_vertical_gap_changed"] = paperwallet_vertical_gap_changed;
    (<any>window)["paperWalletStyleChange"] = paperWalletStyleChange;
    (<any>window)["paperWalletCustomImageSelected"] = paperWalletCustomImageSelected;
    (<any>window)["paperwallet_update_element"] = paperwallet_update_element;
    (<any>window)["GenerateNewSeedButton"] = GenerateNewSeedButton;
    (<any>window)["SetSeedPage"] = SetSeedPage;
    (<any>window)["ViewSeedDetailsButton"] = ViewSeedDetailsButton;
    (<any>window)["SeedChanged"] = SeedChanged;
    (<any>window)["SeedPasswordChanged"] = SeedPasswordChanged;
    (<any>window)["SeedDerivationPresetChanged"] = SeedDerivationPresetChanged;
    (<any>window)["SeedCalculateAddressesButton"] = SeedCalculateAddressesButton;
    (<any>window)["SeedToggleExtendedKeys"] = SeedToggleExtendedKeys;
    (<any>window)["skipRandomness"] = skipRandomness;
    (<any>window)["setDarkMode"] = setDarkMode;
    (<any>window)["runTests"] = runTests;
})();
