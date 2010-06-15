Accounts.TableModel = {
    Name: "accounts",
    Columns: {
        id: new Database.Types.PrimaryKey(),
        name: new Database.Types.String(Database.Types.NonNullable),
        opening_balance: new Database.Types.Integer(Database.Types.NonNullable),
        currency_id: new Database.Types.Integer(Database.Types.NonNullable),
        closed_flag: new Database.Types.Boolean(Database.Types.NonNullable)
    }
};