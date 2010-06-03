Models.GenericForm = Class.create({
    initialize: function(fields) {
        Mojo.require(fields, "Passed 'fields' parameter can't be null or undefined.");

        this.fields = fields;
        this.stateChangedCallbacks = [];
        this.fieldsModels = null;
    },

    addStateChangedCallback: function(callback) {
        Mojo.requireFunction(callback, "Passed 'callback' should be a function.");
        this.stateChangedCallbacks.push(callback)
    },

    setup: function(controller) {
        Mojo.require(controller, "Passed 'controller' parameter can't be null or undefined.");

        this.controller = controller;
        this.formWidgetslistener = this._handleStateChangedEvent.bind(this);

        for (var fieldName in this.fields) {
            var field = this.fields[fieldName];
            this.controller.setupWidget(field.id, field.attributes, {});
            this.controller.listen(field.id, field.changeEvent, this.formWidgetslistener);
        }
    },

    cleanup: function() {
        for (var fieldName in this.fields) {
            var field = this.fields[fieldName];
            this.controller.stopListening(field.id, field.changeEvent, this.formWidgetslistener);
        }
    },

    update: function(model) {
        this.fieldsModels = this._createFieldsModels(model);

        for (var fieldName in this.fields) {
            var field = this.fields[fieldName];
            this.controller.setWidgetModel(field.id, this.fieldsModels[fieldName]);
        }
    },

    getModel: function() {
        var model = {};

        for (var fieldName in this.fieldsModels) {
            var field = this.fields[fieldName];
            var fieldModel = this.fieldsModels[fieldName];
            model[fieldName] = field.fromFieldModel(fieldModel);
        }

        return model;
    },

    getFieldsModels: function() {
        return this.fieldsModels;
    },

    _createFieldsModels: function(model) {
        var formData = {};

        for (var fieldName in model) {
            var modelValue = model[fieldName];

            var field = this.fields[fieldName];
            if (field) {
                formData[fieldName] = field.toFieldModel(modelValue, model);
            }
        }

        return formData;
    },

    _handleStateChangedEvent: function() {
        this.stateChangedCallbacks.each(function(callback) {
            callback(this.fieldsModels);
        }, this);
    }
});
