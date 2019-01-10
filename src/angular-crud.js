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
var module_1 = require("./module");
var CrudService = /** @class */ (function () {
    function CrudService($injector) {
        this.$injector = $injector;
    }
    CrudService.prototype.send = function ($options) {
        return this.$injector.invoke(CrudService.$config.callbacks.sendRequest, this, {
            $options: $options
        });
    };
    CrudService.prototype.create = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "create/" }, options, { url: url, data: data }));
    };
    CrudService.prototype.update = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "update/" }, options, { url: url,
            data: data }));
    };
    CrudService.prototype.delete = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "delete/" }, options, { url: url,
            data: data }));
    };
    CrudService.prototype.retrieve = function (url, data, options) {
        return this.send(__assign({ method: "get", prefix: "retrieve/", checkDataType: false, notify: false }, options, { url: url,
            data: data }));
    };
    CrudService.prototype.alert = function ($options) {
        return this.$injector.invoke(CrudService.$config.callbacks.alert, this, {
            $options: $options
        });
    };
    CrudService.prototype.confirm = function ($options) {
        return this.$injector.invoke(CrudService.$config.callbacks.confirm, this, {
            $options: $options
        });
    };
    CrudService.prototype.prompt = function ($options) {
        return this.$injector.invoke(CrudService.$config.callbacks.prompt, this, {
            $options: $options
        });
    };
    CrudService.prototype.dialog = function ($dialogName, $options) {
        return this.$injector.invoke(CrudService.$config.callbacks.dialog, this, {
            $dialogName: $dialogName,
            $options: $options
        });
    };
    CrudService.prototype.notify = function ($options) {
        return this.$injector.invoke(CrudService.$config.callbacks.notify, this, {
            $options: $options
        });
    };
    CrudService.prototype.chooseFile = function ($options) {
        if ($options === void 0) { $options = {}; }
        return this.$injector.invoke(CrudService.$config.callbacks.prompt, this, {
            $options: $options
        });
    };
    CrudService.$dialogPresets = {};
    CrudService.$config = {
        baseUrl: "",
        callbacks: {
            notify: [
                '$options',
                '$q',
                function ($options, $q) {
                    if ($options === void 0) { $options = {}; }
                    return $q(function (resolve, reject) {
                        alert($options.message);
                        resolve();
                    });
                }
            ],
            alert: [
                '$options',
                '$q',
                function ($options, $q) {
                    if ($options === void 0) { $options = {}; }
                    return $q(function (resolve, reject) {
                        alert($options.title + " - " + $options.message);
                        resolve();
                    });
                }
            ],
            confirm: [
                '$options',
                '$q',
                function ($options, $q) {
                    if ($options === void 0) { $options = {}; }
                    return $q(function (resolve, reject) {
                        var _a = $options.title, title = _a === void 0 ? "Are you sure?" : _a;
                        if (confirm(title)) {
                            resolve();
                        }
                        else {
                            reject();
                        }
                    });
                }
            ],
            prompt: [
                '$options',
                '$q',
                function ($options, $q) {
                    if ($options === void 0) { $options = {}; }
                    return $q(function (resolve, reject) {
                        var _a = $options.title, title = _a === void 0 ? "Type here..." : _a;
                        var value = prompt(title);
                        if (value !== null) {
                            resolve(value);
                        }
                        else {
                            reject();
                        }
                    });
                }
            ],
            checkSuccess: [
                '$data',
                function ($data) {
                    if ($data.type === 'success') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            ]
        }
    };
    return CrudService;
}());
exports.CrudService = CrudService;
var CrudProvider = /** @class */ (function () {
    function CrudProvider() {
        this.$get = [
            '$injector',
            function ($injector) {
                return new CrudService($injector);
            }
        ];
    }
    CrudProvider.prototype.config = function (callback) {
        CrudService.$config = callback.apply(this, [__assign({}, CrudService.$config)]);
        return this;
    };
    CrudProvider.prototype.setDialogPreset = function (name, options) {
        CrudService.$dialogPresets[name] = options;
        return this;
    };
    return CrudProvider;
}());
exports.CrudProvider = CrudProvider;
module_1.module
    .provider("$crud", CrudProvider);
//# sourceMappingURL=angular-crud.js.map