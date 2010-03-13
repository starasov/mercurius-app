var Currencies = Class.create({
    initialize: function() {
        this.currencies = {
            1: {id: 1, name: 'US Dollar', symbol: '$', exchangeRate: 1.0, home: true},
            2: {id: 2, name: 'Euro', symbol: 'eur', exchangeRate: 0.8, home: false},
            3: {id: 3, name: 'GB Pound', symbol: 'gbp', exchangeRate: 0.6, home: false},
            4: {id: 4, name: 'Ukrainian Hryvna', symbol: 'uah', exchangeRate: 8.20, home: false},

            5: {id: 1, name: 'US Dollar', symbol: '$', exchangeRate: 1.0, home: true},
            6: {id: 2, name: 'Euro', symbol: 'eur', exchangeRate: 0.8, home: false},
            7: {id: 3, name: 'GB Pound', symbol: 'gbp', exchangeRate: 0.6, home: false},
            8: {id: 4, name: 'Ukrainian Hryvna', symbol: 'uah', exchangeRate: 8.20, home: false},

            9: {id: 1, name: 'US Dollar', symbol: '$', exchangeRate: 1.0, home: true},
            10: {id: 2, name: 'Euro', symbol: 'eur', exchangeRate: 0.8, home: false},
            11: {id: 3, name: 'GB Pound', symbol: 'gbp', exchangeRate: 0.6, home: false},
            12: {id: 4, name: 'Ukrainian Hryvna', symbol: 'uah', exchangeRate: 8.20, home: false}
        };
    },

    all: function() {
        var currencyList = [];

        for (var id in this.currencies) {
            currencyList.push(this.currencies[id]);
        }

        return currencyList;
    },

    for_id: function(id) {
        return this.currencies[id];
    }
});