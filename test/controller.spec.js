describe('------------------$controller', function () {
    beforeEach(function () {
        delete window.angular;
        publishExternalAPI();
    });
    it('instantiates controller functions', function () {
        var injector = createInjector(['ng']);
        var $controller = injector.get('$controller');
        function MyController() {
            this.invoked = true;
        }
        var controller = $controller(MyController);
        expect(controller).toBeDefined();
        expect(controller instanceof MyController).toBe(true);
        expect(controller.invoked).toBe(true);
    });
    it('allows registering controllers through modules', function () {
        var module = angular.module('myModule', []); 
        module.controller('MyController', function MyController() { });
        var injector = createInjector(['ng', 'myModule']); 
        var $controller = injector.get('$controller'); 
        var controller = $controller('MyController');
        expect(controller).toBeDefined();
    });
});