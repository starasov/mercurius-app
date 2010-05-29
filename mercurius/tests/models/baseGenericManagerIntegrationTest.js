Models.BaseGenericManagerIntegrationTest = Class.create(Models.BaseManagerIntegrationTest, {
    before: function($super, completionCallback) {
        $super((function() {
           this._helper = this.getHelper(this._tableModels[0]);
           this._mapper = this.getResultSetMapper(this._tableModels[0]);
           this._manager = new Models.GenericManager(this._db, this._mapper, this._helper);
           completionCallback(); 
        }).bind(this));
    },
    
    getHelper: function(tableModel) {
        return new Models.GenericManagerHelper(tableModel);
    },

    getResultSetMapper: function(tableModel) {
        return new Models.ResultSetMapper(new Models.GenericMapper(tableModel));
    }
});