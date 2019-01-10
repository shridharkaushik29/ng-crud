import {CrudProvider, CrudService} from "./angular-crud";
import IDialogService = angular.material.IDialogService
import * as angular from "angular";
import {IQService, IRootScopeService} from "angular";
import IInjectorService = angular.auto.IInjectorService;
import IDialogOptions = angular.material.IDialogOptions;
import * as _ from "lodash";

angular.module("ngMaterialCrud", [
    'ngMaterial',
    'ngCrud'
])
    .config([
        '$crudProvider',
        ($crudProvider: CrudProvider) => {
            $crudProvider.config(config => {

                const {callbacks} = config

                callbacks.prompt = [
                    '$mdDialog',
                    '$q',
                    '$options',
                    ($mdDialog: IDialogService, $q: IQService, $options: any) => {
                        const {title, textContent, placeholder = "Type here...", initialValue, ok = "Okay", cancel = "Cancel", targetEvent} = $options
                        const preset = $mdDialog.prompt()
                        preset.title(title)
                        preset.textContent(textContent)
                        preset.initialValue(initialValue)
                        preset.placeholder(placeholder)
                        preset.ok(ok)
                        preset.cancel(cancel)
                        preset.targetEvent(targetEvent)
                        return $mdDialog.show(preset)
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
                        let preset = CrudService.$dialogPresets[$dialogName];
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