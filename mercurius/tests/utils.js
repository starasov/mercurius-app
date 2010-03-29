if (!Test) var Test = {};

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
    recordResults(error.message);
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
    Mojo.requireArray(array1, "1st array parameter should be defined and can't be null.");
    Mojo.requireArray(array2, "2nd array parameter should be defined and can't be null.");
    Mojo.requireEqual(array1.length, array2.length, "Arrays should be equal length.");

    for (var i = 0; i < array1.length; i++) {
        Mojo.requireEqual(array1[i], array2[i], "An " + i + "th array elements are not equal: " + array1[i] + " != " + array2[i]);
    }
};

Test.requireException = function(f) {
    Mojo.requireFunction(f, "Passed argument should be a function.");

    try {
        f();
    } catch (e) {
        // Expected behavior.
        return;
    }

    Mojo.require(false, "Function call passed, but exception was expected instead.");
};