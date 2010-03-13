function AccountViewAssistant(account) {
    this.account = account;
}

AccountViewAssistant.prototype.setup = function() {
    var accountViewTitleElement = this.controller.get("accountViewTitle");
    accountViewTitleElement.innerHTML = this.account.name;

    var accountViewSummaryElement = this.controller.get("accountViewSummary");
    accountViewSummaryElement.innerHTML = "Opening balance: " + this.account.openingBalance;
}

AccountViewAssistant.prototype.activate = function(event) {
}


AccountViewAssistant.prototype.deactivate = function(event) {
}

AccountViewAssistant.prototype.cleanup = function(event) {
}
