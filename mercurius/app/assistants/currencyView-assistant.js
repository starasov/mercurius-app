CurrencyViewAssistant = Class.create(BaseViewAssistant, {
    initialize: function($super, applicationContext, currencyId) {
        $super("currency", applicationContext, currencyId);
    },

    getManager: function(db) {
        return this.context.getCurrenciesFactory().createManager(db);
    },

    getCommandMenuItems: function() {
        return [{label: "Edit", disabled: false, command: "editCurrency"}];
    },

    activate: function(event) {
        if (event) {
            switch (event.source) {
            case "currencyEdit":
                this.loadModel();
            }
        }
    },

    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case "editCurrency":
                this.controller.stageController.pushScene("currencyEdit", this.context, this.modelId);
                event.stop();
            }
        }
    },

    updateView: function(currency) {
        this.controller.get("currency-view-title").innerHTML = currency.name;
        this.controller.get("currency-symbol").innerHTML = currency.symbol;
        this.controller.get("currency-rate").innerHTML = Currencies.Fields.rate.toFormData(currency.rate);

        if (currency.home_flag) {
            this.controller.get("title-home-icon").show();
        }
    }
});