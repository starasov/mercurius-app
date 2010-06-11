CurrencyViewAssistant = Class.create(BaseViewAssistant, {
    initialize: function($super, applicationContext, currencyId) {
        $super("currency", applicationContext, currencyId);
    },

    getManager: function(db) {
        return this.context.getCurrenciesFactory().createManager(db);
    },

    updateView: function(currency) {
        this.controller.get("currency-view-title").innerHTML = currency.name;
        this.controller.get("currency-symbol").innerHTML = currency.symbol;
        this.controller.get("currency-rate").innerHTML = Mojo.Format.formatNumber(currency.rate, 2);

        if (currency.home_flag) {
            this.controller.get("title-home-icon").show();
        }
    }
});