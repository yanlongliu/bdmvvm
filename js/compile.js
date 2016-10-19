function $CompileProvider($provide) {
    var hasDirectives = {};
    function parseIsolateBindings(scope) {
        var bindings = {};
        _.forEach(scope, function (definition, scopeName) {
            var match = definition.match(/\s*([@&]|=(\*?))(\??)\s*(\w*)\s*/);
            bindings[scopeName] = {
                mode: match[1][0],
                collection: match[2] === '*',
                optional: match[3],
                attrName: match[4] || scopeName
            };
        });
        return bindings;
    }
    function parseDirectiveBindings(directive) {
        var bindings = {};
        if (_.isObject(directive.scope)) {
            if (directive.bindToController) {
                bindings.bindToController = parseIsolateBindings(directive.scope);
            } else {
                bindings.isolateScope = parseIsolateBindings(directive.scope);
            }
        }
        if (_.isObject(directive.bindToController)) {
            bindings.bindToController =
                parseIsolateBindings(directive.bindToController);
        }
        return bindings;
    }
    this.directive = function (name, directiveFactory) {
        var self = this;
        if (_.isString(name)) {
            if (name === 'hasOwnProperty') {
                throw 'hasOwnProperty is not a valid directive name';
            }
            if (!hasDirectives.hasOwnProperty(name)) {
                hasDirectives[name] = [];
                $provide.factory(name + 'Directive', ['$injector', function ($injector) {
                    var factories = hasDirectives[name];
                    return _.map(factories, function (factory, i) {
                        var directive = $injector.invoke(factory);
                        directive.restrict = directive.restrict || 'EA';
                        directive.priority = directive.priority || 0;
                        if (directive.link && !directive.compile) {
                            directive.compile = _.constant(directive.link);
                        }
                        directive.$$bindings = parseDirectiveBindings(directive);
                        directive.name = directive.name || name;
                        directive.index = i;
                        directive.require = directive.require || (directive.controller && name);
                        return directive;
                    });
                }])
            }
            hasDirectives[name].push(directiveFactory);
        } else {
            _.forEach(name, function (directiveFactory, name) {
                self.directive(name, directiveFactory);
            });
        }

    }
    this.$get = ['$injector', '$parse', '$controller', '$rootScope', function ($injector, $parse, $controller, $rootScope) {
        function Attributes(element) {
            this.$$element = element;
            this.$attr = {};
        }
        Attributes.prototype.$set = function (key, value, writeAttr, attrName) {
            this[key] = value;

            if (isBooleanAttribute(this.$$element[0], key)) {
                this.$$element.prop(key, value);
            }

            if (!attrName) {
                if (this.$attr[key]) {
                    attrName = this.$attr[key];
                } else {
                    attrName = this.$attr[key] = _.kebabCase(key);
                }
            } else {
                this.$attr[key] = attrName;
            }
            if (writeAttr !== false) {
                this.$$element.attr(attrName, value);
            }
            if (this.$$observers) {
                _.forEach(this.$$observers[key], function (observer) {
                    try {
                        observer(value);
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        };
        Attributes.prototype.$observe = function (key, fn) {
            var self = this;
            this.$$observers = this.$$observers || Object.create(null);
            this.$$observers[key] = this.$$observers[key] || [];
            this.$$observers[key].push(fn);
            $rootScope.$evalAsync(function () {
                fn(self[key]);
            });
            return function () {
                var index = self.$$observers[key].indexOf(fn);
                if (index >= 0) {
                    self.$$observers[key].splice(index, 1);
                }
            };
        }
        Attributes.prototype.$addClass = function (classVal) {
            this.$$element.addClass(classVal);
        };
        Attributes.prototype.$removeClass = function (classVal) {
            this.$$element.removeClass(classVal);
        };

        Attributes.prototype.$updateClass = function (newClassVal, oldClassVal) {
            var newClasses = newClassVal.split(/\s+/);
            var oldClasses = oldClassVal.split(/\s+/);
            var addedClasses = _.difference(newClasses, oldClasses);
            var removedClasses = _.difference(oldClasses, newClasses);
            if (addedClasses.length) {
                this.$addClass(addedClasses.join(' '));
            }
            if (removedClasses.length) {
                this.$removeClass(removedClasses.join(' '));
            }
        };
        function initializeDirectiveBindings(scope, attrs, destination, bindings, newScope) {
            _.forEach(bindings, function (definition, scopeName) {
                var attrName = definition.attrName;
                switch (definition.mode) {
                    case '@':
                        attrs.$observe(attrName, function (newAttrValue) {
                            destination[scopeName] = newAttrValue;
                        });
                        if (attrs[attrName]) {
                            destination[scopeName] = attrs[attrName];
                        }
                        break;
                    case '=':
                        if (definition.optional && !attrs[attrName]) {
                            break;
                        }
                        var parentGet = $parse(attrs[attrName]);
                        var lastValue = destination[scopeName] = parentGet(scope);
                        var parentValueWatch = function () {
                            var parentValue = parentGet(scope);
                            if (destination[scopeName] !== parentValue) {
                                if (parentValue !== lastValue) {
                                    destination[scopeName] = parentValue;
                                } else {
                                    parentValue = destination[scopeName];
                                    parentGet.assign(scope, parentValue);
                                }
                            }
                            lastValue = parentValue;
                            return lastValue;
                        };
                        var unwatch;
                        if (definition.collection) {
                            unwatch = scope.$watchCollection(attrs[attrName], parentValueWatch);
                        } else {
                            unwatch = scope.$watch(parentValueWatch);
                        }
                        isolateScope.$on('$destroy', unwatch);
                        break;
                    case '&':
                        var parentExpr = $parse(attrs[attrName]);
                        if (parentExpr === _.noop && definition.optional) {
                            break;
                        }
                        destination[scopeName] = function (locals) {
                            return parentExpr(scope, locals);
                        };
                        break;
                }
            });
        }
        var BOOLEAN_ATTRS = {
            multiple: true, selected: true, checked: true, disabled: true, readOnly: true, required: true, open: true
        };
        var BOOLEAN_ELEMENTS = {
            INPUT: true,
            SELECT: true,
            OPTION: true, TEXTAREA: true,
            BUTTON: true,
            FORM: true,
            DETAILS: true
        };
        var PREFIX_REGEXP = /(x[\:\-_]|data[\:\-_])/i;
        function directiveNormalize(name) {
            return _.camelCase(name.replace(PREFIX_REGEXP, ''));
        }
        function directiveIsMultiElement(name) {
            if (hasDirectives.hasOwnProperty(name)) {
                var directives = $injector.get(name + 'Directive');
                return _.some(directives, { multiElement: true });
            }
            return false;
        }
        function isBooleanAttribute(node, attrName) {
            return BOOLEAN_ATTRS[attrName] && BOOLEAN_ELEMENTS[node.nodeName];
        }
        function groupScan(node, startAttr, endAttr) {
            var nodes = [];
            if (startAttr && node && node.hasAttribute(startAttr)) {
                var depth = 0; do {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.hasAttribute(startAttr)) {
                            depth++;
                        } else if (node.hasAttribute(endAttr)) {
                            depth--;
                        }
                    }
                    nodes.push(node);
                    node = node.nextSibling;
                } while (depth > 0);
            } else {
                nodes.push(node);
            }
            return $(nodes);
        }
        function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
            return function (scope, element, attrs, ctrl) {
                var group = groupScan(element[0], attrStart, attrEnd);
                return linkFn(scope, group, attrs, ctrl);
            };
        }
        function compile($compileNodes) {
            var compositeLinkFn = compileNodes($compileNodes);
            return function publicLinkFn(scope) {
                $compileNodes.data('$scope', scope);
                compositeLinkFn(scope, $compileNodes);
            };
        }
        function compileNodes($compileNodes) {
            var linkFns = [];
            _.forEach($compileNodes, function (node, i) {
                var attrs = new Attributes($(node));
                var directives = collectDirectives(node, attrs);
                var nodeLinkFn;
                if (directives.length) {
                    nodeLinkFn = applyDirectivesToNode(directives, node, attrs);
                }
                var childLinkFn;
                if ((!nodeLinkFn || !nodeLinkFn.terminal) && node.childNodes && node.childNodes.length) {
                    childLinkFn = compileNodes(node.childNodes);
                }
                if (nodeLinkFn && nodeLinkFn.scope) {
                    attrs.$$element.addClass('ng-scope');
                }
                if (nodeLinkFn || childLinkFn) {
                    linkFns.push({
                        nodeLinkFn: nodeLinkFn,
                        childLinkFn: childLinkFn,
                        idx: i
                    })
                }
            });
            function compositeLinkFn(scope, linkNodes) {
                var stableNodeList = [];
                _.forEach(linkFns, function (linkFn) {
                    var nodeIdx = linkFn.idx;
                    stableNodeList[nodeIdx] = linkNodes[nodeIdx];
                });
                _.forEach(linkFns, function (linkFn) {
                    var node = stableNodeList[linkFn.idx];
                    if (linkFn.nodeLinkFn) {
                        if (linkFn.nodeLinkFn.scope) {
                            scope = scope.$new();
                            $(node).data('$scope', scope);
                        }
                        linkFn.nodeLinkFn(
                            linkFn.childLinkFn,
                            scope,
                            node
                        );
                    } else {
                        linkFn.childLinkFn(
                            scope,
                            node.childNodes
                        );
                    }
                });
            }

            return compositeLinkFn;
        }
        function applyDirectivesToNode(directives, compileNode, attrs) {
            var $compileNode = $(compileNode);
            var terminalPriority = -Number.MAX_VALUE;
            var terminal = false;
            var preLinkFns = [], postLinkFns = [], controllers = {};
            var newScopeDirective, newIsolateScopeDirective;
            var controllerDirectives;
            function getControllers(require, $element) {
                if (_.isArray(require)) {
                    return _.map(require, getControllers);
                } else {
                    var value;
                    var match = require.match(/^(\^\^?)?(\?)?(\^\^?)?/); 
                    var optional = match[2];
                    require = require.substring(match[0].length);
                    if (match[1] || match[3]) {
                        if (match[3] && !match[1]) {
                            match[1] = match[3];
                        }
                        if (match[1] === '^^') {
                            $element = $element.parent();
                        }
                        while ($element.length) {
                            value = $element.data('$' + require + 'Controller');
                            if (value) {
                                break;
                            } else {
                                $element = $element.parent();
                            }
                        }
                    } else {
                        if (controllers[require]) {
                            value = controllers[require].instance;
                        }
                    }
                    if (!value && !optional) {
                        throw 'Controller' + require + 'required by directive, cannot be found!';
                    }
                    return value || null;
                }
            }
            function addLinkFns(preLinkFn, postLinkFn, attrStart, attrEnd, isolateScope, require) {
                if (preLinkFn) {
                    if (attrStart) {
                        preLinkFn = groupElementsLinkFnWrapper(preLinkFn, attrStart, attrEnd);
                    }
                    preLinkFn.isolateScope = isolateScope;
                    preLinkFn.require = require;
                    preLinkFns.push(preLinkFn);
                }
                if (postLinkFn) {
                    if (attrStart) {
                        postLinkFn = groupElementsLinkFnWrapper(postLinkFn, attrStart, attrEnd);
                    }
                    postLinkFn.isolateScope = isolateScope;
                    postLinkFn.require = require;
                    postLinkFns.push(postLinkFn);
                }
            }
            _.forEach(directives, function (directive) {
                if (directive.$$start) {
                    $compileNode = groupScan(compileNode, directive.$$start, directive.$$end);
                }
                if (directive.priority < terminalPriority) {
                    return false;
                }
                if (directive.scope) {
                    if (_.isObject(directive.scope)) {
                        if (newIsolateScopeDirective || newScopeDirective) {
                            throw 'Multiple directives asking for new/inherited scope';
                        }
                        newIsolateScopeDirective = directive;
                    } else {
                        if (newIsolateScopeDirective) {
                            throw 'Multiple directives asking for new/inherited scope';
                        }
                        newScopeDirective = newScopeDirective || directive;
                    }
                }
                if (directive.compile) {
                    var linkFn = directive.compile($compileNode, attrs);
                    var isolateScope = (directive === newIsolateScopeDirective);
                    var attrStart = directive.$$start;
                    var attrEnd = directive.$$end;
                    var require = directive.require;
                    if (_.isFunction(linkFn)) {
                        addLinkFns(null, linkFn, attrStart, attrEnd, isolateScope, require);
                    } else if (linkFn) {
                        addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd, isolateScope, require);
                    }
                }
                if (directive.terminal) {
                    terminal = true;
                    terminalPriority = directive.priority;
                }
                if (directive.controller) {
                    controllerDirectives = controllerDirectives || {};
                    controllerDirectives[directive.name] = directive;
                }
            });
            function nodeLinkFn(childLinkFn, scope, linkNode) {
                var $element = $(linkNode);
                var isolateScope;
                if (newIsolateScopeDirective) {
                    isolateScope = scope.$new(true);
                    $element.addClass('ng-isolate-scope');
                    $element.data('$isolateScope', isolateScope);
                }
                if (controllerDirectives) {
                    _.forEach(controllerDirectives, function (directive) {
                        var locals = {
                            $scope: directive === newIsolateScopeDirective ? isolateScope : scope,
                            $element: $element,
                            $attrs: attrs
                        }
                        var controllerName = directive.controller;
                        if (controllerName === '@') {
                            controllerName = attrs[directive.name]
                        }
                        var controller = $controller(controllerName, locals, true, directive.controllerAs);
                        controllers[directive.name] = controller;
                        $element.data('$' + directive.name + 'Controller', controller.instance);
                    })
                }

                if (newIsolateScopeDirective) {
                    initializeDirectiveBindings(scope, attrs, isolateScope, newIsolateScopeDirective.$$bindings.isolateScope, isolateScope);
                }
                var scopeDirective = newIsolateScopeDirective || newScopeDirective;
                if (scopeDirective && controllers[scopeDirective.name]) {
                    initializeDirectiveBindings(
                        scope,
                        attrs,
                        controllers[scopeDirective.name].instance,
                        scopeDirective.$$bindings.bindToController,
                        isolateScope
                    );
                }
                _.forEach(controllers, function (controller) {
                    controller();
                });
                _.forEach(preLinkFns, function (linkFn) {
                    linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element));
                });
                if (childLinkFn) {
                    childLinkFn(scope, linkNode.childNodes);
                }
                _.forEachRight(postLinkFns, function (linkFn) {
                    linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element));
                });
            }
            nodeLinkFn.terminal = terminal;
            nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope;
            return nodeLinkFn;
        }
        function collectDirectives(node, attrs) {
            var directives = [];
            var match;
            if (node.nodeType === Node.ELEMENT_NODE) {
                var normalizedNodeName = directiveNormalize(nodeName(node).toLowerCase());
                addDirective(directives, normalizedNodeName, 'E');
                _.forEach(node.attributes, function (attr) {
                    var attrStartName, attrEndName;
                    var name = attr.name;
                    var normalizedAttrName = directiveNormalize(name.toLowerCase());
                    var isNgAttr = /^ngAttr[A-Z]/.test(normalizedAttrName);
                    if (isNgAttr) {
                        name = _.kebabCase(
                            normalizedAttrName[6].toLowerCase() +
                            normalizedAttrName.substring(7)
                        );
                        normalizedAttrName = directiveNormalize(name.toLowerCase());
                    }
                    attrs.$attr[normalizedAttrName] = name;
                    var directiveNName = normalizedAttrName.replace(/(Start|End)$/, '');
                    if (directiveIsMultiElement(directiveNName)) {
                        if (/Start$/.test(normalizedAttrName)) {
                            attrStartName = name;
                            attrEndName = name.substring(0, name.length - 5) + 'end';
                            name = name.substring(0, name.length - 6);
                        }
                    }
                    normalizedAttrName = directiveNormalize(name.toLowerCase());
                    addDirective(directives, normalizedAttrName, 'A', attrStartName, attrEndName);
                    if (isNgAttr || !attrs.hasOwnProperty(normalizedAttrName)) {
                        attrs[normalizedAttrName] = attr.value.trim();
                        if (isBooleanAttribute(node, normalizedAttrName)) {
                            attrs[normalizedAttrName] = true;
                        }
                    }
                });
                var className = node.className;
                if (_.isString(className) && !_.isEmpty(className)) {
                    while ((match = /([\d\w\-_]+)(?:\:([^;]+))?;?/.exec(className))) {
                        var normalizedClassName = directiveNormalize(match[1]);
                        if (addDirective(directives, normalizedClassName, 'C')) {
                            attrs[normalizedClassName] = match[2] ? match[2].trim() : undefined;
                        }
                        className = className.substr(match.index + match[0].length);
                    }
                }
            } else if (node.nodeType === Node.COMMENT_NODE) {
                match = /^\s*directive\:\s*([\d\w\-_]+)\s*(.*)$/.exec(node.nodeValue);
                if (match) {
                    var normalizedName = directiveNormalize(match[1]);
                    if (addDirective(directives, normalizedName, 'M')) {
                        attrs[normalizedName] = match[2] ? match[2].trim() : undefined;
                    }
                }
            }
            directives.sort(byPriority);
            return directives;
        }
        function byPriority(a, b) {
            var diff = b.priority - a.priority; if (diff !== 0) {
                return diff;
            } else {
                if (a.name !== b.name) {
                    return (a.name < b.name ? -1 : 1);
                } else {
                    return a.index - b.index;
                }
            }
        }
        function nodeName(element) {
            return element.nodeName ? element.nodeName : element[0].nodeName;
        }
        function addDirective(directives, name, mode, attrStartName, attrEndName) {
            var match;
            if (hasDirectives.hasOwnProperty(name)) {
                var foundDirectives = $injector.get(name + 'Directive');
                var applicableDirectives = _.filter(foundDirectives, function (dir) {
                    return dir.restrict.indexOf(mode) !== -1;
                });
                _.forEach(applicableDirectives, function (directive) {
                    if (attrStartName) {
                        directive = _.create(directive, {
                            $$start: attrStartName,
                            $$end: attrEndName
                        });
                    }
                    directives.push(directive);
                    match = directive;
                });
            }
            return match;
        }

        return compile;
    }];
}
$CompileProvider.$inject = ['$provide'];