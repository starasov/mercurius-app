AccountViewAssistant = Class.create(BaseViewAssistant, {
    initialize: function($super, applicationContext, accountId) {
        $super("account", applicationContext, accountId);
    },

    getManager: function(db) {
        return this.context.getAccountsFactory().createManager(db);
    },

    updateView: function(account) {
        this.controller.get("account-view-title").innerHTML = account.name;
        this.controller.get("account-opening-balance").innerHTML = Mojo.Format.formatNumber(account.opening_balance, 2);
        this.controller.get("account-currency-name").innerHTML = account.currency.name;

        if (account.closed_flag) {
            this.controller.get("title-closed-icon").show();
        }
    }
});