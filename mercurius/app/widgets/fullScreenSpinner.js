Widgets.FullScreenSpinner = Class.create({
    /**
     * @param model {hash} a hash with 'parentId' 'spinnerContainerId' and 'spinnerWidgetId'
     *                     keys that specify parent element for the widget, spinner container
     *                     div id and spinner widget div id appropriately.
     */
    initialize: function(model) {
        Mojo.require(model);
        this.model = model;
    },

    setup: function(controller) {
        this.controller = controller;

        var spinnerContainerDiv = Mojo.View.render({
            template: 'common/fullScreenSpinner',
            object: this.model
        });

        this.controller.get(this.model.parentId).update(spinnerContainerDiv);

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