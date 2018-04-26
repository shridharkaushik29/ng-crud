angular.module("ngCrud", ["ngSmoothSubmit"])

        .provider('$crud', [function () {

                var defaultConfig = {
                    request: {
                        requestType: "$post",
                        reload: false,
                        checkDataType: true,
                        progressModel: "progress",
                        notify: {
                            action: "Close"
                        }
                    },
                    dialogPresets: {},
                    models: {}
                };

                var setBaseUrl = function (url) {
                    defaultConfig.request.baseUrl = url;
                }

                var setProgressIndicator = function (model) {
                    defaultConfig.request.progressModel = model;
                }

                var setDialogPreset = function (name, preset) {
                    defaultConfig.dialogPresets[name] = preset;
                }

                this.setBaseUrl = function (url) {
                    setBaseUrl(url);
                    return this;
                }

                this.setDialogPreset = function (name, preset) {
                    setDialogPreset(name, preset)
                    return this;
                }

                this.setDialogService = function (name) {
                    defaultConfig.dialogService = name;
                    return this;
                }

                this.$get = [
                    '$smoothSubmit',
                    '$q',
                    '$injector',
                    '$location',
                    '$rootScope',
                    '$parse',
                    function ($smoothSubmit, $q, $injector, $location, $rootScope, $parse) {
                        var $state;
                        var $route;
                        var $mdDialog;
                        var $mdToast;
                        var $files;
                        var $modal;

                        if ($injector.has("$route")) {
                            $route = $injector.get("$route");
                        }

                        if ($injector.has("$state")) {
                            $state = $injector.get("$state");
                        }

                        if ($injector.has("$mdDialog")) {
                            $mdDialog = $injector.get("$mdDialog");
                        }

                        if ($injector.has("$files")) {
                            $files = $injector.get("$files");
                        }

                        if ($injector.has("$mdToast")) {
                            $mdToast = $injector.get("$mdToast");
                        }

                        if ($injector.has("$modal")) {
                            $modal = $injector.get("$modal");
                        }

                        var service = {};

                        service.setBaseUrl = setBaseUrl;

                        service.setDialogPreset = setDialogPreset;

                        service.setProgressIndicator = setProgressIndicator;

                        service.send = function (url, params, config) {

                            var options = _.merge({}, defaultConfig.request, config);

                            var dp = $q.defer();

                            var progressModel = options.progressModel;

                            if (progressModel) {
                                $parse(progressModel).assign($rootScope, true);
                            }

                            $smoothSubmit[options.requestType](options.baseUrl + url, params).then(function (data) {

                                if (progressModel) {
                                    $parse(progressModel).assign($rootScope, false);
                                }

                                if (options.notify) {
                                    service.notify(_.merge({}, options.notify, data));
                                }

                                if (options.checkDataType) {
                                    if (data.type === 'success') {

                                        if (options.reload) {
                                            if ($state) {
                                                $state.reload();
                                            } else if ($route) {
                                                $route.reload();
                                            } else {
                                                window.location.reload();
                                            }
                                        } else if (options.goto) {
                                            if ($state) {
                                                $state.go(options.goto);
                                            } else if ($route) {
                                                $location.url(options.goto);
                                            } else {
                                                window.location = options.goto;
                                            }
                                        }

                                        dp.resolve(data);

                                    } else {
                                        dp.notify(data);
                                    }
                                } else {
                                    dp.resolve(data);
                                }
                            }, function (error) {
                                console.warn(error);
                                if (progressModel) {
                                    $parse(progressModel).assign($rootScope, false);
                                }
                                var data = {
                                    type: "error",
                                    message: error.status + " : " + error.statusText
                                }
                                if (options.notify) {
                                    service.notify(_.merge({}, options.notify, data));
                                }
                                dp.reject(data);
                            })

                            return dp.promise;
                        }

                        service.create = function (action, params, options) {
                            return service.send("create/" + action, params, options);
                        }

                        service.retrieve = function (action, params, options) {
                            var config = {}
                            config.requestType = "$get";
                            _.merge(config, options);
                            config.checkDataType = false;
                            config.notify = false;
                            return service.send("retrieve/" + action, params, config).then(function (data) {
                                if (config.scope) {
                                    _.forEach(data, function (value, key) {
                                        config.scope[key] = value;
                                    })
                                }
                                return data;
                            });
                        }

                        service.update = function (action, params, options) {
                            return service.send("update/" + action, params, options);
                        }

                        service.remove = function (action, params, options) {
                            var config = {}
                            config.requestType = "$delete";
                            return service.send("delete/" + action, params, config);
                        }

                        service['delete'] = service.remove;

                        service.confirm = function (options) {
                            var config = {};

                            if ($mdDialog) {
                                config.title = "Are you sure?";
                                config.textContent = "This action won't be reversed";
                                config.ok = "Yes! Sure";
                                config.cancel = "No I'm Not";
                                config.multiple = true;

                                _.merge(config, options);

                                var a = $mdDialog
                                        .confirm(config);
                                return $mdDialog.show(a);
                            }

                        }

                        service.prompt = function (options) {
                            var config = {};

                            if ($mdDialog) {
                                config.ok = "Submit";
                                config.cancel = "Cancel";
                                config.multiple = true;
                                config.placeholder = "Type here..."
                                _.merge(config, options);

                                var a = $mdDialog.prompt(config)

                                return $mdDialog.show(a);
                            }
                        }

                        service.notify = function (options) {
                            if ($mdToast) {
                                var type = options.type;
                                var message;

                                if (type !== undefined) {
                                    if (type === 'success') {
                                        message = "Success: ";
                                    } else if (type === 'error') {
                                        message = "Error: ";
                                    }
                                    message += options.message;
                                } else {
                                    message = options.message;
                                }


                                var dialogOptions = _.merge({
                                    textContent: message,
                                    position: "bottom right",
                                    action: "Hide"
                                }, options);

                                var preset = $mdToast.simple(dialogOptions).textContent(options.textContent || message);

                                return $mdToast.show(preset);
                            }
                        }

                        service.alert = function (options) {
                            var config = {};

                            if ($mdDialog) {
                                config.ok = "Okay!";
                                config.multiple = true;
                                _.merge(config, options);

                                if (config.data) {
                                    if (config.data.type === 'success') {
                                        config.textContent = "Success: ";
                                    } else {
                                        config.textContent = "Success: ";
                                    }
                                    config.textContent += config.data.message;
                                }

                                var a = $mdDialog
                                        .alert(config)
                                        .textContent(config.textContent || config.message)

                                return $mdDialog.show(a);
                            }
                        }

                        service.dialog = function (presetName, config) {

                            var preset = defaultConfig.dialogPresets[presetName];
                            var options = _.merge({}, preset, config);
                            var serviceName = options.dialogService || options.service || defaultConfig.dialogService;
                            var service;

                            if (!serviceName) {
                                if ($injector.has("$mdDialog")) {
                                    serviceName = "$mdDialog";
                                } else {
                                    throw "No supported dialog service found for dialog";
                                }
                            }

                            if (serviceName === '$mdDialog') {
                                options.clickOutsideToClose = true;
                            }

                            service = $injector.get(serviceName);

                            if (!options.scope) {
                                options.scope = $rootScope.$new();
                            }

                            options.scope = _.merge(options.scope, options.scopes);

                            options.scope.hide = service.hide;
                            options.scope.cancel = service.cancel;

                            var dialog = service.show(options);

                            dialog.cancel = service.cancel;
                            dialog.hide = service.hide;

                            return dialog;

                        }

                        service.chooseFile = function (options) {
                            return $injector.get('$files').choose(options);
                        }

                        service.login = function (params, config) {
                            $injector.get('$user').login(params, config);
                        }

                        service.logout = function (params, config) {
                            $injector.get('$user').logout(params, config);
                        }

                        return service;
                    }
                ]
            }
        ])


        .factory("$user", [
            '$rootScope',
            '$parse',
            '$crud',
            '$injector',
            function ($rootScope, $parse, $crud, $injector) {

                var rootScopeVariable = "$user";
                var service = {};
                var $transitions;
                if ($injector.has('$transitions')) {
                    $transitions = $injector.get("$transitions");
                }

                service.retrieve = function () {
                    return $crud.retrieve("user").then(function (data) {
                        var user = data.user;
                        service.set(user);
                        return user;
                    })
                }

                service.get = function () {
                    return $rootScope.$eval(rootScopeVariable);
                }

                service.set = function (user) {
                    $parse(rootScopeVariable).assign($rootScope, user);
                }

                service.protectRoutes = function (config) {
                    var options = _.merge({
                        defaultState: "profile",
                        loginState: "login"
                    }, config);

                    if ($transitions) {
                        var $stateParams = $injector.get('$stateParams');
                        $transitions.onEnter({}, function (transition) {
                            if (transition.to().loggedIn === true || transition.to().loggedOut === true) {
                                return service.retrieve().then(function (user) {
                                    if (transition.to().loggedOut === true && user) {
                                        var to = $stateParams.goto || options.defaultState;
                                        return transition.router.stateService.target(to, {}, {
                                            location: 'replace'
                                        });
                                    } else if (!user && transition.to().loggedIn === true) {
                                        return transition.router.stateService.target(options.loginState, {
                                            goto: transition.to().name
                                        });
                                    }
                                }, function (error) {
                                    return transition.router.stateService.target(options.loginState, {
                                        goto: transition.to().name
                                    });
                                });
                            }
                        })
                    }
                }

                service.login = function (params, config) {
                    var options = _.merge({
                        request: {
                            reload: true
                        }
                    }, config)
                    return $crud.send("login", params, options.request).then(function (data) {
                        if (data.user !== undefined) {
                            service.set(data.user);
                        }
                        return data;
                    });
                }

                service.logout = function (params, config) {
                    var options = _.merge({
                        request: {
                            reload: true
                        }
                    }, config)
                    return $crud.send("logout", params, options.request).then(function (data) {
                        service.remove();
                        return data;
                    });
                }

                service.remove = function () {
                    $parse(rootScopeVariable).assign(undefined, $rootScope);
                }

                return service;
            }
        ])

        .directive("logout", [
            '$user',
            function ($user) {
                return {
                    link: function ($scope, element) {
                        element.on("click", function () {
                            $user.logout().then(function (data) {
                                $scope.$eval(element.attr("on-logout"), {
                                    $data: data
                                })
                            });
                        })
                    }
                }
            }
        ])

        .directive("dialogTrigger", [
            '$crud',
            function ($crud) {
                return {
                    restrict: "A",
                    link: function ($scope, element) {

                        var showDialog = function (preset, options) {
                            $crud.dialog(preset, options).then(function (data) {
                                $scope.$eval(element.attr("dialog-resolve"), {
                                    $data: data
                                });
                            }, function (data) {
                                $scope.$eval(element.attr("dialog-reject"), {
                                    $data: data
                                });
                            })
                        }

                        element.on("click", function (e) {
                            var dialogPreset = element.attr("dialog-preset");
                            var dialogOptions = $scope.$eval(element.attr("dialog-options")) || {};
                            var dialogScopes = $scope.$eval(element.attr("dialog-scopes"));
                            dialogOptions.targetEvent = e;
                            dialogOptions.scopes = dialogScopes;
                            if (dialogPreset) {
                                showDialog(dialogPreset, dialogOptions)
                            }
                        })
                    }
                }
            }
        ])

        .directive("crudRemove", [
            '$crud',
            function ($crud) {
                return {
                    link: function ($scope, element) {
                        var removeModel = function (url, params) {
                            $crud.remove(url, params).then(function (data) {
                                $scope.$eval(element.attr("on-resolve"), {
                                    $data: data
                                });
                            }, function (data) {
                                $scope.$eval(element.attr("on-reject"), {
                                    $data: data
                                });
                            })
                        }

                        element.on("click", function (e) {
                            var confirm = $scope.$eval(element.attr("confirm"));
                            var url = element.attr("crud-remove");
                            var params = $scope.$eval(element.attr("params"));
                            if (confirm) {
                                var confirmOptions = _.merge({}, confirm);
                                if (_.isFunction(confirm)) {
                                    confirm(confirmOptions).then(function () {
                                        removeModel(url, params);
                                    })
                                } else {
                                    confirmOptions.targetEvent = e;
                                    $crud.confirm(confirmOptions).then(function () {
                                        removeModel(url, params);
                                    })
                                }
                            } else {
                                removeModel(url, params);
                            }
                        })
                    }
                }
            }
        ])
