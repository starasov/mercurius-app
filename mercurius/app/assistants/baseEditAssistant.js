BaseEditAssistant = Class.create(BaseAssistant, {
    /**
     * @override
     * @constructor
     */
    initialize: function($super, name, applicationContext) {
        $super(name, applicationContext);

        this.form = null;
        this.validator = null;

        this.saveCommandName = this.name + "Save";
        this.log.info("[%s][BaseEditAssistant] - this.saveCommandName: '%s'", this.name, this.saveCommandName);

        this.saveSourceName = this.name + "Edit";
        this.log.info("[%s][BaseEditAssistant] - this.saveSourceName: '%s'", this.name, this.saveCommandName);
    },

    /** @override */
    setup: function($super) {
        $super();
        
        var titleSuffix = this.isNew() ? "New" : "Edit";
        var title = $L(titleSuffix + " " + this.name.capitalize());
        this.log.info("[%s][BaseEditAssistant] - this.title: '%s'", this.name, title);

        this.controller.get(this.name + "-edit-title").innerHTML = title;

        this.form = this.getForm();
        this.form.setup(this.controller);

        this.spinner.show();
        this.context.getDatabase(this._initialize.bind(this), this.databaseErrorCallback.bind(this));
    },

    /** @override */
    activate: function(event) {
        this.form.activate();
    },

    /** @override */
    deactivate: function(event) {
        this.form.deactivate();
    },

    /** @override */
    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case this.saveCommandName:
                this._validateAndSave();
                event.stop();
            }
        }
    },

    /** @override */
    createCommandMenuItems: function(commandMenu) {
        commandMenu.addItem("done", {label: "Done", disabled: false, command: this.saveCommandName});
    },

    validationErrorCallback: function(key, message) {
        this.spinner.hide();
        Validation.Dialog.showErrorDialog(this.controller, key, message);
    },

    /** @abstract */
    isNew: function() {
        Mojo.require(false, "Not implemented");
    },

    /** @abstract */
    getForm: function() {
        Mojo.require(false, "Not implemented");
    },

    /** @abstract */
    getValidator: function() {
        Mojo.require(false, "Not implemented");
    },

    /** @abstract */
    initializeMappers: function(db) {
        Mojo.require(false, "Not implemented");
    },

    /** @abstract */
    loadModel: function(successCallback, errorCallback) {
        Mojo.require(false, "Not implemented");
    },

    /** @abstract */
    saveModel: function(model, successCallback, errorCallback) {
        Mojo.require(false, "Not implemented");
    },

    updateForm: function() {
        this.loadModel(this._updateForm.bind(this), this.databaseErrorCallback.bind(this));
    },

    /** @private */
    _initialize: function(db) {
        this.log.info("[%s][BaseEditAssistant][_initialize] - begin", this.name);

        this.initializeMappers(db);
        this.validator = this.getValidator();
        this.updateForm();

        this.log.info("[%s][BaseEditAssistant][_initialize] - end", this.name);
    },

    /** @private */
    _updateForm: function(model) {
        this.form.update(model);
        this.spinner.hide();
    },

    /** @private */
    _validateAndSave: function() {
        this.spinner.show();
        this.validator.validate(this.form.getFieldsModels(), this._save.bind(this),
                this.validationErrorCallback.bind(this));
    },

    /** @private */
    _save: function() {
        var model = this.form.getModel();
        this.saveModel(model, (function(id) {
            this.spinner.hide();
            this.controller.stageController.popScene({source: this.saveSourceName, id: id, rowsAdded: 1});
        }).bind(this), this.databaseErrorCallback.bind(this));
    }
});
