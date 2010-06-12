AccountEditAssistant = Class.create(BaseEditAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, accountId) {
        $super("account", applicationContext, accountId);

        this.accountsFactory = applicationContext.getAccountsFactory();
        this.currenciesFactory = applicationContext.getCurrenciesFactory();

        this.accountsManager = null;
        this.currenciesManager = null;

        this.currencies = null;
    },

    /** @override */
    getForm: function() {
        return this.accountsFactory.createForm();
    },

    /** @override */
    getValidator: function() {
        return this.accountsFactory.createValidator();
    },

    /** @override */
    initializeManagers: function(db) {
        this.accountsManager = this.accountsFactory.createManager(db);
        this.currenciesManager = this.currenciesFactory.createManager(db);
    },

    /** @override */
    loadModel: function(successCallback, errorCallback) {
        var chain = new Utils.AsyncChain((function() {
            successCallback(this.account);
        }).bind(this), errorCallback);

        chain.add(this._loadAccount.bind(this));
        chain.add(this._loadCurrencies.bind(this));
        chain.add(this._createCurrencyChoices.bind(this));

        chain.call();
    },

    /** @override */
    saveModel: function(model, successCallback, errorCallback) {
        this.accountsManager.saveOrUpdate(model, successCallback, errorCallback);
    },

    /** @private */
    _loadAccount: function(successCallback, errorCallback) {
        if (this.isNew()) {
            this.account = this.accountsFactory.createEmptyModel();
            successCallback();
        } else {
            this.accountsManager.findById(this.modelId, (function(account) {
                this.account = account;
                successCallback();
            }).bind(this), errorCallback);
        }
    },

    /** @private */
    _loadCurrencies: function(successCallback, errorCallback) {
        this.currenciesManager.all({}, (function(currencies) {
            this.currencies = currencies;
            successCallback();
        }).bind(this), errorCallback);
    },

    /** @private */
    _createCurrencyChoices: function(successCallback, errorCallback) {
        this.account.currency_choices = Models.Fields.toChoices(this.currencies, "name", "id");
        successCallback();
    }
});