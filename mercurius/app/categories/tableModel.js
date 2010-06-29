Categories.TableModel = {
    Name: "categories",
    Columns: {
        id: new Database.Types.PrimaryKey(),
        name: new Database.Types.String(Database.Types.NonNullable),
        type: new Database.Types.Integer(Database.Types.NonNullable),
        parent_id: new Database.Types.Integer(Database.Types.Nullable)
    }
};