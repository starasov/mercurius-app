Widgets.HeaderDropdown = Class.create({
    /**
     * @constructor
     *
     * @param model - header dropdown model. A hash with following entries:
     *
     *                'parentId' (required) - specifies target element where dropdown widget will
     *                be added and rendered;
     *
     *                'name' (required) - some unique name of dropdown (for purposes when multiple
     *                dropdowns coexist in the same document);
     *
     *                'items' (required) - items to be displayed;
     *
     *                'itemSelectedHandler' (required) - handle dropdown item selection event; 
     */
    initialize: function(model) {
        Mojo.requireString(model.parentId);
        Mojo.requireString(model.name);
        Mojo.require(model.items);
        Mojo.require(model.itemSelectedHandler);

        this.model = model;

        this.viewModel = {
            dropdownId: this.model.name + "-header-dropdown",
            dropdownArrowId: this.model.name + "-header-dropdown-arrow",
            dropdownValueContainerId: this.model.name + "-header-dropdown-value"
        };

        this.dropdownTapHandler = this._handleTap.bind(this);
    },

    setup: function(controller) {
        this.controller = controller;

        var headerDropdownDiv = Mojo.View.render({
            template: 'common/headerDropdown',
            object: this.viewModel
        });

        this.controller.get(this.model.parentId).insert(headerDropdownDiv);
        this._updateTitle();
    },

    activate: function() {
        this.controller.get(this.viewModel.dropdownId).observe(Mojo.Event.tap, this.dropdownTapHandler);
    },

    deactivate: function() {
        this.controller.get(this.viewModel.dropdownId).stopObserving(Mojo.Event.tap, this.dropdownTapHandler);
    },

    _handleTap: function(event) {
        this.controller.popupSubmenu({
            onChoose: this._handleItemChosen.bind(this),
            placeNear: event.target,
            items: this.model.items
        });
    },

    _handleItemChosen: function(event) {
        if (event) {
            this.model.itemSelectedHandler(event);
            this._selectItem(event);
            this._updateTitle();
        }
    },

    _updateTitle: function() {
        var item = this._findSelectedItem();
        this.controller.get(this.viewModel.dropdownValueContainerId).innerHTML = item.label;
    },

    _selectItem: function(command) {
        var selectedItem = this._findSelectedItem();
        var currentItem = this._findItemByCommand(command);

        selectedItem.chosen = false;
        currentItem.chosen = true;
    },

    _findSelectedItem: function() {
        return this._findItem(function(item) {
            return item.chosen;
        });
    },

    _findItemByCommand: function(command) {
        return this._findItem(function(item) {
            return command == item.command;
        });
    },

    _findItem: function(predicate) {
        for (var i = 0; i < this.model.items.length; i++) {
            var item = this.model.items[i];
            if (predicate(item)) {
                return item;
            }
        }

        Mojo.require(false, "Predicate doesn't matched for current items.");
    }
});