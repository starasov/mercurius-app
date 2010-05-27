var Accounts = Class.create({
    initialize: function() {
        this.accounts = {
            1: {id: 1, name: 'Pocket Money', openingBalance: 1000},
            2: {id: 2, name: 'UAH', openingBalance: 100000},
            3: {id: 3, name: 'USD', openingBalance: 10000},
            4: {id: 4, name: 'Bonus UAH', openingBalance: 10000}
        };
    },

    all: function() {
        var accountsList = [];

        for (var id in this.accounts) {
            accountsList.push(this.accounts[id]);
        }

        return accountsList;
    },

    for_id: function(id) {
        return this.accounts[id];
    }
});