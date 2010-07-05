Categories.Manager = Class.create(Models.GenericManager, {
    findTopIncomeCategories: function(extraParameters, successCallback, errorCallback) {
        this.find({type: Categories.Type.INCOME, parent_id: null}, extraParameters, successCallback, errorCallback);
    },

    findTopExpenseCategories: function(extraParameters, successCallback, errorCallback) {
        this.find({type: Categories.Type.EXPENSE, parent_id: null}, extraParameters, successCallback, errorCallback);
    },

    findChildCategories: function(parentId, extraParameters, successCallback, errorCallback) {
        this.find({parent_id: parentId}, extraParameters, successCallback, errorCallback);
    }
});