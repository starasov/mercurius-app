var Currencies = {};

Currencies.TableModel = {
    Name: "currencies",
    Columns: {
        id: new Database.Types.PrimaryKey(),
        name: new Database.Types.String(Database.Types.NotNull),
        symbol: new Database.Types.String(Database.Types.NotNull),
        rate: new Database.Types.Real(Database.Types.NotNull),
        home_flag: new Database.Types.Boolean(Database.Types.NotNull)
    }
};

Currencies.Manager = Class.create(GenericManager, {
    initialize: function($super, db) {
        $super(db, Currencies.TableModel);
    }
});

