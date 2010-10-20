TransactionViewAssistant = Class.create(BaseViewAssistant, {
    initialize: function($super, applicationContext, transactionId) {
        $super("transaction", applicationContext, transactionId);
    },

    createMapper: function(db) {
        return this.context.getTransactionsFactory().createMapper(db);
    },

    updateView: function(transaction) {
        this.controller.get("transaction-account-name").innerHTML = transaction.account_name;
        this.controller.get("transaction-category-name").innerHTML = transaction.category_name;
        this.controller.get("transaction-date").innerHTML = Mojo.Format.formatDate(new Date(transaction.date), {date: "default"});

        var amount = transaction.category_type == Categories.Type.EXPENSE ? -transaction.amount : transaction.amount;
        this.controller.get("transaction-amount").innerHTML = Utils.Formatting.formatCurrency(amount, transaction.currency_symbol);
    }
});