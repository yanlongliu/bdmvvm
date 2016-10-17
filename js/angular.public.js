function publishExternalAPI() {
    setupModuleLoader(window);
    var ngModule = angular.module('ng', []);
    ngModule.provider('$filter', $FilterProvider);
    ngModule.provider('$parse', $ParseProvider);
    ngModule.provider('$rootScope', $RootScopeProvider);
    ngModule.provider('$q', $QProvider);
    ngModule.provider('$$q', $$QProvider);
    ngModule.provider('$httpBackend', $HttpBackendProvider); 
    ngModule.provider('$http', $HttpProvider);
    ngModule.provider('$httpParamSerializer', $HttpParamSerializerProvider);
    ngModule.provider('$httpParamSerializerJQLike', $HttpParamSerializerJQLikeProvider);
    ngModule.provider('$compile', $CompileProvider);
}