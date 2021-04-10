
var Query = (() => Lazy(() =>
{
    function HasQueryKey(key: string)
    {
        return GetQueryValue(key) !== null;
    }

    function GetQueryValue(key: string)
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

    function GetAllQueryValues()
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

    return {
        HasQueryKey,
        GetQueryValue,
        GetAllQueryValues
    };
}))();
