Accounts.Factory = Class.create({
    initialize: function(currenciesFactory) {
        this.currenciesFactory = currenciesFactory;
    },

    createEmptyModel: function() {
        return {
            name: "",
            opening_balance: null,
            currency_id: null,
            closed_flag: false
        };
    },

    createManager: function(database) {
        var currenciesManager = this.currenciesFactory.createManager(database);
        
        return new Accounts.Manager(
                database,
                new Models.ResultSetMapper(new Accounts.Mapper(Accounts.TableModel, currenciesManager)),
                new Models.GenericManagerHelper(Accounts.TableModel));
    },

    createForm: function() {
        return new Forms.GenericForm(Accounts.Fields);
    },

    createValidator: function() {
        return new Accounts.Validator(Accounts.Fields);
    }
});