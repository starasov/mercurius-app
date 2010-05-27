Currencies.Manager = Class.create(Models.GenericManager, {
    getHomeCurrency: function(successCallback, errorCallback) {
        this.find({home_flag: true}, {}, function(currencies) {
            if (currencies.length == 1) {
                successCallback(currencies[0]);
            } else {
                successCallback(null);
            }
        }, errorCallback);
    },

    getCurrencyByName: function(name, successCallback, errorCallback) {
        this.find({name: name}, {}, function(currencies) {
            if (currencies.length == 1) {
                successCallback(currencies[0]);
            } else {
                successCallback(null);
            }
        }, errorCallback);
    }
});

Currencies.Manager.create = function(db) {
    return new Currencies.Manager(db, 
                new Models.ResultSetMapper(new Models.GenericMapper(Currencies.TableModel)),
                new Models.GenericManagerHelper(Currencies.TableModel)
           );
};