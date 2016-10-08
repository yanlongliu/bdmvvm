// describe("filter", function () {
//     it('can be registered and obtained', function () {
//         var myFilter = function () { };
//         var myFilterFactory = function () {
//             return myFilter;
//         };
//         register('my', myFilterFactory);
//         expect(filter('my')).toBe(myFilter);
//     });
//     it('allows registering multiple filters with an object', function () {
//         var myFilter = function () { };
//         var myOtherFilter = function () { };
//         register({
//             my: function () {
//                 return myFilter;
//             },
//             myOther: function () {
//                 return myOtherFilter;
//             }
//         });
//         expect(filter('my')).toBe(myFilter);
//         expect(filter('myOther')).toBe(myOtherFilter);
//     });
//     it('can parse filter expressions', function () {
//         register('upcase', function () {
//             return function (str) {
//                 return str.toUpperCase();
//             };
//         });
//         var fn = parse('aString | upcase');
//         expect(fn({ aString: 'Hello' })).toEqual('HELLO');
//     });
//     it('can parse filter chain expressions', function () {
//         register('upcase', function () {
//             return function (s) {
//                 return s.toUpperCase();
//             };
//         });
//         register('exclamate', function () {
//             return function (s) {
//                 return s + '!';
//             };
//         });
//         var fn = parse('"hello" | upcase | exclamate'); expect(fn()).toEqual('HELLO!');
//     });
//     it('can pass several additional arguments to filters', function () {
//         register('surround', function () {
//             return function (s, left, right) {
//                 return left + s + right;
//             };
//         });
//         var fn = parse('"hello" | surround:"*":"!"');
//         expect(fn()).toEqual('*hello!');
//     });
// });
// describe("filter filter", function () {
//     it('is available', function () {
//         expect(filter('filter')).toBeDefined();
//     });
//     it('can filter an array with a predicate function', function () {
//         var fn = parse('[1, 2, 3, 4] | filter:isOdd');
//         var scope = {
//             isOdd: function (n) {
//                 return n % 2 !== 0;
//             }
//         };
//         expect(fn(scope)).toEqual([1, 3]);
//     });
//     it('can filter an array of strings with a string', function () {
//         var fn = parse('arr | filter:"a"');
//         expect(fn({ arr: ["a", "b", "a"] })).toEqual(['a', 'a']);
//     });
//     it('filters an array of objects where any value matches', function () {
//         var fn = parse('arr | filter:"o"');
//         expect(fn({
//             arr: [
//                 { firstName: 'John', lastName: 'Brown' },
//                 { firstName: 'Jane', lastName: 'Fox' },
//                 { firstName: 'Mary', lastName: 'Quick' }
//             ]
//         })).toEqual([
//             { firstName: 'John', lastName: 'Brown' },
//             { firstName: 'Jane', lastName: 'Fox' }
//         ]);
//     });
//     it('does not match undefined values', function () {
//         var fn = parse('arr | filter:"undefined"');
//         expect(fn({ arr: [undefined, 'undefined'] })).toEqual(['undefined']);
//     });
//     it('allows negating string filter', function () {
//         var fn = parse('arr | filter:"!o"');
//         expect(fn({ arr: ['quick', 'brown', 'fox'] })).toEqual(['quick']);
//     });
//     it('filters with an object', function () {
//         var fn = parse('arr | filter:{name: "o"}'); expect(fn({
//             arr: [
//                 { name: 'Joe', role: 'admin' },
//                 { name: 'Jane', role: 'moderator' }
//             ]
//         })).toEqual([
//             { name: 'Joe', role: 'admin' }
//         ]);
//     });
//     it('ignores undefined values in expectation object', function () {
//         var fn = parse('arr | filter:{name: thisIsUndefined}'); expect(fn({
//             arr: [
//                 { name: 'Joe', role: 'admin' },
//                 { name: 'Jane', role: 'moderator' }
//             ]
//         })).toEqual([
//             { name: 'Joe', role: 'admin' },
//             { name: 'Jane', role: 'moderator' }
//         ]);
//     });
//     it('filters with a wildcard property', function () {
//         var fn = parse('arr | filter:{$: "o"}'); expect(fn({
//             arr: [
//                 { name: 'Joe', role: 'admin' },
//                 { name: 'Jane', role: 'moderator' },
//                 { name: 'Mary', role: 'admin' }
//             ]
//         })).toEqual([
//             { name: 'Joe', role: 'admin' },
//             { name: 'Jane', role: 'moderator' }
//         ]);
//     });
//     it('allows using a custom comparator', function () {
//         var fn = parse('arr | filter:{$: "o"}:myComparator'); expect(fn({
//             arr: ['o', 'oo', 'ao', 'aa'], myComparator: function (left, right) {
//                 return left === right;
//             }
//         })).toEqual(['o']);
//     });
// });

// describe("filter", function () {
//     beforeEach(function () {
//         publishExternalAPI();
//     });
//     it('can be registered and obtained', function () {
//         var myFilter = function () { };
//         var myFilterFactory = function () {
//             return myFilter;
//         };
//         var injector = createInjector(['ng', function ($filterProvider) {
//             $filterProvider.register('my', myFilterFactory);
//         }]);
//         var $filter = injector.get('$filter');
//         expect($filter('my')).toBe(myFilter);
//     });
//     it('allows registering multiple filters with an object', function () {
//         var myFilter = function () { };
//         var myOtherFilter = function () { };
//         var injector = createInjector(['ng', function ($filterProvider) {
//             $filterProvider.register({
//                 my: function () {
//                     return myFilter;
//                 },
//                 myOther: function () {
//                     return myOtherFilter;
//                 }
//             });
//         }]);
//         var $filter = injector.get('$filter'); 
//         expect($filter('my')).toBe(myFilter); 
//         expect($filter('myOther')).toBe(myOtherFilter);
//     }); });