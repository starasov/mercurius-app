function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    Mojo.Log.info(">> [StageAssistant.setup]");
//    this.accounts = new Accounts();
//    this.controller.pushScene("accountView", this.accounts.for_id(1));
    this.controller.pushScene("sandboxView");
//    this.controller.pushScene("currencyList");
//    this.controller.pushScene("currencyView", 1);
    Mojo.Log.info("<< [StageAssistant.setup]");
};
