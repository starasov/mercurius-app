Categories.Type = {
    INCOME: 1,
    EXPENSE: 2,

    _NAMES: [$L("Income"), $L("Expense")],

    getDisplayName: function(type) {
        Mojo.requireNumber(type);
        return this._NAMES[type-1];
    },

    toChoices: function() {
        return [
            {label: $L("Income"), value: this.INCOME},
            {label: $L("Expense"), value: this.EXPENSE}
        ];
    }
};