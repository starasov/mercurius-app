Models.Fields = {
    createTextField: function(id, text, modelProperty, maxLength) {
        return {
            id: id,
            attributes: {
                hintText: $L(text),
                modelProperty: modelProperty,
                multiline: false,
                enterSubmits: true,
                textCase: Mojo.Widget.steModeTitleCase,
                autoReplace: false,
                maxLength: maxLength || 20
            },
            changeEvent: Mojo.Event.propertyChanged
        }
    },

    createDecimalField: function(id, text, modelProperty, fractionDigits) {
        return {
            id: id,
            attributes: {
                hintText: $L(text),
                modelProperty: modelProperty,
                multiline: false,
                enterSubmits: true,
                modifierState: Mojo.Widget.numLock,
                textCase: Mojo.Widget.steModeTitleCase,
                autoReplace: false
            },
            changeEvent: Mojo.Event.propertyChanged,
            toFormData: function(number) { return Mojo.Format.formatNumber(number, fractionDigits || 2); },
            fromFormData: function(numberStr) { return Utils.Parsing.parseNumber(numberStr); }
        }
    }
};