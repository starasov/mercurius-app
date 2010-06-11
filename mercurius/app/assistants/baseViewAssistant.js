BaseViewAssistant = Class.create(BaseAssistant, {
    /**
     * @override
     * @constructor 
     */
    initialize: function($super, name, applicationContext, modelId) {
        $super(name, applicationContext);

        this.modelId = modelId;
        this.manager = null;

        this.editCommandName = this.name + "Edit";
        this.log.info("[%s][BaseViewAssistant] - this.editCommandName: %s", this.name, this.editCommandName);

        this.editViewName = this.name + "Edit";
        this.log.info("[%s][BaseViewAssistant] - this.editViewName: %s", this.name, this.editViewName);
    },

    /** @override */
    setup: function($super) {
        $super();

        this.spinner.show();
        this.context.getDatabase(this._initialize.bind(this), this.databaseErrorCallback.bind(this));
    },

    /** @override */
    activate: function(event) {
        if (event) {
            switch (event.source) {
            case this.editViewName:
                this.loadModel();
            }
        }
    },

    /** @override */
    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case this.editCommandName:
                this.controller.stageController.pushScene(this.editViewName, this.context, this.modelId);
                event.stop();
            }
        }
    },

    /** @override */
    getCommandMenuItems: function() {
        return [{label: "Edit", disabled: false, command: this.editCommandName}];
    },

    loadModel: function() {
        this.manager.findById(this.modelId, this._updateView.bind(this), this.databaseErrorCallback.bind(this));
    },

    /** @abstract */
    getManager: function(db) {
        Mojo.require(false, "Not implemented");
    },

    /** @abstract */
    updateView: function(model) {
        Mojo.require(false, "Not implemented");
    },

    /** @private */
    _initialize: function(db) {
        this.manager = this.getManager(db);
        this.loadModel();
    },

    /** @private */
    _updateView: function(model) {
        this.updateView(model);
        this.spinner.hide();
    }
});