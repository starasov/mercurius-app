Currencies.Factory = Class.create({
    createEmptyModel: function() {
        return {
            name: "",
            symbol: "",
            rate: 1.0,
            home_flag: false
        };
    },

    createManager: function(database) {
        return new Currencies.Manager(
                database,
                new Models.ResultSetMapper(new Models.GenericMapper(Currencies.TableModel)),
                new Models.GenericManagerHelper(Currencies.TableModel));
    },

    createForm: function() {
        return new Forms.GenericForm(Currencies.Fields);
    },

    createValidator: function(currenciesManager, currencyId) {
        return new Currencies.Validator(Currencies.Fields, currenciesManager, currencyId);
    }
});