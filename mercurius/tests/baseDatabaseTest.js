BaseDatabaseTest = Class.create({
    before: function(completionCallback) {
        this.fixtures = this.getFixtures();
        this.db = null;

        this.service = new Database.Service("mercurius_test", "1.0", "mercurius_test", 100000);

        var initializer = new Database.Initializer(new Utils.JsonResourceReader());
        this.fixtures.each(function(f) {
            initializer.addScript(f);
        });

        this.service.setDatabaseInitializer(initializer);
        this.service.setVersionProvider(new MockVersionProvider());

        this.service.open((function(db) {
            this.db = db;
            completionCallback();
        }).bind(this), this._handle_database_error.bind(this, completionCallback));
    },

    getFixtures: function() {
        return [];
    },

    _handle_database_error: function(completionCallback, transaction, error) {
        Mojo.Log.info("[Models.BaseGenericManagerIntegrationTest._handle_database_error] - '%s'", error.message);
        Mojo.require(false);
    }
});