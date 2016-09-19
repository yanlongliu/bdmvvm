// describe("Scope", function () {
//     it("can be constructed and used as an object", function () {
//         var scope = new Scope();
//         scope.aProperty = 1;
//         expect(scope.aProperty).toBe(1);
//     });
//     describe("digest", function () {
//         var scope;
//         beforeEach(function () {
//             scope = new Scope();
//         });
//         it("calls the listener function of a watch on first $digest", function () {
//             var watchFn = function () { return 'wat'; };
//             var listenerFn = jasmine.createSpy();
//             scope.$watch(watchFn, listenerFn);
//             scope.$digest();
//             expect(listenerFn).toHaveBeenCalled();
//         });
//         it("calls the listener function when the watched value changes", function () {
//             scope.someValue = 'a';
//             scope.counter = 0;
//             scope.$watch(
//                 function (scope) { return scope.someValue; }, function (newValue, oldValue, scope) { scope.counter++; }
//             );
//             expect(scope.counter).toBe(0);
//             scope.$digest();
//             expect(scope.counter).toBe(1);
//             scope.$digest();
//             expect(scope.counter).toBe(1);
//             scope.someValue = 'b';
//             expect(scope.counter).toBe(1);
//             scope.$digest();
//             expect(scope.counter).toBe(2);
//         });
//         it("calls listener with new value as old value the first time", function () {
//             scope.someValue = 123;
//             var oldValueGiven;
//             scope.$watch(
//                 function (scope) { return scope.someValue; },
//                 function (newValue, oldValue, scope) { oldValueGiven = oldValue; }
//             );
//             scope.$digest();
//             expect(oldValueGiven).toBe(123);
//         });
//         it("may have watchers that omit the listener function", function () {
//             var watchFn = jasmine.createSpy().and.returnValue('something');
//             scope.$watch(watchFn);
//             scope.$digest();
//             expect(watchFn).toHaveBeenCalled();
//         });
//         it("executes $evalAsync ed function later in the same cycle", function () {
//             scope.aValue = [1, 2, 3];
//             scope.asyncEvaluated = false;
//             scope.asyncEvaluatedImmediately = false;
//             scope.$watch(
//                 function (scope) { return scope.aValue; },
//                 function (newValue, oldValue, scope) {
//                     scope.$evalAsync(function (scope) {
//                         scope.asyncEvaluated = true;
//                     });
//                     scope.asyncEvaluatedImmediately = scope.asyncEvaluated;
//                 }
//             );
//             scope.$digest(); expect(scope.asyncEvaluated).toBe(true); expect(scope.asyncEvaluatedImmediately).toBe(false);
//         });
//         it('allows async $apply with $applyAsync', function (done) {
//             scope.counter = 0;
//             scope.$watch(
//                 function (scope) { return scope.aValue; },
//                 function (newValue, oldValue, scope) {
//                     scope.counter++;
//                 }
//             );
//             scope.$digest();
//             expect(scope.counter).toBe(1);
//             scope.$applyAsync(function (scope) {
//                 scope.aValue = 'abc';
//             });
//             expect(scope.counter).toBe(1);
//             setTimeout(function () {
//                 expect(scope.counter).toBe(2);
//                 done();
//             }, 50);
//         });
//         it("schedules a digest in $evalAsync", function (done) {
//             scope.aValue = "abc";
//             scope.counter = 0;
//             scope.$watch(
//                 function (scope) { return scope.aValue; },
//                 function (newValue, oldValue, scope) {
//                     scope.counter++;
//                 }
//             );
//             scope.$evalAsync(function (scope) { });
//             expect(scope.counter).toBe(0);
//             setTimeout(function () {
//                 expect(scope.counter).toBe(1);
//                 done();
//             }, 50);
//         });
//         it('cancels and flushes $applyAsync if digested first', function (done) {
//             scope.counter = 0;
//             scope.$watch(function (scope) {
//                 scope.counter++;
//                 return scope.aValue;
//             },
//                 function (newValue, oldValue, scope) { });
//             scope.$applyAsync(function (scope) {
//                 scope.aValue = 'abc';
//             });
//             scope.$applyAsync(function (scope) {
//                 scope.aValue = 'def';
//             });
//             scope.$digest();
//             expect(scope.counter).toBe(2);
//             expect(scope.aValue).toEqual('def');
//             setTimeout(function () {
//                 expect(scope.counter).toBe(2); done();
//             }, 50);
//         });

//         it("allows destroying a $watch with a removal function", function () {
//             scope.aValue = 'abc';
//             scope.counter = 0;
//             var destroyWatch = scope.$watch(
//                 function (scope) { return scope.aValue; },
//                 function (newValue, oldValue, scope) {
//                     scope.counter++;
//                 }
//             );
//             scope.$digest();
//             expect(scope.counter).toBe(1);
//             scope.aValue = 'def';
//             scope.$digest();
//             expect(scope.counter).toBe(2);
//             scope.aValue = 'ghi';
//             destroyWatch();
//             scope.$digest();
//             expect(scope.counter).toBe(2);
//         });

