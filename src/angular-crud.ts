import {module} from "./module";
import {ChooseFileOptions} from "@crud/core/src/index";
import IInjectorService = angular.auto.IInjectorService;
import {Injectable, IPromise, IQService} from "angular";

export interface RequestOptions {
    baseUrl?: string,
    callbacks?: {
        loading?: Injectable<(...args: any[]) => void>,
        redirect?: Injectable<(...args: any[]) => void>,
        reload?: Injectable<(...args: any[]) => void>,
        checkSuccess?: Injectable<(...args: any[]) => boolean>,
        notify?: Injectable<(...args: any[]) => IPromise<any>>,
        dialog?: Injectable<(...args: any[]) => IPromise<any>>,
        prompt?: Injectable<(...args: any[]) => IPromise<any>>,
        confirm?: Injectable<(...args: any[]) => IPromise<any>>,
        alert?: Injectable<(...args: any[]) => IPromise<any>>,
        sendRequest?: Injectable<(...args: any[]) => IPromise<any>>,
        chooseFile?: Injectable<(...args: any[]) => IPromise<File | File[]>>
    },
    prefix?: string,
    suffix?: string,
    extension?: string,
    url?: string,
    data?: any,
    redirectTo?: string,
    checkDataType?: boolean,
    showProgress?: boolean,
    notify?: boolean,
    goto?: string,
    reload?: boolean,
    method?: "post" | "get" | "put" | "delete" | string
    ajaxOptions?: any
}

export class CrudService {

    static $dialogPresets: any = {}

    static $config: RequestOptions = {
        baseUrl: "",
        callbacks: {
            notify: [
                '$options',
                '$q',
                ($options: any = {}, $q: IQService) => $q((resolve, reject) => {
                    alert($options.message)
                    resolve()
                })
            ],
            alert: [
                '$options',
                '$q',
                ($options: any = {}, $q: IQService) => $q((resolve, reject) => {
                    alert(`${$options.title} - ${$options.message}`)
                    resolve()
                })
            ],
            confirm: [
                '$options',
                '$q',
                ($options: any = {}, $q: IQService) => $q((resolve, reject) => {
                    const {title = "Are you sure?"} = $options
                    if (confirm(title)) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            ],
            prompt: [
                '$options',
                '$q',
                ($options: any = {}, $q: IQService) => $q((resolve, reject) => {
                    const {title = "Type here..."} = $options
                    const value = prompt(title)
                    if (value !== null) {
                        resolve(value)
                    } else {
                        reject()
                    }
                })
            ],
            checkSuccess: [
                '$data',
                ($data: any) => {
                    if ($data.type === 'success') {
                        return true;
                    } else {
                        return false;
                    }
                }
            ]
        }
    }

    constructor(private $injector: IInjectorService) {
    }

    send($options: RequestOptions): IPromise<any> {
        return this.$injector.invoke(CrudService.$config.callbacks.sendRequest, this, {
            $options
        });
    }

    create(url: string, data?: any, options?: RequestOptions): IPromise<any> {
        return this.send({
            method: "post",
            prefix: "create/",
            ...options,
            url: url,
            data: data,
        })
    }

    update(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "post",
            prefix: "update/",
            ...options,
            url,
            data,
        })
    }

    delete(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "post",
            prefix: "delete/",
            ...options,
            url,
            data,
        })
    }

    retrieve(url: string, data?: any, options?: RequestOptions) {
        return this.send({
            method: "get",
            prefix: "retrieve/",
            checkDataType: false,
            notify: false,
            ...options,
            url,
            data,
        })
    }

    alert($options?: any): IPromise<any> {
        return this.$injector.invoke(CrudService.$config.callbacks.alert, this, {
            $options
        });
    }

    confirm($options?: any): IPromise<boolean> {
        return this.$injector.invoke(CrudService.$config.callbacks.confirm, this, {
            $options
        });
    }

    prompt($options?: any): IPromise<any> {
        return this.$injector.invoke(CrudService.$config.callbacks.prompt, this, {
            $options
        });
    }

    dialog($dialogName: string, $options?: any): IPromise<any> {
        return this.$injector.invoke(CrudService.$config.callbacks.dialog, this, {
            $dialogName,
            $options
        });
    }

    notify($options?: any): IPromise<any> {
        return this.$injector.invoke(CrudService.$config.callbacks.notify, this, {
            $options
        });
    }

    chooseFile($options: ChooseFileOptions = {}): IPromise<File | File[]> {
        return this.$injector.invoke(CrudService.$config.callbacks.prompt, this, {
            $options
        });
    }
}

export class CrudProvider {

    config(callback: (config: RequestOptions) => RequestOptions): this {
        CrudService.$config = callback.apply(this, [{...CrudService.$config}]);
        return this;
    }

    setDialogPreset(name: string, options: any): this {
        CrudService.$dialogPresets[name] = options
        return this;
    }

    $get = [
        '$injector',
        ($injector: IInjectorService) => {
            return new CrudService($injector)
        }
    ]

}

module
    .provider("$crud", CrudProvider)