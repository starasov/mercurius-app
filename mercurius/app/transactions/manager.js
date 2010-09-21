Transactions.Manager = Class.create(Models.GenericManager, {
    /** @override */
    save: function($super, model, successCallback, errorCallback) {
        this._adjustAmount(model);
        $super(model, successCallback, errorCallback);
    },

    /** @override */
    update: function($super, model, successCallback, errorCallback) {
        this._adjustAmount(model);
        $super(model, successCallback, errorCallback);
    },

    /** @protected */
    _createSelectStatement: function() {
        return new Transactions.SelectStatement(this.tableModel);
    },

    /** @protected */
    _adjustAmount: function(model) {
        if (model.type == Transactions.Type.EXPENSE) {
            model.amount = -Math.abs(model.amount);
        } else {
            model.amount = Math.abs(model.amount);
        }
    }
});