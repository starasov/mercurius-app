Models.Currencies = {};

Models.Currencies.TableModel = {
    Name: "currencies",
    Columns: {
        id: new Database.Types.PrimaryKey(),
        name: new Database.Types.String(Database.Types.NonNullable),
        symbol: new Database.Types.String(Database.Types.NonNullable),
        rate: new Database.Types.Real(Database.Types.NonNullable),
        home_flag: new Database.Types.Boolean(Database.Types.NonNullable)
    }
};


Models.Currencies.ValidationModel = {
    // possible column validator signature: function(columnValue, columnModel)
    Columns: {
        name: [],
        symbol: [],
        home_flag: []
    },

    // possible instance validator signature: function(instance, model, genericManager)
    Instance: []
};

Models.Currencies.ManagerFactory = Class.create({
    create: function(db) {
        return new Models.Currencies.Manager(db, new Models.GenericMapper(Models.Currencies.TableModel));
    }
});

Models.Currencies.Manager = Class.create(Models.GenericManager, {
    getHomeCurrency: function(successCallback, errorCallback) {
        this.find({home_flag: true}, function(transaction, resultSet) {
            if (resultSet.length() == 1) {
                successCallback(transaction, resultSet.item(0));
            } else {
                successCallback(transaction, null);
            }
        }, errorCallback);
    }
});
