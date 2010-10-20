Categories.Factory = Class.create({
    createForm: function() {
        return new Forms.GenericForm(Categories.Fields);
    },

    createValidator: function(categoriesManager, initialCategory) {
        return new Categories.Validator(categoriesManager, initialCategory, Categories.Fields);
    },

    createMapper: function(db) {
        return new Categories.Mapper(db);
    }
});