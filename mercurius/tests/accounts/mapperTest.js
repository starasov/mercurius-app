Accounts.MapperTest = Class.create({
    before: function() {
        this.mockCurrenciesManager = new MockGenericManager();
        this.mapper = new Accounts.Mapper(Accounts.TableModel, this.mockCurrenciesManager);

        this.accountRow = {
            id: 1,
            name: "DEPO",
            opening_balance: 10000,
            currency_id: 1,
            closed_flag: false
        };

        this.currency = {
            name: "USD",
            symbol: "$"
        };

        return Mojo.Test.beforeFinished;
    },

    test_should_not_map_currency_model_when_no_currency_id_exists: function(recordResults) {
        this.accountRow.currency_id = null;
        this.mapper.mapRow(null,this.accountRow, (function(account) {
            Test.validate(recordResults, Mojo.requireFalse.curry(account.currency));
        }).bind(this), recordResults);
    },

    test_should_map_currency_model_when_currency_id_exists: function(recordResults) {
        this.mockCurrenciesManager.findByIdResult = this.currency;

        this.mapper.mapRow(null, this.accountRow, (function(account) {
            Test.validateAndContinue(recordResults, Mojo.requireEqual.curry(1, this.mockCurrenciesManager.findByIdCalledNumber));
            Test.validate(recordResults, Mojo.requireEqual.curry(this.currency, account.currency));
        }).bind(this), recordResults);
    }
});