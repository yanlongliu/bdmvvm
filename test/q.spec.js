describe("$q", function () {
    var $q;
    beforeEach(function () {
        publishExternalAPI();
        $q = createInjector(['ng']).get('$q');
    });
    it('can create a Deferred' , function () {
        var d = $q.defer(); 
        expect(d).toBeDefined();
    });
});