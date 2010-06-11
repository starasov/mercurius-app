BaseListAssistant = Class.create(BaseAssistant, {
    initialize: function($super, name, applicationContext) {
        $super(name, applicationContext);

        this.manager = null;

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
        this.log.info("[%s][BaseListAssistant] - expected list widget id: %s", this.name, this.listWidgetId);
    },

    setup: function($super) {
        $super();

        this.controller.setupWidget(this.listWidgetId, this.listAttributes);
        this.listWidget = this.controller.get(this.listWidgetId);
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

    getManager: function(db) {
        Mojo.require(false, "Not implemented.");
    },

    listItemsCallback: function(list, offset, limit) {
        Mojo.require(false, "Not implemented.");
    },

    itemTapCallback: function(event) {
        Mojo.require(false, "Not implemented.");
    },

    _listItemsCallback: function(list, offset, limit) {
        if (this.manager == null) {
            this.log.info("[%s][BaseListAssistant][_listItemsCallback] - initializing manager", this.name);
            this._setupManager(list, offset, limit);
        } else {
            this.listItemsCallback(list, offset, limit);
        }
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