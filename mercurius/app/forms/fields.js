Forms.Fields = {
    createTextField: function(id, text, maxLength) {
        return {
            id: id,
            attributes: {
                hintText: $L(text),
                multiline: false,
                enterSubmits: true,
                textCase: Mojo.Widget.steModeTitleCase,
                autoReplace: false,
                maxLength: maxLength || 20
            },

            changeEvent: Mojo.Event.propertyChanged,

            toFieldModel: function(value) {
                return {value: value};
            },

            fromFieldModel: function(fieldModel) {
                return fieldModel.value;
            }
        }
    },

    createDecimalField: function(id, text, fractionDigits) {
        return {
            id: id,
            attributes: {
                hintText: $L(text),
                multiline: false,
                enterSubmits: true,
                modifierState: Mojo.Widget.numLock,
                textCase: Mojo.Widget.steModeTitleCase,
                autoReplace: false
            },
            changeEvent: Mojo.Event.propertyChanged,

            toViewString: function(value) {
                return value != null ? Mojo.Format.formatNumber(value, fractionDigits || 2) : null;
            },

            toFieldModel: function(value) {
                return {value: this.toViewString(value)};
            },

            fromFieldModel: function(fieldModel) {
                return Utils.Parsing.parseDecimal(fieldModel.value);
            }
        }
    },

    createCurrencyField: function(id, text) {
        return {
            id: id,
            attributes: {
                hintText: $L(text),
                multiline: false,
                enterSubmits: true,
                modifierState: Mojo.Widget.numLock,
                textCase: Mojo.Widget.steModeTitleCase,
                autoReplace: false
            },
            changeEvent: Mojo.Event.propertyChanged,

            toViewString: function(value, currencySymbol) {
                if (value != null) {
                    var formattedValue = Mojo.Format.formatNumber(value / 100.0, 2);

                    if (currencySymbol) {
                        var currencyPrepend = Mojo.Locale.formats.currencyPrepend ? currencySymbol : "";
                        var currencyAppend = Mojo.Locale.formats.currencyAppend? currencySymbol : "";

                        return currencyPrepend + formattedValue + currencyAppend;
                    } else {
                        return formattedValue;
                    }
                }

                return null;
            },

            toFieldModel: function(value) {
                return {value: this.toViewString(value)};
            },

            fromFieldModel: function(fieldModel) {
                var parsedValue = Utils.Parsing.parseDecimal(fieldModel.value);
                return parsedValue * 100;
            }
        }
    },

    createSelectorField: function(id, text, choicesField) {
        return {
            id: id,
            attributes: {
                label: $L(text),
                choices: [],
                multiline: false
            },
            changeEvent: Mojo.Event.propertyChanged,

            toFieldModel: function(value, model) {
                return {
                    value: value,
                    choices: model[choicesField]
                };
            },

            fromFieldModel: function(fieldModel) {
                return parseInt(fieldModel.value);
            }
        }
    },

    toChoices: function(models, labelField, valueField) {
        var choices = [];

        for (var i = 0; i < models.length; i++) {
            choices.push({
                label: models[i][labelField],
                value: models[i][valueField]
            });
        }

        return choices;
    }
};