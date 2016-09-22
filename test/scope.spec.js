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
// describe("inheritance", function () {
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
//     it("digests its children", function () {
//         var parent = new Scope();
//         var child = parent.$new();
//         parent.aValue = 'abc';
//         parent.$watch(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 scope.aValueWas = newValue;
//             })
//         child.cValue = "222";
//         child.$watch(
//             function (scope) { return scope.cValue; },
//             function (newValue, oldValue, scope) {
//                 scope.aValueWas = newValue;
//                 child.cValue = "4444";
//             }
//         );
//         parent.$digest();
//         expect(child.aValueWas).toBe('4444');
//     });
//     it("digests from root on $apply", function () {
//         var parent = new Scope();
//         var child = parent.$new();
//         var child2 = child.$new();
//         parent.aValue = 'abc';
//         parent.counter = 0;
//         parent.$watch(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         child2.$apply(function (scope) { });
//         expect(parent.counter).toBe(1);
//     });
//     it("schedules a digest from root on $evalAsync", function (done) {
//         var parent = new Scope();
//         var child = parent.$new();
//         var child2 = child.$new();
//         parent.aValue = 'abc';
//         parent.counter = 0;
//         parent.$watch(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         child2.$evalAsync(function (scope) { });
//         setTimeout(function () {
//             expect(parent.counter).toBe(1);
//             done();
//         }, 50);
//     });
//     it("does not have access to parent attributes when isolated", function () {
//         var parent = new Scope();
//         var child = parent.$new(true);
//         parent.aValue = 'abc';
//         expect(child.aValue).toBeUndefined();
//     });
//     it("cannot watch parent attributes when isolated", function () {
//         var parent = new Scope();
//         var child = parent.$new(true);
//         parent.aValue = 'abc';
//         child.$watch(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 scope.aValueWas = newValue;
//             }
//         );
//         child.$digest();
//         expect(child.aValueWas).toBeUndefined();
//     });
//     it("digests its isolated children", function () {
//         var parent = new Scope();
//         var child = parent.$new(true);
//         child.aValue = 'abc';
//         child.$watch(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 scope.aValueWas = newValue;
//             }
//         );
//         parent.$digest();
//         expect(child.aValueWas).toBe('abc');
//     });
//     it("digests from root on $apply when isolated", function () {
//         var parent = new Scope();
//         var child = parent.$new(true);
//         var child2 = child.$new();
//         parent.aValue = 'abc';
//         parent.counter = 0;
//         parent.$watch(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         child2.$apply(function (scope) { });
//         expect(parent.counter).toBe(1);
//     });
//     it("schedules a digest from root on $evalAsync when isolated", function (done) {
//         var parent = new Scope();
//         var child = parent.$new(true);
//         var child2 = child.$new();
//         parent.aValue = 'abc';
//         parent.counter = 0;
//         parent.$watch(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         child2.$evalAsync(function (scope) { });
//         setTimeout(function () {
//             expect(parent.counter).toBe(1); done();
//         }, 50);
//     });
//     it("executes $evalAsync functions on isolated scopes", function (done) {
//         var parent = new Scope();
//         var child = parent.$new(true);
//         child.$evalAsync(function (scope) {
//             scope.didEvalAsync = true;
//         }); setTimeout(function () {
//             expect(child.didEvalAsync).toBe(true);
//             done();
//         }, 50);
//     });
//     it("executes $$postDigest functions on isolated scopes", function () {
//         var parent = new Scope();
//         var child = parent.$new(true);
//         child.$$postDigest(function () {
//             child.didPostDigest = true;
//         });
//         parent.$digest();
//         expect(child.didPostDigest).toBe(true);
//     });
//     it("can take some other scope as the parent", function () {
//         var prototypeParent = new Scope();
//         var hierarchyParent = new Scope();
//         var child = prototypeParent.$new(false, hierarchyParent);
//         prototypeParent.a = 42;
//         expect(child.a).toBe(42);
//         child.counter = 0;
//         child.$watch(function (scope) {
//             scope.counter++;
//         });
//         prototypeParent.$digest();
//         expect(child.counter).toBe(0);
//         hierarchyParent.$digest();
//         expect(child.counter).toBe(2);
//     });
//     it("is no longer digested when $destroy has been called", function () {
//         var parent = new Scope();
//         var child = parent.$new();
//         child.aValue = [1, 2, 3];
//         child.counter = 0;
//         child.$watch(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             },
//             true);
//         parent.$digest();
//         expect(child.counter).toBe(1);
//         child.aValue.push(4);
//         parent.$digest();
//         expect(child.counter).toBe(2);
//         child.$destroy();
//         child.aValue.push(5);
//         parent.$digest();
//         expect(child.counter).toBe(2);
//     });

