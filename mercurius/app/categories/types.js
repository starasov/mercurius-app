Categories.Type = {
    INCOME: 1,
    EXPENSE: 2,

    toChoices: function() {
        return [
            {label: "Income", value: this.INCOME},
            {label: "Expense", value: this.EXPENSE}
        ];
    }
};