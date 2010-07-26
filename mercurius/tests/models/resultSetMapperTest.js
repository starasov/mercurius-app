Models.ResultSetMapperTest = Class.create({
    before: function() {
        this.mockGenericMapper = new MockGenericMapper();
        this.resultSetMapper = new Models.ResultSetMapper(this.mockGenericMapper);

        return Mojo.Test.beforeFinished;
    },

    test_should_return_empty_array_when_empty_result_set_passed: function(recordResults) {
        var resultSet = {rows: []};
        this.resultSetMapper.map(null, resultSet, function(models) {
            Test.validate(recordResults, Mojo.requireEqual.curry(0, models.length));
        }, recordResults);
    },

    test_should_use_internal_mapper_to_map_all_rows_in_passed_result_set: function(recordResults) {
        var resultSet = {
            rows: {
                length: 3,
                item: function(i) {
                    return i; 
                }
            }
        };

        this.resultSetMapper.map(null, resultSet, (function(models) {
            Test.validate(recordResults, Mojo.requireEqual.curry(3, this.mockGenericMapper.mapRowCalledNumber));
        }).bind(this), recordResults);
    }
});
