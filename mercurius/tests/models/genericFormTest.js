var TestForm = Class.create(Models.GenericForm, {
    initialize: function($super) {
        $super({
            name: {
                id: "name-id",
                attributes: "name-attributes",
                changeEvent: "name-changeEvent",
                toFormData: function() { return "name-toFormData"; },
                fromFormData: function() { return "name-fromFormData"; }
            },

            age: {
                id: "age-id",
                attributes: "age-attributes",
                changeEvent: "age-changeEvent"
            },

            weight: {
                id: "weight-id",
                attributes: "weight-attributes",
                changeEvent: "weight-changeEvent"
            }
        }, {
            name: "",
            age: 1,
            weight: 1.0
        });

        this.updateCalls = [];
    },

    update: function($super, model) {
        this.updateCalls.push(model);
        $super(model);
    }
});

Models.GenericFormTest = Class.create({
    before: function() {
        this.form = new TestForm();
        this.controller = new MockController();

        this.validationCallback = (function(validationResult) {
            this.validationCalled = true;
            this.validationResult = validationResult; 

        }).bind(this);
        this.form.addStateChangedCallback(this.validationCallback);
        
        return Mojo.Test.beforeFinished;
    },

    test_initialize_should_fail_when_null_fields_passed: function() {
        Test.requireException((function() {
            new Models.GenericForm(null, {});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_setup_should_fail_when_null_controller_passed: function() {
        Test.requireException((function() {
            this.form.setup(null);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_should_setup_widgets_for_each_registered_field_when_setup_method_called: function() {
        this.form.setup(this.controller);
        Mojo.requireEqual(3, this.controller.setupWidgetCalls.length);
        return Mojo.Test.passed;
    },

    test_should_setup_widgets_with_valid_data_when_setup_method_called: function() {
        this.form.setup(this.controller);

        var callData = this.controller.setupWidgetCalls[0];
        Mojo.requireEqual("name-id", callData.id);
        Mojo.requireEqual("name-attributes", callData.attributes);
        Test.requireMapsEqual({}, callData.model);

        return Mojo.Test.passed;
    },

    test_should_start_listening_each_widget_when_setup_method_called: function() {
        this.form.setup(this.controller);
        Mojo.requireEqual(3, this.controller.listenCalls.length);
        return Mojo.Test.passed;
    },

    test_should_start_listening_valid_element_and_event_type_when_setup_method_called: function() {
        this.form.setup(this.controller);

        var callData = this.controller.listenCalls[0];
        Mojo.requireEqual("name-id", callData.id);
        Mojo.requireEqual("name-changeEvent", callData.event);

        return Mojo.Test.passed;
    },

    test_cleanup_should_stop_event_listening_for_each_previously_setup_widget: function() {
        this.form.setup(this.controller);
        this.form.cleanup();

        Mojo.requireEqual(3, this.controller.stopListeningCalls.length);

        return Mojo.Test.passed;
    },

    test_should_pass_valid_data_to_stop_listening_method_when_cleanup_called: function() {
        this.form.setup(this.controller);
        this.form.cleanup();

        var callData = this.controller.stopListeningCalls[0];
        Mojo.requireEqual("name-id", callData.id);
        Mojo.requireEqual("name-changeEvent", callData.event);
        
        return Mojo.Test.passed;
    },

    test_update_should_set_widget_model_for_each_field_when_called: function() {
        this.form.setup(this.controller);

        this.controller.setWidgetModelCalls = [];
        this.form.update({});

        Mojo.requireEqual(3, this.controller.setWidgetModelCalls.length);

        return Mojo.Test.passed;
    },

    test_update_should_pass_valid_data_to_set_widget_when_called: function() {
        this.form.setup(this.controller);
        this.controller.setWidgetModelCalls = [];

        var model = {name: "banana", age: 1, weight: 0.5};
        this.form.update(model);

        var callData = this.controller.setWidgetModelCalls[0];
        Mojo.requireEqual("name-id", callData.id);

        var expectedFormData = $H(model);
        expectedFormData.set("name", "name-toFormData");

        Test.requireMapsEqual(expectedFormData, callData.model);

        return Mojo.Test.passed;
    },

    test_get_model_should_return_valid_data_when_called: function() {
        this.form.setup(this.controller);

        var model = {name: "banana", age: 1, weight: 0.5};
        this.form.update(model);

        var actualModel = this.form.getModel();

        var expectedModel = $H(model);
        expectedModel.set("name", "name-fromFormData");

        Test.requireMapsEqual(expectedModel, actualModel);

        return Mojo.Test.passed;
    }
});