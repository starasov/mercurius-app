Models.BaseGenericManagerIntegrationTest = Class.create(Models.BaseManagerIntegrationTest, {
    before: function($super, completionCallback) {
        $super((function() {
           this._mapper = this.getResultSetMapper(this._tableModels[0]);
           this._manager = new Models.GenericManager(this._db, this._tableModels[0], this._mapper);
           completionCallback(); 
        }).bind(this));
    },
    
    getResultSetMapper: function(tableModel) {
        return new Models.ResultSetMapper(new Models.GenericMapper(tableModel));
    }
});