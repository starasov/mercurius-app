Accounts.Factory = Class.create({
    createEmptyModel: function() {
        return {
            name: "",
            opening_balance: null,
            currency_id: null,
            closed_flag: false
        };
    },

    createManager: function(database) {
        return new Accounts.Manager(
                database,
                Accounts.TableModel,
                new Models.ResultSetMapper(new Models.GenericMapper(Accounts.TableModel)));
    },

    createForm: function() {
        return new Forms.GenericForm(Accounts.Fields);
    },

    createValidator: function() {
        return new Accounts.Validator(Accounts.Fields);
    }
});