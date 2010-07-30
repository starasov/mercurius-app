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

        transaction.addCommand(this._findById.bind(this, currencyId), function(context, currency) {
            context.new_home_currency = currency;
        });

        transaction.addCommand(this._getHomeCurrency.bind(this), function(context, currency) {
            context.old_home_currency = currency;
        });

        transaction.addCommand((function(transaction, successCallback, errorCallback, context) {
            var new_home_currency = context.new_home_currency;
            if (new_home_currency) {
                new_home_currency.home_flag = true;
                new_home_currency.rate = 1.0;
                this._update(new_home_currency, transaction, successCallback, errorCallback);
            } else {
                var error = {message: "Can't set currency " + currencyId + " as home currency, because of specified currency doesn't exist."};
                errorCallback(transaction, error);
            }
        }).bind(this));

        transaction.addCommand((function(transaction, successCallback, errorCallback, context) {
            var old_home_currency = context.old_home_currency;
            if (old_home_currency){
                old_home_currency.home_flag = false;
                this._update(old_home_currency, transaction, successCallback, errorCallback);
            } else {
                this.log.warn("No previously set home currency found!");
            }
        }).bind(this));

        transaction.execute(function(context) {
            successCallback(context.new_home_currency);
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