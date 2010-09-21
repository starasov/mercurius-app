TransactionEditAssistant = Class.create(BaseEditAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, transactionId) {
        $super("transaction", applicationContext);

        this.transactionId = transactionId;

        this.transactionsFactory = applicationContext.getTransactionsFactory();
        this.accountsFactory = applicationContext.getAccountsFactory();
        this.categoriesFactory = applicationContext.getCategoriesFactory();

        this.transactionsManager = null;
        this.accountsManager = null;
        this.categoriesManager = null;

        this.transaction = null;
        this.accounts = null;
    },

    /** @override */
    setup: function($super) {
        $super();
        this.categoryPicker = this.controller.get("transaction-category-field");

        this.stateChangedCallback = (function() {
            Mojo.Log.info("[this.stateChangedCallback]");
        }).bind(this);

        this.form.addStateChangedCallback(this.stateChangedCallback);
    },

    /** @override */
    activate: function($super, event) {
        $super(event);
        this.categoryPicker.mojo.setContext(this.context);
    },

    /** @override */
    isNew: function() {
        return !this.transactionId;
    },

    /** @override */
    getForm: function() {
        return this.transactionsFactory.createForm();
    },

    /** @override */
    getValidator: function() {
        return this.transactionsFactory.createValidator();
    },

    /** @override */
    initializeManagers: function(db) {
        this.transactionsManager = this.transactionsFactory.createManager(db);
        this.accountsManager = this.accountsFactory.createManager(db);
        this.categoriesManager = this.categoriesFactory.createManager(db);
    },

    /** @override */
    loadModel: function(successCallback, errorCallback) {
        var chain = new Utils.AsyncChain((function() {
            successCallback(this.transaction);
        }).bind(this), errorCallback);

        chain.add(this._loadTransaction.bind(this));
        chain.add(this._loadAccounts.bind(this));
        chain.add(this._createAccountChoices.bind(this));
        chain.add(this._createTypeChoices.bind(this));

        chain.call();
    },

    /** @override */
    saveModel: function(model, successCallback, errorCallback) {
        this.transactionsManager.saveOrUpdate(model, successCallback, errorCallback);
    },

    /** @private */
    _loadTransaction: function(successCallback, errorCallback) {
        if (this.isNew()) {
            this.transaction = this.transactionsFactory.createEmptyModel();
            successCallback();
        } else {
            this.transactionsManager.findById(this.transactionId, (function(transaction) {
                this.transaction = transaction;
                successCallback();
            }).bind(this), errorCallback);
        }
    },

    /** @private */
    _loadAccounts: function(successCallback, errorCallback) {
        this.accountsManager.all({}, (function(accounts) {
            this.accounts = accounts;
            successCallback();
        }).bind(this), errorCallback);
    },

    /** @private */
    _createAccountChoices: function(successCallback, errorCallback) {
        this.transaction.account_choices = Forms.Fields.toChoices(this.accounts, "name", "id");
        successCallback();
    },

    /** @private */
    _createTypeChoices: function(successCallback, errorCallback) {
        this.transaction.type_choices = Transactions.Type.toChoices();
        successCallback();
    }
});