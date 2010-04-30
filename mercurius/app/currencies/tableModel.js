Currencies.TableModel = {
    Name: "currencies",
    Columns: {
        id: new Database.Types.PrimaryKey(),
        name: new Database.Types.String(Database.Types.NonNullable),
        symbol: new Database.Types.String(Database.Types.NonNullable),
        rate: new Database.Types.Real(Database.Types.NonNullable),
        home_flag: new Database.Types.Boolean(Database.Types.NonNullable)
    }
};