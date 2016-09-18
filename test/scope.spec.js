describe("Scope", function () {
    it("can be constructed and used as an object", function () {
        var scope = new Scope();
        scope.aProperty = 1;
        expect(scope.aProperty).toBe(1);
    });
    describe("digest", function () {
        var scope;
        beforeEach(function () {
            scope = new Scope();
        });
        // it("calls the listener function of a watch on first $digest", function () {
        //     var watchFn = function () { return 'wat'; };
        //     var listenerFn = jasmine.createSpy();
        //     scope.$watch(watchFn, listenerFn);
        //     scope.$digest();
        //     expect(listenerFn).toHaveBeenCalled();
        // });
        // it("calls the listener function when the watched value changes", function () {
        //     scope.someValue = 'a';
        //     scope.counter = 0;
        //     scope.$watch(
        //         function (scope) { return scope.someValue; }, function (newValue, oldValue, scope) { scope.counter++; }
        //     );
        //     expect(scope.counter).toBe(0);
        //     scope.$digest();
        //     expect(scope.counter).toBe(1);
        //     scope.$digest();
        //     expect(scope.counter).toBe(1);
        //     scope.someValue = 'b';
        //     expect(scope.counter).toBe(1);
        //     scope.$digest();
        //     expect(scope.counter).toBe(2);
        // });
        // it("calls listener with new value as old value the first time", function () {
        //     scope.someValue = 123;
        //     var oldValueGiven;
        //     scope.$watch(
        //         function (scope) { return scope.someValue; },
        //         function (newValue, oldValue, scope) { oldValueGiven = oldValue; }
        //     );
        //     scope.$digest();
        //     expect(oldValueGiven).toBe(123);
        // });
        // it("may have watchers that omit the listener function", function () {
        //     var watchFn = jasmine.createSpy().and.returnValue('something');
        //     scope.$watch(watchFn);
        //     scope.$digest();
        //     expect(watchFn).toHaveBeenCalled();
        // });
        // it("executes $evalAsync ed function later in the same cycle", function () {
        //     scope.aValue = [1, 2, 3];
        //     scope.asyncEvaluated = false;
        //     scope.asyncEvaluatedImmediately = false;
        //     scope.$watch(
        //         function (scope) { return scope.aValue; },
        //         function (newValue, oldValue, scope) {
        //             scope.$evalAsync(function (scope) {
        //                 scope.asyncEvaluated = true;
        //             });
        //             scope.asyncEvaluatedImmediately = scope.asyncEvaluated;
        //         }
        //     );
        //     scope.$digest(); expect(scope.asyncEvaluated).toBe(true); expect(scope.asyncEvaluatedImmediately).toBe(false);
        // });
        // it('allows async $apply with $applyAsync', function (done) {
        //     scope.counter = 0;
        //     scope.$watch(
        //         function (scope) { return scope.aValue; },
        //         function (newValue, oldValue, scope) {
        //             scope.counter++;
        //         }
        //     );
        //     scope.$digest();
        //     expect(scope.counter).toBe(1);
        //     scope.$applyAsync(function (scope) {
        //         scope.aValue = 'abc';
        //     });
        //     expect(scope.counter).toBe(1);
        //     setTimeout(function () {
        //         expect(scope.counter).toBe(2);
        //         done();
        //     }, 50);
        // });
        // it("schedules a digest in $evalAsync", function (done) {
        //     scope.aValue = "abc";
        //     scope.counter = 0;
        //     scope.$watch(
        //         function (scope) { return scope.aValue; },
        //         function (newValue, oldValue, scope) {
        //             scope.counter++;
        //         }
        //     );
        //     scope.$evalAsync(function (scope) { });
        //     expect(scope.counter).toBe(0);
        //     setTimeout(function () {
        //         expect(scope.counter).toBe(1);
        //         done();
        //     }, 50);
        // });
        // it('cancels and flushes $applyAsync if digested first', function (done) {
        //     scope.counter = 0;
        //     scope.$watch(function (scope) {
        //         scope.counter++;
        //         return scope.aValue;
        //     },
        //         function (newValue, oldValue, scope) { });
        //     scope.$applyAsync(function (scope) {
        //         scope.aValue = 'abc';
        //     });
        //     scope.$applyAsync(function (scope) {
        //         scope.aValue = 'def';
        //     });
        //     scope.$digest();
        //     expect(scope.counter).toBe(2);
        //     expect(scope.aValue).toEqual('def');
        //     setTimeout(function () {
        //         expect(scope.counter).toBe(2); done();
        //     }, 50);
        // });

        // it("allows destroying a $watch with a removal function", function () {
        //     scope.aValue = 'abc';
        //     scope.counter = 0;
        //     var destroyWatch = scope.$watch(
        //         function (scope) { return scope.aValue; },
        //         function (newValue, oldValue, scope) {
        //             scope.counter++;
        //         }
        //     );
        //     scope.$digest();
        //     expect(scope.counter).toBe(1);
        //     scope.aValue = 'def';
        //     scope.$digest();
        //     expect(scope.counter).toBe(2);
        //     scope.aValue = 'ghi';
        //     destroyWatch();
        //     scope.$digest();
        //     expect(scope.counter).toBe(2);
        // });

        it("allows destroying several $watches during digest", function () {
            scope.aValue = 'abc';
            scope.counter = 0;
            var destroyWatch1 = scope.$watch(function (scope) {
                destroyWatch1();
                destroyWatch2();
            });
            var destroyWatch2 = scope.$watch(
                function (scope) { return scope.aValue; },
                function (newValue, oldValue, scope) {
                    scope.counter++;
                }
            );
            scope.$digest();
            expect(scope.counter).toBe(0);
        });
        it('uses different arrays for old and new values on subsequent runs', function () {
            var gotNewValues, gotOldValues;
            scope.aValue = 1;
            scope.anotherValue = 2;
            scope.$watchGroup([
                function (scope) { return scope.aValue; },
                function (scope) { return scope.anotherValue; }
            ], function (newValues, oldValues, scope) {
                gotNewValues = newValues;
                gotOldValues = oldValues;
            });
            scope.$digest();
            scope.anotherValue = 3;
            scope.$digest();
            expect(gotNewValues).toEqual([1, 3]);
            expect(gotOldValues).toEqual([1, 2]);
        });
        it('calls the listener once when the watch array is empty', function () {
            var gotNewValues, gotOldValues;
            scope.$watchGroup([], function (newValues, oldValues, scope) {
                gotNewValues = newValues;
                gotOldValues = oldValues;
            });
            scope.$digest();
            expect(gotNewValues).toEqual([]);
            expect(gotOldValues).toEqual([]);
        });
        it('can be deregistered', function () {
            var counter = 0;
            scope.aValue = 1;
            scope.anotherValue = 2;
            var destroyGroup = scope.$watchGroup([
                function (scope) { return scope.aValue; },
                function (scope) { return scope.anotherValue; }
            ], function (newValues, oldValues, scope) {
                counter++;
            });
            scope.$digest();
            scope.anotherValue = 3;
            destroyGroup();
            scope.$digest();
            expect(counter).toEqual(1);
        });
        it('does not call the zero- watch listener when deregistered first', function () {
            var counter = 0;
            var destroyGroup = scope.$watchGroup([], function (newValues, oldValues, scope) {
                counter++;
            });
            destroyGroup();
            scope.$digest();
            expect(counter).toEqual(0);
        });

    });
});
