function AllTests() {
    var allTests = []
            .concat(Accounts.AllTests())
            .concat(Categories.AllTests())
            .concat(Currencies.AllTests())
            .concat(Database.AllTests())
            .concat(Forms.AllTests())
            .concat(Transactions.AllTests())
            .concat(Utils.AllTests());

    return allTests;
}