Mojo.Widget.CategoryPicker = Class.create({
    /** @private */
    setup: function() {
        this._initializeDefaultValues();
        this._renderWidget();

        this.handlePickerTap = this._handlePickerTap.bind(this);
        this.handleCleanerTap = this._handleCleanerTap.bind(this);

        this.controller.listen(this.picker, Mojo.Event.tap, this.handlePickerTap);
        this.controller.listen(this.hint, Mojo.Event.tap, this.handlePickerTap);
        this.controller.listen(this.label, Mojo.Event.tap, this.handlePickerTap);
        this.controller.listen(this.cleaner, Mojo.Event.tap, this.handleCleanerTap);

        this.controller.exposeMethods(["setContext", "setCategory", "setListener"]);
    },

    cleanup: function() {
        this.controller.stopListening(this.picker, Mojo.Event.tap, this.handlePickerTap);
        this.controller.stopListening(this.hint, Mojo.Event.tap, this.handlePickerTap);
        this.controller.stopListening(this.label, Mojo.Event.tap, this.handlePickerTap);
        this.controller.stopListening(this.cleaner, Mojo.Event.tap, this.handleCleanerTap);
    },

    handleModelChanged: function() {
        this.category_id = this.controller.model.category_id;
        this.category_name = this.controller.model.category_name;

        this._update();
    },

    setContext: function(context) {
        this.context = context;
    },

    setCategory: function(category) {
        this.controller.model.category_id = category.id;
        this.controller.model.category_name = category.name;

        Mojo.Event.send(this.controller.element, Mojo.Event.propertyChanged, {model:this.controller.model, category: category});

        if (this.listener) {
            this.listener(category);
        }

        this.handleModelChanged();
    },

    setListener: function(listener) {
        Mojo.requireFunction(listener);
        this.listener = listener;
    },

    _initializeDefaultValues: function() {
        this.divPrefix = Mojo.View.makeUniqueId() + this.controller.scene.sceneId + this.controller.element.id;

        this.hintText = this.controller.attributes.hintText;
        this.context = this.controller.attributes.context;

        this.category_id = this.controller.model.category_id;
        this.category_name = this.controller.model.category_name; 
    },

    _renderWidget: function() {
        var model = {
            divPrefix: this.divPrefix,
            hint: this.hintText
        };

        var pickerContent = Mojo.View.render({object: model, template: 'common/categoryPicker'});
        this.controller.element.innerHTML = pickerContent;

        this.hint = this.controller.get(this.divPrefix + "-hint");
        this.label = this.controller.get(this.divPrefix + "-label");
        this.picker = this.controller.get(this.divPrefix + "-picker");
        this.cleaner = this.controller.get(this.divPrefix + "-clear");

        this._update();
    },

    _update: function() {
        if (this.category_id) {
            this.hint.hide();
            this.cleaner.show();

            this.label.show();
            this.label.innerHTML = this.category_name;
        } else {
            this.hint.show();
            this.cleaner.hide();

            this.label.hide();
            this.label.innerHTML = "";
        }
    },

    _handlePickerTap: function(event) {
        this.controller.stageController.pushScene("categoryPickerList", this.context, this.setCategory.bind(this));
    },

    _handleCleanerTap: function(event) {
        this.setCategory({});     
    }
});