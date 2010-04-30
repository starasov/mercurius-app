var MockGenericMapper = Class.create({
    toModelResultSet: function(sqlResultSet) {
        this.toModelResultSetCalled = true;
        return {};
    },

    toCountSql: function(id) {
        this.countCalled = true;
        return {};
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