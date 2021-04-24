"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var InitializePage = (function () { return Lazy(function () {
    var Pages = {
        "single-address": true,
        "address-details": true,
        "bulk-generate": true,
        "paper-wallet": true,
        "mnemonic-seed": true,
        "information": true,
        "beginners-guide": true,
        "security-tips": true
    };
    var _a = Query(), GetAllQueryValues = _a.GetAllQueryValues, GetQueryValue = _a.GetQueryValue;
    var pageButtonPrefix = "button-page-";
    var printAreas = {
        "single-address": [
            ["address-div", "print-visible"]
        ],
        "address-details": [
            ["view-address-div", "print-visible"]
        ],
        "bulk-generate": [
            ["bulk-addresses", "print-visible"]
        ],
        "paper-wallet": [
            ["paperwallet-canvas-print-container", "print-container"],
            ["paperwallet-print-area", "print-visible"]
        ],
        "mnemonic-seed": [
            ["seed-generate-result", "print-visible"],
            ["seed-details-page", "print-visible"]
        ],
        "information": [
            ["page-information", "print-visible"]
        ],
        "beginners-guide": [
            ["page-beginners-guide", "print-visible"]
        ],
        "security-tips": [
            ["page-security-tips", "print-visible"]
        ]
    };
    var initialPageState = GetAllQueryValues();
    var pageState = __assign({}, initialPageState);
    function SetPageState(key, value) {
        pageState[key] = value;
        return pageState;
    }
    function PushPageState(key, value) {
        history.pushState(SetPageState(key, value), "", GetPageStateString());
    }
    var pageStatePopHandlers = {
        "page": function (page) {
            if (page !== null && Pages.hasOwnProperty(page)) {
                SetPage(page, false);
            }
        }
    };
    function PopPageState(key, value) {
        if (pageStatePopHandlers.hasOwnProperty(key)) {
            pageStatePopHandlers[key](value);
        }
    }
    function GetPageStateString() {
        var stateStrings = [];
        for (var key in pageState) {
            var value = pageState[key];
            if (value !== null) {
                stateStrings.push(key + "=" + value);
            }
            else {
                stateStrings.push(key);
            }
        }
        return "?" + stateStrings.join("&");
    }
    var currentPage = null;
    window.addEventListener("popstate", function (ev) {
        if (ev.state !== null) {
            if (typeof ev.state === "object") {
                for (var key in ev.state) {
                    PopPageState(key, ev.state[key]);
                }
            }
        }
        else {
            for (var key in initialPageState) {
                PopPageState(key, initialPageState[key]);
            }
        }
    });
    var initialPage = GetQueryValue("page");
    if (initialPage !== null && Pages.hasOwnProperty(initialPage)) {
        initialPageState["page"] = initialPage;
        SetPage(initialPage, false);
    }
    else {
        var startingPage = "single-address";
        initialPage = startingPage;
        initialPageState["page"] = startingPage;
        SetPage(startingPage, false);
    }
    function SetPage(newPage, setState) {
        if (setState === void 0) { setState = true; }
        if (currentPage === newPage || !printAreas.hasOwnProperty(newPage)) {
            return;
        }
        var prevPage = currentPage;
        if (prevPage !== null) {
            document.getElementById(pageButtonPrefix + prevPage).disabled = false;
            document.getElementById("page-" + prevPage).style.display = "none";
            var prevPrintAreas = printAreas[prevPage];
            for (var _i = 0, prevPrintAreas_1 = prevPrintAreas; _i < prevPrintAreas_1.length; _i++) {
                var printArea = prevPrintAreas_1[_i];
                document.getElementById(printArea[0]).classList.remove(printArea[1]);
            }
        }
        document.getElementById(pageButtonPrefix + newPage).disabled = true;
        document.getElementById("page-" + newPage).style.display = "table";
        var newPrintAreas = printAreas[newPage];
        for (var _a = 0, newPrintAreas_1 = newPrintAreas; _a < newPrintAreas_1.length; _a++) {
            var printArea = newPrintAreas_1[_a];
            if (!document.getElementById(printArea[0])) {
                console.log(printArea[0]);
            }
            document.getElementById(printArea[0]).classList.add(printArea[1]);
        }
        currentPage = newPage;
        if (setState) {
            PushPageState("page", currentPage);
        }
    }
    var _loop_1 = function (page) {
        document.getElementById(pageButtonPrefix + page).addEventListener("click", function () { return SetPage(page); });
    };
    for (var page in Pages) {
        _loop_1(page);
    }
}); })();
