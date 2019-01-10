import * as angular from "angular";
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

export interface ChooseFileOptions {
    accept?: string | string[],
    multiple?: boolean
}

export default 'ngCrud'

let dialogPresets = {}
let fileInput: HTMLInputElement;
let $config: RequestOptions = {
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
        ],
        chooseFile: [
            '$q',
            '$options',
            ($q: IQService, $options: ChooseFileOptions) => $q(resolve => {
                const {multiple, accept} = $options;

                const changeHandler = e => {
                    const files = e.currentTarget.files || [];
                    const filesArray = [];

                    for (let file of files) {
                        file.url = URL.createObjectURL(file);
                        filesArray.push(file)
                    }

                    if (multiple) {
                        resolve(filesArray);
                    } else {
                        resolve(files[0]);
                    }
                }

                if (!fileInput) {
                    fileInput = document.createElement('input');
                    fileInput.type = "file";
                    fileInput.style.display = "none";
                    document.querySelector("body").appendChild(fileInput);
                }

                fileInput.accept = angular.isArray(accept) ? accept.join(",") : accept;
                fileInput.multiple = multiple;
                fileInput.value = '';

                fileInput.click();

                fileInput.onchange = changeHandler

            })
        ]
    }
}

export class CrudService {

    $config: RequestOptions = $config

    constructor(private $injector: IInjectorService) {

    }

    send($options: RequestOptions): IPromise<any> {
        return this.$injector.invoke($config.callbacks.sendRequest, this, {
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

    remove = this.delete

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
        return this.$injector.invoke($config.callbacks.alert, this, {
            $options
        });
    }

    confirm($options?: any): IPromise<boolean> {
        return this.$injector.invoke($config.callbacks.confirm, this, {
            $options
        });
    }

    prompt($options?: any): IPromise<any> {
        return this.$injector.invoke($config.callbacks.prompt, this, {
            $options
        });
    }

    dialog($dialogName: string, $options?: any): IPromise<any> {
        return this.$injector.invoke($config.callbacks.dialog, this, {
            $dialogName,
            $options
        });
    }

    notify($options?: any): IPromise<any> {
        return this.$injector.invoke($config.callbacks.notify, this, {
            $options
        });
    }

    chooseFile($options: ChooseFileOptions = {}): IPromise<File | File[]> {
        return this.$injector.invoke($config.callbacks.chooseFile, this, {
            $options
        });
    }
}

export class CrudProvider {

    config(callback: (config: RequestOptions) => RequestOptions): this {
        $config = callback.apply(this, [{...$config}]);
        return this;
    }

    setDialogPreset(name: string, options: any): this {
        dialogPresets[name] = options
        return this;
    }

    setBaseUrl(url: string): this {
        $config.baseUrl = url;
        return this;
    }

    setProgressIndicator(model: string): this {
        $config.callbacks.loading = [
            '$rootScope',
            '$value',
            ($rootScope, $value) => {
                $rootScope[model] = $value
            }
        ]
        return this;
    }

    getDialogPreset(name: string): any {
        return dialogPresets[name];
    }

    $get = [
        '$injector',
        ($injector: IInjectorService) => {
            return new CrudService($injector)
        }
    ]

}

angular.module("ngCrud", [])

    .provider("$crud", CrudProvider)