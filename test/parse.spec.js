// describe("parse", function () {
//     it("can parse a floating point number", function () {
//         var fn = parse('4.2');
//         expect(fn()).toBe(4.2);
//     });
//     it("can parse a floating point number without an integer part", function () {
//         var fn = parse('.42');
//         expect(fn()).toBe(0.42);
//     });
//     it("can parse a number in scientific notation", function () {
//         var fn = parse('42e3');
//         expect(fn()).toBe(42000);
//     });
//     it("can parse scientific notation with a float coefficient", function () {
//         var fn = parse('.42e2');
//         expect(fn()).toBe(42);
//     });
//     it("can parse scientific notation with negative exponents", function () {
//         var fn = parse('4200e-2');
//         expect(fn()).toBe(42);
//     });
//     it("can parse scientific notation with the + sign", function () {
//         var fn = parse('.42e+2');
//         expect(fn()).toBe(42);
//     });
//     it("can parse upper case scientific notation", function () {
//         var fn = parse('.42E2');
//         expect(fn()).toBe(42);
//     });
//     it("will not parse invalid scientific notation", function () {
//         expect(function () { parse('42e-'); }).toThrow();
//         expect(function () { parse('42e-a'); }).toThrow();
//     });
//     it("can parse a string in single quotes", function () {
//         var fn = parse("'abc'");
//         expect(fn()).toEqual('abc');
//     });
//     it("can parse a string in double quotes", function () {
//         var fn = parse('"abc"');
//         expect(fn()).toEqual('abc');
//     });
//     it("will not parse a string with mismatching quotes", function () {
//         expect(function () {
//             parse('"abc\'');
//         }).toThrow();
//     });
//     it("will not parse a string with invalid unicode escapes", function () {
//         expect(function () { parse('"\\u00T0"'); }).toThrow();
//     });
//     it("will parse null", function () {
//         var fn = parse('null'); expect(fn()).toBe(null);
//     });
//     it("will parse true", function () {
//         var fn = parse('true'); expect(fn()).toBe(true);
//     });
//     it("will parse false", function () {
//         var fn = parse('false'); expect(fn()).toBe(false);
//     });
//     it('ignores whitespace', function () {
//         var fn = parse(' \n42');
//         expect(fn()).toEqual(42);
//     });
//     it("will parse an empty array", function () {
//         var fn = parse('[]');
//         expect(fn()).toEqual([]);
//     });
//     it("will parse a non-empty array", function () {
//         var fn = parse('[1, "two", [3], true]');
//         expect(fn()).toEqual([1, 'two', [3], true]);
//     });
//     it("will parse an array with trailing commas", function () {
//         var fn = parse('[1, 2, 3,]');
//         expect(fn()).toEqual([1, 2, 3]);
//     });
//     it("will parse an empty object", function () {
//         var fn = parse('{}');
//         expect(fn()).toEqual({});
//     });
//     it("will parse a non-empty object", function () {
//         var fn = parse('{"akey":1,\'anotherkey\':2}');
//         expect(fn()).toEqual({ 'akey': 1, 'anotherkey': 2 });
//     });
//     it("will parse an object with identifier keys", function () {
//         var fn = parse('{ a: 1, b: [2, 3], c: { d: 4 } }');
//         expect(fn()).toEqual({ a: 1, b: [2, 3], c: { d: 4 } });
//     });
//     it('looks up an attribute from the scope', function () {
//         var fn = parse('aKey');
//         expect(fn({ aKey: 42 })).toBe(42);
//         expect(fn({})).toBeUndefined();
//     });
//     it('returns undefined when looking up attribute from undefined', function () {
//         var fn = parse('aKey');
//         expect(fn()).toBeUndefined();
//     });
//     it('will parse this', function () {
//         var fn = parse('this');
//         var scope = {};
//         expect(fn(scope)).toBe(scope);
//         expect(fn()).toBeUndefined();
//     });
//     it('looks up a 2- part identifier path from the scope', function () {
//         var fn = parse('aKey.anotherKey');
//         expect(fn({ aKey: { anotherKey: 42 } })).toBe(42);
//         expect(fn({ aKey: {} })).toBeUndefined();
//         expect(fn({})).toBeUndefined();
//     });
//     it('looks up a member from an object', function () {
//         var fn = parse('{ aKey: 42 }.aKey');
//         expect(fn()).toBe(42);
//     });
//     it('looks up a 4- part identifier path from the scope', function () {
//         var fn = parse('aKey.secondKey.thirdKey.fourthKey');
//         expect(fn({ aKey: { secondKey: { thirdKey: { fourthKey: 42 } } } })).toBe(42);
//         expect(fn({ aKey: { secondKey: { thirdKey: {} } } })).toBeUndefined();
//         expect(fn({ aKey: {} })).toBeUndefined();
//         expect(fn()).toBeUndefined();
//     });
//     it('uses locals instead of scope when there is a matching key', function () {
//         var fn = parse('aKey');
//         var scope = { aKey: 42 };
//         var locals = { aKey: 43 };
//         expect(fn(scope, locals)).toBe(43);
//     });
//     it('does not use locals instead of scope when no matching key', function () {
//         var fn = parse('aKey');
//         var scope = { aKey: 42 };
//         var locals = { otherKey: 43 };
//         expect(fn(scope, locals)).toBe(42);
//     });
//     it('uses locals instead of scope when the first part matches', function () {
//         var fn = parse('aKey.anotherKey');
//         var scope = { aKey: { anotherKey: 42 } };
//         var locals = { aKey: {} };
//         expect(fn(scope, locals)).toBeUndefined();
//     });
//     it('parses a simple computed property access', function () {
//         var fn = parse('aKey["anotherKey"]');
//         expect(fn({ aKey: { anotherKey: 42 } })).toBe(42);
//     });
//     it('parses a computed numeric array access', function () {
//         var fn = parse('anArray[1]');
//         expect(fn({ anArray: [1, 2, 3] })).toBe(2);
//     });
//     it('parses a computed access with another key as property', function () {
//         var fn = parse('lock[key]');
//         expect(fn({ key: 'theKey', lock: { theKey: 42 } })).toBe(42);
//     });
//     it('parses computed access with another access as property', function () {
//         var fn = parse('lock[keys["aKey"]]');
//         expect(fn({ keys: { aKey: 'theKey' }, lock: { theKey: 42 } })).toBe(42);
//     });
//     it('parses a function call', function () {
//         var fn = parse('aFunction()');
//         expect(fn({ aFunction: function () { return 42; } })).toBe(42);
//     });
//     it('parses a function call with a single number argument', function () {
//         var fn = parse('aFunction(42)');
//         expect(fn({ aFunction: function (n) { return n; } })).toBe(42);
//     });
//     it('parses a function call with a single identifier argument', function () {
//         var fn = parse('aFunction(n)');
//         expect(fn({ n: 42, aFunction: function (arg) { return arg; } })).toBe(42);
//     });
//     it('parses a function call with a single function call argument', function () {
//         var fn = parse('aFunction(argFn())');
//         expect(fn({
//             argFn: _.constant(42),
//             aFunction: function (arg) { return arg; }
//         })).toBe(42);
//     });
//     it('parses a function call with multiple arguments', function () {
//         var fn = parse('aFunction(37, n, argFn())');
//         expect(fn({
//             n: 3,
//             argFn: _.constant(2),
//             aFunction: function (a1, a2, a3) { return a1 + a2 + a3; }
//         })).toBe(42);
//     });
//     it('calls methods accessed as computed properties', function () {
//         var scope = {
//             anObject: {
//                 aMember: 42, aFunction: function () {
//                     return this.aMember;
//                 }
//             }
//         };
//         var fn = parse('anObject["aFunction"]()');
//         expect(fn(scope)).toBe(42);
//     });
//     it('calls methods accessed as non - computed properties', function () {
//         var scope = {
//             anObject: {
//                 aMember: 42, aFunction: function () {
//                     return this.aMember;
//                 }
//             }
//         };
//         var fn = parse('anObject.aFunction()');
//         expect(fn(scope)).toBe(42);
//     });
//     it('binds bare functions to the scope', function () {
//         var scope = {
//             aFunction: function () {
//                 return this;
//             }
//         };
//         var fn = parse('aFunction()');
//         expect(fn(scope)).toBe(scope);
//     });
//     it('binds bare functions on locals to the locals', function () {
//         var scope = {};
//         var locals = {
//             aFunction: function () {
//                 return this;
//             }
//         };
//         var fn = parse('aFunction()');
//         expect(fn(scope, locals)).toBe(locals);
//     });
//     it('parses a simple attribute assignment', function () {
//         var fn = parse('anAttribute = 42');
//         var scope = {};
//         fn(scope);
//         expect(scope.anAttribute).toBe(42);
//     });
//     it('can assign any primary expression', function () {
//         var fn = parse('anAttribute = aFunction()');
//         var scope = { aFunction: _.constant(42) }; fn(scope);
//         expect(scope.anAttribute).toBe(42);
//     });

