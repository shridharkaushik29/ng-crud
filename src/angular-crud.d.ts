import * as angular from "angular";
import IInjectorService = angular.auto.IInjectorService;
import { Injectable, IPromise } from "angular";
export interface RequestOptions {
    baseUrl?: string;
    callbacks?: {
        loading?: Injectable<(...args: any[]) => void>;
        redirect?: Injectable<(...args: any[]) => void>;
        reload?: Injectable<(...args: any[]) => void>;
        checkSuccess?: Injectable<(...args: any[]) => boolean>;
        notify?: Injectable<(...args: any[]) => IPromise<any>>;
        dialog?: Injectable<(...args: any[]) => IPromise<any>>;
        prompt?: Injectable<(...args: any[]) => IPromise<any>>;
        confirm?: Injectable<(...args: any[]) => IPromise<any>>;
        alert?: Injectable<(...args: any[]) => IPromise<any>>;
        sendRequest?: Injectable<(...args: any[]) => IPromise<any>>;
        chooseFile?: Injectable<(...args: any[]) => IPromise<File | File[]>>;
    };
    prefix?: string;
    suffix?: string;
    extension?: string;
    url?: string;
    data?: any;
    redirectTo?: string;
    checkDataType?: boolean;
    showProgress?: boolean;
    notify?: boolean;
    goto?: string;
    reload?: boolean;
    method?: "post" | "get" | "put" | "delete" | string;
    ajaxOptions?: any;
}
export interface ChooseFileOptions {
    accept?: string | string[];
    multiple?: boolean;
}
declare const _default: "ngCrud";
export default _default;
export declare class CrudService {
    private $injector;
    $config: RequestOptions;
    constructor($injector: IInjectorService);
    send($options: RequestOptions): IPromise<any>;
    create(url: string, data?: any, options?: RequestOptions): IPromise<any>;
    update(url: string, data?: any, options?: RequestOptions): angular.IPromise<any>;
    delete(url: string, data?: any, options?: RequestOptions): angular.IPromise<any>;
    remove: (url: string, data?: any, options?: RequestOptions) => angular.IPromise<any>;
    retrieve(url: string, data?: any, options?: RequestOptions): angular.IPromise<any>;
    alert($options?: any): IPromise<any>;
    confirm($options?: any): IPromise<boolean>;
    prompt($options?: any): IPromise<any>;
    dialog($dialogName: string, $options?: any): IPromise<any>;
    notify($options?: any): IPromise<any>;
    chooseFile($options?: ChooseFileOptions): IPromise<File | File[]>;
}
export declare class CrudProvider {
    config(callback: (config: RequestOptions) => RequestOptions): this;
    setDialogPreset(name: string, options: any): this;
    setBaseUrl(url: string): this;
    setProgressIndicator(model: string): this;
    getDialogPreset(name: string): any;
    $get: (string | (($injector: IInjectorService) => CrudService))[];
}
