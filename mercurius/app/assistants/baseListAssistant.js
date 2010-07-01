BaseListAssistant = Class.create(BaseAssistant, {
    /**
     * @override
     * @constructor
     */
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

        this.listModel = {"items": []};

        this.itemTapHandler = this.itemTapCallback.bind(this);

        this.listWidgetId = this.name + "-list-widget";
        this.log.info("[%s][BaseListAssistant] - expected list widget id: %s", this.name, this.listWidgetId);
    },

    /** @override */
    setup: function($super) {
        $super();

        this.controller.setupWidget(this.listWidgetId, this.listAttributes, this.listModel);
        this.listWidget = this.controller.get(this.listWidgetId);
    },

    /** @override */
    activate: function(event) {
        if (!event) {
            this.listWidget.mojo.setLengthAndInvalidate(this.listWidget.mojo.getLength());
        }

        this.controller.listen(this.listWidgetId, Mojo.Event.listTap, this.itemTapHandler);
    },

    invalidateItems: function() {
        this.controller.modelChanged(this.listModel);
    },

    /** @override */
    deactivate: function(event) {
        this.controller.stopListening(this.listWidgetId, Mojo.Event.listTap, this.itemTapHandler);
    },

    /** @abstract */
    getFormatters: function() {
       return {};
    },

    /** @abstract */
    createManager: function(db) {
        Mojo.require(false, "Not implemented.");
    },

    /** @abstract */
    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        Mojo.require(false, "Not implemented.");
    },

    /** @abstract */
    itemTapCallback: function(event) {
        Mojo.require(false, "Not implemented.");
    },

    /** @private */
    _listItemsCallback: function(list, offset, limit) {
        if (this.manager == null) {
            this.log.info("[%s][BaseListAssistant][_listItemsCallback] - initializing manager", this.name);
            this._setupManager(list, offset, limit);
        } else {
            this.spinner.show();
            this.listItemsCallback(offset, limit, (function(models) {
                list.mojo.noticeUpdatedItems(offset, models);
                this.spinner.hide();
            }).bind(this), this.databaseErrorCallback.bind(this));
        }
    },

    /** @private */
    _setupManager: function(list, offset, limit) {
        this.spinner.show();
        this.context.getDatabase((function(db) {
            this.manager = this.createManager(db);
            this._listItemsCallback(list, offset, limit);
            this.spinner.hide();
        }).bind(this), this.databaseErrorCallback.bind(this));
    }
});