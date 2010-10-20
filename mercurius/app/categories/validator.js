Categories.Validator = Class.create(Validation.GenericValidator, {
    initialize: function($super, categoriesMapper, categoryId, fields) {
        $super(fields);
        this.categoriesMapper = categoriesMapper;
        this.categoryId = categoryId;
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
        this.categoriesMapper.findByNameAndParent(name, parentId, (function(categories) {
            if (categories.length && categories[0].id != this.categoryId) {
                if (parentId) {
                    errorCallback("name", "Subcategory with specified name alredy exists.");
                } else {
                    errorCallback("name", "Category with specified name alredy exists.");
                }
            } else {
                successCallback();
            }
        }).bind(this), function(transaction, error) {
            errorCallback("_all", "Failed to read categories data.");
        });
    }
});