//     it('can assign a computed object property', function () {
//         var fn = parse('anObject["anAttribute"] = 42');
//         var scope = { anObject: {} };
//         fn(scope); expect(scope.anObject.anAttribute).toBe(42);
//     });
//     it('can assign a non- computed object property', function () {
//         var fn = parse('anObject.anAttribute = 42');
//         var scope = { anObject: {} };
//         fn(scope);
//         expect(scope.anObject.anAttribute).toBe(42);
//     });
//     it('can assign a nested object property', function () {
//         var fn = parse('anArray[0].anAttribute = 42');
//         var scope = { anArray: [{}] };
//         fn(scope); expect(scope.anArray[0].anAttribute).toBe(42);
//     });
//     it('creates the objects in the assignment path that do not exist', function () {
//         var fn = parse('some["nested"].property.path = 42');
//         var scope = {};
//         fn(scope);
//         expect(scope.some.nested.property.path).toBe(42);
//     });
//     it('does not allow calling the function constructor', function () {
//         expect(function () {
//             var fn = parse('aFunction.constructor("return window;")()');
//             fn({ aFunction: function () { } });
//         }).toThrow();
//     });
//     it('does not allow accessing window as computed property', function () {
//         var fn = parse('anObject["wnd"]');
//         expect(function () { fn({ anObject: { wnd: window } }); }).toThrow();
//     });
//     it('does not allow accessing window as non - computed property', function () {
//         var fn = parse('anObject.wnd');
//         expect(function () { fn({ anObject: { wnd: window } }); }).toThrow();
//     });

