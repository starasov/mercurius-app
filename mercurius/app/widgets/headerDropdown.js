Widgets.HeaderDropdown = Class.create({
    /** @constructor */
    initialize: function(parentId, name) {
        Mojo.requireString(name);

        this.parentId = parentId ;

        this.model = {
            dropdownId: name + "-header-dropdown",
            dropdownValueContainerId: name + "-header-dropdown-value"
        };
    },

    setup: function(controller) {
        this.controller = controller;

        var headerDropdownDiv = Mojo.View.render({
            template: 'common/headerDropdown',
            object: this.model
        });

        this.controller.get(this.parentId).insert(headerDropdownDiv);
    }
});