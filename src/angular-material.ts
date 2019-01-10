import * as angular from "angular";
import * as _ from "lodash";
import {CrudProvider} from "./angular-crud";
import IDialogService = angular.material.IDialogService
import IToastService = angular.material.IToastService
import {IQService, IRootScopeService} from "angular";
import IInjectorService = angular.auto.IInjectorService;

export default 'ngCrudMaterial'

angular.module("ngCrudMaterial", [
    'ngMaterial',
    'ngCrud'
])
    .config([
        '$crudProvider',
        ($crudProvider: CrudProvider) => {
            $crudProvider

                .config(config => {

                    const {callbacks} = config

                    callbacks.notify = [
                        '$mdToast',
                        '$options',
                        ($mdToast: IToastService, $options: any) => {

                            let {type, message} = $options;

                            if (type) {
                                message = `${type === 'success' ? 'Success' : 'Error'} : ${message}`;
                            }

                            var dialogOptions = {
                                textContent: message,
                                position: "bottom right",
                                action: "Hide",
                                ...$options
                            };

                            // @ts-ignore
                            var preset = $mdToast.simple(dialogOptions).textContent($options.textContent || message);

                            return $mdToast.show(preset);
                        }
                    ]

                    callbacks.alert = [
                        '$mdDialog',
                        '$options',
                        ($mdDialog: IDialogService, $options: any) => {

                            const config = {
                                ok: "Okay!",
                                multiple: true,
                                ...$options
                            }
                            const {textContent, message} = config
                            // @ts-ignore
                            const preset = $mdDialog.alert(config).textContent(textContent || message)
                            return $mdDialog.show(preset);
                        }
                    ]

                    callbacks.confirm = [
                        '$mdDialog',
                        '$options',
                        ($mdDialog: IDialogService, $options: any) => {

                            const config = {
                                title: "Are you sure?",
                                textContent: "This action won't be revered",
                                ok: "Yes! Sure",
                                cancel: "No I'm Not",
                                multiple: true,
                                ...$options
                            }
                            // @ts-ignore
                            const preset = $mdDialog.confirm(config);
                            return $mdDialog.show(preset);
                        }
                    ]

                    callbacks.prompt = [
                        '$mdDialog',
                        '$options',
                        ($mdDialog, $options) => {

                            const config = {
                                ok: "Submit",
                                cancel: "Cancel",
                                multiple: true,
                                placeholder: "Type here...",
                                ...$options
                            }

                            const preset = $mdDialog.prompt(config)
                            return $mdDialog.show(preset);
                        }

                    ]

                    callbacks.dialog = [
                        '$mdDialog',
                        '$q',
                        '$options',
                        '$dialogName',
                        '$injector',
                        '$rootScope',
                        ($mdDialog: IDialogService, $q: IQService, $options, $dialogName: string, $injector: IInjectorService, $rootScope: IRootScopeService) => {
                            let preset = $crudProvider.getDialogPreset($dialogName);
                            if (angular.isArray(preset) || angular.isFunction(preset)) {
                                preset = $injector.invoke(preset)
                            }
                            let dialogOptions: any = {
                                clickOutsideToClose: true,
                                ...preset,
                                ...$options,
                            }

                            if (!dialogOptions.scope) {
                                dialogOptions.scope = $rootScope.$new();
                            }

                            const {scope} = dialogOptions

                            const defer = $q.defer();

                            _.merge(scope, dialogOptions.scopes);

                            scope.hide = $mdDialog.hide;
                            scope.cancel = $mdDialog.cancel;
                            scope.notify = defer.notify;

                            let dialog: any = $mdDialog.show(dialogOptions);

                            dialog.cancel = $mdDialog.cancel;
                            dialog.hide = $mdDialog.hide;
                            dialog.notify = $mdDialog.notify;

                            dialog.then(defer.resolve, defer.reject);

                            return defer.promise;
                        }
                    ]

                    return config
                })
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
                link: function ($scope: any, element) {

                    element.on("click", function (e) {
                        const {dialogOptions = {}, dialogPreset, dialogScopes = {}, dialogResolve = () => null, dialogReject = () => null, dialogNotify = () => null} = $scope;
                        dialogOptions.targetEvent = e;
                        dialogOptions.scopes = dialogScopes;
                        if (dialogPreset) {
                            $crud.dialog(dialogPreset, dialogOptions).then(($data) => {
                                dialogResolve({$data});
                            }, ($data) => {
                                dialogReject({$data});
                            }, $data => {
                                dialogNotify({$data})
                            })
                        }
                    })
                }
            }
        }
    ])