//     it('parses a unary +', function () {
//         expect(parse('+42')()).toBe(42);
//         expect(parse('+a')({ a: 42 })).toBe(42);
//     });
//     it('replaces undefined with zero for unary +', function () {
//         expect(parse('+a')({})).toBe(0);
//     });
//     it('parses a unary !', function () {
//         expect(parse('!true')()).toBe(false);
//         expect(parse('!42')()).toBe(false);
//         expect(parse('!a')({ a: false })).toBe(true);
//         expect(parse('!!a')({ a: false })).toBe(false);
//     });
//     it('parses a unary -', function () {
//         expect(parse('-42')()).toBe(-42);
//         expect(parse('-a')({ a: -42 })).toBe(42);
//         expect(parse('--a')({ a: -42 })).toBe(-42);
//         expect(parse('-a')({})).toBe(0);
//     });
//     it('parses a ! in a string', function () {
//         expect(parse('"!"')()).toBe('!');
//     });
//     it('parses a multiplication', function () {
//         expect(parse('21 * 2')()).toBe(42);
//     });
//     it('parses a division', function () {
//         expect(parse('84 / 2')()).toBe(42);
//     });
//     it('parses a remainder', function () {
//         expect(parse('85 % 43')()).toBe(42);
//     });
//     it('parses several multiplicatives', function () {
//         expect(parse('36 * 2 % 5')()).toBe(2);
//     });
//     it('parses an addition', function () {
//         expect(parse('20 + 22')()).toBe(42);
//     });
//     it('parses a subtraction', function () {
//         expect(parse('42 - 22')()).toBe(20);
//     });
//     it('parses multiplicatives on a higher precedence than additives', function () {
//         expect(parse('2 + 3 * 5')()).toBe(17);
//         expect(parse('2 + 3 * 2 + 3')()).toBe(11);
//     });
//     it('substitutes undefined with zero in addition', function () {
//         expect(parse('a + 22')()).toBe(22);
//         expect(parse('42 + a')()).toBe(42);
//     });
//     it('substitutes undefined with zero in subtraction', function () {
//         expect(parse('a - 22')()).toBe(-22);
//         expect(parse('42 - a')()).toBe(42);
//     });
//     it('parses relational operators', function () {
//         expect(parse('1 < 2')()).toBe(true);
//         expect(parse('1 > 2')()).toBe(false);
//         expect(parse('1 <= 2')()).toBe(true);
//         expect(parse('2 <= 2')()).toBe(true);
//         expect(parse('1 >= 2')()).toBe(false);
//         expect(parse('2 >= 2')()).toBe(true);
//     });
//     it('parses equality operators', function () {
//         expect(parse('42 == 42')()).toBe(true);
//         expect(parse('42 == "42"')()).toBe(true);
//         expect(parse('42 != 42')()).toBe(false);
//         expect(parse('42 === 42')()).toBe(true);
//         expect(parse('42 === "42"')()).toBe(false);
//         expect(parse('42 !== 42')()).toBe(false);
//     });
//     it('parses relationals on a higher precedence than equality', function () {
//         expect(parse('2 == "2" > 2 === "2"')()).toBe(false);
//     });
//     it('parses additives on a higher precedence than relationals', function () {
//         expect(parse('2 + 3 < 6 - 2')()).toBe(false);
//     });
//     it('parses logical AND', function () {
//         expect(parse('true && true')()).toBe(true);
//         expect(parse('true && false')()).toBe(false);
//     });
//     it('parses logical OR', function () {
//         expect(parse('true || true')()).toBe(true);
//         expect(parse('true || false')()).toBe(true);
//         expect(parse('fales || false')()).toBe(false);
//     });
//     it('parses multiple ANDs', function () {
//         expect(parse('true && true && true')()).toBe(true);
//         expect(parse('true && true && false')()).toBe(false);
//     });
//     it('parses multiple ORs', function () {
//         expect(parse('true || true || true')()).toBe(true);
//         expect(parse('true || true || false')()).toBe(true);
//         expect(parse('false || false || true')()).toBe(true);
//         expect(parse('false || false || false')()).toBe(false);
//     });
//     it('short - circuits AND', function () {
//         var invoked;
//         var scope = { fn: function () { invoked = true; } };
//         parse('false && fn()')(scope);
//         expect(invoked).toBeUndefined();
//     });
//     it('short - circuits OR', function () {
//         var invoked;
//         var scope = { fn: function () { invoked = true; } };
//         parse('true || fn()')(scope);
//         expect(invoked).toBeUndefined();
//     });
//     it('parses the ternary expression', function () {
//         expect(parse('a === 42 ? true : false')({ a: 42 })).toBe(true);
//         expect(parse('a === 42 ? true : false')({ a: 43 })).toBe(false);
//     });
//     it('parses OR with a higher precedence than ternary', function () {
//         expect(parse('0 || 1 ? 0 || 2 : 0 || 3')()).toBe(2);
//     });
//     it('parses parentheses altering precedence order', function () {
//         expect(parse('21 * (3 - 1)')()).toBe(42);
//         expect(parse('false && (true || true)')()).toBe(false);
//         expect(parse('-((a % 2) === 0 ? 1 : 2)')({ a: 42 })).toBe(-1);
//     });
//     it('parses several statements', function () {
//         var fn = parse('a = 1; b = 2; c = 3');
//         var scope = {};
//         fn(scope);
//         expect(scope).toEqual({ a: 1, b: 2, c: 3 });
//     });
//     it('returns the value of the last statement', function () {
//         expect(parse('a = 1; b = 2; a + b')({})).toBe(3);
//     });
//     it('returns the function itself when given one', function () {
//         var fn = function () { };
//         expect(parse(fn)).toBe(fn);
//     });
//     it('still returns a function when given no argument', function () {
//         expect(parse()).toEqual(jasmine.any(Function));
//     });
//     it('marks arrays constant when elements are constant', function () {
//         expect(parse('[1, 2, 3]').constant).toBe(true);
//         expect(parse('[1, [2, [3]]]').constant).toBe(true); expect(parse('[1, 2, a]').constant).toBe(false); expect(parse('[1, [2, [a]]]').constant).toBe(false);
//     });
//     it('marks this as non-constant', function () {
//         expect(parse('this').constant).toBe(false);
//     });
//     it('marks non-computed lookup constant when object is constant', function () {
//         expect(parse('{a: 1}.a').constant).toBe(true); expect(parse('obj.a').constant).toBe(false);
//     });
//     it('marks binaries constant when both arguments are constant', function () {
//         expect(parse('1 + 2').constant).toBe(true);
//         expect(parse('1 + 2').literal).toBe(false);
//         expect(parse('1 + a').constant).toBe(false);
//         expect(parse('a + 1').constant).toBe(false);
//         expect(parse('a + a').constant).toBe(false);
//     });
//     it('marks logicals constant when both arguments are constant', function () {
//         expect(parse('true && false').constant).toBe(true);
//         expect(parse('true && false').literal).toBe(false);
//         expect(parse('true && a').constant).toBe(false);
//         expect(parse('a && false').constant).toBe(false);
//         expect(parse('a && b').constant).toBe(false);
//     });
//     it('allows calling assign on identifier expressions', function () {
//         var fn = parse('anAttribute');
//         expect(fn.assign).toBeDefined();
//         var scope = {};
//         fn.assign(scope, 42); expect(scope.anAttribute).toBe(42);
//     });
//     it('allows calling assign on member expressions', function () {
//         var fn = parse('anObject.anAttribute'); expect(fn.assign).toBeDefined();
//         var scope = {};
//         fn.assign(scope, 42); expect(scope.anObject).toEqual({ anAttribute: 42 });
//     });
// });

