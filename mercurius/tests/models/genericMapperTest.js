Models.GenericMapperTest = Class.create({
    before: function() {
        this.tableModel = {
            Columns: {
                name: {
                    fromSqlType: function(value) {
                        return "name_value";
                    }
                },

                price: {
                    fromSqlType: function(value) {
                        return 12;
                    }
                }
            }
        };

        return Mojo.Test.beforeFinished;
    },

    test_mapper_creation_should_fail_when_null_table_model_passed: function() {
        Test.requireException(function() {
            new Models.GenericMapper(null);
        });

        return Mojo.Test.passed;
    },

    test_mapper_should_correctly_map_passed_row_with_table_model: function(recordResults) {
        var row = {
            name: "name",
            price: 1
        };

        var mapper = new Models.GenericMapper(this.tableModel);
        mapper.mapRow(row, function(model) {
            Test.validateAndContinue(recordResults, Mojo.requireEqual.curry("name_value", model.name));
            Test.validate(recordResults, Mojo.requireEqual.curry(12, model.price));
        }, recordResults)
    },

    test_mapper_should_correctly_map_foreign_columns_when_exist: function(recordResults) {
        this.tableModel.ForeignColumns = {
            foreign_name: function() {
                return {
                    fromSqlType: function(value) {
                        return "foreign_name";
                    }
                }
            }
        };

        var row = {
            foreign_name: "name"
        };

        var mapper = new Models.GenericMapper(this.tableModel);
        mapper.mapRow(row, function(model) {
            Test.validate(recordResults, Mojo.requireEqual.curry("foreign_name", model.foreign_name));
        }, recordResults)

    }
});
