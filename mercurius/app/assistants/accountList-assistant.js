AccountListAssistant = Class.create(BaseListAssistant, {
    initialize: function($super, applicationContext) {
        $super("account", applicationContext);
        this.dropdown = new Widgets.HeaderDropdown("account-list-title", "account");
    },

    /** @override */
    setup: function($super) {
        $super();
        this.dropdown.setup(this.controller);
    },

    activate: function($super, event) {
        if (event) {
            switch (event.source) {
            case "accountEdit":
                var expectedNewLength = this.listWidget.mojo.getLength() + event.rowsAdded;
                this.listWidget.mojo.setLengthAndInvalidate(expectedNewLength);
            }
        }

        $super(event);
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
            opening_balance: function(value, model) {
                return Object.isUndefined(value) ? value :
                        Accounts.Fields.opening_balance.toViewString(value, model.currency.symbol);
            },

            itemStyle: function(_, model) {
                return model.closed_flag ? "palm-textfield-disabled" : null;
            }
        };
    },

    createCommandMenuItems: function(commandMenu) {
        commandMenu.addItem("addAccount", {icon: "new", command: "addAccount"});
    },

    createManager: function(db) {
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