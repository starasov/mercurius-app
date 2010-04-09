function CurrencyListAssistant(databaseService) {
    Mojo.Log.info("[CurrencyListAssistant] - begin");

    this.databaseService = databaseService;
    this.currencyFormatters = {
        rate: function(rate) {
            return Mojo.Format.formatNumber(rate, 2);
        },

        homeIconStyle: function(_, model) {
            return model.home_flag ? "block" : "none";
        },

        rateStyle: function(_, model) {
            return model.home_flag ? "none" : "block";
        }
    };

    Mojo.Log.info("[CurrencyListAssistant] - end");
}

CurrencyListAssistant.prototype.setup = function() {
    Mojo.Log.info("[CurrencyListAssistant.setup] - begin");

    this.currencyListAttributes = {
        itemTemplate: "currencyList/listitem",
        listTemplate: "currencyList/listcontainer",
        swipeToDelete: false,
        renderLimit: 20,
        reorderable: false,
        formatters: this.currencyFormatters
    };

    this.currencyListModel = {
        items: []
    };

    this.controller.setupWidget("currency-list-widget",
            this.currencyListAttributes, this.currencyListModel);

    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
            {items: [{icon: 'new', command: 'addCurrency'}]});
    
    this.databaseService.getDatabase((function(db) {
        Mojo.Log.info("[CurrencyListAssistant.setup] - retrieved database");
        this.manager = new Models.Currencies.ManagerFactory().create(db);

        this.manager.all({}, (function(tr, resultSet) {
            this.currencyListModel.items = resultSet.toArray();            
            this.controller.modelChanged(this.currencyListModel, this);
        }).bind(this), function() {});
    }).bind(this), function(error) {});

    Mojo.Log.info("[CurrencyListAssistant.setup] - end");
};

CurrencyListAssistant.prototype.activate = function(event) {
};

CurrencyListAssistant.prototype.deactivate = function(event) {
};

CurrencyListAssistant.prototype.cleanup = function(event) {
};
