Categories.Fields = {
    name: Models.Fields.createTextField(
            "category-name-field",
            "Name..."),

    parent_id: Models.Fields.createSelectorField(
            "category-parent-field",
            "Parent",
            "parent_choices"),

    type: Models.Fields.createSelectorField(
            "category-type-field",
            "Type",
            "type_choices")
};