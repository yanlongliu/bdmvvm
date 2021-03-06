// describe('injector', function () {
//     beforeEach(function () {
//         delete window.angular; setupModuleLoader(window);
//     });
//     it('can be created', function () {
//         var injector = createInjector([]);
//         expect(injector).toBeDefined();
//     });
//     it('has a constant that has been registered to a module', function () {
//         var module = angular.module('myModule', []); module.constant('aConstant', 42);
//         var injector = createInjector(['myModule']); expect(injector.has('aConstant')).toBe(true);
//     });
//     it('does not have a non-registered constant', function () {
//         var module = angular.module('myModule', []);
//         var injector = createInjector(['myModule']); expect(injector.has('aConstant')).toBe(false);
//     });
//     it('does not allow a constant called hasOwnProperty', function () {
//         var module = angular.module('myModule', []);
//         module.constant('hasOwnProperty', _.constant(false));
//         expect(function () {
//             createInjector(['myModule']);
//         }).toThrow();
//     });
//     it('can return a registered constant', function () {
//         var module = angular.module('myModule', []); module.constant('aConstant', 42);
//         var injector = createInjector(['myModule']); expect(injector.get('aConstant')).toBe(42);
//     });
//     it('loads multiple modules', function () {
//         var module1 = angular.module('myModule', []);
//         var module2 = angular.module('myOtherModule', []); module1.constant('aConstant', 42); module2.constant('anotherConstant', 43);
//         var injector = createInjector(['myModule', 'myOtherModule']);
//         expect(injector.has('aConstant')).toBe(true);
//         expect(injector.has('anotherConstant')).toBe(true);
//     });
//     it('loads the transitively required modules of a module', function () {
//         var module1 = angular.module('myModule', []);
//         var module2 = angular.module('myOtherModule', ['myModule']);
//         var module3 = angular.module('myThirdModule', ['myOtherModule']); module1.constant('aConstant', 42); module2.constant('anotherConstant', 43); module3.constant('aThirdConstant', 44);
//         var injector = createInjector(['myThirdModule']);
//         expect(injector.has('aConstant')).toBe(true); expect(injector.has('anotherConstant')).toBe(true); expect(injector.has('aThirdConstant')).toBe(true);
//     });
//     it('invokes an annotated function with dependency injection', function () {
//         var module = angular.module('myModule', []);
//         module.constant('a', 1);
//         module.constant('b', 2);
//         var injector = createInjector(['myModule']);
//         var fn = function (one, two) { return one + two; };
//         fn.$inject = ['a', 'b'];
//         expect(injector.invoke(fn)).toBe(3);
//     });
//     it('does not accept non-strings as injection tokens', function () {
//         var module = angular.module('myModule', []); module.constant('a', 1);
//         var injector = createInjector(['myModule']);
//         var fn = function (one, two) { return one + two; }; fn.$inject = ['a', 2];
//         expect(function () {
//             injector.invoke(fn);
//         }).toThrow();
//     });
//     it('invokes a function with the given this context', function () {
//         var module = angular.module('myModule', []); module.constant('a', 1);
//         var injector = createInjector(['myModule']);
//         var obj = {
//             two: 2,
//             fn: function (one) { return one + this.two; }
//         };
//         obj.fn.$inject = ['a'];
//         expect(injector.invoke(obj.fn, obj)).toBe(3);
//     });
//     it('overrides dependencies with locals when invoking', function () {
//         var module = angular.module('myModule', []);
//         module.constant('a', 1);
//         module.constant('b', 2);
//         var injector = createInjector(['myModule']);
//         var fn = function (one, two) { return one + two; };
//         fn.$inject = ['a', 'b'];
//         expect(injector.invoke(fn, undefined, { b: 3 })).toBe(4);
//     });
//     describe('annotate', function () {
//         it('returns the $inject annotation of a function when it has one', function () {
//             var injector = createInjector([]); var fn = function () { };
//             fn.$inject = ['a', 'b'];
//             expect(injector.annotate(fn)).toEqual(['a', 'b']);
//         });
//     });
//     it('returns annotations parsed from function args when not annotated', function () {
//         var injector = createInjector([]);
//         var fn = function (a, b) { };
//         expect(injector.annotate(fn)).toEqual(['a', 'b']);
//     });
//     it('strips comments from argument lists when parsing', function () {
//         var injector = createInjector([]);
//         var fn = function (a, /*b,*/ c) { }; expect(injector.annotate(fn)).toEqual(['a', 'c']);
//     });
//     it('strips surrounding underscores from argument names when parsing', function () {
//         var injector = createInjector([]);
//         var fn = function (a, _b_, c_, _d, an_argument) { }; expect(injector.annotate(fn)).toEqual(['a', 'b', 'c_', '_d', 'an_argument']);
//     });
//     it('invokes a non-annotated function with dependency injection', function () {
//         var module = angular.module('myModule', []);
//         module.constant('a', 1);
//         module.constant('b', 2);
//         var injector = createInjector(['myModule']);
//         var fn = function (a, b) { return a + b; };
//         expect(injector.invoke(fn)).toBe(3);
//     });
//     it('instantiates an annotated constructor function', function () {
//         var module = angular.module('myModule', []); module.constant('a', 1);
//         module.constant('b', 2);
//         var injector = createInjector(['myModule']);
//         function Type(one, two) {
//             this.result = one + two;
//         }
//         Type.$inject = ['a', 'b'];
//         var instance = injector.instantiate(Type);
//         expect(instance.result).toBe(3);
//     });
//     it('supports locals when instantiating', function () {
//         var module = angular.module('myModule', []); module.constant('a', 1);
//         module.constant('b', 2);
//         var injector = createInjector(['myModule']);
//         function Type(a, b) {
//             this.result = a + b;
//         }
//         var instance = injector.instantiate(Type, { b: 3 });
//         expect(instance.result).toBe(4);
//     });
//     it('allows registering a provider and uses its $get', function () {
//         var module = angular.module('myModule', []); module.provider('a', {
//             $get: function () {
//                 return 42;
//             }
//         });
//         var injector = createInjector(['myModule']);
//         expect(injector.has('a')).toBe(true);
//         expect(injector.get('a')).toBe(42);
//     });
//     it('injects the $get method of a provider', function () {
//         var module = angular.module('myModule', []); module.constant('a', 1);
//         module.provider('b', {
//             $get: function (a) {
//                 return a + 2;
//             }
//         });
//         var injector = createInjector(['myModule']); expect(injector.get('b')).toBe(3);
//     });
//     it('injects the $get method of a provider lazily', function () {
//         var module = angular.module('myModule', []); module.provider('b', {
//             $get: function (a) {
//                 return a + 2;
//             }
//         });
//         module.provider('a', { $get: _.constant(1) });
//         var injector = createInjector(['myModule']);
//         expect(injector.get('b')).toBe(3);
//     });
//     it('injects the $get method of a provider lazily', function () {
//         var module = angular.module('myModule', []); module.provider('b', {
//             $get: function (a) {
//                 return a + 2;
//             }
//         });
//         module.provider('a', { $get: _.constant(1) });
//         var injector = createInjector(['myModule']);
//         expect(injector.get('b')).toBe(3);
//     });
//     it('instantiates a dependency only once', function () {
//         var module = angular.module('myModule', []); module.provider('a', { $get: function () { return {}; } });
//         var injector = createInjector(['myModule']); expect(injector.get('a')).toBe(injector.get('a'));
//     });
//     it('notifies the user about a circular dependency', function () {
//         var module = angular.module('myModule', []); module.provider('a', { $get: function (b) { } }); module.provider('b', { $get: function (c) { } }); module.provider('c', { $get: function (a) { } });
//         var injector = createInjector(['myModule']);
//         expect(function () {
//             injector.get('a');
//         }).toThrowError(/Circular dependency found/);
//     });
//     it('injects the given provider constructor function', function () {
//         var module = angular.module('myModule', []);
//         module.constant('b', 2); module.provider('a', function AProvider(b) {
//             this.$get = function () { return 1 + b; };
//         });
//         var injector = createInjector(['myModule']); expect(injector.get('a')).toBe(3);
//     });
//     it('injects another provider to a provider constructor function', function () {
//         var module = angular.module('myModule', []);
//         module.provider('a', function AProvider() {
//             var value = 1;
//             this.setValue = function (v) { value = v; }; this.$get = function () { return value; };
//         });
//         module.provider('b', function BProvider(aProvider) {
//             aProvider.setValue(2);
//             this.$get = function () { };
//         });
//         var injector = createInjector(['myModule']); expect(injector.get('a')).toBe(2);
//     });
//     it('does not inject an instance to a provider constructor function', function () {
//         var module = angular.module('myModule', []);
//         module.provider('a', function AProvider() {
//             this.$get = function () { return 1; };
//         });
//         module.provider('b', function BProvider(a) {
//             this.$get = function () { return a; };
//         });
//         expect(function () {
//             createInjector(['myModule']);
//         }).toThrow();
//     });

