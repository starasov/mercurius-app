Currencies.BaseManagerIntegrationTest = Class.create(Models.BaseManagerIntegrationTest, {
    before: function($super, completionCallback) {
        $super((function() {
            this._currenciesManager = new Currencies.Factory().createManager(this._db);
            completionCallback();
        }).bind(this));
    },

    getTableModels: function() {
        return [Currencies.TableModel];
    },

    getFixtures: function() {
        return [
            "INSERT INTO currencies VALUES(1, 'US Dollar', '$', 1.0, 1);",
            "INSERT INTO currencies VALUES(2, 'Euro', 'EUR', 1.2, 0);",
            "INSERT INTO currencies VALUES(3, 'GB Pound', 'GPB', 1.4, 0);"
        ];
    }
});