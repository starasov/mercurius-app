AccountListAssistant = Class.create(BaseListAssistant, {
    initialize: function($super, applicationContext) {
        $super("account", applicationContext);    
    },

    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case "addAccount":
                this.controller.stageController.pushScene("accountEdit", this.context);
                event.stop();
            }
        }
    },

    getFormatters: function() {
        return {
            nameStyle: function(_, model) { return model.closed_flag ? "palm-textfield-disabled" : null; }
        };
    },

    getCommandMenuItems: function() {
        return [{icon: "new", command: "addAccount"}];
    },

    getManager: function(db) {
        return this.context.getAccountsFactory().createManager(db);
    },

    listItemsCallback: function(list, offset, limit) {
        this.manager.find({}, {limit: limit, offset: offset}, function(accounts) {
            list.mojo.noticeUpdatedItems(offset, accounts);
        }, this.databaseErrorCallback.bind(this));
    },

    itemTapCallback: function(event) {
        this.controller.stageController.pushScene("accountView", this.context, event.item.id);
    }
});