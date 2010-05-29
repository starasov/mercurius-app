AccountListAssistant = Class.create({
    initialize: function(applicationContext) {
        Mojo.Log.info("[AccountListAssistant] - begin");

        this.context = applicationContext;
        this.manager = null;

        this.spinner = new Widgets.FullScreenSpinner({
            parentId: "accounts-spinner",
            spinnerContainerId: "accounts-spinner-container",
            spinnerWidgetId: "accounts-spinner-widget"
        });

//        this.currencyFormatters = {
//            rate: function(rate) { return Mojo.Format.formatNumber(rate, 2); },
//            homeIconStyle: function(_, model) { return model.home_flag ? "block" : "none"; },
//            rateStyle: function(_, model) { return model.home_flag ? "none" : "block"; }
//        };

        this.accountListAttributes = {
            itemTemplate: "accountList/listitem",
            listTemplate: "accountList/listcontainer",
            swipeToDelete: false,
            renderLimit: 20,
            reorderable: false,
//            formatters: this.currencyFormatters,
            itemsCallback: this._handleAccountListCallback.bind(this)
        };

        Mojo.Log.info("[AccountListAssistant] - end");
    },

    setup: function() {
        Mojo.Log.info("[AccountListAssistant][setup] - begin");

        this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
                {items: [{icon: "new", command: "addAccount"}]});

        this.controller.setupWidget("account-list-widget",
                this.accountListAttributes);
        this.listWidget = this.controller.get("account-list-widget");

        this.spinner.setup(this.controller);

        this.currencyItemTapHandler = this._handleAccountItemTap.bind(this);

        Mojo.Log.info("[AccountListAssistant][setup] - end");
    },

    activate: function(event) {
        if (event) {
            switch (event.source) {
            case "accountEdit":
                var expectedNewLength = this.listWidget.mojo.getLength() + event.rowsAdded;
                this.listWidget.mojo.setLengthAndInvalidate(expectedNewLength);
            }
        } else {
            this.listWidget.mojo.setLengthAndInvalidate(this.listWidget.mojo.getLength());
        }

        this.controller.listen("account-list-widget", Mojo.Event.listTap, this.currencyItemTapHandler);
    },

    deactivate: function(event) {
        this.controller.stopListening("account-list-widget", Mojo.Event.listTap, this.currencyItemTapHandler);
    },

    cleanup: function(event) {
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

    _handleAccountListCallback: function(list, offset, limit) {
        Mojo.Log.info("[AccountListAssistant][_handleAccountListCallback] - begin");

        if (this.manager == null) {
            this._setupAccountsManager(list, offset, limit);
        } else {
            this._loadAccounts(list, offset, limit);
        }

        Mojo.Log.info("[AccountListAssistant][_handleAccountListCallback] - end");
    },

    _handleAccountItemTap: function(event) {
        this.controller.stageController.pushScene("accountView", this.context, event.item.id);
    },

    _setupAccountsManager: function(list, offset, limit) {
        this.spinner.show();

        this.context.getDatabase((function(db) {
            this.manager = this.context.getAccountsFactory().createManager(db);
            this._loadAccounts(list, offset, limit);
            this.spinner.hide();
        }).bind(this), this._handleDatabaseError.bind(this));
    },

    _loadAccounts: function(list, offset, limit) {
        this.manager.find({}, {limit: limit, offset: offset}, function(currencies) {
            list.mojo.noticeUpdatedItems(offset, currencies);
        }, this._handleDatabaseError.bind(this));
    },

    _handleDatabaseError: function(transaction, error) {
        this.spinner.hide();
        // ToDO: add some error logic handling here.
    }
});