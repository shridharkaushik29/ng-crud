angular.module("ngCrud", ["ngSmoothSubmit"])

        .run([
            '$injector',
            '$crud',
            function ($injector, $crud) {

            }
        ])

        .factory("$user", [
            '$rootScope',
            '$crud',
            function ($rootScope, $crud) {

                var config = {

                };

                var service = {};

//                service.

                service.login = function (options) {
                    $crud.send("login", options.params).then(function (data) {
                        $rootScope.$user = data.user;
                    });
                }

                return service;
            }
        ])

        .provider('$crud', [function () {

                var defaultConfig = {
                    request: {
                        requestType: "$post",
                        reload: false,
                        checkDataType: true,
                        notify: {
                            action: "Close"
                        }
                    },
                    dialogPresets: {},
                    models: {}
                };

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

                        var service = {};

                        service.setBaseUrl = function (url) {
                            defaultConfig.request.baseUrl = url;
                        }

                        service.send = function (url, params, config) {

                            var options = _.merge({}, defaultConfig.request, config);

                            var dp = $q.defer();

                            $smoothSubmit[options.requestType](options.baseUrl + url, params).then(function (data) {

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
                            return $q(function (resolve, reject) {
                                if (options && options.dialog) {
                                    service.dialog(options.dialog).then(resolve, reject);
                                } else {
                                    resolve();
                                }
                            }).then(function () {
                                return service.send("create/" + action, params, options);
                            })
                        }

                        service.retrieve = function (action, params, options) {
                            var config = {}
                            config.requestType = "$get";
                            _.merge(config, options);
                            config.checkDataType = false;
                            config.notify = false;
                            return service.send("retrieve/" + action, params, config).then(function (data) {
                                if (config.scope) {
                                    var main = data[config.main || action];
                                    var mainScopeKey = config.mainScopeKey || config.main || action;
                                    $parse(mainScopeKey).assign(config.scope, main);
                                }
                                return data;
                            });
                        }

                        service.update = function (action, params, options) {
                            return service.send("update/" + action, params, options);
                        }

                        service.remove = function (action, params, options) {
                            return service.send("delete/" + action, params, options);
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

                            if ($mdDialog) {
                                var options = _.merge({}, preset, config, {
                                    fullscreen: true,
                                    scopes: {
                                        hide: $mdDialog.hide,
                                        cancel: $mdDialog.cancel
                                    }
                                });
                                if (!options.scope) {
                                    options.scope = $rootScope.$new();
                                }
                                options.scope = _.merge(options.scope, options.scopes);
                                options.scope.hide = $mdDialog.hide;
                                options.scope.cancel = $mdDialog.cancel;
                                options.clickOutsideToClose = true;
                                return $mdDialog.show(options);
                            } else {
                                console.error("No supported dialog plugins found for dialog");
                            }

                        }

                        service.chooseFile = function (options) {
                            if ($files) {
                                return $files.choose(options);
                            } else {
                                console.error("$files is not available");
                            }
                        }

                        service.setDialogPreset = function (name, preset) {
                            defaultConfig.dialogPresets[name] = preset;
                        }

                        return service;
                    }
                ]
            }
        ])
