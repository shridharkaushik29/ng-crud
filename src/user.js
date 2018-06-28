import module from "./module";

module

        .provider("$user", function () {

            var defaultConfig = {
                rootScopeModel: "$user",
                requests: {
                    retrieveUser: [
                        '$crud',
                        ($crud) => $crud.retrieve("user").then(data => data.user)
                    ],
                    login: [
                        '$crud',
                        '$params',
                        ($crud, $params) => $crud.login($params)
                    ],
                    logout: [
                        '$crud',
                        '$params',
                        ($crud, $params) => $crud.logout($params)
                    ],
                }
            }

            this.setRequests = function (requests) {
                _.merge(defaultConfig.requests, requests);
            }

            this.$get = [
                '$rootScope',
                '$parse',
                '$crud',
                '$injector',
                '$q',
                function ($rootScope, $parse, $crud, $injector, $q) {

                    var rootScopeVariable = defaultConfig.rootScopeModel;
                    var service = {};
                    var $transitions;
                    if ($injector.has('$transitions')) {
                        $transitions = $injector.get("$transitions");
                    }

                    service.retrieve = function (params) {
                        return $injector.invoke(defaultConfig.requests.retrieveUser, this, {
                            $params: params
                        }).then((user) => {
                            service.set(user);
                            return user;
                        })
                    }

                    service.get = () => $rootScope.$eval(rootScopeVariable);

                    service.set = (user) => {
                        $parse(rootScopeVariable).assign($rootScope, user);
                        return this;
                    }

                    service.protectRoutes = function (config) {
                        var options = _.merge({
                            defaultState: "profile",
                            checkLogin: () => $q((resolve, reject) => {
                                    service.retrieve().then(user => {
                                        user ? resolve(user) : reject()
                                    })
                                }),
                            loginAction: (transition) => transition.router.stateService.target("login", {
                                    goto: transition.to().name
                                })
                        }, config);

                        if ($transitions) {
                            var $stateParams = $injector.get('$stateParams');
                            $transitions.onEnter({}, function (transition) {
                                if (transition.to().loggedIn === true || transition.to().loggedOut === true) {
                                    return options.checkLogin(transition).then(function () {
                                        if (transition.to().loggedOut === true) {
                                            var to = $stateParams.goto || options.defaultState;
                                            return transition.router.stateService.target(to, {}, {
                                                location: 'replace'
                                            });
                                        }
                                    }, function () {
                                        if (transition.to().loggedIn === true && options.loginAction) {
                                            return options.loginAction(transition);
                                        }
                                    });
                                }
                            })
                        }
                    }

                    service.login = function (params, config) {
                        var options = {
                            request: {
                                reload: true,
                                requestType: "$post",
                                checkDataType: true
                            }
                        }

                        _.merge(options, config)

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
                                reload: true,
                                requestType: "$post",
                                checkDataType: true
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
            ]
        })