//         it("allows destroying several $watches during digest", function () {
//             scope.aValue = 'abc';
//             scope.counter = 0;
//             var destroyWatch1 = scope.$watch(function (scope) {
//                 destroyWatch1();
//                 destroyWatch2();
//             });
//             var destroyWatch2 = scope.$watch(
//                 function (scope) { return scope.aValue; },
//                 function (newValue, oldValue, scope) {
//                     scope.counter++;
//                 }
//             );
//             scope.$digest();
//             expect(scope.counter).toBe(0);
//         });
//         it('uses different arrays for old and new values on subsequent runs', function () {
//             var gotNewValues, gotOldValues;
//             scope.aValue = 1;
//             scope.anotherValue = 2;
//             scope.$watchGroup([
//                 function (scope) { return scope.aValue; },
//                 function (scope) { return scope.anotherValue; }
//             ], function (newValues, oldValues, scope) {
//                 gotNewValues = newValues;
//                 gotOldValues = oldValues;
//             });
//             scope.$digest();
//             scope.anotherValue = 3;
//             scope.$digest();
//             expect(gotNewValues).toEqual([1, 3]);
//             expect(gotOldValues).toEqual([1, 2]);
//         });
//         it('calls the listener once when the watch array is empty', function () {
//             var gotNewValues, gotOldValues;
//             scope.$watchGroup([], function (newValues, oldValues, scope) {
//                 gotNewValues = newValues;
//                 gotOldValues = oldValues;
//             });
//             scope.$digest();
//             expect(gotNewValues).toEqual([]);
//             expect(gotOldValues).toEqual([]);
//         });
//         it('can be deregistered', function () {
//             var counter = 0;
//             scope.aValue = 1;
//             scope.anotherValue = 2;
//             var destroyGroup = scope.$watchGroup([
//                 function (scope) { return scope.aValue; },
//                 function (scope) { return scope.anotherValue; }
//             ], function (newValues, oldValues, scope) {
//                 counter++;
//             });
//             scope.$digest();
//             scope.anotherValue = 3;
//             destroyGroup();
//             scope.$digest();
//             expect(counter).toEqual(1);
//         });
//         it('does not call the zero- watch listener when deregistered first', function () {
//             var counter = 0;
//             var destroyGroup = scope.$watchGroup([], function (newValues, oldValues, scope) {
//                 counter++;
//             });
//             destroyGroup();
//             scope.$digest();
//             expect(counter).toEqual(0);
//         });

