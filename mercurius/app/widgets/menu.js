Widgets.Menu = Class.create({
    /** @constructor */
    initialize: function(menuType, menuAttributes) {
        this.menuType = menuType;
        this.menuAttributes = menuAttributes;

        this.itemsMapping = {};
        this.visible = true;

        this.menuModel = {
            visible: this.visible,
            items: []
        }
    },

    addItem: function(id, model) {
        this.itemsMapping[id] = model;
    },

    setup: function(controller) {
        this.controller = controller;
        this.menuModel.items = this._createMenuItems();
        this.controller.setupWidget(this.menuType, this.menuAttributes, this.menuModel);
    },

    disableItem: function(id) {
        this.itemsMapping[id].disabled = true;
        this.update();
    },

    enableItem: function(id) {
        this.itemsMapping[id].disabled = false;
        this.update();
    },

    update: function() {
        Mojo.require(this.controller);
        this.controller.modelChanged(this.menuModel);
    },

    _createMenuItems: function() {
        var items = [];

        for (var id in this.itemsMapping) {
            items.push(this.itemsMapping[id]);
        }

        return items;
    }
});