CurrencyListAssistant = Class.create(BaseListAssistant, {
    initialize: function($super, applicationContext) {
        $super("currency", applicationContext);
    },

    activate: function($super, event) {
        if (event) {
            switch (event.source) {
            case "currencyView":
            case "currencyEdit":
                var expectedNewLength = this.listWidget.mojo.getLength() + event.rowsAdded;
                this.listWidget.mojo.setLengthAndInvalidate(expectedNewLength);
            }
        }
        
        $super(event);
    },

    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case "addCurrency":
                this.controller.stageController.pushScene("currencyEdit", this.context);
                event.stop();
            }
        }
    },

    getFormatters: function() {
        return {
            rate: function(rate) { return Mojo.Format.formatNumber(rate, 2); },
            homeIconStyle: function(_, model) { return model.home_flag ? "block" : "none"; },
            rateStyle: function(_, model) { return model.home_flag ? "none" : "block"; }
        };
    },

    createCommandMenuItems: function(commandMenu) {
        commandMenu.addItem("new", {icon: "new", command: "addCurrency"});
    },

    createManager: function(db) {
        return this.context.getCurrenciesFactory().createManager(db);
    },

    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        this.manager.find({}, {limit: limit, offset: offset}, successCallback, errorCallback);
    },

    itemTapCallback: function(event) {
        this.controller.stageController.pushScene("currencyView", this.context, event.item.id);
    }
});