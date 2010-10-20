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

        this.finder = null;
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
        this.mapper = this.context.getTransactionsFactory().createMapper(db);

        this.accountsMapper = this.context.getAccountsFactory().createMapper(db);
        this.accountsMapper.findAll(Database.NO_LIMIT, 0, (function(accounts) {
            var items = this._createDropdownItems(accounts);
            this.dropdown.setItems(items);
        }).bind(this), this.databaseErrorCallback.bind(this));
    },

    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        var finder = this._getFinder();
        finder(limit, offset, successCallback, errorCallback);
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

    _getFinder: function() {
        return this.finder || this.mapper.findAll.bind(this.mapper);
    },

    _dropdownItemSelectedHandler: function(event) {
        this.finder = (event == "all") ?
                this.mapper.findAll.bind(this.mapper) : this.mapper.findForAccount.bind(this.mapper, event);
        
        this.invalidateItems();
    }
});