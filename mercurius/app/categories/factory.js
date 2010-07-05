Categories.Factory = Class.create({
    createManager: function(database) {
        return new Categories.Manager(
                database,
                new Models.ResultSetMapper(new Models.GenericMapper(Categories.TableModel)),
                new Models.GenericManagerHelper(Categories.TableModel));
    }
});