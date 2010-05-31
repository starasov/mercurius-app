Accounts.Fields = {
    name: Models.Fields.createTextField(
            "account-name-field",
            "Name..."),

    opening_balance: Models.Fields.createDecimalField(
            "account-opening-balance-field",
            "Opening Balance..."),

    currency_id: Models.Fields.createSelectorField(
            "account-currency-field",
            "Currency",
            "currency_choices")
};