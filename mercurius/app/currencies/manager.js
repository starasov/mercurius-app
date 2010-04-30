Currencies.Manager = Class.create(Models.GenericManager, {
    getHomeCurrency: function(successCallback, errorCallback) {
        this.find({home_flag: true}, {}, function(transaction, resultSet) {
            if (resultSet.length() == 1) {
                successCallback(transaction, resultSet.item(0));
            } else {
                successCallback(transaction, null);
            }
        }, errorCallback);
    },

    getCurrencyByName: function(name, successCallback, errorCallback) {
        this.find({name: name}, {}, function(transaction, resultSet) {
            if (resultSet.length() == 1) {
                successCallback(transaction, resultSet.item(0));
            } else {
                successCallback(transaction, null);
            }
        }, errorCallback);
    }
});

Currencies.Manager.create = function(db) {
    return new Currencies.Manager(db, new Models.GenericMapper(Currencies.TableModel));
};