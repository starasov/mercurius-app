Accounts.Fields = {
    name: Forms.Fields.createTextField(
            "account-name-field",
            "Name..."),

    currency_id: Forms.Fields.createSelectorField(
            "account-currency-field",
            "Currency",
            "currency_choices"),

    opening_balance: Forms.Fields.createCurrencyField(
            "account-opening-balance-field",
            "Opening Balance...")
};