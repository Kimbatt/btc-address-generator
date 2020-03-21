
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

    const hour = new Date().getHours();
    let darkMode = hour < 7 || hour > 18;

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

                randomnessNumbers.push.apply(randomnessNumbers, tempRandomnessBytes);
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
            tempArray.push.apply(tempArray, randomnessNumbers);

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
            salt.push.apply(salt, addresshash);
            salt.push.apply(salt, bip38generate_ownersalt!);

            const encrypted = <number[]>scrypt(bip38generate_passpoint!, salt, 10, 1, 1, 64);
            const derivedhalf1 = encrypted.slice(0, 32);
            const derivedhalf2 = encrypted.slice(32, 64);

            const AES_opts = { mode: new (<any>window).AES_mode.ECB((<any>window).AES_pad.NoPadding), asBytes: true };
            const encryptedpart1 = <number[]>(<any>window).AES.encrypt(byteArrayXOR(seedb.slice(0, 16), derivedhalf1.slice(0, 16)), derivedhalf2, AES_opts);

            const block2: number[] = [];
            block2.push.apply(block2, encryptedpart1.slice(8, 16));
            block2.push.apply(block2, seedb.slice(16, 24));
            const encryptedpart2 = <number[]>(<any>window).AES.encrypt(byteArrayXOR(block2, derivedhalf1.slice(16, 32)), derivedhalf2, AES_opts);

            const finalprivkey = [0x01, 0x43, 0x20];
            finalprivkey.push.apply(finalprivkey, addresshash);
            finalprivkey.push.apply(finalprivkey, bip38generate_ownersalt!);
            finalprivkey.push.apply(finalprivkey, encryptedpart1.slice(0, 8));
            finalprivkey.push.apply(finalprivkey, encryptedpart2);
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

        const AES_opts = { mode: new (<any>window).AES_mode.ECB((<any>window).AES_pad.NoPadding), asBytes: true };

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
            passpoint.push.apply(passpoint, bytes_public_x);

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

            const decrypted2 = <number[]>(<any>window).AES.decrypt(encryptedpart2, derivedhalf2, AES_opts);

            const encryptedpart1 = bytes.slice(14, 22);
            encryptedpart1.push.apply(encryptedpart1, byteArrayXOR(decrypted2.slice(0, 8), scrypt_result_2.slice(16, 24)));
            const decrypted1 = <number[]>(<any>window).AES.decrypt(encryptedpart1, derivedhalf2, AES_opts);
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
            const decrypted = <number[]>(<any>window).AES.decrypt(bytes.slice(6, 38), derivedBytes.slice(32), AES_opts);
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

        key_bytes.push.apply(key_bytes, bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = SHA256(key_bytes);
        const ripemd_result_2 = RIPEMD160(sha_result_1);
        const ripemd_extended = [isTestnet ? 0x6F : 0x00];
        ripemd_extended.push.apply(ripemd_extended, ripemd_result_2);
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

        key_bytes.push.apply(key_bytes, bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = SHA256(key_bytes);
        const keyhash = RIPEMD160(sha_result_1);

        const redeemscript = [0x00, 0x14];
        redeemscript.push.apply(redeemscript, keyhash);

        const redeemscripthash = [isTestnet ? 0xC4 : 0x05];

        redeemscripthash.push.apply(redeemscripthash, RIPEMD160(SHA256(redeemscript)));
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
        hrpExpanded.push.apply(hrpExpanded, data);
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

        key_bytes.push.apply(key_bytes, bytes_public_x);

        if (keypair.y.isOdd())
            key_bytes.push(0x03);
        else
            key_bytes.push(0x02);

        key_bytes.reverse();
        const sha_result_1 = SHA256(key_bytes);
        const keyhash = RIPEMD160(sha_result_1);

        const redeemscript = [0x00, 0x14];
        redeemscript.push.apply(redeemscript, keyhash);

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

        privkey.push.apply(privkey, temp);
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
                    addressDiv.style.top = "384px";
                    addressDiv.style.left = "197px";
                    addressDiv.style.fontFamily = "roboto-mono";
                    addressDiv.style.fontWeight = "bold";
                    addressDiv.style.fontSize = "14.5px";

                    const privkeyDiv = document.createElement("div");
                    privkeyDiv.innerHTML = splitText(currentPrivkey, 2);
                    privkeyDiv.style.fontSize = bip38 ? "13px" : "14.5px";
                    privkeyDiv.style.position = "absolute";
                    privkeyDiv.style.top = "25px";
                    privkeyDiv.style.left = "575px";
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
                    addressQRImg.style.top = "118px"
                    addressQRImg.style.left = "55px";
                    addressQRImg.style.width = addressTargetSize + "px";
                    addressQRImg.style.height = addressTargetSize + "px";

                    const currentPrivkeyQR = currentData.privkeyQR!;
                    const privkeySize = currentPrivkeyQR.getModuleCount() + 4;
                    finalSize = Math.floor(privkeyTargetSize / privkeySize) + 1;
                    const privkeyQRImg = new Image();
                    privkeyQRImg.src = currentPrivkeyQR.createDataURL(finalSize, 0);
                    privkeyQRImg.style.position = "absolute";
                    privkeyQRImg.style.top = "226px";
                    privkeyQRImg.style.left = "755px";
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
                errorMessageDiv.textContent = "Private key \"" +
                    (privkey.length < 8 ? privkey : privkey.substr(0, 8) + "...") +
                    "\" is not valid: " + reason;
            }

            const privkeyBigints = Array<PrivateKeyWithKeypair>(privkeys.length);
            for (let i = 0; i < privkeys.length; ++i)
            {
                const currentPrivkey = privkeys[i];
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

                privkeyBigints[i] = keypair;
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
        finalprivkey.push.apply(finalprivkey, salt);

        const AES_opts = { mode: new (<any>window).AES_mode.ECB((<any>window).AES_pad.NoPadding), asBytes: true };
        const encrypted = <number[]>(<any>window).AES.encrypt(firstHalf, secondHalf, AES_opts);
        finalprivkey.push.apply(finalprivkey, encrypted);

        const checksum = SHA256(SHA256(finalprivkey)).slice(0, 4);
        finalprivkey.push.apply(finalprivkey, checksum);

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

                TestDecrypt(testCase.encryptedPrivKey, testCase.password);
                TestDecrypt(testCase.encryptedPrivKeyFromPrivkey, testCase.password);

                function TestEncrypt(privkey: string, password: string)
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

                TestEncrypt(testCase.decryptedPrivKey, testCase.password);
            });
        }

        TestAddressesAndPrivkeys();
        TestBip38();

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
    (<any>window)["skipRandomness"] = skipRandomness;
    (<any>window)["setDarkMode"] = setDarkMode;
    (<any>window)["runTests"] = runTests;
})();
