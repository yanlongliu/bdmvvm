// describe("$q", function () {
//     var $q, $$q, $rootScope;
//     beforeEach(function () {
//         publishExternalAPI();
//         var injector = createInjector(['ng']);
//         $q = injector.get('$q');
//         $$q = injector.get('$$q');
//         $rootScope = injector.get('$rootScope');
//     });

//     // it('can create a Deferred', function () {
//     //     var d = $q.defer();
//     //     expect(d).toBeDefined();
//     // });
//     // it('has a promise for each Deferred', function () {
//     //     var d = $q.defer();
//     //     expect(d.promise).toBeDefined();
//     // });
//     // it('can resolve a promise', function (done) {
//     //     var deferred = $q.defer();
//     //     var promise = deferred.promise;
//     //     var promiseSpy = jasmine.createSpy();
//     //     promise.then(promiseSpy);
//     //     deferred.resolve('a - ok');
//     //     setTimeout(function () {
//     //         expect(promiseSpy).toHaveBeenCalledWith('a - ok');
//     //         done();
//     //     }, 1);
//     // });

//     // it('works when resolved before promise listener', function (done) {
//     //     var d = $q.defer();
//     //     d.resolve(42);
//     //     var promiseSpy = jasmine.createSpy();
//     //     d.promise.then(promiseSpy);
//     //     setTimeout(function () {
//     //         expect(promiseSpy).toHaveBeenCalledWith(42);
//     //         done();
//     //     }, 0);
//     // });
//     // it('does not resolve promise immediately', function () {
//     //     var d = $q.defer();
//     //     var promiseSpy = jasmine.createSpy();
//     //     d.promise.then(promiseSpy);
//     //     d.resolve(42);
//     //     expect(promiseSpy).not.toHaveBeenCalled();
//     // });
//     // it('resolves promise at next digest', function () {
//     //     var d = $q.defer();
//     //     var promiseSpy = jasmine.createSpy();
//     //     d.promise.then(promiseSpy);
//     //     d.resolve(42);
//     //     $rootScope.$apply();
//     //     expect(promiseSpy).toHaveBeenCalledWith(42);
//     // });
//     // it('may only be resolved once', function () {
//     //     var d = $q.defer();
//     //     var promiseSpy = jasmine.createSpy();
//     //     d.promise.then(promiseSpy);
//     //     d.resolve(42);
//     //     d.resolve(43);
//     //     $rootScope.$apply();
//     //     expect(promiseSpy.calls.count()).toEqual(1);
//     //     expect(promiseSpy).toHaveBeenCalledWith(42);
//     // });
//     // it('resolves a listener added after resolution', function () {
//     //     var d = $q.defer();
//     //     d.resolve(42);
//     //     $rootScope.$apply();
//     //     var promiseSpy = jasmine.createSpy();
//     //     d.promise.then(promiseSpy);
//     //     $rootScope.$apply();
//     //     expect(promiseSpy).toHaveBeenCalledWith(42);
//     // });
//     // it('invokes callbacks once', function () {
//     //     var d = $q.defer();
//     //     var firstSpy = jasmine.createSpy(); var secondSpy = jasmine.createSpy();
//     //     d.promise.then(firstSpy);
//     //     d.resolve(42);
//     //     $rootScope.$apply();
//     //     expect(firstSpy.calls.count()).toBe(1);
//     //     expect(secondSpy.calls.count()).toBe(0);
//     //     d.promise.then(secondSpy);
//     //     expect(firstSpy.calls.count()).toBe(1);
//     //     expect(secondSpy.calls.count()).toBe(0);
//     //     $rootScope.$apply();
//     //     expect(firstSpy.calls.count()).toBe(1);
//     //     expect(secondSpy.calls.count()).toBe(1);
//     // });
//     // it('can reject a deferred', function () {
//     //     var d = $q.defer();
//     //     var fulfillSpy = jasmine.createSpy();
//     //     var rejectSpy = jasmine.createSpy();
//     //     d.promise.then(fulfillSpy, rejectSpy);
//     //     d.reject('fail');
//     //     $rootScope.$apply();
//     //     expect(fulfillSpy).not.toHaveBeenCalled();
//     //     expect(rejectSpy).toHaveBeenCalledWith('fail');
//     // });
//     // it('does not require a success handler each time', function () {
//     //     var d = $q.defer();
//     //     var fulfillSpy = jasmine.createSpy();
//     //     var rejectSpy = jasmine.createSpy();
//     //     d.promise.then(fulfillSpy);
//     //     d.promise.then(null, rejectSpy);
//     //     d.resolve('ok');
//     //     $rootScope.$apply();
//     //     expect(fulfillSpy).toHaveBeenCalledWith('ok');
//     // });
//     // it('can register rejection handler with catch', function () {
//     //     var d = $q.defer();
//     //     var rejectSpy = jasmine.createSpy();
//     //     d.promise.catch(rejectSpy);
//     //     d.reject('fail');
//     //     $rootScope.$apply();
//     //     expect(rejectSpy).toHaveBeenCalled();
//     // });
//     // it('allows chaining handlers', function () {
//     //     var d = $q.defer();
//     //     var fulfilledSpy = jasmine.createSpy();
//     //     d.promise.then(function (result) {
//     //         return result + 1;
//     //     }).then(function (result) {
//     //         return result * 2;
//     //     }).then(fulfilledSpy);
//     //     d.resolve(20);
//     //     $rootScope.$apply();
//     //     expect(fulfilledSpy).toHaveBeenCalledWith(42);
//     // });
//     // it('catches rejection on chained handler', function () {
//     //     var d = $q.defer();
//     //     var rejectedSpy = jasmine.createSpy();
//     //     d.promise.then(_.noop).catch(rejectedSpy);
//     //     d.reject('fail');
//     //     $rootScope.$apply();
//     //     expect(rejectedSpy).toHaveBeenCalledWith('fail');
//     // });
//     // it('fulfills on chained handler', function () {
//     //     var d = $q.defer();
//     //     var fulfilledSpy = jasmine.createSpy();
//     //     d.promise.catch(_.noop).then(fulfilledSpy);
//     //     d.resolve(42);
//     //     $rootScope.$apply();
//     //     expect(fulfilledSpy).toHaveBeenCalledWith(42);
//     // });
//     // it('treats catch return value as resolution', function () {
//     //     var d = $q.defer();
//     //     var fulfilledSpy = jasmine.createSpy();
//     //     d.promise
//     //         .catch(function () {
//     //             return 42;
//     //         })
//     //         .then(fulfilledSpy);
//     //     d.reject('fail');
//     //     $rootScope.$apply();
//     //     expect(fulfilledSpy).toHaveBeenCalledWith(42);
//     // });
//     // it('rejects chained promise when handler throws', function () {
//     //     var d = $q.defer();
//     //     var rejectedSpy = jasmine.createSpy();
//     //     d.promise.then(function () {
//     //         throw 'fail';
//     //     }).catch(rejectedSpy);
//     //     d.resolve(42);
//     //     $rootScope.$apply();
//     //     expect(rejectedSpy).toHaveBeenCalledWith('fail');
//     // });
//     // it('waits on promise returned from handler', function () {
//     //     var d = $q.defer();
//     //     var fulfilledSpy = jasmine.createSpy();
//     //     d.promise.then(function (v) {
//     //         var d2 = $q.defer();
//     //         d2.resolve(v + 1);
//     //         return d2.promise;
//     //     }).then(function (v) {
//     //         return v * 2;
//     //     }).then(fulfilledSpy);
//     //     d.resolve(20);
//     //     $rootScope.$apply();
//     //     expect(fulfilledSpy).toHaveBeenCalledWith(42);
//     // });
//     // it('waits on promise given to resolve', function () {
//     //     var d = $q.defer();
//     //     var d2 = $q.defer();
//     //     var fulfilledSpy = jasmine.createSpy();
//     //     d.promise.then(fulfilledSpy);
//     //     d2.resolve(42);
//     //     d.resolve(d2.promise);
//     //     $rootScope.$apply();
//     //     expect(fulfilledSpy).toHaveBeenCalledWith(42);
//     // });

