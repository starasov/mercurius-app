Transactions.Factory = Class.create({
    createEmptyModel: function() {
        return {
            amount: null,
            date: (new Date()).getTime(),
            account_id: null,
            category_id: null,
            transactions_balance: null
        };
    },

    createMapper: function(db) {
        return new Transactions.Mapper(db);
    },

    createForm: function() {
        return new Forms.GenericForm(Transactions.Fields);
    },

    createValidator: function() {
        return new Transactions.Validator(Transactions.Fields);
    }
});