BaseAssistant = Class.create({
    log: Mojo.Log,

    /** @constructor */
    initialize: function(name, applicationContext) {
        this.log.info("[%s][BaseAssistant] - begin", name);

        Mojo.require(name, "'name' parameter is required.");
        Mojo.require(applicationContext, "'applicationContext' parameter is required.");

        this.name = name;
        this.context = applicationContext;

        this.appMenu = new Widgets.Menu(Mojo.Menu.appMenu, {});
        this.commandMenu = new Widgets.Menu(Mojo.Menu.commandMenu, {});

        this.spinner = new Widgets.FullScreenSpinner(this.name);

        this.log.info("[%s][BaseAssistant] - end", name);
    },

    setup: function() {
        this.log.info("[%s][BaseAssistant][setup] - begin", this.name);

        this.createAppMenuItems(this.appMenu);
        this.appMenu.setup(this.controller);

        this.createCommandMenuItems(this.commandMenu);
        this.commandMenu.setup(this.controller);       

        this.spinner.setup(this.controller);

        this.log.info("[%s][BaseAssistant][setup] - end", this.name);
    },

    createCommandMenuItems: function(commandMenu) {
    },

    createAppMenuItems: function(appMenu) {
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