//     it('does not inject a provider to a $get function', function () {
//         var module = angular.module('myModule', []);
//         module.provider('a', function AProvider() {
//             this.$get = function () { return 1; };
//         });
//         module.provider('b', function BProvider() {
//             this.$get = function (aProvider) { return aProvider.$get(); };
//         });
//         var injector = createInjector(['myModule']);
//         expect(function () {
//             injector.get('b');
//         }).toThrow();
//     });
//     it('runs run blocks when the injector is created', function () {
//         var module = angular.module('myModule', []);
//         var hasRun = false;
//         module.run(function () {
//             hasRun = true;
//         });
//         createInjector(['myModule']);
//         expect(hasRun).toBe(true);
//     });

//     it('injects run blocks with the instance injector', function () {
//         var module = angular.module('myModule', []);
//         module.provider('a', { $get: _.constant(42) });
//         var gotA; module.run(function (a) {
//             gotA = a;
//         });
//         createInjector(['myModule']);
//         expect(gotA).toBe(42);
//     });
//     it('configures all modules before running any run blocks', function () {
//         var module1 = angular.module('myModule', []);
//         module1.provider('a', { $get: _.constant(1) });
//         var result;
//         module1.run(function (a, b) {
//             result = a + b;
//         });
//         var module2 = angular.module('myOtherModule', []);
//         module2.provider('b', { $get: _.constant(2) });
//         createInjector(['myModule', 'myOtherModule']);
//         expect(result).toBe(3);
//     });

