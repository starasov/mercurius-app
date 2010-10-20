if (!Test) var Test = {};

Test.databaseErrorHandler = function(recordResults) {
    return (function(recordResults, transaction, error) {
        recordResults(error.message);
    }).curry(recordResults);
};

/**
 * @param {Function} recordResults
 * @param {Function} f
 */
Test.validate = function(recordResults, f) {
    Mojo.Test.validate(recordResults, f);  
};

Test.validateAndContinue = function(recordResults, f) {
    try {
        f();
    } catch (e) {
        recordResults(e.toString());
    }
};

Test.defaultDatabaseErrorCallback = function(recordResults, transaction, error) {
    recordResults(error);
};

/**
 * Ensures that two passed arrays are equal.
 *
 * Two arrays will be considered as equal in case when both arrays have equal
 * lengths and elements at the same positions of each array are equal too.
 *
 * @param array1 - {array} first array to test.
 * @param array2 - {array} second array to test.
 */
Test.requireArraysEqual = function(array1, array2) {
    if (!array1 && !array2) {
        return;
    }

    Mojo.requireEqual(array1.length, array2.length, "Arrays should be equal length.");

    for (var i = 0; i < array1.length; i++) {
        Mojo.requireEqual(array1[i], array2[i], "An " + i + "th array elements are not equal: " + array1[i] + " != " + array2[i]);
    }
};

Test.requireMapsEqual = function(map1, map2) {
    if (!map1 && !map2) {
        return;
    }

    var hash1 = $H(map1);
    var hash2 = $H(map2);

    Test.requireArraysEqual(hash1.keys(), hash2.keys());
    Test.requireArraysEqual(hash1.values(), hash2.values());
};

Test.requireException = function(f) {
    Mojo.requireFunction(f, "Passed argument should be a function.");

    try {
        f();
    } catch (e) {
        // Expected behavior.
        return;
    }

    Mojo.require(false, "Function was succeed, but exception was expected instead.");
};

Test.requireNumbersEqual = function(number1, number2, eps) {
    Mojo.requireNumber(number1, "Passed 'number1' argument should be a number.");
    Mojo.requireNumber(number2, "Passed 'number2' argument should be a number.");

    var absoluteDiff = Math.abs(number1 - number2);
    Mojo.require(absoluteDiff < (eps || 1e-6), "'" + number1 + "' was expected, but get '" + number2 + "'");
};