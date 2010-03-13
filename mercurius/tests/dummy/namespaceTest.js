function NamespaceTest() {
}

NamespaceTest.prototype.
        test_conditional_logic_for_namespace_creation = function()
{
    var n;
    !n && function() { n = 'a' }();
};