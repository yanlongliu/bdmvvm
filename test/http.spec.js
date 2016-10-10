describe('$http', function () {
    var $http, $rootScope, $q;
    var xhr, requests;

    beforeEach(function () {
        publishExternalAPI();
        var injector = createInjector(['ng']);
        $http = injector.get('$http');
        $rootScope = injector.get('$rootScope');
        $q = injector.get('$q');
    });
    beforeEach(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) {
            requests.push(req);
        };
    });
    afterEach(function () {
        xhr.restore();
    });
    beforeEach(function () {
        jasmine.clock().install();
    });
    afterEach(function () {
        jasmine.clock().uninstall();
    });
    // it('is a function', function () {
    //     expect($http instanceof Function).toBe(true);
    // });
    // it('returns a Promise', function () {
    //     var result = $http({});
    //     expect(result).toBeDefined();
    //     expect(result.then).toBeDefined();
    // });
    it('makes an XMLHttpRequest to given URL', function () {
        $http({
            method: 'POST',
            url: 'http://teropa.info',
            data: 'hello'
        });
        $rootScope.$apply();
        expect(requests.length).toBe(1);
        expect(requests[0].method).toBe('POST');
        expect(requests[0].url).toBe('http://teropa.info');
        expect(requests[0].async).toBe(true);
        expect(requests[0].requestBody).toBe('hello');

    });
    // it('resolves promise when XHR result received', function () {
    //     var requestConfig = {
    //         method: 'GET',
    //         url: 'http://teropa.info'
    //     };
    //     var response;
    //     $http(requestConfig).then(function (r) {
    //         response = r;
    //     });
    //     requests[0].respond(200, {}, 'Hello');
    //     expect(response).toBeDefined();
    //     expect(response.status).toBe(200);
    //     expect(response.statusText).toBe('OK');
    //     expect(response.data).toBe('Hello');
    //     expect(response.config.url).toEqual('http://teropa.info');
    // });
    // it('sets headers on request', function () {
    //     $http({
    //         url: 'http://teropa.info',
    //         headers: {
    //             'Accept': 'text/plain',
    //             'Cache-Control': 'no-cache'
    //         }
    //     });
    //     expect(requests.length).toBe(1);
    //     expect(requests[0].requestHeaders.Accept).toBe('text/plain');
    //     expect(requests[0].requestHeaders['Cache-Control']).toBe('no-cache');
    // });
    // it('does not send content- type header when no data', function () {
    //     $http({
    //         method: 'POST',
    //         url: 'http://teropa.info',
    //         headers: {
    //             'Content-Type': 'application/json;charset=utf-8'
    //         }
    //     });
    //     expect(requests.length).toBe(1);
    //     expect(requests[0].requestHeaders['Content-Type']).not.toBe('application/json;charset=utf-8');
    // });
    // it('may returns all response headers', function () {
    //     var response;
    //     $http({
    //         method: 'POST',
    //         url: 'http://teropa.info',
    //         data: 42
    //     }).then(function (r) {
    //         response = r;
    //     });
    //     requests[0].respond(200, {
    //         'Content-Type': 'text/plain'
    //     }, 'Hello');
    //     expect(response.headers()).toEqual({ 'content-type': 'text/plain' });
    // });

    // it('allows transforming requests with functions', function () {
    //     $http({
    //         method: 'POST',
    //         url: 'http://teropa.info',
    //         data: 42,
    //         transformRequest: function (data) {
    //             return '*' + data + '*';
    //         }
    //     });
    //     expect(requests[0].requestBody).toBe('*42*');
    // });

    // it('allows multiple request transform functions', function () {
    //     $http({
    //         method: 'POST',
    //         url: 'http://teropa.info',
    //         data: 42,
    //         transformRequest: [function (data) {
    //             return '*' + data + '*';
    //         }, function (data) {
    //             return '-' + data + '-';
    //         }]
    //     });
    //     expect(requests[0].requestBody).toBe('-*42*-');
    // });
    // it('passes request headers getter to transforms', function () {
    //     $http.defaults.transformRequest = [function (data, headers) {
    //         if (headers('Content-Type') === 'text/emphasized') {
    //             return '*' + data + '*';
    //         } else {
    //             return data;
    //         }
    //     }];
    //     $http({
    //         method: 'POST',
    //         url: 'http://teropa.info',
    //         data: 42,
    //         headers: {
    //             'content-type': 'text/emphasized'
    //         }
    //     });
    //     expect(requests[0].requestBody).toBe('*42*');
    // });
    // it('transforms error responses also', function () {
    //     var response;
    //     $http({
    //         url: 'http://teropa.info',
    //         transformResponse: function (data) {
    //             return '*' + data + '*';
    //         }
    //     }).catch(function (r) {
    //         response = r;
    //     });
    //     requests[0].respond(401, { 'Content-Type': 'text/plain' }, 'Fail');
    //     expect(response.data).toEqual('*Fail*');
    // });
    // it('does not serialize form data for requests', function () {
    //     var formData = new FormData();
    //     formData.append('aField', 'aValue');
    //     $http({
    //         method: 'POST',
    //         url: 'http://teropa.info',
    //         data: formData
    //     });
    //     expect(requests[0].requestBody).toBe(formData);
    // });
    // it('escapes url characters in params', function () {
    //     $http({
    //         url: 'http://teropa.info',
    //         params: {
    //             '==': '&&'
    //         }
    //     });
    //     expect(requests[0].url).toBe('http://teropa.info?%3D%3D=%26%26');
    // });
    // it('allows substituting param serializer through DI', function () {
    //     var injector = createInjector(['ng', function ($provide) {
    //         $provide.factory('mySpecialSerializer', function () {
    //             return function (params) {
    //                 return _.map(params, function (v, k) {
    //                     return k + '=' + v + 'lol';
    //                 }).join('&');
    //             };
    //         });
    //     }]);
    //     injector.invoke(function ($http) {
    //         $http({
    //             url: 'http://teropa.info',
    //             params: {
    //                 a: 42,
    //                 b: 43
    //             },
    //             paramSerializer: 'mySpecialSerializer'
    //         });
    //         expect(requests[0].url)
    //             .toEqual('http://teropa.info?a=42lol&b=43lol');
    //     });
    // });
    // it('uses DI to instantiate interceptors', function () {
    //     var interceptorFactorySpy = jasmine.createSpy();
    //     var injector = createInjector(['ng', function ($httpProvider) {
    //         $httpProvider.interceptors.push(['$rootScope', interceptorFactorySpy]);
    //     }]);
    //     $http = injector.get('$http');
    //     var $rootScope = injector.get('$rootScope'); 
    //     expect(interceptorFactorySpy).toHaveBeenCalledWith($rootScope);
    // });
    it('allows intercepting requests', function () {
        var injector = createInjector(['ng', function ($httpProvider) {
            $httpProvider.interceptors.push(function () {
                return {
                    request: function (config) {
                        config.params.intercepted = true;
                        return config;
                    }
                };
            });
        }]);
        $http = injector.get('$http');
        $rootScope = injector.get('$rootScope');
        $http.get('http://teropa.info', { params: {} });
        $rootScope.$apply();
        expect(requests[0].url).toBe('http://teropa.info?intercepted=true');
    });

    it('allows intercepting responses', function () {
        var injector = createInjector(['ng', function ($httpProvider) {
            $httpProvider.interceptors.push(_.constant({
                response: function (response) {
                    response.intercepted = true;
                    return response;
                }
            }));
        }]);
        $http = injector.get('$http');
        $rootScope = injector.get('$rootScope');
        var response; $http.get('http://teropa.info').then(function (r) {
            response = r;
        });
        $rootScope.$apply();
        requests[0].respond(200, {}, 'Hello');
        expect(response.intercepted).toBe(true);
    });

    it('allows attaching error handlers', function () {
        var data, status, headers, config;
        $http.get('http://teropa.info').error(function (d, s, h, c) {
            data = d;
            status = s;
            headers = h;
            config = c;
        });
        $rootScope.$apply();
        requests[0].respond(401, { 'Cache-Control': 'no-cache' }, 'Fail');
        //$rootScope.$apply();
        expect(data).toBe('Fail');
        expect(status).toBe(401);
        expect(headers('Cache-Control')).toBe('no-cache');
        expect(config.method).toBe('GET');
    });
    it('allows aborting a request with a Promise', function () {
        var timeout = $q.defer();
        $http.get('http://teropa.info', {
            timeout: timeout.promise
        });
        $rootScope.$apply();
        timeout.resolve();
        $rootScope.$apply();
        expect(requests[0].aborted).toBe(true);
    });

    it('allows aborting a request after a timeout', function () {
        $http.get('http://teropa.info', {
            timeout: 5000
        });
        $rootScope.$apply();
        jasmine.clock().tick(5001);
        expect(requests[0].aborted).toBe(true);
    });
    describe('useApplyAsync', function () {
        beforeEach(function () {
            var injector = createInjector(['ng', function ($httpProvider) {
                $httpProvider.useApplyAsync(true);
            }]);
            $http = injector.get('$http');
            $rootScope = injector.get('$rootScope');
        });
    });
});
