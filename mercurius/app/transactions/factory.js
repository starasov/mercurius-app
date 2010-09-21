Transactions.Factory = Class.create({
    createEmptyModel: function() {
        return {
            type: Transactions.Type.EXPENSE,
            amount: null,
            date: (new Date()).getTime(),
            account_id: null,
            category_id: null
        };
    },

    createManager: function(database) {
        return new Transactions.Manager(
                database,
                Transactions.TableModel,
                new Models.ResultSetMapper(new Models.GenericMapper(Transactions.TableModel)));
    },

    createForm: function() {
        return new Forms.GenericForm(Transactions.Fields);
    },

    createValidator: function() {
        return new Transactions.Validator(Transactions.Fields);
    }
});