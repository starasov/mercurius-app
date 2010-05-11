Utils.Parsing = {};

Utils.Parsing.parseNumber = function(numberStr, options) {
    Mojo.requireString(numberStr, "'str' parameter should be a string");

    var formatHash = Mojo.Format.getFormatHash(options && options.countryCode);

    var decimal = formatHash.numberDecimal;
    var tripleSpacer = formatHash.numberTripleDivider;

    var clearedNumberStr = numberStr.replace(new RegExp(tripleSpacer, "g"), "");
    if (decimal != ".") {
        clearedNumberStr = clearedNumberStr.replace(new RegExp(decimal, "g"), ".");
    }

    return new Number(clearedNumberStr);
};