AccountListAssistant = Class.create(BaseListAssistant, {
    ACCOUNT_FILTERS: {
        all: {
            query: "findAllWithBalance",
            divider: function(account) {
                return account.closed_flag ? "Closed" : "Open";
            }
        },

        open: {
            query: "findOpenWithBalance",
            divider: Prototype.emptyFunction
        }
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

        this.filter = this.ACCOUNT_FILTERS["open"].query;
        this.dividerFunction = this.ACCOUNT_FILTERS["open"].divider;
    },

    /** @override */
    setup: function($super) {
        this.listAttributes.dividerFunction = (function(account) {
            return this.dividerFunction(account); }).bind(this);
        this.listAttributes.dividerTemplate = "accountList/divider";

        $super();
        
        this.dropdown.setup(this.controller);
    },

    /** @override */
    activate: function($super, event) {
        if (event) {
            switch (event.source) {
            case "accountView":
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
            balance: function(value, model) {
                return Object.isUndefined(value) ? value :
                        Accounts.Fields.opening_balance.toViewString(value, model.currency_symbol);
            }
        };
    },

    createCommandMenuItems: function(commandMenu) {
        commandMenu.addItem("addAccount", {icon: "new", command: "addAccount"});
    },

    initializeFromDatabase: function(db) {
        this.mapper = this.context.getAccountsFactory().createMapper(db);
    },

    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        this.mapper[this.filter](limit, offset, successCallback, errorCallback);
    },

    itemTapCallback: function(event) {
        this.controller.stageController.pushScene("accountView", this.context, event.item.id);
    },

    _dropdownItemSelectedHandler: function(event) {
        this.log.info("[_dropdownItemSelectedHandler] - event: %s", event);

        this.filter = this.ACCOUNT_FILTERS[event].query;
        this.dividerFunction = this.ACCOUNT_FILTERS[event].divider; 

        this.invalidateItems();
    }
});