//     it('resolves to orig value when nested promise resolves', function () {
//         var d = $q.defer();
//         var fulfilledSpy = jasmine.createSpy();
//         var resolveNested;
//         d.promise.then(function (result) {
//             return result + 1;
//         }).finally(function (result) {
//             var d2 = $q.defer();
//             resolveNested = function () {
//                 d2.resolve('abc');
//             };
//             return d2.promise;
//         }).then(fulfilledSpy);
//         d.resolve(20);
//         $rootScope.$apply();
//         expect(fulfilledSpy).not.toHaveBeenCalled();
//         resolveNested();
//         $rootScope.$apply();
//         expect(fulfilledSpy).toHaveBeenCalledWith(21);
//     });

//     it('rejects when nested promise rejects in finally', function () {
//         var d = $q.defer();
//         var fulfilledSpy = jasmine.createSpy();
//         var rejectedSpy = jasmine.createSpy();
//         var rejectNested;
//         d.promise.then(function (result) {
//             return result + 1;
//         }).finally(function (result) {
//             var d2 = $q.defer();
//             rejectNested = function () {
//                 d2.reject('fail');
//             };
//             return d2.promise;
//         }).then(fulfilledSpy, rejectedSpy);
//         d.resolve(20);
//         $rootScope.$apply();
//         expect(fulfilledSpy).not.toHaveBeenCalled();
//         rejectNested();
//         $rootScope.$apply();
//         expect(fulfilledSpy).not.toHaveBeenCalled();
//         expect(rejectedSpy).toHaveBeenCalledWith('fail');
//     });
//     it('rejects to original value when nested promise resolves', function () {
//         var d = $q.defer();
//         var rejectedSpy = jasmine.createSpy();
//         var resolveNested;
//         d.promise.then(function (result) {
//             throw 'fail';
//         }).finally(function (result) {
//             var d2 = $q.defer();
//             resolveNested = function () {
//                 d2.resolve('abc');
//             };
//             return d2.promise;
//         }).catch(rejectedSpy);
//         d.resolve(20);
//         $rootScope.$apply();
//         expect(rejectedSpy).not.toHaveBeenCalled();
//         resolveNested();
//         $rootScope.$apply();
//         expect(rejectedSpy).toHaveBeenCalledWith('fail');
//     });

