CurrencyViewAssistant = Class.create(BaseViewAssistant, {
    APP_MENU_SET_HOME_CURRENCY_ITEM: "set_home_currency",

    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, currencyId) {
        $super("currency", applicationContext, currencyId);
        this.currencyRateModel = Currencies.Fields.rate;
    },

    /** @override */
    handleCommand: function($super, event) {
        $super(event);

        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case "setAsHomeCurrency":
                this._setHomeHomeCurrency();
                event.stop();
            }
        }
    },

    /** @override */
    createAppMenuItems: function($super, appMenu) {
        appMenu.addItem(this.APP_MENU_SET_HOME_CURRENCY_ITEM,
            {label: $L("Set As Home Currency"), command: "setAsHomeCurrency", disabled: false});
        
        $super(appMenu);
    },

    /** @override */
    createMapper: function(db) {
        return this.context.getCurrenciesFactory().createMapper(db);
    },

    /** @override */
    updateView: function(currency) {
        this.currency = currency;

        this.controller.get("currency-view-title").innerHTML = currency.name;
        this.controller.get("currency-symbol").innerHTML = currency.symbol;
        this.controller.get("currency-rate").innerHTML = this.currencyRateModel.toViewString(currency.rate);

        if (currency.home_flag) {
            this.controller.get("title-home-icon").show();

            this.appMenu.disableItem(this.APP_MENU_SET_HOME_CURRENCY_ITEM);
            this.appMenu.disableItem(this.APP_MENU_DELETE_ITEM);
        } else {
            this.appMenu.enableItem(this.APP_MENU_SET_HOME_CURRENCY_ITEM);
            this.appMenu.enableItem(this.APP_MENU_DELETE_ITEM);
        }
    },

    _setHomeHomeCurrency: function() {
        this.mapper.setHomeCurrency(this.modelId, this.loadModel.bind(this), this.databaseErrorCallback.bind(this));
    }
});