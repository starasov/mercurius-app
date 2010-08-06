Transactions.SelectStatementTest = Class.create({
    before: function() {
        this.statement = new Transactions.SelectStatement(Transactions.TableModel);
        return Mojo.Test.beforeFinished;
    },

    test_should_correctly_build_join_clause: function() {
        var context = this.statement.toSelectSql({}, {});

        Mojo.requireEqual(
                "SELECT transactions.id AS id, transactions.amount AS amount, transactions.date AS date, " +
                       "transactions.account_id AS account_id, transactions.category_id AS category_id, " +
                       "accounts.name AS account_name, categories.name AS category_name " +
                "FROM transactions " +
                "LEFT JOIN accounts ON transactions.account_id = accounts.id " +
                "LEFT JOIN categories ON transactions.category_id = categories.id;", context.sql);

        return Mojo.Test.passed;
    }
});