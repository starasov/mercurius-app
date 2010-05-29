CurrencyListAssistant = Class.create(BaseListAssistant, {
    initialize: function($super, applicationContext) {
        $super("currency", applicationContext);
    },

    activate: function($super, event) {
        if (event) {
            switch (event.source) {
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

    getCommandMenuItems: function() {
        return [{icon: "new", command: "addCurrency"}];
    },

    getManager: function(db) {
        return this.context.getCurrenciesFactory().createManager(db);
    },

    listItemsCallback: function(list, offset, limit) {
        this.manager.find({}, {limit: limit, offset: offset}, function(accounts) {
            list.mojo.noticeUpdatedItems(offset, accounts);
        }, this.databaseErrorCallback.bind(this));
    },

    itemTapCallback: function(event) {
        this.controller.stageController.pushScene("currencyView", this.context, event.item.id);
    }
});