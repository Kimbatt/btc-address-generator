"use strict";
var PaperWalletDesignNames = {
    "Simple": null,
    "bitaddress.org": "https://bitaddress.org",
    "bitcoinpaperwallet.com": "https://bitcoinpaperwallet.com",
    "bitcoinpaperwallet.com (black and white)": "https://bitcoinpaperwallet.com",
    "Dorian Satoshi Nakamoto": "https://redd.it/20rml2",
    "walletgenerator.net": "https://walletgenerator.net",
    "Bitcoin currency note": "https://steemit.com/bitcoin/@bunnychum/bitcoin-paper-wallet-redesigned-as-currency-note-free-psd-to-download",
    "Design by Mark & Barbara Messer": "https://i.pinimg.com/originals/a3/89/89/a38989778a3e113a657016f5fab1803b.png",
    "Design by Timbo925 (grey)": "https://github.com/Timbo925/walletprinter/blob/d8ae0eab0c5ef09b0ade59009d544ae5f78b12f8/img/wallet_designs/timbo-grey.svg",
    "Design by 75RTUGA": "https://github.com/nieldlr/walletprinter/blob/master/img/wallet_designs/75RTUGA.jpg",
    "Your custom design": null
};
function GetPaperWalletDesign(designName, isBIP38) {
    function GetImageSrc(src) {
        return window.imageSources[src];
    }
    switch (designName) {
        case "Simple":
            return {
                width: 1000,
                height: 200,
                addressQRCodes: [{
                        position: { x: 10, y: 10 },
                        size: 100
                    }],
                privateKeyQRCodes: [{
                        anchor: 3 /* BottomRight */,
                        position: { x: 10, y: 10 },
                        size: 100
                    }],
                addressTexts: [{
                        position: { x: 120, y: 50 },
                        size: 18
                    }],
                privateKeyTexts: [{
                        anchor: 3 /* BottomRight */,
                        position: { x: 120, y: 10 },
                        size: 18
                    }],
                customTexts: [
                    {
                        text: "Address:",
                        fontFamily: "Verdana",
                        bold: true,
                        position: { x: 120, y: 15 },
                        size: 25
                    }, {
                        text: isBIP38 ? "Encrypted private key:" : "Private key:",
                        fontFamily: "Verdana",
                        bold: true,
                        anchor: 3 /* BottomRight */,
                        position: { x: isBIP38 ? 431 : 514, y: 40 },
                        size: 25
                    }
                ]
            };
        case "bitaddress.org":
            return {
                width: 1004,
                height: 538,
                backgroundImageSrc: GetImageSrc("bitaddressorg.jpg"),
                addressQRCodes: [{
                        position: { x: 53, y: 110 },
                        size: 184
                    }],
                privateKeyQRCodes: [{
                        position: { x: 757, y: 228 },
                        size: 210
                    }],
                addressTexts: [{
                        position: { x: 291, y: 480 },
                        size: 18,
                        rotation: 270,
                        rotationPivot: { x: 0, y: 0 },
                        bold: true
                    }],
                privateKeyTexts: [{
                        position: { x: 708, y: 483 },
                        size: isBIP38 ? 13 : 15,
                        rotation: 270,
                        rotationPivot: { x: 0, y: 0 },
                        bold: true
                    }]
            };
        case "bitcoinpaperwallet.com":
            return {
                width: 1010,
                height: 307,
                backgroundImageSrc: GetImageSrc("bitcoinpaperwalletcom.png"),
                addressQRCodes: [{
                        position: { x: 46, y: 113 },
                        size: 90.75
                    }],
                privateKeyQRCodes: [{
                        position: { x: 833, y: 96 },
                        size: 112.75
                    }],
                addressTexts: [
                    {
                        position: { x: 43, y: 260 },
                        size: 11,
                        bold: true
                    }, {
                        position: { x: 43, y: 34 },
                        size: 11,
                        rotation: 180,
                        rotationPivot: { x: 50, y: 50 },
                        bold: true
                    }
                ],
                privateKeyTexts: [
                    {
                        position: { x: isBIP38 ? 582 : 600, y: 228 },
                        size: 11,
                        bold: true
                    }, {
                        position: { x: isBIP38 ? 582 : 600, y: 62 },
                        size: 11,
                        rotation: 180,
                        rotationPivot: { x: 50, y: 50 },
                        bold: true
                    }
                ]
            };
        case "bitcoinpaperwallet.com (black and white)":
            return {
                width: 1000,
                height: 300,
                backgroundImageSrc: GetImageSrc("bitcoinpaperwalletcomblackandwhite.png"),
                addressQRCodes: [{
                        position: { x: 50, y: 110 },
                        size: 90
                    }],
                privateKeyQRCodes: [{
                        position: { x: 816, y: 93 },
                        size: 117
                    }],
                addressTexts: [
                    {
                        position: { x: 43, y: 256 },
                        size: 11,
                        bold: true
                    }, {
                        position: { x: 43, y: 32 },
                        size: 11,
                        rotation: 180,
                        rotationPivot: { x: 50, y: 50 },
                        bold: true
                    }
                ],
                privateKeyTexts: [
                    {
                        position: { x: isBIP38 ? 582 : 600, y: 228 },
                        size: 11,
                        bold: true
                    }, {
                        position: { x: isBIP38 ? 582 : 600, y: 62 },
                        size: 11,
                        rotation: 180,
                        rotationPivot: { x: 50, y: 50 },
                        bold: true
                    }
                ]
            };
        case "Dorian Satoshi Nakamoto":
            return {
                width: 1002,
                height: 426,
                backgroundImageSrc: GetImageSrc("dorian.jpg"),
                addressQRCodes: [{
                        position: { x: 29, y: 265 },
                        size: 135
                    }],
                privateKeyQRCodes: [{
                        position: { x: 839, y: 32 },
                        size: 135
                    }],
                addressTexts: [{
                        position: { x: 197, y: 385 },
                        size: 14.5,
                        bold: true
                    }],
                privateKeyTexts: [{
                        position: { x: 577, y: 24 },
                        size: isBIP38 ? 13 : 14.5,
                        bold: true,
                        maxLineLength: isBIP38 ? 29 : 26
                    }]
            };
        case "walletgenerator.net":
            return {
                width: 1001,
                height: 425,
                backgroundImageSrc: GetImageSrc("walletgeneratornet.jpg"),
                addressQRCodes: [{
                        position: { x: 780, y: 265 },
                        size: 120,
                        rotation: 270
                    }],
                privateKeyQRCodes: [{
                        position: { x: 442, y: 40 },
                        size: 120,
                        rotation: 90
                    }],
                addressTexts: [{
                        position: { x: 905, y: 391 },
                        size: 13,
                        maxLineLength: 17,
                        rotation: 270,
                        rotationPivot: { x: 0, y: 0 }
                    }],
                privateKeyTexts: [{
                        position: { x: 434, y: 30 },
                        size: isBIP38 ? 12 : 13,
                        maxLineLength: isBIP38 ? 20 : 18,
                        rotation: 90,
                        rotationPivot: { x: 0, y: 0 }
                    }]
            };
        case "Bitcoin currency note":
            return {
                width: 1002,
                height: 426,
                backgroundImageSrc: GetImageSrc("currencynote.jpg"),
                addressQRCodes: [{
                        position: { x: 29, y: 265 },
                        size: 135
                    }],
                privateKeyQRCodes: [{
                        position: { x: 839, y: 32 },
                        size: 135
                    }],
                addressTexts: [{
                        position: { x: 197, y: 384 },
                        size: 14.6,
                        bold: true
                    }],
                privateKeyTexts: [{
                        position: { x: isBIP38 ? 565 : 577, y: 25 },
                        size: 14.5,
                        maxLineLength: isBIP38 ? 29 : 26,
                        bold: true
                    }]
            };
        case "Design by Mark & Barbara Messer":
            return {
                width: 1020,
                height: 340,
                backgroundImageSrc: GetImageSrc("design_by_mark_and_barbara_messer.jpg"),
                addressQRCodes: [
                    {
                        position: { x: 42, y: 34 },
                        size: 116
                    }, {
                        position: { x: 867, y: 34 },
                        size: 116,
                        rotation: 270
                    }
                ],
                privateKeyQRCodes: [
                    {
                        position: { x: 622, y: 186 },
                        size: 116
                    }, {
                        position: { x: 867, y: 186 },
                        size: 116,
                        rotation: 270
                    }
                ],
                addressTexts: [
                    {
                        position: { x: 213, y: 29 },
                        bold: true,
                        size: 14
                    }, {
                        position: { x: 761, y: 82 },
                        size: 14,
                        bold: true,
                        rotation: 270,
                        maxLength: 14
                    }
                ],
                privateKeyTexts: []
            };
        case "Design by Timbo925 (grey)":
            return {
                width: 1004,
                height: 334,
                backgroundImageSrc: GetImageSrc("design_by_timbo925.svg"),
                addressQRCodes: [{
                        position: { x: 40, y: 34 },
                        size: 116
                    }],
                privateKeyQRCodes: [
                    {
                        position: { x: 610, y: 182 },
                        size: 116
                    }, {
                        position: { x: 852, y: 182 },
                        size: 116
                    }
                ],
                addressTexts: [
                    {
                        position: { x: 205, y: 25 },
                        bold: true,
                        size: 18
                    }, {
                        position: { x: 795, y: 152 },
                        size: 18,
                        bold: true,
                        rotation: 270,
                        rotationPivot: { x: 0, y: 0 },
                        maxLength: 11
                    }
                ],
                privateKeyTexts: [{
                        position: { x: isBIP38 ? 850 : 852, y: 30 },
                        size: isBIP38 ? 17 : 18,
                        bold: true,
                        maxLineLength: isBIP38 ? 12 : 11
                    }]
            };
        case "Design by 75RTUGA":
            return {
                width: 1020,
                height: 340,
                backgroundImageSrc: GetImageSrc("design_by_75rtuga.jpg"),
                addressQRCodes: [
                    {
                        position: { x: 44, y: 35 },
                        size: 116
                    }, {
                        position: { x: 868, y: 35 },
                        size: 116
                    }
                ],
                privateKeyQRCodes: [
                    {
                        position: { x: 622, y: 186 },
                        size: 116
                    }, {
                        position: { x: 868, y: 186 },
                        size: 116,
                        rotation: 270
                    }
                ],
                addressTexts: [
                    {
                        position: { x: 208, y: 29 },
                        size: 14.5,
                        bold: true
                    }, {
                        position: { x: 757, y: 84 },
                        size: 15,
                        bold: true,
                        rotation: 270,
                        maxLength: 14
                    }
                ],
                privateKeyTexts: []
            };
        case "Your custom design":
            return GetCustomPaperWalletDesign();
    }
    ;
}
