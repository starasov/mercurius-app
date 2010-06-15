AccountViewAssistant = Class.create(BaseViewAssistant, {
    initialize: function($super, applicationContext, accountId) {
        $super("account", applicationContext, accountId);
        this.openingBalanceModel = Accounts.Fields.opening_balance;
    },

    getManager: function(db) {
        return this.context.getAccountsFactory().createManager(db);
    },

    updateView: function(account) {
        this.controller.get("account-view-title").innerHTML = account.name;
        this.controller.get("account-opening-balance").innerHTML = this.openingBalanceModel.toViewString(account.opening_balance);
        this.controller.get("account-currency-name").innerHTML = account.currency.name;

        if (account.closed_flag) {
            this.controller.get("title-closed-icon").show();
        }
    }
});