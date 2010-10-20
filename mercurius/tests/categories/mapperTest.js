Categories.MapperTest = Class.create(Database.BaseMapperTest, {
    test_findTopCategoriesByType_should_return_expected_child_categories_number: function(recordResults) {
        this.mapper.findTopCategoriesByType(Categories.Type.INCOME, Database.NO_LIMIT, 0, (function(incomeCategories) {
            Test.validate(recordResults, Mojo.requireEqual.curry(2, incomeCategories.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_findChildCategories_should_return_expected_child_categories_number: function(recordResults) {
        this.mapper.findChildCategories(2, Database.NO_LIMIT, 0, (function(children) {
            Test.validate(recordResults, Mojo.requireEqual.curry(3, children.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_findByNameAndParent_should_return_empty_list_when_no_matches_found: function(recordResults) {
        this.mapper.findByNameAndParent("Doesnt exist", 0, (function(children) {
            Test.validate(recordResults, Mojo.requireEqual.curry(0, children.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_findByNameAndParent_should_return_list_when_matches_found_for_top_categories: function(recordResults) {
        this.mapper.findByNameAndParent("Food", 0, (function(children) {
            Test.validate(recordResults, Mojo.requireEqual.curry(1, children.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_findByNameAndParent_should_return_list_when_matches_found_for_child_categories: function(recordResults) {
        this.mapper.findByNameAndParent("Cafe", 2, (function(children) {
            Test.validate(recordResults, Mojo.requireEqual.curry(1, children.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    getFixtures: function() {
        return [
            Mojo.appPath + "resources/database/categories.json"
        ];
    },

    createMapper: function(db) {
        return new Categories.Mapper(db);
    },

    getInitialCount: function() {
        return 8;
    },

    createNewModel: function() {
        return {
            name: "Fuel",
            type: Categories.Type.EXPENSE,
            parent_id: 0
        };
    },

    createUpdateModel: function() {
        var model = this.createNewModel();
        model.id = 1;

        return model;
    }
});