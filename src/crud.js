import module from "./module";
import {
dialog as dialogDriver,
        notify as notifyDriver,
        alert as alertDriver,
        confirm as confirmDriver,
        prompt as promptDriver
        } from "./drivers";
import dialogPresets from "./dialog-presets";

module

        .provider('$crud', [function () {

                var defaultConfig = {
                    request: {
                        progressModel: "progress",
                        baseUrl: null,
                        preferRemote: false,
                        notify: {
                            action: "Close"
                        }
                    },
                    dataServices: {},
                    dialogPresets: dialogPresets,
                    drivers: {
                        notify: notifyDriver,
                        dialog: dialogDriver,
                        alert: alertDriver,
                        confirm: confirmDriver,
                        prompt: promptDriver,
                    }
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

                this.setDriver = function (name, value) {
                    defaultConfig.drivers[name] = value;
                    return this;
                }

                this.dataService = function (url, value) {
                    defaultConfig.dataServices[url] = value;
                    return this;
                }

                this.$get = [
                    '$smoothSubmit',
                    '$q',
                    '$injector',
                    '$location',
                    '$rootScope',
                    '$parse',
                    ($smoothSubmit, $q, $injector, $location, $rootScope, $parse) => {
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

                        service.setProgressIndicator = setProgressIndicator;

                        service.send = function (url, params, config) {

                            var options = {}

                            _.merge(options, defaultConfig.request, config);

                            var progressModel = options.progressModel;

                            if (progressModel) {
                                $parse(progressModel).assign($rootScope, true);
                            }

                            var dp = $q.defer();


                            $q((resolve, reject) => {
                                if (defaultConfig.dataServices[url] && !options.preferRemote) {
                                    $injector.invoke(defaultConfig.dataServices[url], this, {
                                        $params: params,
                                        $options: options
                                    }).then(resolve, reject);
                                } else {
                                    $smoothSubmit[options.requestType](options.baseUrl + url, params, options.smoothSubmitOptions).then(resolve, reject)
                                }
                            }).then(data => {

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
                            }, error => {

                                if (progressModel) {
                                    $parse(progressModel).assign($rootScope, false);
                                }

                                var data = {
                                    type: "error",
                                    message: error.status + " : " + error.statusText,
                                    error: error
                                }

                                if (options.notify) {
                                    service.notify(_.merge({}, options.notify, data));
                                }

                                dp.reject(data);
                            })


                            return dp.promise;
                        }

                        service.create = function (action, params, options) {
                            var config = {}

                            config.checkDataType = true;
                            config.notify = true;
                            config.requestType = "$post";

                            _.merge(config, options);

                            return service.send("create/" + action, params, config);
                        }

                        service.retrieve = function (action, params, options) {
                            var config = {}

                            config.checkDataType = false;
                            config.notify = false;
                            config.requestType = "$get";

                            _.merge(config, options);


                            return this.send("retrieve/" + action, params, config).then((data) => {
                                if (config.scope) {
                                    _(data).forEach((value, key) => {
                                        config.scope[key] = value;
                                    })
                                }
                                return data;
                            });
                        }

                        service.update = function (action, params, options) {
                            var config = {}

                            config.checkDataType = true;
                            config.notify = true;
                            config.requestType = "$post";

                            _.merge(config, options);

                            return this.send("update/" + action, params, config);
                        }

                        service.remove = function (action, params, options) {
                            var config = {}

                            config.checkDataType = true;
                            config.notify = true;
                            config.requestType = "$delete";

                            _.merge(config, options);

                            return $q((resolve, reject) => {
                                if (config.confirm) {
                                    this.confirm(config.confirm).then(resolve, reject)
                                } else {
                                    resolve(true);
                                }
                            }).then(() => {
                                return this.send("delete/" + action, params, config);
                            })

                        }

                        service.delete = service.remove;

                        service.confirm = function (options) {
                            return $injector.invoke(defaultConfig.drivers.confirm, this, {
                                $options: options
                            })
                        }

                        service.prompt = function (options) {
                            return $injector.invoke(defaultConfig.drivers.prompt, this, {
                                $options: options
                            })
                        }

                        service.notify = function (options) {
                            return $injector.invoke(defaultConfig.drivers.notify, this, {
                                $options: options
                            })
                        }

                        service.alert = function (options) {
                            return $injector.invoke(defaultConfig.drivers.alert, this, {
                                $options: options
                            });
                        }

                        service.dialog = function (presetName, config) {

                            var preset = defaultConfig.dialogPresets[presetName];

                            if (_.isArray(preset)) {
                                preset = $injector.invoke(preset, this, {
                                    $options: config
                                })
                            }

                            var options = _.merge(preset, config);

                            return $injector.invoke(defaultConfig.drivers.dialog, this, {
                                $options: options
                            });

                        }

                        service.chooseFile = function (options) {
                            return $injector.get('$files').choose(options);
                        }

                        service.login = function (params, config) {
                            return $injector.get('$user').login(params, config);
                        }

                        service.logout = function (params, config) {
                            return $injector.get('$user').logout(params, config);
                        }

                        return service;
                    }
                ]
            }
        ])