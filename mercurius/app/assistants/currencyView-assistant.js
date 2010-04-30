function CurrencyViewAssistant(currencyId, databaseService) {
    this.currencies = new Currencies();
    this.currencyId = currencyId;
}

CurrencyViewAssistant.prototype.setup = function() {
1    Mojo.Log.info("-> [CurrencyViewAssistant.setup]");

    Mojo.Log.info("-- [CurrencyViewAssistant.setup] looking for currency with id=%d", this.currencyId);
    this.currency = this.currencies.for_id(this.currencyId);
    Mojo.Log.info("-- [CurrencyViewAssistant.setup] found currency=%j", this.currency);

    var currencyNameElement = this.controller.get("currency-name");
    currencyNameElement.innerHTML = this.currency.name;

    if (this.currency.home) {
        var currencyHomeTextElement = this.controller.get("currency-home-text");
        currencyHomeTextElement.innerHTML = "Home Currency";
    }

    var currencySymbolElement = this.controller.get("currency-symbol");
    currencySymbolElement.innerHTML = this.currency.symbol;

    var currencyExchangeRateElement = this.controller.get("currency-exchange-rate");
    currencyExchangeRateElement.innerHTML =
        Mojo.Format.formatNumber(parseFloat(this.currency.exchangeRate), {fractionDigits: "2"});

    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
            {items: [{label: "Edit", command: "editCurrency"}]});

    Mojo.Log.info("<- [CurrencyViewAssistant.setup]");
};

CurrencyViewAssistant.prototype.activate = function(event) {
};


CurrencyViewAssistant.prototype.deactivate = function(event) {
};

CurrencyViewAssistant.prototype.cleanup = function(event) {
};

CurrencyViewAssistant.prototype.handleCommand = function(event) {
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case "editCurrency":
                Mojo.Controller.errorDialog("Edit Clicked!", this.controller.window);
                break;
        }
    }
};