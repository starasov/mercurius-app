Widgets.FullScreenSpinner = Class.create({
    /**
     * @param name {hash} a hash with 'parentId' 'spinnerContainerId' and 'spinnerWidgetId'
     *                     keys that specify parent element for the widget, spinner container
     *                     div id and spinner widget div id appropriately.
     */
    initialize: function(name) {
        Mojo.requireString(name);

        this.parentId = name + "-spinner";

        this.model = {
            spinnerContainerId: name + "-spinner-container",
            spinnerWidgetId: name + "-spinner-widget"
        };
    },

    setup: function(controller) {
        this.controller = controller;

        var spinnerContainerDiv = Mojo.View.render({
            template: 'common/fullScreenSpinner',
            object: this.model
        });

        this.controller.get(this.parentId).update(spinnerContainerDiv);

        this.spinnerModel = {spinning : true};

        this.controller.setupWidget(this.model.spinnerWidgetId,
            {spinnerSize : Mojo.Widget.spinnerLarge}, this.spinnerModel);
    },

    show: function() {
        this.controller.get(this.model.spinnerContainerId).show();
    },

    hide: function() {
        this.controller.get(this.model.spinnerContainerId).hide();
    }
});