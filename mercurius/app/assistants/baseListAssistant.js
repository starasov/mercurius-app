BaseListAssistant = Class.create({
    initialize: function(name, applicationContext) {
        Mojo.Log.info("[%s][BaseListAssistant] - begin", name);

        this.name = name;
        this.context = applicationContext;
        this.manager = null;

        this.spinner = new Widgets.FullScreenSpinner({
            parentId: this.name + "-spinner",
            spinnerContainerId: this.name + "-spinner-container",
            spinnerWidgetId: this.name + "-spinner-widget"
        });

        this.listAttributes = {
            itemTemplate: this.name + "List/listitem",
            listTemplate: "common/listcontainer",
            swipeToDelete: false,
            renderLimit: 20,
            reorderable: false,
            formatters: this.getFormatters(),
            itemsCallback: this._listItemsCallback.bind(this)
        };

        this.itemTapHandler = this.itemTapCallback.bind(this);

        this.listWidgetId = this.name + "-list-widget";
        Mojo.Log.info("[%s][BaseListAssistant] - expected list widget id: %s", name, this.listWidgetId);

        Mojo.Log.info("[%s][BaseListAssistant] - end", name);
    },

    setup: function() {
        Mojo.Log.info("[%s][BaseListAssistant][setup] - begin", this.name);

        this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
                {items: this.getCommandMenuItems()});

        this.controller.setupWidget(this.listWidgetId, this.listAttributes);
        this.listWidget = this.controller.get(this.listWidgetId);

        this.spinner.setup(this.controller);

        Mojo.Log.info("[%s][BaseListAssistant][setup] - end", this.name);
    },

    activate: function(event) {
        if (!event) {
            this.listWidget.mojo.setLengthAndInvalidate(this.listWidget.mojo.getLength());
        }

        this.controller.listen(this.listWidgetId, Mojo.Event.listTap, this.itemTapHandler);
    },

    deactivate: function(event) {
        this.controller.stopListening(this.listWidgetId, Mojo.Event.listTap, this.itemTapHandler);
    },

    getFormatters: function() {
       return {};
    },

    getCommandMenuItems: function() {
        return []
    },

    getManager: function(db) {
        Mojo.require(false, "Not implemented.");
    },

    listItemsCallback: function(list, offset, limit) {
        Mojo.require(false, "Not implemented.");
    },

    itemTapCallback: function(event) {
        Mojo.require(false, "Not implemented.");
    },

    databaseErrorCallback: function(transaction, error) {
        this.spinner.hide();
        // ToDO: add some error logic handling here.
    },

    _listItemsCallback: function(list, offset, limit) {
        Mojo.Log.info("[%s][BaseListAssistant][_listItemsCallback] - begin", this.name);

        if (this.manager == null) {
            Mojo.Log.info("[%s][BaseListAssistant][_listItemsCallback] - initializing manager", this.name);
            this._setupManager(list, offset, limit);
        } else {
            this.listItemsCallback(list, offset, limit);
        }

        Mojo.Log.info("[%s][BaseListAssistant][_listItemsCallback] - begin", this.name);
    },

    _setupManager: function(list, offset, limit) {
        this.spinner.show();

        this.context.getDatabase((function(db) {
            this.manager = this.getManager(db);
            this.listItemsCallback(list, offset, limit);
            this.spinner.hide();
        }).bind(this), this.databaseErrorCallback.bind(this));
    }
});