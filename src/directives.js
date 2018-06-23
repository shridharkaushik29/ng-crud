import module from "./module";

module

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
                            }, function (data) {
                                $scope.$eval(element.attr("dialog-notify"), {
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
