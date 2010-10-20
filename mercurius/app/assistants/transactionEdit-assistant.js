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

        this.transactionsMapper = null;
        this.accountsMapper = null;

        this.transaction = null;
        this.accounts = null;
    },

    /** @override */
    setup: function($super) {
        $super();
        this.categoryPicker = this.controller.get("transaction-category-field");
    },

    /** @override */
    activate: function($super, event) {
        $super(event);
        this.categoryPicker.mojo.setContext(this.context);
        this.categoryPicker.mojo.setListener(this._adjustAmountSign.bind(this));
    },

    /** @override */
    deactivate: function($super, event) {
        $super(event);
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
    initializeMappers: function(db) {
        this.transactionsMapper = this.transactionsFactory.createMapper(db);
        this.accountsMapper = this.accountsFactory.createMapper(db);
    },

    /** @override */
    loadModel: function(successCallback, errorCallback) {
        var chain = new Utils.AsyncChain((function() {
            successCallback(this.transaction);
        }).bind(this), errorCallback);

        chain.add(this._loadTransaction.bind(this));
        chain.add(this._loadAccounts.bind(this));
        chain.add(this._createAccountChoices.bind(this));

        chain.call();
    },

    /** @override */
    saveModel: function(model, successCallback, errorCallback) {
        this.transactionsMapper.saveOrUpdate(model, successCallback, errorCallback);
    },

    /** @private */
    _loadTransaction: function(successCallback, errorCallback) {
        if (this.isNew()) {
            this.transaction = this.transactionsFactory.createEmptyModel();
            successCallback();
        } else {
            this.transactionsMapper.findById(this.transactionId, (function(transaction) {
                this.transaction = transaction;
                successCallback();
            }).bind(this), errorCallback);
        }
    },

    /** @private */
    _loadAccounts: function(successCallback, errorCallback) {
        this.accountsMapper.findAll(Database.NO_LIMIT, 0, (function(accounts) {
            this.accounts = accounts;
            successCallback();
        }).bind(this), errorCallback);
    },

    /** @private */
    _createAccountChoices: function(successCallback, errorCallback) {
        this.transaction.account_choices = Forms.Fields.toChoices(this.accounts, "name", "id");
        successCallback();
    },

    _adjustAmountSign: function(pickedCategory) {
        var amount = this.form.getFieldValue("amount");
        if (isNaN(amount)) {
            return;
        }

        var isIncome = pickedCategory.type == Categories.Type.INCOME;

        var adjustedAmount =  isIncome ? Math.abs(amount) : -Math.abs(amount);
        this.form.setFieldValue("amount", adjustedAmount);
    }
});