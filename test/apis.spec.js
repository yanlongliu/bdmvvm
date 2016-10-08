describe('apis--------------------------------------', function () {
    describe('hashKey', function () {
        it('is undefined:undefined for undefined', function () {
            expect(hashKey(undefined)).toEqual('undefined:undefined');
        });
    });
    it('is object:[unique id] for objects', function () {
        expect(hashKey({})).toMatch(/^object:\S+$/);
    });
    it('stores the hash key in the $$hashKey attribute', function () {
        var obj = { a: 42 };
        var hash = hashKey(obj);
        expect(obj.$$hashKey).toEqual(hash.match(/^object:(\S+)$/)[1]);
    });
    it('supports a function $$hashKey', function () {
        expect(hashKey({ $$hashKey: _.constant(42) })).toEqual('object:42');
    });
    it('calls the function $$hashKey as a method with the correct this', function () {
        expect(hashKey({
            myKey: 42,
            $$hashKey: function () {
                return this.myKey;
            }
        })).toEqual('object:42');
    });
});