// describe("parse", function () {
//     var parse;
//     beforeEach(function () {
//         publishExternalAPI();
//         parse = createInjector(['ng']).get('$parse');
//     });
//     it('can parse filter expressions', function () {
//         parse = createInjector(['ng', function ($filterProvider) {
//             $filterProvider.register('upcase', function () {
//                 return function (str) {
//                     return str.toUpperCase();
//                 };
//             });
//         }]).get('$parse');
//         var fn = parse('aString | upcase');
//         expect(fn({ aString: 'Hello' })).toEqual('HELLO');
//     });
//     it('can parse filter chain expressions', function () {
//         parse = createInjector(['ng', function ($filterProvider) {
//             $filterProvider.register('upcase', function () {
//                 return function (s) {
//                     return s.toUpperCase();
//                 };
//             });
//             $filterProvider.register('exclamate', function () {
//                 return function (s) {
//                     return s + '!';
//                 };
//             });
//         }]).get('$parse');
//         var fn = parse('"hello" | upcase | exclamate');
//         expect(fn()).toEqual('HELLO!');
//     });
//     it('can pass an additional argument to filters', function () {
//         parse = createInjector(['ng', function ($filterProvider) {
//             $filterProvider.register('repeat', function () {
//                 return function (s, times) {
//                     return _.repeat(s, times);
//                 };
//             });
//         }]).get('$parse');
//         var fn = parse('"hello" | repeat:3');
//         expect(fn()).toEqual('hellohellohello');
//     });
//     it('can pass several additional arguments to filters', function () {
//         parse = createInjector(['ng', function ($filterProvider) {
//             $filterProvider.register('surround', function () {
//                 return function (s, left, right) {
//                     return left + s + right;
//                 };
//             });
//         }]).get('$parse');
//         var fn = parse('"hello" | surround:"*":"!"'); expect(fn()).toEqual('*hello!');
//     });
// });