CurrencyEditAssistant = Class.create({
    initialize: function(applicationContext, currencyId) {
        this.context = applicationContext;
        this.factory = applicationContext.getCurrenciesFactory();

        this.currencyId = currencyId;

        this.manager = null;
        this.validator = null;
        this.form = this.factory.createForm();

        this.spinner = new Widgets.FullScreenSpinner("currency");

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

        if (this.currencyId) {
            this.validator = this.factory.createEditCurrencyValidator(this.manager);
            this._loadCurrency();
        } else {
            this.validator = this.factory.createNewCurrencyValidator(this.manager);
            this.form.update(this.factory.createEmptyModel());
            this.spinner.hide();
        }
    },

    _loadCurrency: function() {
        this.manager.findById(this.currencyId, (function(currency) {
            this.form.update(currency);
            this.spinner.hide();
        }).bind(this), this._handleDatabaseError.bind(this));
    },

    _validateAndSave: function() {
        this.spinner.show();
        this.validator.validate(this.form.modelData, this._save.bind(this),
                this._handleValidationError.bind(this));
    },

    _save: function() {
        var currency = this.form.getModel();
        this.manager.saveOrUpdate(currency, (function(id) {
            this.controller.stageController.popScene({source: "currencyEdit", id: id, rowsAdded: 1});
        }).bind(this), this._handleDatabaseError.bind(this));
    },

    _handleValidationError: function(key, message) {
        this.spinner.hide();
        this.controller.showAlertDialog({
            title: "Please correct '" + key + "' field",
            message: message,
            choices: [
                {label: "OK", value: "ok", type: "medium"}
            ]
        });
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