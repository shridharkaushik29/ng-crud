import module from "./module";

module

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
        ])