//     it('runs a function module dependency as a config block', function () {
//         var functionModule = function ($provide) {
//             $provide.constant('a', 42);
//         };
//         angular.module('myModule', [functionModule]);
//         var injector = createInjector(['myModule']);
//         expect(injector.get('a')).toBe(42);
//     });
//     it('runs a function module with array injection as a config block', function () {
//         var functionModule = ['$provide', function ($provide) {
//             $provide.constant('a', 42);
//         }];
//         angular.module('myModule', [functionModule]);
//         var injector = createInjector(['myModule']);
//         expect(injector.get('a')).toBe(42);
//     });
//     it('supports returning a run block from a function module', function () {
//         var result;
//         var functionModule = function ($provide) {
//             $provide.constant('a', 42); return function (a) {
//                 result = a;
//             };
//         };
//         angular.module('myModule', [functionModule]);
//         createInjector(['myModule']);
//         expect(result).toBe(42);
//     });
//     it('injects a factory function with instances', function () {
//         var module = angular.module('myModule', []);
//         module.factory('a', function () { return 1; });
//         module.factory('b', function (a) { return a + 2; });
//         var injector = createInjector(['myModule']);
//         expect(injector.get('b')).toBe(3);
//     });

//     it('forces a factory to return a value', function () {
//         var module = angular.module('myModule', []);
//         module.factory('a', function () { }); module.factory('b', function () { return null; });
//         var injector = createInjector(['myModule']);
//         expect(function () {
//             injector.get('a');
//         }).toThrow();
//         expect(injector.get('b')).toBeNull();
//     });
//     it('injects service constructors with instances', function () {
//         var module = angular.module('myModule', []);
//         module.value('theValue', 42);
//         module.service('aService', function MyService(theValue) {
//             this.getValue = function () { return theValue; };
//         });
//         var injector = createInjector(['myModule']);
//         expect(injector.get('aService').getValue()).toBe(42);
//     });

//     it('uses dependency injection with decorators', function () {
//         var module = angular.module('myModule', []); 
//         module.factory('aValue', function () {
//             return {};
//         });
//         module.constant('a', 42); 
//         module.decorator('aValue', function (a, $delegate) {
//             $delegate.decoratedKey = a;
//         });
//         var injector = createInjector(['myModule']); 
//         expect(injector.get('aValue').decoratedKey).toBe(42);
//     });

// });