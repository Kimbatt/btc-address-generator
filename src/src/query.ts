
var Query = (() => Lazy(() =>
{
    function HasQueryKey(key: string)
    {
        return GetQueryValue(key) !== null;
    }

    function GetQueryValue(key: string)
    {
        if (window.location.search.length === 0 || window.location.search[0] !== "?")
        {
            return null;
        }

        const queryValues = window.location.search.substr(1).split("&");
        for (let i = 0; i < queryValues.length; ++i)
        {
            const currentQueryValue = queryValues[i];
            const index = currentQueryValue.indexOf("=");

            const currentKey = index === -1 ? currentQueryValue : currentQueryValue.substring(0, index);
            if (currentKey === key)
            {
                // empty string if no value
                return currentQueryValue.substring(index + 1);
            }
        }

        return null;
    }

    function GetAllQueryValues(): { [key: string]: string | null }
    {
        if (window.location.search.length === 0 || window.location.search[0] !== "?")
        {
            return {};
        }

        const result: { [key: string]: string | null } = {};
        const queryValues = window.location.search.substr(1).split("&");
        for (let i = 0; i < queryValues.length; ++i)
        {
            const currentQueryValue = queryValues[i];
            const index = currentQueryValue.indexOf("=");
            if (index !== -1)
            {
                result[currentQueryValue.substring(0, index)] = currentQueryValue.substring(index + 1);
            }
            else
            {
                result[currentQueryValue] = null;
            }
        }

        return result;
    }

    return {
        HasQueryKey,
        GetQueryValue,
        GetAllQueryValues
    };
}))();
