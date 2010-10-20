Accounts.Factory = Class.create({
    createEmptyModel: function() {
        return {
            name: "",
            opening_balance: null,
            currency_id: null,
            closed_flag: false,
            currency_symbol: null
        };
    },

    createMapper: function(db) {
        return new Accounts.Mapper(db);
    },

    createForm: function() {
        return new Forms.GenericForm(Accounts.Fields);
    },

    createValidator: function() {
        return new Accounts.Validator(Accounts.Fields);
    }
});