Categories.Factory = Class.create({
    createForm: function() {
        return new Models.GenericForm(Categories.Fields);
    },

    createValidator: function(categoriesManager) {
        return new Categories.Validator(categoriesManager, Categories.Fields);
    },

    createManager: function(database) {
        return new Categories.Manager(
                database,
                new Models.ResultSetMapper(new Categories.Mapper(Categories.TableModel)),
                new Models.GenericManagerHelper(Categories.TableModel));
    }
});