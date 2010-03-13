function SandboxViewAssistant(account) {
    this.account = account;
}

SandboxViewAssistant.prototype.setup = function() {
    Mojo.Log.info("[SandboxViewAssistant.setup] - begin");

    this.toggleAttributes = {
        trueLabel: 'ON',
        trueValue: 'on',
        falseLabel: 'OFF',
        falseValue: 'off'
    };

    this.toggleModel = {
        value: true,
        disabled: false
    };

//    var toggleButtonElement = this.controller.get("toggleButton");
//    this.controller.setupWidget("toggleButton", this.toggleAttributes, this.toggleModel);

//    this.toggleModel.disabled = true;      
//    this.controller.modelChanged(this.toggleModel, this);
//
//    // Use a new model object in place of the old one:
//    this.newToggleModel = { value: "off" };
//    // Set the widget to use the new model:
//    this.controller.setWidgetModel("toggleButton", this.newToggleModel);

//    this.togglePressed = this.togglePressed.bindAsEventListener(this);
//    Mojo.Event.listen(toggleButtonElement, Mojo.Event.propertyChange, this.togglePressed);

    try {
        var name = "mercurius_test_3";  // required
        var version = "";  // required
        var displayName = "Mercurius Database"; // optional
        var size = 200000;  // optional

//        this.db = openDatabase('ext:doc1', '', 'Offline document storage', 5 * 1024 * 1024);
//        if (!this.db.version) {
//            Mojo.Log.info("db has no version");
//        }

//        var dbService = new DatabaseService(name, version, displayName, size);
//        dbService.open(undefined, undefined);

        Mojo.Log.info("[SandboxViewAssistant.setup] - opeining database...");
        var db = openDatabase(name, version, displayName, size);
        if (!db) {
            Mojo.Log.error("[SandboxViewAssistant.setup] - failed to open database!");
        } else {
            Mojo.Log.info("[SandboxViewAssistant.setup] - database opened. db version is %s", db.version);
            db.changeVersion("1.0", "2.0", function(t) {
                Mojo.Log.info("[SandboxViewAssistant.setup] - OK!");
            }, function() {
                Mojo.Log.info("[SandboxViewAssistant.setup] - OK!");
            }, function(e) {
                Mojo.Log.info("[SandboxViewAssistant.setup] - FAILED!");
            });
        }
    } catch(e) {
        Mojo.Log.logException(e);
    }

    Mojo.Log.info
            ("[SandboxViewAssistant.setup] - Currencies.TableModel: %s", Currencies.TableModel);

    Mojo.Log.info("[SandboxViewAssistant.setup] - end");
};

SandboxViewAssistant.prototype.activate = function(event) {
};


SandboxViewAssistant.prototype.deactivate = function(event) {
};

SandboxViewAssistant.prototype.cleanup = function(event) {
//    Mojo.Event.stopListening(this.controller.get('toggleButton'), Mojo.Event.propertyChange, this.togglePressed);
};

SandboxViewAssistant.prototype.togglePressed = function() {
    this.controller.get("toggleSummary").innerHTML = "Toggle value is now: " + event.value;
};