BaseAssistant = Class.create({
    log: Mojo.Log,

    initialize: function(name, applicationContext) {
        this.log.info("[%s][BaseAssistant] - begin", name);

        Mojo.require(name, "'name' parameter is required.");
        Mojo.require(applicationContext, "'applicationContext' parameter is required.");

        this.name = name;
        this.context = applicationContext;
        this.spinner = new Widgets.FullScreenSpinner(this.name);

        this.log.info("[%s][BaseAssistant] - end", name);
    },

    setup: function() {
        this.log.info("[%s][BaseAssistant][setup] - begin", this.name);

        this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
                {items: this.getCommandMenuItems()});

        this.spinner.setup(this.controller);

        this.log.info("[%s][BaseAssistant][setup] - end", this.name);
    },

    getCommandMenuItems: function() {
        return []
    },

    databaseErrorCallback: function(transaction, error) {
        this.spinner.hide();

        // ToDO: add some error logic handling here.

        this.controller.showAlertDialog({
            title: "Error",
            message: error.message,
            choices: [
                {label: "OK", value: "ok", type: "medium"}
            ]
        });
    }
});