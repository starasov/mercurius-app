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
    reportResults(error.message);
};

Test.requireArraysEqual = function(array1, array2) {
    Mojo.requireArray(array1);
    Mojo.requireArray(array2);
    Mojo.requireEqual(array1.length, array2.length);

    for (var i = 0; i < array1.length; i++) {
        Mojo.requireEqual(array1[i], array2[i]);
    }
};