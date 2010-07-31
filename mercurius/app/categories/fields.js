Categories.Fields = {
    name: Forms.Fields.createTextField(
            "category-name-field",
            "Name..."),

    parent_id: Forms.Fields.createSelectorField(
            "category-parent-field",
            "Parent",
            "parent_choices"),

    type: Forms.Fields.createSelectorField(
            "category-type-field",
            "Type",
            "type_choices")
};