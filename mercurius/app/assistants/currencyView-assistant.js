CurrencyViewAssistant = Class.create({
    initialize: function(applicationContext, currencyId) {
        this.context = applicationContext;
        this.factory = applicationContext.getCurrenciesFactory();

        this.currencyId = currencyId;
        this.manager = null;
        this.lastEditEvent = null;

        this.spinner = new Widgets.FullScreenSpinner({
            parentId: "currency-spinner",
            spinnerContainerId: "currency-spinner-container",
            spinnerWidgetId: "currency-spinner-widget"
        });

        this.commandMenuModel = {
            items: [{label: "Edit", disabled: false, command: "editCurrency"}]
        };
    },

    setup: function() {
        this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.commandMenuModel);

        this.spinner.setup(this.controller);

        this.spinner.show();
        this.context.getDatabase(this._initialize.bind(this), this._handleDatabaseError.bind(this));
    },

    activate: function(event) {
        if (event) {
            switch (event.source) {
            case "currencyEdit":
                this.lastEditEvent = event;
                this._loadCurrency();
            }
        }
    },

    deactivate: function(event) {
    },

    cleanup: function(event) {
    },

    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case "editCurrency":
                this.controller.stageController.pushScene("currencyEdit", this.context, this.currencyId);
                event.stop();
            }
        }
    },

    _initialize: function(db) {
        this.manager = this.factory.createManager(db);
        this._loadCurrency();
    },

    _loadCurrency: function() {
        this.manager.findById(this.currencyId, this._updateView.bind(this), this._handleDatabaseError.bind(this));
    },

    _updateView: function(transaction, currency) {
        this.controller.get("currency-view-title").innerHTML = currency.name;
        this.controller.get("currency-symbol").innerHTML = currency.symbol;
        this.controller.get("currency-rate").innerHTML = Currencies.Fields.rate.toFormData(currency.rate);

        if (currency.home_flag) {
            this.controller.get("title-home-icon").show();
        }

        this.spinner.hide();
    },

    _handleDatabaseError: function(transaction, error) {
        this.spinner.hide();
        this.controller.showAlertDialog({
            title: "Error",
            message: error.message,
            choices: [
                {label: "OK", value: "ok", type: "medium"}
            ]
        });
    }
});