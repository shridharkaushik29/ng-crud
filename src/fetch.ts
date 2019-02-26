import {CrudProvider, RequestOptions} from "./angular-crud";
import * as angular from "angular";
import {IQService} from "angular";
import * as _ from "lodash";
import IInjectorService = angular.auto.IInjectorService;

export default 'ngCrudFetch';

declare global {
    interface FormData {
        merge(data: any): this
    }

    interface URLSearchParams {
        merge(data: any): this
    }

    interface File {
        url: string
    }
}

const isFile = value => (value instanceof File || value instanceof Blob)

const mergeData = (formData: FormData | URLSearchParams, data: any, key?: string) => {
    if (_.isObject(data) && !isFile(data)) {
        _.each(data, (value, _key) => {
            const name = key ? `${key}[${_key}]` : _key;
            mergeData(formData, value, name);
        })
    } else if (key && data !== undefined) {
        // @ts-ignore
        formData.append(key, (data !== false && !data) ? "" : data);
    }
}

FormData.prototype.merge = function (data: Object) {
    mergeData(this, data);
    return this;
}

URLSearchParams.prototype.merge = function (data: Object) {
    mergeData(this, data);
    return this;
}

angular.module("ngCrudFetch", [
    'ngCrud'
])

    .config([
        '$crudProvider',
        ($crudProvider: CrudProvider) => {

            $crudProvider.config(config => {

                config.callbacks.sendRequest = [
                    '$q',
                    '$options',
                    '$injector',
                    function ($q: IQService, $options: RequestOptions, $injector: IInjectorService) {

                        return $q((resolve, reject) => {

                            const config = {
                                checkDataType: true,
                                notify: true,
                                ...this.$config,
                                ...$options,
                            }

                            const {data, callbacks = {}, method = "get", baseUrl = '', url, redirectTo, showProgress = true, prefix = "", suffix = "", extension = "", checkDataType} = config;
                            const reloadPage = config.reload;
                            const {loading, reload, redirect, checkSuccess, notify} = callbacks;

                            const successCallback = responseText => {
                                let response;
                                try {
                                    response = JSON.parse(responseText);
                                } catch (e) {
                                    response = responseText;
                                }
                                showProgress && loading && $injector.invoke(loading, this, {$value: false});

                                if (method.toLowerCase() === 'get' || !checkSuccess) {
                                    resolve(response);
                                } else if (checkSuccess) {
                                    if (checkDataType && $injector.invoke(checkSuccess, this, {$data: response})) {
                                        resolve(response);
                                        // @ts-ignore
                                        (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());
                                    } else if (!checkDataType) {
                                        resolve(response);
                                    } else {
                                        reject(response);
                                    }
                                    const notification: any = {
                                        type: response.type,
                                        message: response.message
                                    }
                                    config.notify && notify && $injector.invoke(notify, this, {$options: notification});
                                }
                            }

                            const errorCallback = (error) => {
                                showProgress && loading && $injector.invoke(notify, this, {$value: false});
                                const notification: any = {
                                    type: "error"
                                }
                                notification.message = error.statusText ? `${error.status}: ${error.statusText}` : error;
                                config.notify && notify && $injector.invoke(notify, this, {$options: notification});
                                reject(error)
                            }

                            const ajaxOptions: RequestInit = {
                                headers: {},
                                credentials: "include",
                                ...config.ajaxOptions,
                            }

                            ajaxOptions.method = method;
                            let fullUrl = baseUrl + prefix + url + suffix + extension;

                            if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
                                const formData = new FormData().merge(data);
                                ajaxOptions.body = formData;
                            }

                            if (ajaxOptions.body instanceof FormData) {
                                ajaxOptions.method = "post";
                            } else if (data) {
                                const params = new URLSearchParams().merge(data);
                                fullUrl += "?" + params;
                            }

                            showProgress && loading && $injector.invoke(notify, this, {$value: true});

                            fetch(fullUrl, ajaxOptions).then(response => {
                                return new Promise((resolve, reject) => {
                                    if (response.status === 200) {
                                        resolve(response.text())
                                    } else {
                                        reject(response);
                                    }
                                })
                            }).then(successCallback, errorCallback)
                        })
                    }
                ]

                return config
            })

        }
    ])
