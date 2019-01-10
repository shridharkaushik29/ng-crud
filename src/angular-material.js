"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var _ = require("lodash");
exports.default = 'ngCrudMaterial';
angular.module("ngCrudMaterial", [
    'ngMaterial',
    'ngCrud'
])
    .config([
    '$crudProvider',
    function ($crudProvider) {
        $crudProvider
            .config(function (config) {
            var callbacks = config.callbacks;
            callbacks.notify = [
                '$mdToast',
                '$options',
                function ($mdToast, $options) {
                    var type = $options.type, message = $options.message;
                    if (type) {
                        message = (type === 'success' ? 'Success' : 'Error') + " : " + message;
                    }
                    var dialogOptions = __assign({ textContent: message, position: "bottom right", action: "Hide" }, $options);
                    // @ts-ignore
                    var preset = $mdToast.simple(dialogOptions).textContent($options.textContent || message);
                    return $mdToast.show(preset);
                }
            ];
            callbacks.alert = [
                '$mdDialog',
                '$options',
                function ($mdDialog, $options) {
                    var config = __assign({ ok: "Okay!", multiple: true }, $options);
                    var textContent = config.textContent, message = config.message;
                    // @ts-ignore
                    var preset = $mdDialog.alert(config).textContent(textContent || message);
                    return $mdDialog.show(preset);
                }
            ];
            callbacks.confirm = [
                '$mdDialog',
                '$options',
                function ($mdDialog, $options) {
                    var config = __assign({ title: "Are you sure?", textContent: "This action won't be revered", ok: "Yes! Sure", cancel: "No I'm Not", multiple: true }, $options);
                    // @ts-ignore
                    var preset = $mdDialog.confirm(config);
                    return $mdDialog.show(preset);
                }
            ];
            callbacks.prompt = [
                '$mdDialog',
                '$options',
                function ($mdDialog, $options) {
                    var config = __assign({ ok: "Submit", cancel: "Cancel", multiple: true, placeholder: "Type here..." }, $options);
                    var preset = $mdDialog.prompt(config);
                    return $mdDialog.show(preset);
                }
            ];
            callbacks.dialog = [
                '$mdDialog',
                '$q',
                '$options',
                '$dialogName',
                '$injector',
                '$rootScope',
                function ($mdDialog, $q, $options, $dialogName, $injector, $rootScope) {
                    var preset = $crudProvider.getDialogPreset($dialogName);
                    if (angular.isArray(preset) || angular.isFunction(preset)) {
                        preset = $injector.invoke(preset);
                    }
                    var dialogOptions = __assign({ clickOutsideToClose: true }, preset, $options);
                    if (!dialogOptions.scope) {
                        dialogOptions.scope = $rootScope.$new();
                    }
                    var scope = dialogOptions.scope;
                    var defer = $q.defer();
                    _.merge(scope, dialogOptions.scopes);
                    scope.hide = $mdDialog.hide;
                    scope.cancel = $mdDialog.cancel;
                    scope.notify = defer.notify;
                    var dialog = $mdDialog.show(dialogOptions);
                    dialog.cancel = $mdDialog.cancel;
                    dialog.hide = $mdDialog.hide;
                    dialog.notify = $mdDialog.notify;
                    dialog.then(defer.resolve, defer.reject);
                    return defer.promise;
                }
            ];
            return config;
        });
    }
])
    .directive("dialogTrigger", [
    '$crud',
    function ($crud) {
        return {
            restrict: "A",
            scope: {
                dialogResolve: '&?',
                dialogReject: '&?',
                dialogNotify: "&?",
                dialogOptions: "=?",
                dialogScopes: "=?",
                dialogPreset: "@",
            },
            link: function ($scope, element) {
                element.on("click", function (e) {
                    var _a = $scope.dialogOptions, dialogOptions = _a === void 0 ? {} : _a, dialogPreset = $scope.dialogPreset, _b = $scope.dialogScopes, dialogScopes = _b === void 0 ? {} : _b, _c = $scope.dialogResolve, dialogResolve = _c === void 0 ? function () { return null; } : _c, _d = $scope.dialogReject, dialogReject = _d === void 0 ? function () { return null; } : _d, _e = $scope.dialogNotify, dialogNotify = _e === void 0 ? function () { return null; } : _e;
                    dialogOptions.targetEvent = e;
                    dialogOptions.scopes = dialogScopes;
                    if (dialogPreset) {
                        $crud.dialog(dialogPreset, dialogOptions).then(function ($data) {
                            dialogResolve({ $data: $data });
                        }, function ($data) {
                            dialogReject({ $data: $data });
                        }, function ($data) {
                            dialogNotify({ $data: $data });
                        });
                    }
                });
            }
        };
    }
]);
//# sourceMappingURL=angular-material.js.map