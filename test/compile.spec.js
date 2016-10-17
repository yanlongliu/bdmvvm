function makeInjectorWithDirectives() {
    var args = arguments;
    return createInjector(['ng', function ($compileProvider) {
        $compileProvider.directive.apply($compileProvider, args);
    }]);
}
describe('$compile', function () {
    beforeEach(function () {
        delete window.angular;
        publishExternalAPI();
    });
    it('allows creating directives', function () {
        var myModule = window.angular.module('myModule', []);
        myModule.directive('testing', function () { });
        var injector = createInjector(['ng', 'myModule']);
        expect(injector.has('testingDirective')).toBe(true);
    });
    it('allows creating many directives with the same name', function () {
        var myModule = window.angular.module('myModule', []);
        myModule.directive('testing', _.constant({ d: 'one' }));
        myModule.directive('testing', _.constant({ d: 'two' }));
        var injector = createInjector(['ng', 'myModule']);
        var result = injector.get('testingDirective');
        expect(result.length).toBe(2);
        expect(result[0].d).toEqual('one');
        expect(result[1].d).toEqual('two');
    });
    it('compiles element directives from a single element', function () {
        var injector = makeInjectorWithDirectives('myDirective', function () {
            return {
                compile: function (element) {
                    element.data('hasCompiled', true);
                }
            };
        });
        injector.invoke(function ($compile) {
            var el = $('<my-directive></my-directive>');
            $compile(el);
            expect(el.data('hasCompiled')).toBe(true);
        });
    });
    it('allows applying a directive to multiple elements', function () {
        var compileEl = false;
        var injector = makeInjectorWithDirectives('myDir', function () {
            return {
                multiElement: true, 
                compile: function (element) {
                    compileEl = element;
                }
            };
        });
        injector.invoke(function ($compile) {
            var el = $('<div my-dir-start></div><span></span><div my-dir-end></div>'); 
            $compile(el);
            expect(compileEl.length).toBe(3);
        });
    });
});
