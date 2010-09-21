Utils.Formatting = {};

Utils.Formatting.formatCurrency = function(cents, symbol) {
    if (cents != null) {
        var formattedValue = Mojo.Format.formatNumber(cents / 100.0, 2);

        if (symbol) {
            var currencyPrepend = Mojo.Locale.formats.currencyPrepend ? symbol : "";
            var currencyAppend = Mojo.Locale.formats.currencyAppend? symbol : "";

            return currencyPrepend + formattedValue + currencyAppend;
        } else {
            return formattedValue;
        }
    }

    return null;
};