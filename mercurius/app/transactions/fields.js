Transactions.Fields = {
    date: Forms.Fields.createDateField("transaction-date-field", "Date"),

    account_id: Forms.Fields.createSelectorField(
            "transaction-account-field",
            "Account",
            "account_choices"),

    amount: Forms.Fields.createCurrencyField("transaction-amount-field", "Amount..."),

    category_id: {
        id: "transaction-category-field",

        attributes: {
            hintText: $L("Category...")
        },

        changeEvent: Mojo.Event.propertyChanged,

        toFieldModel: function(value, transaction) {
            return {category_id: transaction.category_id, category_name: transaction.category_name};
        },

        fromFieldModel: function(fieldModel) {
            return fieldModel.category_id;
        }
    }
};