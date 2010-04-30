Currencies.Fields = {
    name: {
        id: "currency-name-field",
        attributes: {
            hintText: $L("Name..."),
            modelProperty: "name",
            multiline: true,
            enterSubmits: true,
            textCase: Mojo.Widget.steModeTitleCase,
            autoReplace: false
        },
        changeEvent: Mojo.Event.propertyChanged
    },

    symbol: {
        id: "currency-symbol-field",
        attributes: {
            hintText: $L("Symbol..."),
            modelProperty: "symbol",
            multiline: true,
            enterSubmits: true,
            textCase: Mojo.Widget.steModeTitleCase,
            autoReplace: false
        },
        changeEvent: Mojo.Event.propertyChanged
    },

    rate: {
        id: "currency-rate-field",
        attributes: {
            hintText: $L("Rate..."),
            modelProperty: "rate",
            multiline: true,
            enterSubmits: true,
            modifierState: Mojo.Widget.numLock,
            textCase: Mojo.Widget.steModeTitleCase,
            autoReplace: false
        },
        changeEvent: Mojo.Event.propertyChanged,
        toFormData: function(rate) { return Mojo.Format.formatNumber(rate, 2); },
        fromFormData: function(rateData) { return Number(rateData); }
    }
};