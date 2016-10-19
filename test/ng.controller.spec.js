it('has an inherited scope', function () {
    var gotScope;
    function MyController($scope, $element, $attrs) {
        gotScope = $scope;
    }
    var injector = createInjector(['ng', function ($controllerProvider) {
        $controllerProvider.register('MyController', MyController);
    }]);
    injector.invoke(function ($compile, $rootScope) {
        var el = $('<div ng-controller="MyController"></div>'); 
        $compile(el)($rootScope); 
        expect(gotScope).not.toBe($rootScope); 
        expect(gotScope.$parent).toBe($rootScope); 
        expect(Object.getPrototypeOf(gotScope)).toBe($rootScope);
    });
});