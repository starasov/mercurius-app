BaseViewAssistant = Class.create(BaseAssistant, {
    APP_MENU_DELETE_ITEM: "delete",

    /**
     * @override
     * @constructor
     */
    initialize: function($super, name, applicationContext, modelId) {
        $super(name, applicationContext);

        this.modelId = modelId;
        this.manager = null;

        this.sourceName = this.name + "View";
        this.log.info("[%s][BaseViewAssistant] - this.sourceName: '%s'", this.name, this.sourceName);

        this.editCommandName = this.name + "Edit";
        this.log.info("[%s][BaseViewAssistant] - this.editCommandName: '%s'", this.name, this.editCommandName);

        this.deleteCommandName = this.name + "Delete";
        this.log.info("[%s][BaseViewAssistant] - this.deleteCommandName: '%s'", this.name, this.deleteCommandName);

        this.editViewName = this.name + "Edit";
        this.log.info("[%s][BaseViewAssistant] - this.editViewName: '%s'", this.name, this.editViewName);
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
                break;
            case this.deleteCommandName:
                this._deleteModel();
                break;
            }
        }
    },

    /** @override */
    createCommandMenuItems: function(commandMenu) {
        commandMenu.addItem("edit", {label: "Edit", disabled: false, command: this.editCommandName});
    },

    /** @override */
    createAppMenuItems: function(appMenu) {
        appMenu.addItem(this.APP_MENU_DELETE_ITEM, {label: "Delete", disabled: false, command: this.deleteCommandName});
    },

    loadModel: function() {
        this.manager.findById(this.modelId, this._updateView.bind(this), this.databaseErrorCallback.bind(this));
    },

    /** @abstract */
    createManager: function(db) {
        Mojo.require(false, "Not implemented");
    },

    /** @abstract */
    updateView: function(model) {
        Mojo.require(false, "Not implemented");
    },

    /** @private */
    _initialize: function(db) {
        this.manager = this.createManager(db);
        this.loadModel();
    },

    /** @private */
    _updateView: function(model) {
        this.updateView(model);
        this.spinner.hide();
    },

    _deleteModel: function() {
        this.spinner.show();
        this.manager.deleteById(this.modelId, (function() {
            this.controller.stageController.popScene({source: this.sourceName, rowsAdded: -1});
        }).bind(this), this.databaseErrorCallback.bind(this))
    }
});