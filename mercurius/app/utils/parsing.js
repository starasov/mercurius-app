Utils.Parsing = {};

Utils.Parsing.parseDecimal = function(numberStr, options) {
    Mojo.requireString(numberStr, "'numberStr' parameter should be a string");

    if (this.isEmptyString(numberStr)) {
        return Number.NaN;
    }

    var formatHash = Mojo.Format.getFormatHash(options && options.countryCode);

    var decimal = formatHash.numberDecimal;
    var tripleSpacer = formatHash.numberTripleDivider;

    var clearedNumberStr = numberStr.replace(new RegExp(tripleSpacer, "g"), "");
    if (decimal != ".") {
        clearedNumberStr = clearedNumberStr.replace(new RegExp(decimal, "g"), ".");
    }

    return new Number(clearedNumberStr);
};

Utils.Parsing.isEmptyString = function(string) {
    return !string || string.trim().length == 0;
};