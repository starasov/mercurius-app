Currencies.Manager = Class.create(Models.GenericManager, {
    getHomeCurrency: function(successCallback, errorCallback) {
        this._db.transaction((function(transaction) {
            this._getHomeCurrency(transaction, successCallback, errorCallback);
        }).bind(this));
    },

    getCurrencyByName: function(name, successCallback, errorCallback) {
        this.find({name: name}, {}, function(currencies) {
            if (currencies.length == 1) {
                successCallback(currencies[0]);
            } else {
                successCallback(null);
            }
        }, errorCallback);
    },

    setHomeCurrency: function(currencyId, successCallback, errorCallback) {
        var transaction = this._createTransaction();

        transaction.addCommand("new_home_currency", this._findById.bind(this, currencyId));
        transaction.addCommand("old_home_currency", this._getHomeCurrency.bind(this));

        transaction.addCommand("update_new", (function(transaction, successCallback, errorCallback, executionResults) {
            var new_home_currency = executionResults.new_home_currency;
            if (new_home_currency) {
                new_home_currency.home_flag = true;
                new_home_currency.rate = 1.0;
                this._update(new_home_currency, transaction, successCallback, errorCallback);
            } else {
                var error = {message: "Can't set currency " + currencyId + " as home currency, because of specified currency doesn't exist."};
                errorCallback(transaction, error);
            }
        }).bind(this));

        transaction.addCommand("update_old", (function(transaction, successCallback, errorCallback, executionResults) {
            var old_home_currency = executionResults.old_home_currency;
            if (old_home_currency){
                old_home_currency.home_flag = false;
                this._update(old_home_currency, transaction, successCallback, errorCallback);
            } else {
                this.log.warn("No previously set home currency found!");
            }
        }).bind(this));

        transaction.execute(function(executionResults) {
            successCallback(executionResults.new_home_currency);
        }, errorCallback);
    },

    /** @private */
    _getHomeCurrency: function(transaction, successCallback, errorCallback) {
        this._find({home_flag: true}, {}, transaction, function(currencies) {
            if (currencies.length == 1) {
                successCallback(currencies[0]);
            } else {
                successCallback(null);
            }
        }, errorCallback);
    }
});

Currencies.Manager.create = function(database) {
    return new Currencies.Manager(database,
                new Models.ResultSetMapper(new Models.GenericMapper(Currencies.TableModel)),
                new Models.GenericManagerHelper(Currencies.TableModel));
};