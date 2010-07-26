Accounts.Mapper = Class.create(Models.GenericMapper, {
    initialize: function($super, accountsTableModel, currenciesManager) {
        $super(accountsTableModel);
        this.currenciesManager = currenciesManager;
    },

    mapRow: function($super, manager, row, successCallback, errorCallback) {
        $super(manager, row, (function(model) {
            model.value = 1;
            if (model.currency_id) {
                this._mapCurrency(model, successCallback, errorCallback);
            } else {
                successCallback(model);
            }
        }).bind(this), errorCallback);
    },

    _mapCurrency: function(model, successCallback, errorCallback) {
        this.currenciesManager.findById(model.currency_id, function(currency) {
            model.currency = currency;
            successCallback(model);
        }, errorCallback);
    }
});