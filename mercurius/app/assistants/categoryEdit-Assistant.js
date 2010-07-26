CategoryEditAssistant = Class.create(BaseEditAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, category) {
        $super("category", applicationContext);

        this.category = category;
        this.factory = applicationContext.getCategoriesFactory();
        this.manager = null;
    },

    setup: function($super) {
        $super();
        this.form.addStateChangedCallback(this._categoryModelChangedHandler.bind(this));
    },

    /** @override */
    isNew: function() {
        return !this.category.id;
    },

    /** @override */
    getForm: function() {
        return this.factory.createForm();
    },

    /** @override */
    getValidator: function() {
        return this.factory.createValidator(this.manager);
    },

    /** @override */
    initializeManagers: function(db) {
        this.manager = this.factory.createManager(db);
    },

    /** @override */
    loadModel: function(successCallback, errorCallback) {
        this.manager.findTopCategoriesByType(this.category.type, {}, (function(categories) {
            this.category.parent_choices = this._createParentChoices(categories);
            this.category.type_choices = Categories.Type.toChoices();
            successCallback(this.category);
        }).bind(this), errorCallback);
    },

    /** @override */
    saveModel: function(model, successCallback, errorCallback) {
        this.manager.saveOrUpdate(model, successCallback, errorCallback);
    },

    _categoryModelChangedHandler: function(form) {
        var currentType = form.getFieldValue("type");
        if (currentType != this.category.type) {
            this.category = form.getModel();
            this.category.parent_id = 0;
            this.updateForm();
        }
    },

    /** @private */
    _createParentChoices: function(parentCategories) {
        return [{label: "[No Parent]", value: 0}].concat(Models.Fields.toChoices(parentCategories, "name", "id"));
    }
});