CategoryListAssistant = Class.create(BaseListAssistant, {
    /**
     * @constructor
     * @override
     */
    initialize: function($super, applicationContext) {
        $super("category", applicationContext);

        this.subcategoryListAttrs = {
            listTemplate: "common/listcontainer",
            itemTemplate: "categoryList/subcategorylistitem",
            itemsCallback: this._subcategoriesListItemsCallback.bind(this),
            addItemLabel: $L("Add...")
        };

        this.subcategoryListDrawerAttrs = {
            unstyled: false
        };

        this.categoryAddHandler = this._categoryAddHandler.bind(this);

        this.dropdown = new Widgets.HeaderDropdown({
            parentId: "category-list-title",
            name: "category",
            items: [{label: $L("Income"), command: "income"}, {label: $L("Expense"), command: "expense", chosen: true}],
            itemSelectedHandler: this._dropdownItemSelectedHandler.bind(this)
        });
        
        this.categoryType = Categories.Type.EXPENSE;
    },

    /** @override */
    setup: function($super) {
        this.listAttributes.addItemLabel = $L("Add...");

        $super();

        this.dropdown.setup(this.controller);

        this.controller.setupWidget("subcategoryList", this.subcategoryListAttrs);
        this.controller.setupWidget("subcategoryListDrawer", this.subcategoryListDrawerAttrs);
    },

    /** @override */
    activate: function($super, event) {
        if (event) {
            switch (event.source) {
            case "categoryEdit":
                this.invalidateItems();
            }
        }

        $super(event);

        this.dropdown.activate();
        this.controller.listen("category-list-widget", Mojo.Event.listAdd, this.categoryAddHandler);
    },

    /** @override */
    deactivate: function($super, event) {
        $super(event);

        this.dropdown.cleanup();
        this.controller.stopListening("category-list-widget", Mojo.Event.listAdd, this.categoryAddHandler);
    },

    /** @override */
    initializeFromDatabase: function(db) {
        this.manager = this.context.getCategoriesFactory().createManager(db);
    },

    /** @override */
    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        this.manager.findTopCategoriesByType(this.categoryType, {limit: limit, offset: offset}, successCallback, errorCallback);
    },

    /** @override */
    itemTapCallback: function(event) {
        var name = this._getTargetName(event);

        switch (name) {
        case "subcategoriesToggleButton":
            var drawers = this.controller.document.getElementsByName("subcategoryListDrawer");
            drawers[event.index].mojo.toggleState();
            break;
        }
    },

    /**
     * Retrieves target element 'name' attribute value from event model.
     *
     * @param event an event model.
     */
    _getTargetName: function(event) {
        var target = event.originalEvent.target;
        return target.getAttribute("name");
    },

    /**
     * Dynamically loads subcategories of particular parent (top) category.
     * Automatically called by 'subcategoryList' widget.
     *
     * @param list subcategories list widget
     * @param offset subcategories load offset
     * @param limit  subcategories load limit
     */
    _subcategoriesListItemsCallback: function(list, offset, limit) {
        var parent_id = parseInt(list.getAttribute("x-parent-id"));

        this.spinner.show();
        this.manager.findChildCategories(parent_id, {limit: limit, offset: offset}, (function(models) {
            this.controller.setupWidget("childrenField", {modelProperty: "name"});
            list.mojo.noticeUpdatedItems(offset, models);
            this.spinner.hide();
        }).bind(this), this.databaseErrorCallback.bind(this));
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
    },

    _dropdownItemSelectedHandler: function(event) {
        this.categoryType = event == "expense" ? Categories.Type.EXPENSE : Categories.Type.INCOME;
        this.invalidateItems();
    }
});