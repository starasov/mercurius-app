BaseViewAssistant = Class.create({
    initialize: function(name, applicationContext, modelId) {
        this.context = applicationContext;

        this.modelId = modelId;
        this.manager = null;

        this.spinner = new Widgets.FullScreenSpinner(name);
    },

    setup: function() {
        this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
                {items: this.getCommandMenuItems()});

        this.spinner.setup(this.controller);

        this.spinner.show();
        this.context.getDatabase(this._initialize.bind(this), this.databaseErrorCallback.bind(this));
    },

    loadModel: function() {
        this.manager.findById(this.modelId, this._updateView.bind(this), this.databaseErrorCallback.bind(this));
    },

    getManager: function(db) {
        Mojo.require(false, "Not implemented");
    },

    getCommandMenuItems: function() {
        return [];
    },

    updateView: function(model) {
        Mojo.require(false, "Not implemented");
    },

    databaseErrorCallback: function(transaction, error) {
         this.spinner.hide();
         this.controller.showAlertDialog({
             title: "Error",
             message: error.message,
             choices: [
                 {label: "OK", value: "ok", type: "medium"}
             ]
         });
    },

    _initialize: function(db) {
        this.manager = this.getManager(db);
        this.loadModel();
    },

    _updateView: function(model) {
        this.updateView(model);
        this.spinner.hide();
    }
});