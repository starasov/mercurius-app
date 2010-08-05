Accounts.TableModel = {
    Name: "accounts",

    Columns: {
        id: new Database.Types.PrimaryKey(),
        name: new Database.Types.String(Database.Types.NonNullable),
        opening_balance: new Database.Types.Integer(Database.Types.NonNullable),
        currency_id: new Database.Types.Integer(Database.Types.NonNullable),
        closed_flag: new Database.Types.Boolean(Database.Types.NonNullable)
    },

    ForeignColumns: {
        currency_name: function() {
            return Currencies.TableModel.Columns.name;
        },

        currency_symbol: function() {
            return Currencies.TableModel.Columns.symbol;
        }
    }
};