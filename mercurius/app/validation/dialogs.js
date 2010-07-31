Validation.Dialog = {
    showErrorDialog: function(controller, key, message, onChooseCallback) {
        controller.showAlertDialog({
            title: "Please correct '" + key + "' field",
            message: message,
            onChoose: onChooseCallback || Prototype.emptyFunction,
            choices: [
                {label: "OK", value: "ok", type: "medium"}
            ]
        });
    }
};