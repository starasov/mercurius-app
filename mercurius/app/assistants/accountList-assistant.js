AccountListAssistant = Class.create(BaseListAssistant, {
    ACCOUNT_FILTERS: {
        all: "all",
        open: "findOpenAccounts"
    },

    /** 
     * @constructor
     * @override
     */
    initialize: function($super, applicationContext) {
        $super("account", applicationContext);

        this.dropdown = new Widgets.HeaderDropdown({
            parentId: "account-list-title",
            name: "account",
            items: [{label: "All", command: "all"}, {label: $L("Open"), command: "open", chosen: true}],
            itemSelectedHandler: this._dropdownItemSelectedHandler.bind(this)
        });

        this.filter = this.ACCOUNT_FILTERS["open"];
    },

    /** @override */
    setup: function($super) {
        $super();
        this.dropdown.setup(this.controller);
    },

    /** @override */
    activate: function($super, event) {
        if (event) {
            switch (event.source) {
            case "accountEdit":
                var expectedNewLength = this.listWidget.mojo.getLength() + event.rowsAdded;
                this.listWidget.mojo.setLengthAndInvalidate(expectedNewLength);
            }
        }

        this.dropdown.activate();
        $super(event);
    },

    /** @override */
    deactivate: function($super, event) {
        $super(event);
        this.dropdown.deactivate();
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

    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        this.manager[this.filter]({limit: limit, offset: offset}, successCallback, errorCallback);
    },

    itemTapCallback: function(event) {
        this.controller.stageController.pushScene("accountView", this.context, event.item.id);
    },

    _dropdownItemSelectedHandler: function(event) {
        this.log.info("[_dropdownItemSelectedHandler] - event: %s", event);
        this.filter = this.ACCOUNT_FILTERS[event];
        this.invalidateItems();
    }
});