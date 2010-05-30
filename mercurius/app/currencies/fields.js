Currencies.Fields = {
    name: Models.Fields.createTextField("currency-name-field", "Name...", "name"),
    symbol: Models.Fields.createTextField("currency-symbol-field", "Symbol...", "symbol", 3),
    rate: Models.Fields.createDecimalField("currency-rate-field", "Rate...", "rate")
};