//     it('can report progress many times', function () {
//         var d = $q.defer();
//         var progressSpy = jasmine.createSpy();
//         d.promise.then(null, null, progressSpy);
//         d.notify('40 %');
//         $rootScope.$apply();
//         d.notify('80 %');
//         d.notify('100 %');
//         $rootScope.$apply();
//         expect(progressSpy.calls.count()).toBe(3);
//     });
// });
// describe('all', function () {
//     var $q, $rootScope;
//     beforeEach(function () {
//         publishExternalAPI();
//         var injector = createInjector(['ng']);
//         $q = injector.get('$q');
//         $rootScope = injector.get('$rootScope');
//     });
//     it('can resolve an array of promises to array of results', function () {
//         var promise = $q.all([$q.when(1), $q.when(2), $q.when(3)]);
//         var fulfilledSpy = jasmine.createSpy();
//         promise.then(fulfilledSpy);
//         $rootScope.$apply();
//         expect(fulfilledSpy).toHaveBeenCalledWith([1, 2, 3]);
//     });
// });

// describe('$$q', function () {
//     var $q, $$q, $rootScope;
//     beforeEach(function () {
//         publishExternalAPI();
//         var injector = createInjector(['ng']); 
//         $q = injector.get('$q');
//         $$q = injector.get('$$q');
//         $rootScope = injector.get('$rootScope');
//     });
//     it('uses deferreds that do not resolve at digest', function () {
//         var d = $$q.defer();
//         var fulfilledSpy = jasmine.createSpy();
//         d.promise.then(fulfilledSpy);
//         d.resolve('ok');
//         $rootScope.$apply();
//         expect(fulfilledSpy).not.toHaveBeenCalled();
//     });
// });