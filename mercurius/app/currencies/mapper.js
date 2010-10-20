Currencies.Mapper = Class.create(Database.BaseMapper, {
    getHomeCurrency: function(successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            this._getHomeCurrency(transaction, successCallback, errorCallback);
        }).bind(this));
    },

    getCurrencyByName: function(name, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            transaction.executeSql(Currencies.Mapper._findCurrencyByNameSql, [name],
                    this._handleSingleResult.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    setHomeCurrency: function(currencyId, successCallback, errorCallback) {
        var transaction = this._createLazyTransaction();

        transaction.addCommand(this._findById.bind(this, currencyId), function(context, currency) {
            context.new_home_currency = currency;
        });

        transaction.addCommand(this._getHomeCurrency.bind(this), function(context, currency) {
            context.old_home_currency = currency;
        });

        transaction.addCommand((function(transaction, successCallback, errorCallback, context) {
            var new_home_currency = context.new_home_currency;
            if (new_home_currency) {
                new_home_currency.home_flag = 1;
                new_home_currency.rate = 1.0;

                this._update(new_home_currency, transaction, successCallback, errorCallback);
            } else {
                var error = {message: "Can't set currency " + currencyId + " as home currency, because of specified currency doesn't exist."};
                errorCallback(transaction, error);
            }
        }).bind(this));

        transaction.addCommand((function(transaction, successCallback, errorCallback, context) {
            var old_home_currency = context.old_home_currency;
            if (old_home_currency) {
                old_home_currency.home_flag = 0;
                this._update(old_home_currency, transaction, successCallback, errorCallback);
            }
        }).bind(this));

        transaction.execute(function(context) {
            successCallback(context.new_home_currency);
        }, errorCallback);
    },

    _getHomeCurrency: function(transaction, successCallback, errorCallback) {
        transaction.executeSql(Currencies.Mapper._findHomeCurrencySql, [],
                this._handleSingleResult.bind(this, successCallback), errorCallback);
    },

    getCountSql: function() {
        return Currencies.Mapper._countSql;
    },

    getSaveSql: function() {
        return Currencies.Mapper._saveSql;
    },

    getUpdateSql: function() {
        return Currencies.Mapper._updateSql;
    },

    getDeleteSql: function() {
        return Currencies.Mapper._deleteSql;
    },

    getFindByIdSql: function() {
        return Currencies.Mapper._findByIdSql;
    },

    getFindAllSql: function() {
        return Currencies.Mapper._findAllSql;
    },

    getBaseColumns: function() {
        return Currencies.Mapper._baseColumns;
    }
});

Currencies.Mapper._baseColumns = ["name", "symbol", "rate", "home_flag"];

Currencies.Mapper._countSql =
        "SELECT COUNT(*) as count FROM currencies;";

Currencies.Mapper._saveSql =
        "INSERT INTO currencies(name, symbol, rate, home_flag) VALUES(?, ?, ?, ?);";

Currencies.Mapper._updateSql =
        "UPDATE currencies SET name=?, symbol=?, rate=?, home_flag=? WHERE id=?;";

Currencies.Mapper._deleteSql =
        "DELETE FROM currencies WHERE id=?;";

Currencies.Mapper._findByIdSql =
        "SELECT id, name, symbol, rate, home_flag FROM currencies WHERE id=?;";

Currencies.Mapper._findAllSql =
        "SELECT id, name, symbol, rate, home_flag FROM currencies ORDER BY name LIMIT ? OFFSET ?;";

Currencies.Mapper._findHomeCurrencySql =
        "SELECT id, name, symbol, rate, home_flag FROM currencies WHERE home_flag=1;";

Currencies.Mapper._findCurrencyByNameSql =
        "SELECT id, name, symbol, rate, home_flag FROM currencies WHERE name=?;";
