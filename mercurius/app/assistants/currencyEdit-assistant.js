CurrencyEditAssistant = Class.create(BaseEditAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, currencyId) {
        $super("currency", applicationContext);

        this.currencyId = currencyId;
        this.factory = applicationContext.getCurrenciesFactory();
        this.mapper = null;
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
        return this.factory.createValidator(this.mapper, this.currencyId);
    },

    /** @override */
    initializeMappers: function(db) {
        this.mapper = this.factory.createMapper(db);
    },

    /** @override */
    loadModel: function(successCallback, errorCallback) {
        if (this.isNew()) {
            successCallback(this.factory.createEmptyModel());
        } else {
            this.mapper.findById(this.currencyId, (function(currency) {
                successCallback(currency);
            }).bind(this), errorCallback);
        }
    },

    /** @override */
    saveModel: function(model, successCallback, errorCallback) {
        this.mapper.saveOrUpdate(model, successCallback, errorCallback);
    }
});