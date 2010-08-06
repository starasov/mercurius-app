Transactions.Factory = Class.create({
    createManager: function(database) {
        return new Transactions.Manager(
                database,
                Transactions.TableModel,
                new Models.ResultSetMapper(new Models.GenericMapper(Transactions.TableModel)));
    }
});