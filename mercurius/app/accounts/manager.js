Accounts.Manager = Class.create(Models.GenericManager, {
    findOpenAccounts: function(extraParameters, successCallback, errorCallback) {
        this.find({closed_flag: false}, extraParameters, successCallback, errorCallback);
    }
});