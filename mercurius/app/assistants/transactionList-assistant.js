TransactionListAssistant = Class.create(BaseListAssistant, {
    initialize: function($super, applicationContext) {
        $super("transaction", applicationContext);
    },

    activate: function($super, event) {
        if (event) {
            switch (event.source) {
            case "transactionView":
            case "transactionEdit":
                var expectedNewLength = this.listWidget.mojo.getLength() + event.rowsAdded;
                this.listWidget.mojo.setLengthAndInvalidate(expectedNewLength);
            }
        }

        $super(event);
    },

    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case "addTransaction":
                this.controller.stageController.pushScene("transactionEdit", this.context);
                event.stop();
            }
        }
    },

    getFormatters: function() {
        return {};
    },

    createCommandMenuItems: function(commandMenu) {
//        commandMenu.addItem("new", {icon: "new", command: "addTransaction"});
    },

    initializeFromDatabase: function(db) {
        this.manager = this.context.getTransactionsFactory().createManager(db);
    },

    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        this.manager.find({}, {limit: limit, offset: offset}, successCallback, errorCallback);
    },

    itemTapCallback: function(event) {
//        this.controller.stageController.pushScene("transactionView", this.context, event.item.id);
    }
});