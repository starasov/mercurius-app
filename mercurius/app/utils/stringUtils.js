Utils.StringUtils = {
    trimLast: function(str, trimmed) {
        var index = str.lastIndexOf(trimmed);
        var result = (index == str.length - trimmed.length) ? str.substr(0, str.length - trimmed.length) : str;
        return result.trim();
    }
};