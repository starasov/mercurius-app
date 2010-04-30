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
        return new Currencies.Manager(database, new Models.GenericMapper(Currencies.TableModel));
    },

    createForm: function() {
        return new Models.GenericForm(Currencies.Fields);
    },

    createValidator: function(currenciesManager) {
        return new Currencies.Validator(Currencies.Fields, currenciesManager);
    }
});