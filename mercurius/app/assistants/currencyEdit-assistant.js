CurrencyEditAssistant = Class.create({
    initialize: function(applicationContext, currencyId) {
        this.context = applicationContext;
        this.factory = applicationContext.getCurrenciesFactory();

        this.currencyId = null;

        this.manager = null;
        this.validator = null;
        this.form = this.factory.createForm();

        this.spinner = new Widgets.FullScreenSpinner({
            parentId: "currency-spinner",
            spinnerContainerId: "currency-spinner-container",
            spinnerWidgetId: "currency-spinner-widget"
        });

        this.commandMenuModel = {
            items: [{label: "Done", disabled: false, command: "saveCurrency"}]
        };
    },

    setup: function() {
        var title = this.currencyId ? $L("Edit Currency") : $L("New Currency"); 
        this.controller.get("currency-edit-title").innerHTML = title;

        this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.commandMenuModel);

        this.form.setup(this.controller);
        this.spinner.setup(this.controller);

        this.spinner.show();
        this.context.getDatabase(this._initialize.bind(this), this._handleDatabaseError.bind(this));
    },

    activate: function(event) {
    },

    deactivate: function(event) {
    },

    cleanup: function(event) {
        this.form.cleanup();
    },

    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case "saveCurrency":
                this._validateAndSave();
                event.stop();
            }
        }
    },

    _initialize: function(db) {
        this.manager = this.factory.createManager(db);
        this.validator = this.factory.createValidator(this.manager);

        if (this.currencyId) {
            this._loadCurrency();
        } else {
            this.form.update(this.factory.createEmptyModel());
            this.spinner.hide();
        }
    },

    _loadCurrency: function() {
        this.manager.findById(this.currencyId, (function(transaction, currency) {
            this.form.update(currency);
            this.spinner.hide();
        }).bind(this), this._handleDatabaseError.bind(this));
    },

    _validateAndSave: function() {
        this.spinner.show();

        this.validator.validate(this.form.modelData, (function() {
            // ToDO
            this.spinner.hide();
        }).bind(this), (function(key, message) {
            // ToDO
            this.spinner.hide();
        }).bind(this));
    },

    _handleDatabaseError: function(transaction, error) {
        this.spinner.hide();
        // ToDO: add some error logic handling here.
    }
});