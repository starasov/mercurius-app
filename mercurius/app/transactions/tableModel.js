Transactions.TableModel = {
    Name: "transactions",

    Columns: {
        id: new Database.Types.PrimaryKey(),
        type: new Database.Types.Integer(Database.Types.NonNullable),
        amount: new Database.Types.Integer(Database.Types.NonNullable),
        date: new Database.Types.Integer(Database.Types.NonNullable),
        account_id: new Database.Types.Integer(Database.Types.NonNullable),
        category_id: new Database.Types.Integer(Database.Types.Nullable)
    },

    ForeignColumns: {
        account_name: function() {
            return Accounts.TableModel.Columns.name;
        },

        category_name: function() {
            return Categories.TableModel.Columns.name;
        },

        category_type: function() {
            return Categories.TableModel.Columns.type;
        },

        currency_symbol: function() {
            return Currencies.TableModel.Columns.symbol;
        }
    }
};