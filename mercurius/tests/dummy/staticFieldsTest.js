function StaticFieldsTest() {
}

var ClassWithStaticField = Class.create({});
ClassWithStaticField.ImStatic = "some content here";
ClassWithStaticField.prototype.ImNotStatic = "some other content here";

StaticFieldsTest.prototype.
        test_static_fields_of_prototypelib_created_classes = function()
{
    Mojo.requireEqual("some content here", ClassWithStaticField.ImStatic);
    Mojo.requireEqual('undefined', typeof(ClassWithStaticField.ImNotStatic));
    return Mojo.Test.passed;
};