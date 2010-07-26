// ToDO: looks like an obsolete code!
Categories.Mapper = Class.create(Models.GenericMapper, {
    initialize: function($super, categoriesTableModel) {
        $super(categoriesTableModel);
    },

    mapRow: function($super, manager, row, successCallback, errorCallback) {
        $super(manager, row, (function(model) {
            this._mapChildrenFlag(manager, model, successCallback, errorCallback);
        }).bind(this), errorCallback);
    },

    _mapChildrenFlag: function(manager, model, successCallback, errorCallback) {
        if (model.parent_id) {
            model.has_children = false;
            successCallback(model);
        } else {
            manager.count({parent_id: model.id}, function(count) {
                model.has_children = (count != 0);
                successCallback(model);
            }, errorCallback);
        }
    }
});