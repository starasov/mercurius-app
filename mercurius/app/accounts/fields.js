Accounts.Fields = {
    name: Models.Fields.createTextField(
            "account-name-field",
            "Name..."),

    currency_id: Models.Fields.createSelectorField(
            "account-currency-field",
            "Currency",
            "currency_choices"),

    opening_balance: Models.Fields.createCurrencyField(
            "account-opening-balance-field",
            "Opening Balance...")
};