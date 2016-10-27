function makeInjectorWithDirectives() {
    var args = arguments;
    return createInjector(['ng', function($compileProvider) {
        $compileProvider.directive.apply($compileProvider, args);
    }]);
}

function registerAndCompile(dirName, domString, callback) {
    var givenAttrs;
    var injector = makeInjectorWithDirectives(dirName, function() {
        return {
            restrict: 'EACM',
            compile: function(element, attrs) {
                givenAttrs = attrs;
            }
        };
    });
    injector.invoke(function($compile, $rootScope) {
        var el = $(domString);
        $compile(el);
        callback(el, givenAttrs, $rootScope);
    });
}
describe('$compile', function() {
    beforeEach(function() {
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
    describe('attributes', function() {
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
        it('adds an attribute from a class directive', function() {
            registerAndCompile(
                'myDirective',
                '<div class="my-directive"></div>',
                function(element, attrs) {
                    expect(attrs.hasOwnProperty('myDirective')).toBe(true);
                }
            );
        });
        it('does not add attribute from class without a directive', function() {
            registerAndCompile(
                'myDirective',
                '<my-directive class="some-class"></my-directive>',
                function(element, attrs) {
                    expect(attrs.hasOwnProperty('someClass')).toBe(false);
                }
            );
        });
        it('allows updating classes', function() {
            registerAndCompile(
                'myDirective',
                '<my-directive class="one three four"></my-directive>',
                function(element, attrs) {
                    attrs.$updateClass('one two three', 'one three four');
                    expect(element.hasClass('one')).toBe(true);
                    expect(element.hasClass('two')).toBe(true);
                    expect(element.hasClass('three')).toBe(true);
                    expect(element.hasClass('four')).toBe(false);
                });
        });
        describe('linking', function() {
            it('takes a scope and attaches it to elements', function() {
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        compile: _.noop
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el)($rootScope);
                    expect(el.data('$scope')).toBe($rootScope);
                });
            });
            it('calls directive link function with scope', function() {
                var givenScope, givenElement, givenAttrs;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        compile: function() {
                            return function link(scope, element, attrs) {
                                givenScope = scope;
                                givenElement = element;
                                givenAttrs = attrs;
                            };
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el)($rootScope);
                    expect(givenScope).toBe($rootScope);
                    expect(givenElement[0]).toBe(el[0]);
                    expect(givenAttrs).toBeDefined();
                    expect(givenAttrs.myDirective).toBeDefined();
                });
            });
            it('links directive on child elements first', function() {
                var givenElements = [];
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        link: function(scope, element, attrs) {
                            givenElements.push(element);
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive><div my-directive></div></div>');
                    $compile(el)($rootScope);
                    expect(givenElements.length).toBe(2);
                    expect(givenElements[0][0]).toBe(el[0].firstChild);
                    expect(givenElements[1][0]).toBe(el[0]);
                });
            });
            it('supports prelinking and postlinking', function() {
                var linkings = [];
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        link: {
                            pre: function(scope, element) {
                                linkings.push(['pre', element[0]]);
                            },
                            post: function(scope, element) {
                                linkings.push(['post', element[0]]);
                            }
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive><div my-directive></div></div>');
                    $compile(el)($rootScope);
                    expect(linkings.length).toBe(4);
                    expect(linkings[0]).toEqual(['pre', el[0]]);
                    expect(linkings[1]).toEqual(['pre', el[0].firstChild]);
                    expect(linkings[2]).toEqual(['post', el[0].firstChild]);
                    expect(linkings[3]).toEqual(['post', el[0]]);
                });
            });
            it('stabilizes node list during linking', function() {
                var givenElements = [];
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        link: function(scope, element, attrs) {
                            givenElements.push(element[0]);
                            element.after('<div></div>');
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div><div my-directive></div><div my-directive></div></div>');
                    var el1 = el[0].childNodes[0],
                        el2 = el[0].childNodes[1];
                    $compile(el)($rootScope);
                    expect(givenElements.length).toBe(2);
                    expect(givenElements[0]).toBe(el1);
                    expect(givenElements[1]).toBe(el2);
                });
            });
            it('makes new scope for element when directive asks for it', function() {
                var givenScope;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: true,
                        link: function(scope) {
                            givenScope = scope;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el)($rootScope);
                    expect(givenScope.$parent).toBe($rootScope);
                });
            });
            it('adds scope class and data for element with new scope', function() {
                var givenScope;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: true,
                        link: function(scope) {
                            givenScope = scope;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el)($rootScope);
                    expect(el.hasClass('ng-scope')).toBe(true);
                    expect(el.data('$scope')).toBe(givenScope);
                });
            });
            it('creates an isolate scope when requested', function() {
                var givenScope;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: {},
                        link: function(scope) {
                            givenScope = scope;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el)($rootScope);
                    expect(givenScope.$parent).toBe($rootScope);
                    expect(Object.getPrototypeOf(givenScope)).not.toBe($rootScope);
                });
            });
            it('allows observing attribute to the isolate scope', function() {
                var givenScope, givenAttrs;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: {
                            anAttr: '@'
                        },
                        link: function(scope, element, attrs) {
                            givenScope = scope;
                            givenAttrs = attrs;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el)($rootScope);
                    givenAttrs.$set('anAttr', '42');
                    expect(givenScope.anAttr).toEqual('42');
                });
            });

            it('sets initial value of observed attr to the isolate scope', function() {
                var givenScope;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: {
                            anAttr: '@'
                        },
                        link: function(scope, element, attrs) {
                            givenScope = scope;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive an-attr="42"></div>');
                    $compile(el)($rootScope);
                    expect(givenScope.anAttr).toEqual('42');
                });
            });
            it('allows aliasing observed attribute', function() {
                var givenScope;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: {
                            aScopeAttr: '@anAttr'
                        },
                        link: function(scope, element, attrs) {
                            givenScope = scope;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive an-attr="42"></div>');
                    $compile(el)($rootScope);
                    expect(givenScope.aScopeAttr).toEqual('42');
                });
            });
            it('evaluates isolate scope expression on parent scope', function() {
                var givenScope;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: {
                            myAttr: '='
                        },
                        link: function(scope) {
                            givenScope = scope;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    $rootScope.parentAttr = 41;
                    var el = $('<div my-directive my-attr="parentAttr + 1"></div>');
                    $compile(el)($rootScope);
                    expect(givenScope.myAttr).toBe(42);
                });
            });
            it('watches isolated scope expressions', function() {
                var givenScope;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: {
                            myAttr: '='
                        },
                        link: function(scope) {
                            givenScope = scope;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive my-attr="parentAttr + 1"></div>');
                    $compile(el)($rootScope);
                    $rootScope.parentAttr = 41;
                    $rootScope.$digest();
                    expect(givenScope.myAttr).toBe(42);
                });
            });
            it('allows binding an invokable expression on the parent scope', function() {
                var givenScope;
                var injector = makeInjectorWithDirectives('myDirective', function() {
                    return {
                        scope: {
                            myExpr: '&'
                        },
                        link: function(scope) {
                            givenScope = scope;
                        }
                    };
                });
                injector.invoke(function($compile, $rootScope) {
                    $rootScope.parentFunction = function() {
                        return 42;
                    };
                    var el = $('<div my-directive my-expr="parentFunction() + 1"></div>');
                    $compile(el)($rootScope);
                    expect(givenScope.myExpr()).toBe(43);
                });
            });
            it('compiles template contents also', function() {
                var compileSpy = jasmine.createSpy();
                var injector = makeInjectorWithDirectives({
                    myDirective: function() {
                        return {
                            template: '<div my-other-directive></div>'
                        };
                    },
                    myOtherDirective: function() {
                        return {
                            compile: compileSpy
                        };
                    }
                });
                injector.invoke(function($compile) {
                    var el = $('<div my-directive></div>');
                    $compile(el);
                    expect(compileSpy).toHaveBeenCalled();
                });
            });
            it('uses isolate scope for template contents', function() {
                var linkSpy = jasmine.createSpy();
                var injector = makeInjectorWithDirectives({
                    myDirective: function() {
                        return {
                            scope: {
                                isoValue: '=myDirective'
                            },
                            template: '<div my-other-directive></div>'
                        };
                    },
                    myOtherDirective: function() {
                        return {
                            link: linkSpy
                        };
                    }
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive="42"></div>');
                    $compile(el)($rootScope);
                    expect(linkSpy.calls.first().args[0]).not.toBe($rootScope);
                    expect(linkSpy.calls.first().args[0].isoValue).toBe(42);
                });
            });
        });
        describe('templateUrl', function() {
            var xhr, requests;
            beforeEach(function() {
                xhr = sinon.useFakeXMLHttpRequest();
                requests = [];
                xhr.onCreate = function(req) {
                    requests.push(req);
                };
            });
            afterEach(function() {
                xhr.restore();
            });
            it('fetches the template', function() {
                var injector = makeInjectorWithDirectives({
                    myDirective: function() {
                        return {
                            templateUrl: '/my_directive.html'
                        };
                    }
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el);
                    $rootScope.$apply();
                    expect(requests.length).toBe(1);
                    expect(requests[0].method).toBe('GET');
                    expect(requests[0].url).toBe('/my_directive.html');
                });
            });
            it('populates element with template', function() {
                var injector = makeInjectorWithDirectives({
                    myDirective: function() {
                        return {
                            templateUrl: '/my_directive.html'
                        };
                    }
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el);
                    $rootScope.$apply();
                    requests[0].respond(200, {}, '<div class="from-template"></div>');
                    expect(el.find('> .from-template').length).toBe(1);
                });
            });
            it('resumes child compilation after template received', function() {
                var otherCompileSpy = jasmine.createSpy();
                var injector = makeInjectorWithDirectives({
                    myDirective: function() {
                        return {
                            templateUrl: '/my_directive.html'
                        };
                    },
                    myOtherDirective: function() {
                        return {
                            compile: otherCompileSpy
                        };
                    }
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive></div>');
                    $compile(el);
                    $rootScope.$apply();
                    requests[0].respond(200, {}, '<div my-other-directive></div>');
                    expect(otherCompileSpy).toHaveBeenCalled();
                });
            });
            it('links directives that were compiled earlier', function() {
                var linkSpy = jasmine.createSpy();
                var injector = makeInjectorWithDirectives({
                    myDirective: function() {
                        return {
                            link: linkSpy
                        };
                    },
                    myOtherDirective: function() {
                        return {
                            templateUrl: '/my_other_directive.html'
                        };
                    }
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive my-other-directive></div>');
                    var linkFunction = $compile(el);
                    $rootScope.$apply();
                    linkFunction($rootScope);
                    requests[0].respond(200, {}, '<div></div>');
                    expect(linkSpy).toHaveBeenCalled();
                    expect(linkSpy.calls.argsFor(0)[0]).toBe($rootScope);
                    expect(linkSpy.calls.argsFor(0)[1][0]).toBe(el[0]);
                    expect(linkSpy.calls.argsFor(0)[2].myDirective).toBeDefined();
                });
            });
            it('sets up controllers for all controller directives', function() {
                var myDirectiveControllerInstantiated, myOtherDirectiveControllerInstantiated;
                var injector = makeInjectorWithDirectives({
                    myDirective: function() {
                        return {
                            controller: function MyDirectiveController() {
                                myDirectiveControllerInstantiated = true;
                            }
                        };
                    },
                    myOtherDirective: function() {
                        return {
                            templateUrl: '/my_other_directive.html',
                            controller: function MyOtherDirectiveController() {
                                myOtherDirectiveControllerInstantiated = true;
                            }
                        };
                    }
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-directive my-other-directive></div>');
                    $compile(el)($rootScope);
                    $rootScope.$apply();
                    requests[0].respond(200, {}, '<div></div>');
                    expect(myDirectiveControllerInstantiated).toBe(true);
                    expect(myOtherDirectiveControllerInstantiated).toBe(true);
                });
            });
            describe('+++++++++++++++++++++++++++transclude', function() {
                it('removes the children of the element from the DOM', function() {
                    var injector = makeInjectorWithDirectives({
                        myTranscluder: function() {
                            return {
                                transclude: true
                            };
                        }
                    });
                    injector.invoke(function($compile) {
                        var el = $('<div my-transcluder><div>Must go</div></div>');
                        $compile(el);
                        expect(el.is(':empty')).toBe(true);
                    });
                });
            });
            it('makes contents available to child elements', function() {
                var injector = makeInjectorWithDirectives({
                    myTranscluder: function() {
                        return {
                            transclude: true,
                            template: '<div in-template></div>' 
                        };
                    },
                    inTemplate: function() {
                        return {
                            link: function(scope, element, attrs, ctrl, transcludeFn) {
                                element.append(transcludeFn());
                            }
                        };
                    }
                });
                injector.invoke(function($compile, $rootScope) {
                    var el = $('<div my-transcluder><div in-transclude></div></div>');
                    $compile(el)($rootScope);
                    expect(el.find('> [in-template] > [in-transclude]').length).toBe(1);
                });
            });
        });
    });
});