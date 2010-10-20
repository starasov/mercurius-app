Currencies.Factory = Class.create({
    createEmptyModel: function() {
        return {
            name: "",
            symbol: "",
            rate: 1.0,
            home_flag: false
        };
    },

    createMapper: function(db) {
        return new Currencies.Mapper(db);
    },

    createForm: function() {
        return new Forms.GenericForm(Currencies.Fields);
    },

    createValidator: function(mapper, currencyId) {
        return new Currencies.Validator(Currencies.Fields, mapper, currencyId);
    }
});