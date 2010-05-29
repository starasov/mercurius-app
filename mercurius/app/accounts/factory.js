Accounts.Factory = Class.create({
    initialize: function(currenciesManager) {
        this.currenciesManager = currenciesManager;
    },

    createEmptyModel: function() {
        return {
            name: "",
            symbol: "",
            rate: 1.0,
            home_flag: false
        };
    },

    createManager: function(database) {
        return new Accounts.Manager(
                database,
                new Models.ResultSetMapper(new Accounts.Mapper(Accounts.TableModel, this.currenciesManager)),
                new Models.GenericManagerHelper(Accounts.TableModel));
    }
});