// });
// describe("$watchCollection", function () {
//     var scope;
//     beforeEach(function () {
//         scope = new Scope();
//     });
//     it("works like a normal watch for non-collections", function () {
//         var valueProvided;
//         scope.aValue = 42;
//         scope.counter = 0;
//         scope.$watchCollection(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 valueProvided = newValue;
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         expect(valueProvided).toBe(scope.aValue);
//         scope.aValue = 43;
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("notices when the value becomes an array", function () {
//         scope.counter = 0;
//         scope.$watchCollection(
//             function (scope) { return scope.arr; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         scope.arr = [1, 2, 3];
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("notices an item added to an array", function () {
//         scope.arr = [1, 2, 3];
//         scope.counter = 0;
//         scope.$watchCollection(
//             function (scope) { return scope.arr; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         scope.arr.push(4);
//         scope.$digest();
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("notices an item removed from an array", function () {
//         scope.arr = [1, 2, 3];
//         scope.counter = 0;

//         scope.$watchCollection(
//             function (scope) { return scope.arr; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);

//         scope.arr.shift();
//         scope.$digest();
//         expect(scope.counter).toBe(2);

//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("notices an item replaced in an array", function () {
//         scope.arr = [1, 2, 3];
//         scope.counter = 0;

//         scope.$watchCollection(
//             function (scope) { return scope.arr; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++
//             }
//         );

//         scope.$digest();
//         expect(scope.counter).toBe(1);

//         scope.arr[1] = 42;
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });

//     it("notices items reordered in an array", function () {
//         scope.arr = [2, 1, 3];
//         scope.counter = 0;
//         scope.$watchCollection(
//             function (scope) { return scope.arr; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         scope.arr.sort();
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("does not fail on NaNs in arrays", function () {
//         scope.arr = [2, NaN, 3];
//         scope.counter = 0;
//         scope.$watchCollection(
//             function (scope) { return scope.arr; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//     });
//     it("notices an item replaced in an arguments object", function () {
//         (function () {
//             scope.arrayLike = arguments;
//         })(1, 2, 3);
//         scope.counter = 0;
//         scope.$watchCollection(
//             function (scope) { return scope.arrayLike; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         scope.arrayLike[1] = 42;
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("notices when the value becomes an object", function () {
//         scope.counter = 0;
//         scope.$watchCollection(
//             function (scope) { return scope.obj; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         scope.obj = { a: 1 };
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("notices when an attribute is added to an object", function () {
//         scope.counter = 0;
//         scope.obj = { a: 1 };
//         scope.$watchCollection(
//             function (scope) { return scope.obj; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         scope.obj.b = 2;
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("notices when an attribute is changed in an object", function () {
//         scope.counter = 0;
//         scope.obj = { a: 1 };
//         scope.$watchCollection(
//             function (scope) { return scope.obj; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         scope.obj.a = 2;
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("does not fail on NaN attributes in objects", function () {
//         scope.counter = 0;
//         scope.obj = { a: NaN };
//         scope.$watchCollection(
//             function (scope) { return scope.obj; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//     });
//     it("notices when an attribute is removed from an object", function () {
//         scope.counter = 0;
//         scope.obj = { a: 1 };
//         scope.$watchCollection(
//             function (scope) { return scope.obj; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         expect(scope.counter).toBe(1);
//         delete scope.obj.a;
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("does not consider any object with a length property an array", function () {
//         scope.obj = { length: 42, otherKey: 'abc' };
//         scope.counter = 0;
//         scope.$watchCollection(
//             function (scope) { return scope.obj; },
//             function (newValue, oldValue, scope) {
//                 scope.counter++;
//             }
//         );
//         scope.$digest();
//         scope.obj.newKey = 'def';
//         scope.$digest();
//         expect(scope.counter).toBe(2);
//     });
//     it("gives the old non-collection value to listeners", function () {
//         scope.aValue = 42;
//         var oldValueGiven;
//         scope.$watchCollection(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 oldValueGiven = oldValue;
//             }
//         );
//         scope.$digest();
//         scope.aValue = 43;
//         scope.$digest();
//         expect(oldValueGiven).toBe(42);
//     });
//     it("gives the old array value to listeners", function () {
//         scope.aValue = [1, 2, 3];
//         var oldValueGiven;
//         scope.$watchCollection(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 oldValueGiven = oldValue;
//             }
//         );
//         scope.$digest();
//         scope.aValue.push(4);
//         scope.$digest();
//         expect(oldValueGiven).toEqual([1, 2, 3]);
//     });
//     it("uses the new value as the old value on first digest", function () {
//         scope.aValue = { a: 1, b: 2 };
//         var oldValueGiven;
//         scope.$watchCollection(
//             function (scope) { return scope.aValue; },
//             function (newValue, oldValue, scope) {
//                 oldValueGiven = oldValue;
//             }
//         );
//         scope.$digest();
//         expect(oldValueGiven).toEqual({ a: 1, b: 2 });
//     });
// });

// describe("Events", function () {
//     var parent;
//     var scope;
//     var child;
//     var isolatedChild;
//     beforeEach(function () {
//         parent = new Scope();
//         scope = parent.$new();
//         child = scope.$new();
//         isolatedChild = scope.$new(true);
//     });
//     it("allows registering listeners", function () {
//         var listener1 = function () { };
//         var listener2 = function () { };
//         var listener3 = function () { };
//         scope.$on('someEvent', listener1);
//         scope.$on('someEvent', listener2);
//         scope.$on('someOtherEvent', listener3);
//         expect(scope.$$listeners).toEqual({
//             someEvent: [listener1, listener2],
//             someOtherEvent: [listener3]
//         });
//     });
//     it("registers different listeners for every scope", function () {
//         var listener1 = function () { };
//         var listener2 = function () { };
//         var listener3 = function () { };
//         scope.$on('someEvent', listener1);
//         child.$on('someEvent', listener2);
//         isolatedChild.$on('someEvent', listener3);
//         expect(scope.$$listeners).toEqual({ 'someEvent': [listener1] });
//         expect(child.$$listeners).toEqual({ 'someEvent': [listener2] });
//         expect(isolatedChild.$$listeners).toEqual({ 'someEvent': [listener3] });
//     });
//     it("calls the listeners of the matching event on $emit", function () {
//         var listener1 = jasmine.createSpy();
//         var listener2 = jasmine.createSpy();
//         scope.$on('someEvent', listener1);
//         scope.$on('someOtherEvent', listener2);
//         scope.$emit('someEvent');
//         expect(listener1).toHaveBeenCalled();
//         expect(listener2).not.toHaveBeenCalled();
//     });
//     it("calls the listeners of the matching event on $broadcast", function () {
//         var listener1 = jasmine.createSpy();
//         var listener2 = jasmine.createSpy();
//         scope.$on('someEvent', listener1);
//         scope.$on('someOtherEvent', listener2);
//         scope.$broadcast('someEvent');
//         expect(listener1).toHaveBeenCalled();
//         expect(listener2).not.toHaveBeenCalled();
//     });
//     _.forEach(['$emit', '$broadcast'], function (method) {
//         it("calls listeners registered for matching events on " + method, function () {
//             var listener1 = jasmine.createSpy();
//             var listener2 = jasmine.createSpy();
//             scope.$on('someEvent', listener1);
//             scope.$on('someOtherEvent', listener2);
//             scope[method]('someEvent');
//             expect(listener1).toHaveBeenCalled();
//             expect(listener2).not.toHaveBeenCalled();
//         });
//         it("passes an event object with a name to listeners on " + method, function () {
//             var listener = jasmine.createSpy();
//             scope.$on('someEvent', listener);
//             scope[method]('someEvent');
//             expect(listener).toHaveBeenCalled();
//             expect(listener.calls.mostRecent().args[0].name).toEqual('someEvent');
//         });
//         it("passes the same event object to each listener on " + method, function () {
//             var listener1 = jasmine.createSpy();
//             var listener2 = jasmine.createSpy();
//             scope.$on('someEvent', listener1);
//             scope.$on('someEvent', listener2);
//             scope[method]('someEvent');
//             var event1 = listener1.calls.mostRecent().args[0];
//             var event2 = listener2.calls.mostRecent().args[0];
//             expect(event1).toBe(event2);
//         });
//         it("passes additional arguments to listeners on " + method, function () {
//             var listener = jasmine.createSpy();
//             scope.$on('someEvent', listener);
//             scope[method]('someEvent', 'and', ['additional', 'arguments'], '...');
//             expect(listener.calls.mostRecent().args[1]).toEqual('and');
//             expect(listener.calls.mostRecent().args[2]).toEqual(['additional', 'arguments']);
//             expect(listener.calls.mostRecent().args[3]).toEqual('...');
//         });
//         it("returns the event object on " + method, function () {
//             var returnedEvent = scope[method]('someEvent');
//             expect(returnedEvent).toBeDefined();
//             expect(returnedEvent.name).toEqual('someEvent');
//         });
//         it("can be deregistered " + method, function () {
//             var listener = jasmine.createSpy();
//             var deregister = scope.$on('someEvent', listener);
//             deregister();
//             scope[method]('someEvent');
//             expect(listener).not.toHaveBeenCalled();
//         });
//         it("does not skip the next listener when removed on " + method, function () {
//             var deregister;
//             var listener = function () {
//                 deregister();
//             };
//             var nextListener = jasmine.createSpy();
//             deregister = scope.$on('someEvent', listener);
//             scope.$on('someEvent', nextListener);
//             scope[method]('someEvent');
//             expect(nextListener).toHaveBeenCalled();
//         });
//         it("is sets defaultPrevented when preventDefault called on " + method, function () {
//             var listener = function (event) {
//                 event.preventDefault();
//             };
//             scope.$on('someEvent', listener);
//             var event = scope[method]('someEvent');
//             expect(event.defaultPrevented).toBe(true);
//         });
//         it("does not stop on exceptions on " + method, function () {
//             var listener1 = function (event) {
//                 throw 'listener1 throwing an exception';
//             };
//             var listener2 = jasmine.createSpy(); 
//             scope.$on('someEvent', listener1); 
//             scope.$on('someEvent', listener2);
//             scope[method]('someEvent');
//             expect(listener2).toHaveBeenCalled();
//         });

//     });
//     it("propagates up the scope hierarchy on $emit", function () {
//         var parentListener = jasmine.createSpy();
//         var scopeListener = jasmine.createSpy();
//         parent.$on('someEvent', parentListener);
//         scope.$on('someEvent', scopeListener);
//         scope.$emit('someEvent');
//         expect(scopeListener).toHaveBeenCalled();
//         expect(parentListener).toHaveBeenCalled();
//     });
//     it("propagates down the scope hierarchy on $broadcast", function () {
//         var scopeListener = jasmine.createSpy();
//         var childListener = jasmine.createSpy();
//         var isolatedChildListener = jasmine.createSpy();
//         scope.$on('someEvent', scopeListener);
//         child.$on('someEvent', childListener);
//         isolatedChild.$on('someEvent', isolatedChildListener);
//         scope.$broadcast('someEvent');
//         expect(scopeListener).toHaveBeenCalled();
//         expect(childListener).toHaveBeenCalled();
//         expect(isolatedChildListener).toHaveBeenCalled();
//     });
//     it("propagates the same event down on $broadcast", function () {
//         var scopeListener = jasmine.createSpy();
//         var childListener = jasmine.createSpy();
//         scope.$on('someEvent', scopeListener);
//         child.$on('someEvent', childListener);
//         scope.$broadcast('someEvent');
//         var scopeEvent = scopeListener.calls.mostRecent().args[0];
//         var childEvent = childListener.calls.mostRecent().args[0];
//         expect(scopeEvent).toBe(childEvent);
//     });
//     it("attaches targetScope on $emit", function () {
//         var scopeListener = jasmine.createSpy();
//         var parentListener = jasmine.createSpy();
//         scope.$on('someEvent', scopeListener);
//         parent.$on('someEvent', parentListener);
//         scope.$emit('someEvent');
//         expect(scopeListener.calls.mostRecent().args[0].targetScope).toBe(scope);
//         expect(parentListener.calls.mostRecent().args[0].targetScope).toBe(scope);
//     });
//     it("attaches targetScope on $broadcast", function () {
//         var scopeListener = jasmine.createSpy();
//         var childListener = jasmine.createSpy();
//         scope.$on('someEvent', scopeListener);
//         child.$on('someEvent', childListener);
//         scope.$broadcast('someEvent');
//         expect(scopeListener.calls.mostRecent().args[0].targetScope).toBe(scope);
//         expect(childListener.calls.mostRecent().args[0].targetScope).toBe(scope);
//     });
//     it("attaches currentScope on $emit", function () {
//         var currentScopeOnScope, currentScopeOnParent;
//         var scopeListener = function (event) {
//             currentScopeOnScope = event.currentScope;
//         };
//         var parentListener = function (event) {
//             currentScopeOnParent = event.currentScope;
//         };
//         scope.$on('someEvent', scopeListener);
//         parent.$on('someEvent', parentListener);
//         scope.$emit('someEvent');
//         expect(currentScopeOnScope).toBe(scope);
//         expect(currentScopeOnParent).toBe(parent);
//     });
//     it("sets currentScope to null after propagation on $emit", function () {
//         var event;
//         var scopeListener = function (evt) {
//             event = evt;
//         };
//         scope.$on('someEvent', scopeListener);
//         scope.$emit('someEvent');
//         expect(event.currentScope).toBe(null);
//     });
//     it("sets currentScope to null after propagation on $broadcast", function () {
//         var event;
//         var scopeListener = function (evt) {
//             event = evt;
//         };
//         scope.$on('someEvent', scopeListener);
//         scope.$broadcast('someEvent');
//         expect(event.currentScope).toBe(null);
//     });
//     it("does not propagate to parents when stopped", function () {
//         var scopeListener = function (event) {
//             event.stopPropagation();
//         };
//         var parentListener = jasmine.createSpy();
//         scope.$on('someEvent', scopeListener);
//         parent.$on('someEvent', parentListener);
//         scope.$emit('someEvent');
//         expect(parentListener).not.toHaveBeenCalled();
//     });
//     it("is received by listeners on current scope after being stopped", function () {
//         var listener1 = function (event) {
//             event.stopPropagation();
//         };
//         var listener2 = jasmine.createSpy();
//         scope.$on('someEvent', listener1);
//         scope.$on('someEvent', listener2);
//         scope.$emit('someEvent');
//         expect(listener2).toHaveBeenCalled();
//     });
//     it("fires $destroy when destroyed", function () {
//         var listener = jasmine.createSpy();
//         scope.$on('$destroy', listener);
//         scope.$destroy();
//         expect(listener).toHaveBeenCalled();
//     });
//     it("fires $destroy on children destroyed", function () {
//         var listener = jasmine.createSpy();
//         child.$on('$destroy', listener);
//         scope.$destroy();
//         expect(listener).toHaveBeenCalled();
//     });
//     it('no longers calls listeners after destroyed', function () {
//         var listener = jasmine.createSpy();
//         scope.$on('myEvent', listener);
//         scope.$destroy();
//         scope.$emit('myEvent');
//         expect(listener).not.toHaveBeenCalled();
//     });
// });
