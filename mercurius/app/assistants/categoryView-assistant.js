CategoryViewAssistant = Class.create(BaseViewAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, applicationContext, categoryId) {
        $super("category", applicationContext, categoryId);
        this.category = null;
    },

    /** @override */
    createMapper: function(db) {
        return this.context.getCategoriesFactory().createMapper(db);
    },

    /** @override */
    prepareModel: function(category, successCallback, errorCallback) {
        this.category = category;

        category.type_name = Categories.Type.getDisplayName(category.type); 

        if (category.parent_id) {
            this.manager.findById(category.parent_id, function(parent) {
                category.parent_name = parent.name;
                successCallback();
            }, errorCallback);
        } else {
            category.parent_name = $L("No Parent");
            successCallback();
        }
    },

    /** @override */
    updateView: function(category) {
        this.controller.get("category-view-title").innerHTML = category.name;
        this.controller.get("category-parent-name").innerHTML = category.parent_name;
        this.controller.get("category-type-name").innerHTML = category.type_name;
    },

    /** @override */
    editModel: function() {
        this.controller.stageController.pushScene(this.editViewName, this.context, this.category);
    }
});