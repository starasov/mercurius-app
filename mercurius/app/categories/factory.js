Categories.Factory = Class.create({
    createForm: function() {
        return new Forms.GenericForm(Categories.Fields);
    },

    createValidator: function(categoriesManager, initialCategory) {
        return new Categories.Validator(categoriesManager, initialCategory, Categories.Fields);
    },

    createManager: function(database) {
        return new Categories.Manager(
                database,
                new Models.ResultSetMapper(new Models.GenericMapper(Categories.TableModel)),
                new Models.GenericManagerHelper(Categories.TableModel));
    }
});