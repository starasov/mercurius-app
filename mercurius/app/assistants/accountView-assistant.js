AccountViewAssistant = Class.create(BaseViewAssistant, {
    initialize: function($super, applicationContext, accountId) {
        $super("account", applicationContext, accountId);
    },

    getManager: function(db) {
        return this.context.getAccountsFactory().createManager(db);
    },

    getCommandMenuItems: function() {
        return [{label: "Edit", disabled: false, command: "editAccount"}];
    },

    activate: function(event) {
        if (event) {
            switch (event.source) {
            case "accountEdit":
                this.loadModel();
            }
        }
    },

    handleCommand: function(event) {
        if (event.type == Mojo.Event.command) {
            switch (event.command) {
            case "editAccount":
                this.controller.stageController.pushScene("accountEdit", this.context, this.modelId);
                event.stop();
            }
        }
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