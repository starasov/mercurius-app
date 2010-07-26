Categories.TOP = 0;

Categories.Manager = Class.create(Models.GenericManager, {
    findTopCategories: function(extraParameters, successCallback, errorCallback) {
        this.find({parent_id: 0}, extraParameters, successCallback, errorCallback);
    },

    findTopCategoriesByType: function(type, extraParameters, successCallback, errorCallback) {
        this.find({parent_id: 0, type: type}, extraParameters, successCallback, errorCallback);
    },

    findChildCategories: function(parentId, extraParameters, successCallback, errorCallback) {
        this.find({parent_id: parentId}, extraParameters, successCallback, errorCallback);
    }
});