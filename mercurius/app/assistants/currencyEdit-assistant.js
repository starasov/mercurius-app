CurrencyEditAssistant = Class.create(BaseEditAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, currencyId) {
        $super("currency", applicationContext, currencyId);

        this.factory = applicationContext.getCurrenciesFactory();
        this.manager = null;
    },

    /** @override */
    getForm: function() {
        return this.factory.createForm();
    },

    /** @override */
    getValidator: function() {
        if (this.isNew()) {
            return this.factory.createNewCurrencyValidator(this.manager);
        } else {
            return this.factory.createEditCurrencyValidator(this.manager);
        }
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
            this.manager.findById(this.modelId, (function(currency) {
                successCallback(currency);
            }).bind(this), errorCallback);
        }
    },

    /** @override */
    saveModel: function(model, successCallback, errorCallback) {
        this.manager.saveOrUpdate(model, successCallback, errorCallback);
    }
});