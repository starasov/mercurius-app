CategoryListAssistant = Class.create(BaseCategoryListAssistant, {
    /**
     * @constructor
     * @override
     */
    initialize: function($super, applicationContext) {
        $super(applicationContext);

        this.listAttributes.addItemLabel = $L("Add...");
        this.subcategoryListAttrs.addItemLabel = $L("Add...");

        this.categoryAddHandler = this._categoryAddHandler.bind(this);
    },

    /** @override */
    activate: function($super, event) {
        Mojo.Log.info("event: %j", event);

        if (event) {
            switch (event.source) {
            case "categoryEdit":
            case "categoryView":
                this.invalidateItems();
                break;
            }
        }

        $super(event);
        this.controller.listen("category-list-widget", Mojo.Event.listAdd, this.categoryAddHandler);
    },

    /** @override */
    deactivate: function($super, event) {
        $super(event);
        this.controller.stopListening("category-list-widget", Mojo.Event.listAdd, this.categoryAddHandler);
    },

    /** @override */
    categoryTapCallback: function(category) {
        this.controller.stageController.pushScene("categoryView", this.context, category.id);
    },

    /**
     * Handles add item events of top categories and subcategory lists.
     *
     * When event target (list instance) has 'x-parent-id' attribute (see listitem.html template)
     * it designates that it's subcategory list event of parent category with id stored under the
     * attribute. Otherwise it's event of top categories list.
     *
     * @param event
     */
    _categoryAddHandler: function(event) {
        var parentId = parseInt(event.target.getAttribute("x-parent-id")) || 0;
        var category = {name: "", parent_id: parentId, type: this.categoryType};
        this.controller.stageController.pushScene("categoryEdit", this.context, category);
    }
});