
var InitializePage = (() => Lazy(() =>
{
    const Pages = {
        "single-address": true,
        "address-details": true,
        "bulk-generate": true,
        "paper-wallet": true,
        "mnemonic-seed": true,
        "information": true,
        "beginners-guide": true,
        "security-tips": true
    } as const;

    type Page = keyof typeof Pages;

    const { GetAllQueryValues, GetQueryValue } = Query();

    const pageButtonPrefix = "button-page-";

    const printAreas: { [key in Page]: [string, string][] } = {
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

    type PageState = { [key: string]: string | null };
    const initialPageState: PageState = GetAllQueryValues();
    const pageState: PageState = { ...initialPageState };

    function SetPageState(key: string, value: string | null)
    {
        pageState[key] = value;
        return pageState;
    }

    function PushPageState(key: string, value: string | null)
    {
        history.pushState(SetPageState(key, value), "", GetPageStateString());
    }

    const pageStatePopHandlers: { [key: string]: (newValue: string | null) => void } = {
        "page": page =>
        {
            if (page !== null && Pages.hasOwnProperty(page))
            {
                SetPage(<Page>page, false);
            }
        }
    };

    function PopPageState(key: string, value: string | null)
    {
        if (pageStatePopHandlers.hasOwnProperty(key))
        {
            pageStatePopHandlers[key](value);
        }
    }

    function GetPageStateString()
    {
        const stateStrings: string[] = [];
        for (let key in pageState)
        {
            const value = pageState[key];
            if (value !== null)
            {
                stateStrings.push(key + "=" + value);
            }
            else
            {
                stateStrings.push(key);
            }
        }

        return "?" + stateStrings.join("&");
    }

    let currentPage: Page | null = null;
    window.addEventListener("popstate", ev =>
    {
        if (ev.state !== null)
        {
            if (typeof ev.state === "object")
            {
                for (let key in ev.state)
                {
                    PopPageState(key, ev.state[key]);
                }
            }
        }
        else
        {
            for (let key in initialPageState)
            {
                PopPageState(key, initialPageState[key]);
            }
        }
    });

    let initialPage = GetQueryValue("page");
    if (initialPage !== null && Pages.hasOwnProperty(initialPage))
    {
        initialPageState["page"] = initialPage;
        SetPage(<Page>initialPage, false);
    }
    else
    {
        const startingPage: Page = "single-address";
        initialPage = startingPage
        initialPageState["page"] = startingPage;
        SetPage(startingPage, false);
    }

    function SetPage(newPage: Page, setState: boolean = true)
    {
        if (currentPage === newPage || !printAreas.hasOwnProperty(newPage))
        {
            return;
        }

        const prevPage = currentPage;
        if (prevPage !== null)
        {
            (<HTMLButtonElement>document.getElementById(pageButtonPrefix + prevPage)).disabled = false;
            document.getElementById("page-" + prevPage)!.style.display = "none";

            const prevPrintAreas = printAreas[prevPage];
            for (let printArea of prevPrintAreas)
            {
                document.getElementById(printArea[0])!.classList.remove(printArea[1]);
            }
        }

        (<HTMLButtonElement>document.getElementById(pageButtonPrefix + newPage)).disabled = true;
        document.getElementById("page-" + newPage)!.style.display = "table";
        const newPrintAreas = printAreas[newPage];
        for (let printArea of newPrintAreas)
        {
            if (!document.getElementById(printArea[0]))
            {
                console.log(printArea[0]);
            }
            document.getElementById(printArea[0])!.classList.add(printArea[1]);
        }

        currentPage = newPage;

        if (setState)
        {
            PushPageState("page", currentPage);
        }
    }

    for (let page in Pages)
    {
        document.getElementById(pageButtonPrefix + page)!.addEventListener("click", () => SetPage(<Page>page))
    }
}))();
