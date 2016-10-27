describe('$interpolate', function () {
    beforeEach(function () {
        delete window.angular;
        publishExternalAPI();
    });
    it('exists', function () {
        var injector = createInjector(['ng']);
        expect(injector.has('$interpolate')).toBe(true);
    });
    it('produces an identity function for static content', function () {
        var injector = createInjector(['ng']);
        var $interpolate = injector.get('$interpolate');
        var interp = $interpolate('hello');
        expect(interp instanceof Function).toBe(true);
        expect(interp()).toEqual('hello');
    });
    it('evaluates many expressions', function () {
        var injector = createInjector(['ng']);
        var $interpolate = injector.get('$interpolate');
        var interp = $interpolate('First {{anAttr}}, then {{anotherAttr}}! ');
        expect(interp({ anAttr: '42', anotherAttr: '43' })).toEqual('First 42, then 43! ');
    });
    it('turns objects into JSON strings', function () {
        var injector = createInjector(['ng']);
        var $interpolate = injector.get('$interpolate');
        var interp = $interpolate('{{anObject}}');
        expect(interp({ anObject: { a: 1, b: '2' } })).toEqual('{"a":1,"b":"2"}');
    });
});