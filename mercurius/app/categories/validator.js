Categories.Validator = Class.create(Validation.GenericValidator, {
    initialize: function($super, categoriesManager, fields) {
        $super(fields);
        this.categoriesManager = categoriesManager;
    },

    _validateName: function(fieldModel, fieldDescriptor, successCallback, errorCallback) {
        var name = fieldDescriptor.fromFieldModel(fieldModel);
        if (!Validation.Utils.validateNotEmpty(name)) {
            errorCallback("name", "Category name can't be empty.");
        } else {
            successCallback();
        }
    },

    _validate: function(fieldsModels, fieldsDescriptors, successCallback, errorCallback) {
        var name = fieldsDescriptors["name"].fromFieldModel(fieldsModels["name"]);
        var parentId = fieldsDescriptors["parent_id"].fromFieldModel(fieldsModels["parent_id"]);
        this._validateNameAvailability(name, parentId, successCallback, errorCallback);
    },

    _validateNameAvailability: function(name, parentId, successCallback, errorCallback) {
        var searchParams = {name: name, parent_id: parentId};
        this.categoriesManager.find(searchParams, {}, function(categories) {
            if (categories.length) {
                if (parentId) {
                    errorCallback("name", "Subcategory with specified name alredy exists.");
                } else {
                    errorCallback("name", "Category with specified name alredy exists.");
                }
            } else {
                successCallback();
            }
        }, function(transaction, error) {
            Mojo.Log.error("[validateNameAvailability] - error: %o", error.message);
            errorCallback("_all", "Failed to read categories data.");
        });
    }
});