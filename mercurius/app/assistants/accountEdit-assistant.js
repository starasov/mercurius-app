AccountEditAssistant = Class.create({
    initialize: function(applicationContext, accountId) {
        this.context = applicationContext;

        this.accountsFactory = applicationContext.getAccountsFactory();
        this.currenciesFactory = applicationContext.getCurrenciesFactory();

        this.accountsManager = null;
        this.currenciesManager = null;

        this.accountId = accountId;
        this.currencies = null;

        this.validator = null;
        this.form = this.accountsFactory.createForm();

        this.spinner = new Widgets.FullScreenSpinner("account");

        this.commandMenuModel = {
            items: [{label: "Done", disabled: false, command: "saveAccount"}]
        };
    },

    setup: function() {
        var title = this.accountId ? $L("Edit Account") : $L("New Account");
        this.controller.get("account-edit-title").innerHTML = title;

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
            case "saveAccount":
                this._validateAndSave();
                event.stop();
            }
        }
    },

    _initialize: function(db) {
        this.accountsManager = this.accountsFactory.createManager(db);
        this.currenciesManager = this.currenciesFactory.createManager(db);

        var chain = new Utils.AsyncChain(this.spinner.hide.bind(this.spinner), 
                this._handleDatabaseError.bind(this));

        chain.add(this._loadAccount.bind(this));
        chain.add(this._loadCurrencies.bind(this));
        chain.add(this._updateForm.bind(this));

        chain.call();

//        else {
//            this.validator = this.factory.createNewAccountValidator(this.manager);
//            this.form.update(this.factory.createEmptyModel());
//            this.spinner.hide();
//        }
    },

    _loadAccount: function(successCallback, errorCallback) {
        if (this.accountId) {
            this.accountsManager.findById(this.accountId, (function(account) {
                this.account = account;
                successCallback();
            }).bind(this), errorCallback);
        }
    },

    _loadCurrencies: function(successCallback, errorCallback) {
        this.currenciesManager.all({}, (function(currencies) {
            this.currencies = currencies;
            successCallback();
        }).bind(this), errorCallback);
    },

    _updateForm: function(successCallback, errorCallback) {
        this.account.currency_choices = Models.Fields.toChoices(this.currencies, "name", "id");
        this.form.update(this.account);
        successCallback();
    },

    _validateAndSave: function() {
        this.spinner.show();
        this.validator.validate(this.form.modelData, this._save.bind(this),
                this._handleValidationError.bind(this));
    },

    _save: function() {
        var account = this.form.getModel();
        this.currenciesManager.saveOrUpdate(account, (function(id) {
            this.controller.stageController.popScene({source: "accountEdit", id: id, rowsAdded: 1});
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