"use strict";
var Query = (function () { return Lazy(function () {
    function HasQueryKey(key) {
        return GetQueryValue(key) !== null;
    }
    function GetQueryValue(key) {
        if (window.location.search.length === 0 || window.location.search[0] !== "?") {
            return null;
        }
        var queryValues = window.location.search.substr(1).split("&");
        for (var i = 0; i < queryValues.length; ++i) {
            var currentQueryValue = queryValues[i];
            var index = currentQueryValue.indexOf("=");
            var currentKey = index === -1 ? currentQueryValue : currentQueryValue.substring(0, index);
            if (currentKey === key) {
                // empty string if no value
                return currentQueryValue.substring(index + 1);
            }
        }
        return null;
    }
    function GetAllQueryValues() {
        if (window.location.search.length === 0 || window.location.search[0] !== "?") {
            return {};
        }
        var result = {};
        var queryValues = window.location.search.substr(1).split("&");
        for (var i = 0; i < queryValues.length; ++i) {
            var currentQueryValue = queryValues[i];
            var index = currentQueryValue.indexOf("=");
            if (index !== -1) {
                result[currentQueryValue.substring(0, index)] = currentQueryValue.substring(index + 1);
            }
            else {
                result[currentQueryValue] = null;
            }
        }
        return result;
    }
    return {
        HasQueryKey: HasQueryKey,
        GetQueryValue: GetQueryValue,
        GetAllQueryValues: GetAllQueryValues
    };
}); })();
