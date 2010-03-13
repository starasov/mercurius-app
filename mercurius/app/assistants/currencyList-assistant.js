function CurrencyListAssistant() {
}

CurrencyListAssistant.prototype.setup = function() {
    this.currencies = new Currencies();

    this.currencyListAttributes = {
        itemTemplate: "currencyList/listitem",
        listTemplate: "currencyList/listcontainer",
        swipeToDelete: false,
        renderLimit: 20,
        reorderable: false
    };

    this.currencyListModel = {
        items: this.currencies.all()
    };

    this.controller.setupWidget("currency-list-widget",
            this.currencyListAttributes, this.currencyListModel);

    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
            {items: [{icon: 'new', command: 'addCurrency'}]});	
};

CurrencyListAssistant.prototype.activate = function(event) {
};


CurrencyListAssistant.prototype.deactivate = function(event) {
};

CurrencyListAssistant.prototype.cleanup = function(event) {
};
