Categories.ManagerFindIntegrationTest = Class.create(Models.BaseManagerIntegrationTest, {
    before: function($super, completionCallback) {
        $super((function() {
            this.categoriesManager = new Categories.Factory().createManager(this._db);
            completionCallback();
        }).bind(this));
    },

    getTableModels: function() {
        return [Categories.TableModel];
    },

    getFixtures: function() {
        return [
            "INSERT INTO categories VALUES(1, 'Household', 2, 0);",

            "INSERT INTO categories VALUES(2, 'Car', 2, 0);",
            "INSERT INTO categories VALUES(3, 'Gas', 2, 2);",
            "INSERT INTO categories VALUES(4, 'Insuranse', 2, 2);"
        ];
    },

    test_should_correctly_search_for_top_categories: function(recordResults) {
        this.categoriesManager.findTopCategoriesByType(Categories.Type.EXPENSE, {}, function(categories) {
            Test.validate(recordResults, Mojo.requireEqual.curry(2, categories.length));
        }, recordResults);
    },

    test_should_return_empty_list_when_no_top_categories_defined: function(recordResults) {
        this.categoriesManager.findTopCategoriesByType(Categories.Type.INCOME, {}, function(categories) {
            Test.validate(recordResults, Mojo.requireEqual.curry(0, categories.length));
        }, recordResults);
    },

    test_should_correctly_search_for_child_categories: function(recordResults) {
        this.categoriesManager.findChildCategories(2, {}, function(categories) {
            Test.validate(recordResults, Mojo.requireEqual.curry(2, categories.length));
        }, recordResults);
    },

    test_should_return_empty_list_when_no_child_categories_found_for_parent: function(recordResults) {
        this.categoriesManager.findChildCategories(1, {}, function(categories) {
            Test.validate(recordResults, Mojo.requireEqual.curry(0, categories.length));
        }, recordResults);
    }
});