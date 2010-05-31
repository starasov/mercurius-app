Currencies.Fields = {
    name: Models.Fields.createTextField("currency-name-field", "Name..."),
    symbol: Models.Fields.createTextField("currency-symbol-field", "Symbol...", 3),
    rate: Models.Fields.createDecimalField("currency-rate-field", "Rate...")
};