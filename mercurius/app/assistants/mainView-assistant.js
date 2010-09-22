MainViewAssistant = Class.create(BaseAssistant, {
    initialize: function($super, applicationContext) {
        $super("main", applicationContext);

        this.listAttributes = {
            itemTemplate: "mainView/listitem",
            listTemplate: "common/listcontainer",
            swipeToDelete: false,
            renderLimit: 20,
            reorderable: false
        };

        this.listModel = {items: [
            {icon: "account", title: $L("Accounts"), scene: "accountList"},
            {icon: "transaction", title: $L("Transactions"), scene: "transactionList"},
            {icon: "category", title: $L("Categories"), scene: "categoryList"},
            {icon: "currency", title: $L("Currencies"), scene: "currencyList"}
        ]};

        this.itemTapCallback = this._itemTapCallback.bind(this);
    },

    /** @override */
    setup: function($super) {
        $super();
        this.controller.setupWidget("main-list-widget", this.listAttributes, this.listModel);
    },

    /** @override */
    activate: function(event) {
        this.controller.listen("main-list-widget", Mojo.Event.listTap, this.itemTapCallback);
    },

    /** @override */
    deactivate: function(event) {
        this.controller.stopListening("main-list-widget", Mojo.Event.listTap, this.itemTapCallback);
    },

    _itemTapCallback: function(event) {
        this.controller.stageController.pushScene(event.item.scene, this.context);
    }
});