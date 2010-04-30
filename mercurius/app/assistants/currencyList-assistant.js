CurrencyListAssistant = Class.create({
    initialize: function(applicationContext) {
        Mojo.Log.info("[CurrencyListAssistant] - begin");

        this.context = applicationContext;
        this.manager = null;

        this.spinner = new Widgets.FullScreenSpinner({
            parentId: "currencies-spinner",
            spinnerContainerId: "currencies-spinner-container",
            spinnerWidgetId: "currencies-spinner-widget"
        });

        this.currencyFormatters = {
            rate: function(rate) { return Mojo.Format.formatNumber(rate, 2); },
            homeIconStyle: function(_, model) { return model.home_flag ? "block" : "none"; },
            rateStyle: function(_, model) { return model.home_flag ? "none" : "block"; }
        };

        this.currencyListAttributes = {
            itemTemplate: "currencyList/listitem",
            listTemplate: "currencyList/listcontainer",
            swipeToDelete: false,
            renderLimit: 20,
            reorderable: false,
            formatters: this.currencyFormatters,
            itemsCallback: this._handleCurrencyListCallback.bind(this)
        };
        
        Mojo.Log.info("[CurrencyListAssistant] - end");
    },

    setup: function() {
        Mojo.Log.info("[CurrencyListAssistant][setup] - begin");

        this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
                {items: [{icon: "new", command: "addCurrency"}]});

        this.controller.setupWidget("currency-list-widget",
                this.currencyListAttributes);

        this.spinner.setup(this.controller);

        Mojo.Log.info("[CurrencyListAssistant][setup] - end");
    },

    activate: function(event) {
    },

    deactivate: function(event) {
    },

    cleanup: function(event) {
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

    _handleCurrencyListCallback: function(list, offset, limit) {
        Mojo.Log.info("[CurrencyListAssistant][_handleCurrencyListCallback] - begin");

        if (this.manager == null) {
            this._setupCurrenciesManager(list, offset, limit);
        } else {
            this._loadCurrencies(list, offset, limit);
        }

        Mojo.Log.info("[CurrencyListAssistant][_handleCurrencyListCallback] - end");
    },

    _setupCurrenciesManager: function(list, offset, limit) {
        this.spinner.show();

        this.context.getDatabase((function(db) {
            this.manager = this.context.getCurrenciesFactory().createManager(db);
            this._loadCurrencies(list, offset, limit);
            this.spinner.hide();
        }).bind(this), this._handleDatabaseError.bind(this));
    },

    _loadCurrencies: function(list, offset, limit) {
        this.manager.find({}, {limit: limit, offset: offset}, function(transaction, resultSet) {
            list.mojo.noticeUpdatedItems(offset, resultSet.toArray());
        }, this._handleDatabaseError.bind(this));
    },

    _handleDatabaseError: function(transaction, error) {
        this.spinner.hide();
        // ToDO: add some error logic handling here.
    }
});