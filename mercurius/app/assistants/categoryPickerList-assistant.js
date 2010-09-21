CategoryPickerListAssistant = Class.create(BaseCategoryListAssistant, {
    /**
     * @constructor
     * @override
     */
    initialize: function($super, applicationContext, categoryPickedCallback) {
        $super(applicationContext);
        this.categoryPickedCallback = categoryPickedCallback;
    },

    /** @override */
    categoryTapCallback: function(category) {
        this.categoryPickedCallback(category);
        this.controller.stageController.popScene({source: "categoryPickerList", category: category});
    }
});