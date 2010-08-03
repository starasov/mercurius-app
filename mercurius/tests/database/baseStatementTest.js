Database.BaseStatementTest = Class.create({
    before: function() {
        this.tableModel = {
            Name: "name_and_flag",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String(),
                some_flag: new Database.Types.Boolean(Database.Types.Nullable)
            }
        };

        return Mojo.Test.beforeFinished;
    }
});