//     });
// });
describe("inheritance", function () {
    // it("inherits the parent s properties", function () {
    //     var parent = new Scope();
    //     parent.aValue = [1, 2, 3];
    //     var child = parent.$new();
    //     expect(child.aValue).toEqual([1, 2, 3]);
    // });
    // it("can watch a property in the parent", function () {
    //     var parent = new Scope();
    //     var child = parent.$new();
    //     parent.aValue = [1, 2, 3];
    //     child.counter = 0;
    //     child.$watch(
    //         function (scope) { return scope.aValue; },
    //         function (newValue, oldValue, scope) {
    //             scope.counter++;
    //         },
    //         true
    //     );
    //     child.$digest();
    //     expect(child.counter).toBe(1);
    //     parent.aValue.push(4);
    //     child.$digest();
    //     expect(child.counter).toBe(2);
    // });
    // it("shadows a parent s property with the same name", function () {
    //     var parent = new Scope();
    //     var child = parent.$new();
    //     parent.name = 'Joe';
    //     child.name = 'Jill';
    //     expect(child.name).toBe('Jill');
    //     expect(parent.name).toBe('Joe');
    // });
    // it("does not shadow members of parent scope s attributes", function () {
    //     var parent = new Scope();
    //     var child = parent.$new();
    //     parent.user = { name: 'Joe' };
    //     child.user.name = 'Jill';
    //     expect(child.user.name).toBe('Jill');
    //     expect(parent.user.name).toBe('Jill');
    // });
    // it("does not digest its parent(s)", function () {
    //     var parent = new Scope();
    //     var child = parent.$new();
    //     parent.aValue = 'abc';
    //     parent.$watch(
    //         function (scope) { return scope.aValue; },
    //         function (newValue, oldValue, scope) {
    //             scope.aValueWas = newValue;
    //         }
    //     );
    //     child.$digest();
    //     expect(child.aValueWas).toBeUndefined();
    // });
    // it("keeps a record of its children", function () {
    //     var parent = new Scope();
    //     var child1 = parent.$new();
    //     var child2 = parent.$new();
    //     var child2_1 = child2.$new();
    //     expect(parent.$$children.length).toBe(2);
    //     expect(parent.$$children[0]).toBe(child1);
    //     expect(parent.$$children[1]).toBe(child2);
    //     expect(child1.$$children.length).toBe(0);
    //     expect(child2.$$children.length).toBe(1);
    //     expect(child2.$$children[0]).toBe(child2_1);
    // });
    it("digests its children", function () {
        var parent = new Scope();
        var child = parent.$new();
        parent.aValue = 'abc';
        parent.$watch(
            function (scope) { return scope.aValue; },
            function (newValue, oldValue, scope) {
                scope.aValueWas = newValue;
            })
        child.cValue = "222";
        child.$watch(
            function (scope) { return scope.cValue; },
            function (newValue, oldValue, scope) {
                scope.aValueWas = newValue;
                child.cValue = "4444";
            }
        );
        parent.$digest();
        expect(child.aValueWas).toBe('4444');
    });
    it("digests from root on $apply", function () {
        var parent = new Scope();
        var child = parent.$new();
        var child2 = child.$new();
        parent.aValue = 'abc';
        parent.counter = 0;
        parent.$watch(
            function (scope) { return scope.aValue; },
            function (newValue, oldValue, scope) {
                scope.counter++;
            }
        );
        child2.$apply(function (scope) { });
        expect(parent.counter).toBe(1);
    });
    it("schedules a digest from root on $evalAsync", function (done) {
        var parent = new Scope();
        var child = parent.$new();
        var child2 = child.$new();
        parent.aValue = 'abc';
        parent.counter = 0;
        parent.$watch(
            function (scope) { return scope.aValue; },
            function (newValue, oldValue, scope) {
                scope.counter++;
            }
        );
        child2.$evalAsync(function (scope) { });
        setTimeout(function () {
            expect(parent.counter).toBe(1);
            done();
        }, 50);
    });
    it("does not have access to parent attributes when isolated", function () {
        var parent = new Scope();
        var child = parent.$new(true);
        parent.aValue = 'abc';
        expect(child.aValue).toBeUndefined();
    });
    it("cannot watch parent attributes when isolated", function () {
        var parent = new Scope();
        var child = parent.$new(true);
        parent.aValue = 'abc';
        child.$watch(
            function (scope) { return scope.aValue; },
            function (newValue, oldValue, scope) {
                scope.aValueWas = newValue;
            }
        );
        child.$digest();
        expect(child.aValueWas).toBeUndefined();
    });
    it("digests its isolated children", function () {
        var parent = new Scope();
        var child = parent.$new(true);
        child.aValue = 'abc';
        child.$watch(
            function (scope) { return scope.aValue; },
            function (newValue, oldValue, scope) {
                scope.aValueWas = newValue;
            }
        );
        parent.$digest();
        expect(child.aValueWas).toBe('abc');
    });
    it("digests from root on $apply when isolated", function () {
        var parent = new Scope();
        var child = parent.$new(true);
        var child2 = child.$new();
        parent.aValue = 'abc';
        parent.counter = 0;
        parent.$watch(
            function (scope) { return scope.aValue; },
            function (newValue, oldValue, scope) {
                scope.counter++;
            }
        );
        child2.$apply(function (scope) { });
        expect(parent.counter).toBe(1);
    });
    it("schedules a digest from root on $evalAsync when isolated", function (done) {
        var parent = new Scope();
        var child = parent.$new(true);
        var child2 = child.$new();
        parent.aValue = 'abc';
        parent.counter = 0;
        parent.$watch(
            function (scope) { return scope.aValue; },
            function (newValue, oldValue, scope) {
                scope.counter++;
            }
        );
        child2.$evalAsync(function (scope) { });
        setTimeout(function () {
            expect(parent.counter).toBe(1); done();
        }, 50);
    });
    it("executes $evalAsync functions on isolated scopes", function (done) {
        var parent = new Scope();
        var child = parent.$new(true);
        child.$evalAsync(function (scope) {
            scope.didEvalAsync = true;
        }); setTimeout(function () {
            expect(child.didEvalAsync).toBe(true);
            done();
        }, 50);
    });
    it("executes $$postDigest functions on isolated scopes", function () {
        var parent = new Scope();
        var child = parent.$new(true);
        child.$$postDigest(function () {
            child.didPostDigest = true;
        });
        parent.$digest();
        expect(child.didPostDigest).toBe(true);
    });
    it("can take some other scope as the parent", function () {
        var prototypeParent = new Scope();
        var hierarchyParent = new Scope();
        var child = prototypeParent.$new(false, hierarchyParent);
        prototypeParent.a = 42;
        expect(child.a).toBe(42);
        child.counter = 0; 
        child.$watch(function (scope) {
            scope.counter++;
        });
        prototypeParent.$digest();
        expect(child.counter).toBe(0);
        hierarchyParent.$digest();
        expect(child.counter).toBe(2);
    });
});
