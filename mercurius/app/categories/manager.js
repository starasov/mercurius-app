Categories.TOP = 0;

Categories.Manager = Class.create(Models.GenericManager, {
    findTopCategoriesByType: function(type, extraParameters, successCallback, errorCallback) {
        Mojo.requireFunction(successCallback, "'successCallback' should be a function.");
        Mojo.requireFunction(errorCallback, "'errorCallback' should be a function.");

        this.find({parent_id: 0, type: type}, extraParameters, successCallback, errorCallback);
    },

    findChildCategories: function(parentId, extraParameters, successCallback, errorCallback) {
        Mojo.requireFunction(successCallback, "'successCallback' should be a function.");
        Mojo.requireFunction(errorCallback, "'errorCallback' should be a function.");

        this.find({parent_id: parentId}, extraParameters, successCallback, errorCallback);
    }
});