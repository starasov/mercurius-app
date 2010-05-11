Currencies.Fields = {
    name: {
        id: "currency-name-field",
        attributes: {
            hintText: $L("Name..."),
            modelProperty: "name",
            multiline: false,
            enterSubmits: true,
            textCase: Mojo.Widget.steModeTitleCase,
            autoReplace: false,
            maxLength: 20
        },
        changeEvent: Mojo.Event.propertyChanged
    },

    symbol: {
        id: "currency-symbol-field",
        attributes: {
            hintText: $L("Symbol..."),
            modelProperty: "symbol",
            multiline: false,
            enterSubmits: true,
            textCase: Mojo.Widget.steModeTitleCase,
            autoReplace: false,
            maxLength: 3
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
        fromFormData: function(rate) { return Utils.Parsing.parseNumber(rate); }
    }
};