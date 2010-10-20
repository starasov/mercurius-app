Currencies.MapperTest = Class.create(Database.BaseMapperTest, {
    test_getHomeCurrency_should_return_expected_currency: function(recordResults) {
        this.mapper.getHomeCurrency((function(currency) {
            Test.validate(recordResults, Mojo.requireEqual.curry(1, currency.id));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_getCurrencyByName_should_return_expected_currency_when_exists: function(recordResults) {
        this.mapper.getCurrencyByName("Euro", (function(currency) {
            Test.validate(recordResults, Mojo.requireEqual.curry(3, currency.id));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_getCurrencyByName_should_return_null_when_does_not_exist: function(recordResults) {
        this.mapper.getCurrencyByName("Rur", (function(currency) {
            Test.validate(recordResults, Mojo.requireEqual.curry(null, currency));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_setHomeCurrency_should_correctly_set_home_currency_when_exists: function(recordResults) {
        this.mapper.setHomeCurrency(2, (function(newHomeCurrency) {
            this.mapper.getHomeCurrency(function(homeCurrency) {
                Test.validate(recordResults, Mojo.requireEqual.curry(2, homeCurrency.id));
            }, Test.databaseErrorHandler(recordResults));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_setHomeCurrency_should_correctly_set_home_currency_rate: function(recordResults) {
        this.mapper.setHomeCurrency(2, (function(newHomeCurrency) {
            Test.validate(recordResults, Test.requireNumbersEqual.curry(1.0, newHomeCurrency.rate));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_setHomeCurrency_should_report_error_when_non_existing_currency_passed: function(recordResults) {
        this.mapper.setHomeCurrency(0, (function(newHomeCurrency) {
            recordResults("Should report error for non existing currency.");
        }).bind(this), function() {
            recordResults();
        });
    },

    getFixtures: function() {
        return [
            Mojo.appPath + "resources/database/currencies.json"
        ];
    },

    createMapper: function(db) {
        return new Currencies.Mapper(db);
    },

    getInitialCount: function() {
        return 3;
    },

    createNewModel: function() {
        return {
            name: "Rub",
            symbol: "ru",
            rate: 20,
            home_flag: false
        };
    },

    createUpdateModel: function() {
        var model = this.createNewModel();
        model.id = 1;

        return model;
    }
});