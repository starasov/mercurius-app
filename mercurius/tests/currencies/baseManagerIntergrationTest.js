Currencies.BaseManagerIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    before: function($super, completionCallback) {
        $super((function() {
            this._currenciesManager = Currencies.Manager.create(this._db);
            completionCallback();
        }).bind(this));
    },

    getTableModel: function() {
        return Currencies.TableModel;
    },

    getFixtures: function($super, tableModel) {
        return $super(tableModel).concat([
                "INSERT INTO currencies VALUES(1, 'US Dollar', '$', 1.0, 1);",
                "INSERT INTO currencies VALUES(2, 'Euro', 'EUR', 1.2, 0);",
                "INSERT INTO currencies VALUES(3, 'GB Pound', 'GPB', 1.4, 0);"
        ]);
    }
});