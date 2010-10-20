CategoryEditAssistant = Class.create(BaseEditAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, category) {
        $super("category", applicationContext);

        this.category = category;
        this.factory = applicationContext.getCategoriesFactory();
        this.mapper = null;
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
        return this.factory.createValidator(this.mapper, this.category.id);
    },

    /** @override */
    initializeMappers: function(db) {
        this.mapper = this.factory.createMapper(db);
    },

    /** @override */
    loadModel: function(successCallback, errorCallback) {
        this.mapper.findTopCategoriesByType(this.category.type, Database.NO_LIMIT, 0, (function(categories) {
            this.category.parent_choices = this._createParentChoices(categories);
            this.category.type_choices = Categories.Type.toChoices();
            successCallback(this.category);
        }).bind(this), errorCallback);
    },

    /** @override */
    saveModel: function(model, successCallback, errorCallback) {
        this.mapper.saveOrUpdate(model, successCallback, errorCallback);
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
        return [{label: "[No Parent]", value: 0}].concat(Forms.Fields.toChoices(parentCategories, "name", "id"));
    }
});