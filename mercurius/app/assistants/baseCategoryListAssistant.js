BaseCategoryListAssistant = Class.create(BaseListAssistant, {
    /**
     * @constructor
     * @override
     */
    initialize: function($super, applicationContext) {
        $super("category", applicationContext);

        this.subcategoryListAttrs = {
            listTemplate: "common/listcontainer",
            itemTemplate: "categoryList/subcategorylistitem",
            itemsCallback: this._subcategoriesListItemsCallback.bind(this)
        };

        this.subcategoryListDrawerAttrs = {
            unstyled: false
        };

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
        $super();

        this.dropdown.setup(this.controller);

        this.controller.setupWidget("subcategoryList", this.subcategoryListAttrs);
        this.controller.setupWidget("subcategoryListDrawer", this.subcategoryListDrawerAttrs);
    },

    /** @override */
    activate: function($super, event) {
        $super(event);
        this.dropdown.activate();
    },

    /** @override */
    deactivate: function($super, event) {
        $super(event);
        this.dropdown.deactivate();
    },

    /** @override */
    initializeFromDatabase: function(db) {
        this.mapper = this.context.getCategoriesFactory().createMapper(db);
    },

    /** @override */
    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        this.mapper.findTopCategoriesByType(this.categoryType, limit, offset, successCallback, errorCallback);
    },

    /** @override */
    itemTapCallback: function(event) {
        var name = this._getTargetName(event);

        switch (name) {
        case "subcategoriesToggleButton":
            var drawers = this.controller.document.getElementsByName("subcategoryListDrawer");
            drawers[event.index].mojo.toggleState();
            break;
        default:
            this.categoryTapCallback(event.item);
        }
    },

    /** @abstract */
    categoryTapCallback: function(category) {
        Mojo.require(false, "Not implemented.");
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
        this.mapper.findChildCategories(parent_id, limit, offset, (function(models) {
            this.controller.setupWidget("childrenField", {modelProperty: "name"});
            list.mojo.noticeUpdatedItems(offset, models);
            this.spinner.hide();
        }).bind(this), this.databaseErrorCallback.bind(this));
    },

    _dropdownItemSelectedHandler: function(event) {
        this.categoryType = event == "expense" ? Categories.Type.EXPENSE : Categories.Type.INCOME;
        this.invalidateItems();
    }
});