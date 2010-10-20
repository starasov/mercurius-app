AccountEditAssistant = Class.create(BaseEditAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, accountId) {
        $super("account", applicationContext);

        this.accountId = accountId;
        this.accountsFactory = applicationContext.getAccountsFactory();
        this.currenciesFactory = applicationContext.getCurrenciesFactory();

        this.accountsMapper = null;
        this.currenciesMapper = null;

        this.account = null;
        this.currencies = null;
    },

    /** @override */
    isNew: function() {
        return !this.accountId;
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
    initializeMappers: function(db) {
        this.accountsMapper = this.accountsFactory.createMapper(db);
        this.currenciesMapper = this.currenciesFactory.createMapper(db);
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
        this.accountsMapper.saveOrUpdate(model, successCallback, errorCallback);
    },

    /** @private */
    _loadAccount: function(successCallback, errorCallback) {
        if (this.isNew()) {
            this.account = this.accountsFactory.createEmptyModel();
            successCallback();
        } else {
            this.accountsMapper.findById(this.accountId, (function(account) {
                this.account = account;
                successCallback();
            }).bind(this), errorCallback);
        }
    },

    /** @private */
    _loadCurrencies: function(successCallback, errorCallback) {
        this.currenciesMapper.findAll(Database.NO_LIMIT, 0, (function(currencies) {
            this.currencies = currencies;
            successCallback();
        }).bind(this), errorCallback);
    },

    /** @private */
    _createCurrencyChoices: function(successCallback, errorCallback) {
        this.account.currency_choices = Forms.Fields.toChoices(this.currencies, "name", "id");
        successCallback();
    }
});