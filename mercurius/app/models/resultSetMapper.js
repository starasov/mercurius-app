Models.ResultSetMapper = Class.create({
    initialize: function(rowMapper) {
        Mojo.require(rowMapper, "Row mapper should be defined and can't be null.");
        this.rowMapper = rowMapper;
    },

    map: function(manager, resultSet, successCallback, errorCallback) {
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
            chain.add(this._doMap.bind(this, manager, row, mappedModels));
        }

        chain.call();
    },

    _doMap: function(manager, row, mappedModels, successCallback, errorCallback) {
        this.rowMapper.mapRow(manager, row, (function(mappedModels, successCallback, model) {
            mappedModels.push(model);
            successCallback();
        }).curry(mappedModels, successCallback), errorCallback);
    }
});