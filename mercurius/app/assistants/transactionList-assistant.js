TransactionListAssistant = Class.create(BaseListAssistant, {
    /** @override */
    initialize: function($super, applicationContext) {
        $super("transaction", applicationContext);

        this.dropdown = new Widgets.HeaderDropdown({
            parentId: "transaction-list-title",
            name: "transaction",
            items: this._createDropdownItems([]),
            itemSelectedHandler: this._dropdownItemSelectedHandler.bind(this)
        });

        this.searchParameters = {};
    },

    /** @override */
    setup: function($super) {
        $super();
        this.dropdown.setup(this.controller);
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
            case "addTransaction":
                this.controller.stageController.pushScene("transactionEdit", this.context);
                event.stop();
            }
        }
    },

    getFormatters: function() {
        return {
            amount: function(initial_amount, transaction) {
                var amount = transaction.category_type == Categories.Type.EXPENSE ? -initial_amount : initial_amount;
                return Utils.Formatting.formatCurrency(amount, transaction.currency_symbol);
            },

            date: function(date) {
                return Mojo.Format.formatDate(new Date(date), {date: "default"});
            }
        };
    },

    createCommandMenuItems: function(commandMenu) {
        commandMenu.addItem("new", {icon: "new", command: "addTransaction"});
    },

    initializeFromDatabase: function(db) {
        this.transactionsManager = this.context.getTransactionsFactory().createManager(db);

        this.accountsManager = this.context.getAccountsFactory().createManager(db);
        this.accountsManager.all({}, (function(accounts) {
            var items = this._createDropdownItems(accounts);
            this.dropdown.setItems(items);
        }).bind(this), this.databaseErrorCallback.bind(this));
    },

    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        this.transactionsManager.find(this.searchParameters, {limit: limit, offset: offset}, successCallback, errorCallback);
    },

    itemTapCallback: function(event) {
        this.controller.stageController.pushScene("transactionView", this.context, event.item.id);
    },

    _createDropdownItems: function(accounts) {
        var items = [{label: "All", command: "all", chosen: true}];

        for (var i = 0; i < accounts.length; i++) {
            items.push({label: accounts[i].name, command: accounts[i].id});
        }

        return items;
    },

    _dropdownItemSelectedHandler: function(event) {
        this.log.info("[_dropdownItemSelectedHandler] - event: %s", event);

        this.searchParameters = (event == "all") ? {} : {account_id: event};
        this.invalidateItems();
    }
});