Transactions.TableModel = {
    Name: "transactions",
    Columns: {
        id: new Database.Types.PrimaryKey(),
        amount: new Database.Types.Integer(Database.Types.NonNullable),
        date: new Database.Types.Integer(Database.Types.NonNullable),
        account_id: new Database.Types.Integer(Database.Types.NonNullable),
        category_id: new Database.Types.Integer(Database.Types.Nullable)
    }
};