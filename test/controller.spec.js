describe('------------------$controller', function () {
    beforeEach(function () {
        delete window.angular;
        publishExternalAPI();
    });
    it('instantiates controller functions', function () {
        var injector = createInjector(['ng']);
        var $controller = injector.get('$controller');
        function MyController() {
            this.invoked = true;
        }
        var controller = $controller(MyController);
        expect(controller).toBeDefined();
        expect(controller instanceof MyController).toBe(true);
        expect(controller.invoked).toBe(true);
    });
    it('allows registering controllers through modules', function () {
        var module = angular.module('myModule', []);
        module.controller('MyController', function MyController() { });
        var injector = createInjector(['ng', 'myModule']);
        var $controller = injector.get('$controller');
        var controller = $controller('MyController');
        expect(controller).toBeDefined();
    });
    it('can be applied to different directives, as different instances', function () {
        var invocations = 0;
        function MyController() {
            invocations++;
        }
        var injector = createInjector(['ng', function ($controllerProvider, $compileProvider) {
            $controllerProvider.register('MyController', MyController);
            $compileProvider.directive('myDirective', function () {
                return { controller: 'MyController' };
            });
            $compileProvider.directive('myOtherDirective', function () {
                return { controller: 'MyController' };
            });
        }]);
        injector.invoke(function ($compile, $rootScope) {
            var el = $('<div my-directive my-other-directive></div>');
            $compile(el)($rootScope);
            expect(invocations).toBe(2);
        });
    });
    it('can be attached on the scope', function () {
        function MyController() { }
        var injector = createInjector(['ng',
            function ($controllerProvider, $compileProvider) {
                $controllerProvider.register('MyController', MyController);
                $compileProvider.directive('myDirective', function () {
                    return {
                        controller: 'MyController',
                        controllerAs: 'myCtrl'
                    };
                });
            }]);
        injector.invoke(function ($compile, $rootScope) {
            var el = $('<div my-directive></div>');
            $compile(el)($rootScope);
            expect($rootScope.myCtrl).toBeDefined();
            expect($rootScope.myCtrl instanceof MyController).toBe(true);
        });
    });
    it('has isolate scope bindings available during construction', function () {
        var gotMyAttr;
        function MyController($scope) {
            gotMyAttr = $scope.myAttr;
        }
        var injector = createInjector(['ng', function ($controllerProvider, $compileProvider) {
            $controllerProvider.register('MyController', MyController);
            $compileProvider.directive('myDirective', function () {
                return {
                    scope: {
                        'myAttr': '@myDirective'
                    },
                    controller: 'MyController'
                };
            });
        }]);
        injector.invoke(function ($compile, $rootScope) {
            var el = $('<div my-directive="abc"></div>');
            $compile(el)($rootScope);
            expect(gotMyAttr).toEqual('abc');
        });
    });
    it('can bind isolate scope bindings directly to self', function () {
        var gotMyAttr;
        function MyController() {
            gotMyAttr = this.myAttr;
        }
        var injector = createInjector(['ng', function ($controllerProvider, $compileProvider) {
            $controllerProvider.register('MyController', MyController);
            $compileProvider.directive('myDirective', function () {
                return {
                    scope: {
                        myAttr: '@myDirective'
                    },
                    controller: 'MyController',
                    bindToController: true
                };
            });
        }]);
        injector.invoke(function ($compile, $rootScope) {
            var el = $('<div my-directive="abc"></div>');
            $compile(el)($rootScope);
            expect(gotMyAttr).toEqual('abc');
        });
    });
    it('can return a semi- constructed controller', function () {
        var injector = createInjector(['ng']);
        var $controller = injector.get('$controller');
        function MyController() {
            this.constructed = true;
            this.myAttrWhenConstructed = this.myAttr;
        }
        var controller = $controller(MyController, null, true);
        expect(controller.constructed).toBeUndefined();
        expect(controller.instance).toBeDefined();
        controller.instance.myAttr = 42;
        var actualController = controller();
        expect(actualController.constructed).toBeDefined();
        expect(actualController.myAttrWhenConstructed).toBe(42);
    });
    it('can be required from a sibling directive', function () {
        function MyController() { }
        var gotMyController;
        var injector = createInjector(['ng', function ($compileProvider) {
            $compileProvider.directive('myDirective', function () {
                return {
                    scope: {},
                    controller: MyController
                };
            });
            $compileProvider.directive('myOtherDirective', function () {
                return {
                    require: 'myDirective',
                    link: function (scope, element, attrs, myController) {
                        gotMyController = myController;
                    }
                };
            });
        }]);
        injector.invoke(function ($compile, $rootScope) {
            var el = $('<div my-directive my-other-directive></div>'); 
            $compile(el)($rootScope); 
            expect(gotMyController).toBeDefined(); 
            expect(gotMyController instanceof MyController).toBe(true);
        });
    });
});