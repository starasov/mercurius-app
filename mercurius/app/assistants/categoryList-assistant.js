CategoryListAssistant = Class.create(BaseListAssistant, {
    initialize: function($super, applicationContext) {
        $super("category", applicationContext);
    },

    createManager: function(db) {
        return this.context.getCategoriesFactory().createManager(db);
    },

    listItemsCallback: function(offset, limit, successCallback, errorCallback) {
        this.manager.find({}, {limit: limit, offset: offset}, successCallback, errorCallback);
    }
});