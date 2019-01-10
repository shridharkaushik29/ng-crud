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
var angular_crud_1 = require("./angular-crud");
var angular = require("angular");
var _ = require("lodash");
angular.module("ngMaterialCrud", [
    'ngMaterial',
    'ngCrud'
])
    .config([
    '$crudProvider',
    function ($crudProvider) {
        $crudProvider.config(function (config) {
            var callbacks = config.callbacks;
            callbacks.prompt = [
                '$mdDialog',
                '$q',
                '$options',
                function ($mdDialog, $q, $options) {
                    var title = $options.title, textContent = $options.textContent, _a = $options.placeholder, placeholder = _a === void 0 ? "Type here..." : _a, initialValue = $options.initialValue, _b = $options.ok, ok = _b === void 0 ? "Okay" : _b, _c = $options.cancel, cancel = _c === void 0 ? "Cancel" : _c, targetEvent = $options.targetEvent;
                    var preset = $mdDialog.prompt();
                    preset.title(title);
                    preset.textContent(textContent);
                    preset.initialValue(initialValue);
                    preset.placeholder(placeholder);
                    preset.ok(ok);
                    preset.cancel(cancel);
                    preset.targetEvent(targetEvent);
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
                    var preset = angular_crud_1.CrudService.$dialogPresets[$dialogName];
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
]);
//# sourceMappingURL=angular-material.js.map