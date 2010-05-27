Models.ResultSetMapper = Class.create({
    initialize: function(rowMapper) {
        Mojo.require(rowMapper, "Row mapper should be defined and can't be null.");
        this.rowMapper = rowMapper;
    },

    map: function(resultSet, successCallback, errorCallback) {
        var rows = resultSet.rows;

        if (!rows || rows.length == 0) {
            successCallback([]);
            return;
        }

        var mappedModels = [];

        var chain = new Utils.AsyncChain((function(mappedSet, innerSuccessCallback) {
            innerSuccessCallback(mappedSet);
        }).curry(mappedModels, successCallback), errorCallback);

        for (var i = 0; i < rows.length; i++) {
            var row = rows.item(i);
            chain.add(this._doMap.bind(this, row, mappedModels));
        }

        chain.call();
    },

    _doMap: function(row, mappedModels, successCallback, errorCallback) {
        this.rowMapper.mapRow(row, (function(mappedSet, innerSuccessCallback, model) {
            mappedSet.push(model);
            innerSuccessCallback();
        }).curry(mappedModels, successCallback), errorCallback);
    }
});