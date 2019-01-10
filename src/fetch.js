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
exports.default = 'ngCrudFetch';
var isFile = function (value) { return (value instanceof File || value instanceof Blob); };
var mergeData = function (formData, data, key) {
    if (_.isObject(data) && !isFile(data)) {
        _.each(data, function (value, _key) {
            var name = key ? key + "[" + _key + "]" : _key;
            mergeData(formData, value, name);
        });
    }
    else if (key && data !== undefined) {
        // @ts-ignore
        formData.append(key, (data !== false && !data) ? "" : data);
    }
};
FormData.prototype.merge = function (data) {
    mergeData(this, data);
    return this;
};
URLSearchParams.prototype.merge = function (data) {
    mergeData(this, data);
    return this;
};
angular.module("ngCrudFetch", [
    'ngCrud'
])
    .config([
    '$crudProvider',
    function ($crudProvider) {
        $crudProvider.config(function (config) {
            config.callbacks.sendRequest = [
                '$q',
                '$options',
                '$injector',
                function ($q, $options, $injector) {
                    var _this = this;
                    return $q(function (resolve, reject) {
                        var config = __assign({ checkDataType: true, notify: true }, _this.$config, $options);
                        var data = config.data, _a = config.callbacks, callbacks = _a === void 0 ? {} : _a, _b = config.method, method = _b === void 0 ? "get" : _b, _c = config.baseUrl, baseUrl = _c === void 0 ? '' : _c, url = config.url, redirectTo = config.redirectTo, _d = config.showProgress, showProgress = _d === void 0 ? true : _d, _e = config.prefix, prefix = _e === void 0 ? "" : _e, _f = config.suffix, suffix = _f === void 0 ? "" : _f, _g = config.extension, extension = _g === void 0 ? "" : _g, checkDataType = config.checkDataType;
                        var reloadPage = config.reload;
                        var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notify = callbacks.notify;
                        var successCallback = function (responseText) {
                            var response;
                            try {
                                response = JSON.parse(responseText);
                            }
                            catch (e) {
                                response = responseText;
                            }
                            showProgress && loading && $injector.invoke(loading, _this, { $value: false });
                            if (method.toLowerCase() === 'get' || !checkSuccess) {
                                resolve(response);
                            }
                            else if (checkSuccess) {
                                if (checkDataType && $injector.invoke(checkSuccess, _this, { $data: false })) {
                                    resolve(response);
                                    // @ts-ignore
                                    (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());
                                }
                                else if (!checkDataType) {
                                    resolve(response);
                                }
                                else {
                                    reject(response);
                                }
                                var notification = {
                                    type: response.type,
                                    message: response.message
                                };
                                config.notify && notify && $injector.invoke(notify, _this, { $options: notification });
                            }
                        };
                        var errorCallback = function (error) {
                            showProgress && loading && $injector.invoke(notify, _this, { $value: false });
                            var notification = {
                                type: "error"
                            };
                            notification.message = error.statusText ? error.status + ": " + error.statusText : error;
                            config.notify && notify && $injector.invoke(notify, _this, { $options: notification });
                            reject(error);
                        };
                        var ajaxOptions = __assign({ headers: {}, credentials: "include" }, config.ajaxOptions);
                        ajaxOptions.method = method;
                        var fullUrl = baseUrl + prefix + url + suffix + extension;
                        if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
                            var formData = new FormData().merge(data);
                            ajaxOptions.body = formData;
                        }
                        if (ajaxOptions.body instanceof FormData) {
                            ajaxOptions.method = "post";
                        }
                        else if (data) {
                            var params = new URLSearchParams().merge(data);
                            fullUrl += "?" + params;
                        }
                        showProgress && loading && $injector.invoke(notify, _this, { $value: true });
                        fetch(fullUrl, ajaxOptions).then(function (response) {
                            return new Promise(function (resolve, reject) {
                                if (response.status === 200) {
                                    resolve(response.text());
                                }
                                else {
                                    reject(response);
                                }
                            });
                        }).then(successCallback, errorCallback);
                    });
                }
            ];
            return config;
        });
    }
]);
//# sourceMappingURL=fetch.js.map