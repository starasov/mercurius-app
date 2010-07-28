CurrencyEditAssistant = Class.create(BaseEditAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, currencyId) {
        $super("currency", applicationContext);

        this.currencyId = currencyId;
        this.factory = applicationContext.getCurrenciesFactory();
        this.manager = null;
    },

    /** @override */
    isNew: function() {
        return !this.currencyId;
    },

    /** @override */
    getForm: function() {
        return this.factory.createForm();
    },

    /** @override */
    getValidator: function() {
        return this.factory.createValidator(this.manager, this.currencyId);
    },

    /** @override */
    initializeManagers: function(db) {
        this.manager = this.factory.createManager(db);
    },

    /** @override */
    loadModel: function(successCallback, errorCallback) {
        if (this.isNew()) {
            successCallback(this.factory.createEmptyModel());
        } else {
            this.manager.findById(this.currencyId, (function(currency) {
                successCallback(currency);
            }).bind(this), errorCallback);
        }
    },

    /** @override */
    saveModel: function(model, successCallback, errorCallback) {
        this.manager.saveOrUpdate(model, successCallback, errorCallback);
    }
});