function makeInjectorWithDirectives() {
    var args = arguments;
    return createInjector(['ng', function ($compileProvider) {
        $compileProvider.directive.apply($compileProvider, args);
    }]);
}
function registerAndCompile(dirName, domString, callback) {
    var givenAttrs;
    var injector = makeInjectorWithDirectives(dirName, function () {
        return {
            restrict: 'EACM',
            compile: function (element, attrs) {
                givenAttrs = attrs;
            }
        };
    });
    injector.invoke(function ($compile, $rootScope) {
        var el = $(domString);
        $compile(el);
        callback(el, givenAttrs, $rootScope);
    });
}
describe('$compile', function () {
    beforeEach(function () {
        delete window.angular;
        publishExternalAPI();
    });
    // it('allows creating directives', function () {
    //     var myModule = window.angular.module('myModule', []);
    //     myModule.directive('testing', function () { });
    //     var injector = createInjector(['ng', 'myModule']);
    //     expect(injector.has('testingDirective')).toBe(true);
    // });
    // it('allows creating many directives with the same name', function () {
    //     var myModule = window.angular.module('myModule', []);
    //     myModule.directive('testing', _.constant({ d: 'one' }));
    //     myModule.directive('testing', _.constant({ d: 'two' }));
    //     var injector = createInjector(['ng', 'myModule']);
    //     var result = injector.get('testingDirective');
    //     expect(result.length).toBe(2);
    //     expect(result[0].d).toEqual('one');
    //     expect(result[1].d).toEqual('two');
    // });
    // it('compiles element directives from a single element', function () {
    //     var injector = makeInjectorWithDirectives('myDirective', function () {
    //         return {
    //             compile: function (element) {
    //                 element.data('hasCompiled', true);
    //             }
    //         };
    //     });
    //     injector.invoke(function ($compile) {
    //         var el = $('<my-directive></my-directive>');
    //         $compile(el);
    //         expect(el.data('hasCompiled')).toBe(true);
    //     });
    // });
    // it('allows applying a directive to multiple elements', function () {
    //     var compileEl = false;
    //     var injector = makeInjectorWithDirectives('myDir', function () {
    //         return {
    //             multiElement: true,
    //             compile: function (element) {
    //                 compileEl = element;
    //             }
    //         };
    //     });
    //     injector.invoke(function ($compile) {
    //         var el = $('<div my-dir-start></div><span></span><div my-dir-end></div>');
    //         $compile(el);
    //         expect(compileEl.length).toBe(3);
    //     });
    // });
    describe('attributes', function () {
        //     it('passes the element attributes to the compile function', function () {
        //         var injector = makeInjectorWithDirectives('myDirective', function () {
        //             return {
        //                 restrict: 'E',
        //                 compile: function (element, attrs) {
        //                     element.data('givenAttrs', attrs);
        //                 }
        //             };
        //         });
        //         injector.invoke(function ($compile) {
        //             var el = $('<my-directive my-attr="1" my-other-attr="two"></my-directive>');
        //             $compile(el);
        //             expect(el.data('givenAttrs').myAttr).toEqual('1');
        //             expect(el.data('givenAttrs').myOtherAttr).toEqual('two');
        //         });
        //     });
        //     it('sets the value of boolean attributes to true', function () {
        //         registerAndCompile(
        //             'myDirective',
        //             '<input my-directive disabled>',
        //             function (element, attrs) {
        //                 expect(attrs.disabled).toBe(true);
        //             }
        //         );
        //     });
        //     it('overrides attributes with ng- attr - versions', function () {
        //         registerAndCompile(
        //             'myDirective',
        //             '<input my-directive ng-attr-whatever="42" whatever="41">',
        //             function (element, attrs) {
        //                 expect(attrs.whatever).toEqual('42');
        //             }
        //         );
        //     });
        //     it('sets attributes to DOM', function () {
        //         registerAndCompile(
        //             'myDirective',
        //             '<my-directive attr="true"></my-directive>',
        //             function (element, attrs) {
        //                 attrs.$set('attr', 'false');
        //                 expect(element.attr('attr')).toEqual('false');
        //             }
        //         );
        //     });
        //     it('sets prop for boolean attributes even when not flushing', function () {
        //         registerAndCompile(
        //             'myDirective',
        //             '<input my-directive>',
        //             function (element, attrs) {
        //                 attrs.$set('disabled', true, false);
        //                 expect(element.prop('disabled')).toBe(true);
        //             }
        //         );
        //     });
        //     it('denormalizes attribute by snake- casing', function () {
        //         registerAndCompile(
        //             'myDirective',
        //             '<my-directive some-attribute="42"></my-directive>',
        //             function (element, attrs) {
        //                 attrs.$set('someAttribute', 43);
        //                 expect(element.attr('some-attribute')).toEqual('43');
        //             }
        //         );
        //     });
        // it('denormalizes attribute by using original attribute name', function () {
        //     registerAndCompile(
        //         'myDirective',
        //         '<my-directive x-some-attribute="42"></my-directive>',
        //         function (element, attrs) {
        //             attrs.$set('someAttribute', '43');
        //             expect(element.attr('x-some-attribute')).toEqual('43');
        //         }
        //     );
        // });
        // it('does not use ng- attr - prefix in denormalized names', function () {
        //     registerAndCompile(
        //         'myDirective',
        //         '<my-directive ng-attr-some-attribute="42"></my-directive>',
        //         function (element, attrs) {
        //             attrs.$set('someAttribute', 43);
        //             expect(element.attr('some-attribute')).toEqual('43');
        //         }
        //     );
        // });
        // it('calls observer immediately when attribute is $set', function () {
        //     registerAndCompile(
        //         'myDirective',
        //         '<my-directive some-attribute="42"></my-directive>',
        //         function (element, attrs) {
        //             var gotValue;
        //             attrs.$observe('someAttribute', function (value) {
        //                 gotValue = value;
        //             });
        //             attrs.$set('someAttribute', '43');
        //             expect(gotValue).toEqual('43');
        //         });
        // });
        // it('calls observer on next $digest after registration', function () {
        //     registerAndCompile(
        //         'myDirective',
        //         '<my-directive some-attribute="42"></my-directive>', 
        //         function (element, attrs, $rootScope) {
        //             var gotValue;
        //             attrs.$observe('someAttribute', function (value) {
        //                 gotValue = value;
        //             });
        //             $rootScope.$digest();
        //             expect(gotValue).toEqual('42');
        //         });
        // });
        it('adds an attribute from a class directive', function () {
            registerAndCompile(
                'myDirective',
                '<div class="my-directive"></div>',
                function (element, attrs) {
                    expect(attrs.hasOwnProperty('myDirective')).toBe(true);
                }
            );
        });
        it('does not add attribute from class without a directive', function () {
            registerAndCompile(
                'myDirective',
                '<my-directive class="some-class"></my-directive>', 
                function (element, attrs) {
                    expect(attrs.hasOwnProperty('someClass')).toBe(false);
                }
            );
        });

    });
});
