var MockGenericHelper = Class.create({
    initialize: function() {
        this.toInsertSqlResult = null;
        this.toUpdateSqlResult = null;
    },

    toCountSql: function(id) {
        this.countCalled = true;
        return {};
    },

    toInsertSql: function(entity) {
        this.toInsertSqlCalled = true;
        return this.toInsertSqlResult || {};
    },

    toUpdateSql: function(entity) {
        this.toUpdateSqlCalled = true;
        return this.toUpdateSqlResult || {};
    },

    toDeleteSql: function(id) {
        this.toDeleteSqlCalled = true;
        return {};
    },

    toSelectSql: function(searchParams) {
        this.toSelectSqlCalled = true;
        return {};
    }
});

var MockResultSetMapper = Class.create({
    map: function(manager, resultSet, successCallback, errorCallback) {
        this.mapCalled = true;
        successCallback([]);
    }
});

var MockController = Class.create({
    initialize: function() {
        this.setupWidgetCalls = [];
        this.listenCalls = [];
        this.stopListeningCalls = [];
        this.setWidgetModelCalls = [];
    },

    setupWidget: function(id, attributes, model) {
        this.setupWidgetCalls.push({id: id, attributes: attributes, model: model});
    },

    listen: function(id, event, listener) {
        this.listenCalls.push({id: id, event: event, listener: listener});
    },

    stopListening: function(id, event, listener) {
        this.stopListeningCalls.push({id: id, event: event, listener: listener});
    },

    setWidgetModel: function(id, model) {
        this.setWidgetModelCalls.push({id: id, model: model});
    }
});

var MockGenericMapper = Class.create({
    initialize: function() {
        this.modelResult = null;
        this.shouldCallSuccessCallback = true;
        this.mapRowCalledNumber = 0;
    },

    mapRow: function(manager, row, successCallback, errorCallback) {
        this.mapRowCalledNumber += 1;

        if (this.shouldCallSuccessCallback) {
            successCallback(this.modelResult);
        } else {
            errorCallback();
        }
    }
});

var MockGenericManager = Class.create({
    initialize: function() {
        this.findByIdResult = null;
        this.findByIdCalledNumber = 0;
        this.findResults = []
    },

    findById: function(id, successCallback, errorCallback) {
        this.findByIdCalledNumber += 1;
        successCallback(this.findByIdResult);
    },

    find: function(searchParameters, extraParameters, successCallback, errorCallback) {
        successCallback(this.findResults);

    }
});