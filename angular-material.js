/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/angular-material.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/angular-material.ts":
/*!*********************************!*\
  !*** ./src/angular-material.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar angular = __webpack_require__(/*! angular */ \"angular\");\r\nvar _ = __webpack_require__(/*! lodash */ \"lodash\");\r\nexports.default = 'ngCrudMaterial';\r\nangular.module(\"ngCrudMaterial\", [\r\n    'ngMaterial',\r\n    'ngCrud'\r\n])\r\n    .config([\r\n    '$crudProvider',\r\n    function ($crudProvider) {\r\n        $crudProvider\r\n            .config(function (config) {\r\n            var callbacks = config.callbacks;\r\n            callbacks.notify = [\r\n                '$mdToast',\r\n                '$options',\r\n                function ($mdToast, $options) {\r\n                    var type = $options.type, message = $options.message;\r\n                    if (type) {\r\n                        message = (type === 'success' ? 'Success' : 'Error') + \" : \" + message;\r\n                    }\r\n                    var dialogOptions = __assign({ textContent: message, position: \"bottom right\", action: \"Hide\" }, $options);\r\n                    // @ts-ignore\r\n                    var preset = $mdToast.simple(dialogOptions).textContent($options.textContent || message);\r\n                    return $mdToast.show(preset);\r\n                }\r\n            ];\r\n            callbacks.alert = [\r\n                '$mdDialog',\r\n                '$options',\r\n                function ($mdDialog, $options) {\r\n                    var config = __assign({ ok: \"Okay!\", multiple: true }, $options);\r\n                    var textContent = config.textContent, message = config.message;\r\n                    // @ts-ignore\r\n                    var preset = $mdDialog.alert(config).textContent(textContent || message);\r\n                    return $mdDialog.show(preset);\r\n                }\r\n            ];\r\n            callbacks.confirm = [\r\n                '$mdDialog',\r\n                '$options',\r\n                function ($mdDialog, $options) {\r\n                    var config = __assign({ title: \"Are you sure?\", textContent: \"This action won't be revered\", ok: \"Yes! Sure\", cancel: \"No I'm Not\", multiple: true }, $options);\r\n                    // @ts-ignore\r\n                    var preset = $mdDialog.confirm(config);\r\n                    return $mdDialog.show(preset);\r\n                }\r\n            ];\r\n            callbacks.prompt = [\r\n                '$mdDialog',\r\n                '$options',\r\n                function ($mdDialog, $options) {\r\n                    var config = __assign({ ok: \"Submit\", cancel: \"Cancel\", multiple: true, placeholder: \"Type here...\" }, $options);\r\n                    var preset = $mdDialog.prompt(config);\r\n                    return $mdDialog.show(preset);\r\n                }\r\n            ];\r\n            callbacks.dialog = [\r\n                '$mdDialog',\r\n                '$q',\r\n                '$options',\r\n                '$dialogName',\r\n                '$injector',\r\n                '$rootScope',\r\n                function ($mdDialog, $q, $options, $dialogName, $injector, $rootScope) {\r\n                    var preset = $crudProvider.getDialogPreset($dialogName);\r\n                    if (angular.isArray(preset) || angular.isFunction(preset)) {\r\n                        preset = $injector.invoke(preset);\r\n                    }\r\n                    var dialogOptions = __assign({ clickOutsideToClose: true }, preset, $options);\r\n                    if (!dialogOptions.scope) {\r\n                        dialogOptions.scope = $rootScope.$new();\r\n                    }\r\n                    var scope = dialogOptions.scope;\r\n                    var defer = $q.defer();\r\n                    _.merge(scope, dialogOptions.scopes);\r\n                    scope.hide = $mdDialog.hide;\r\n                    scope.cancel = $mdDialog.cancel;\r\n                    scope.notify = defer.notify;\r\n                    var dialog = $mdDialog.show(dialogOptions);\r\n                    dialog.cancel = $mdDialog.cancel;\r\n                    dialog.hide = $mdDialog.hide;\r\n                    dialog.notify = $mdDialog.notify;\r\n                    dialog.then(defer.resolve, defer.reject);\r\n                    return defer.promise;\r\n                }\r\n            ];\r\n            return config;\r\n        });\r\n    }\r\n])\r\n    .directive(\"dialogTrigger\", [\r\n    '$crud',\r\n    function ($crud) {\r\n        return {\r\n            restrict: \"A\",\r\n            scope: {\r\n                dialogResolve: '&?',\r\n                dialogReject: '&?',\r\n                dialogNotify: \"&?\",\r\n                dialogOptions: \"=?\",\r\n                dialogScopes: \"=?\",\r\n                dialogPreset: \"@\",\r\n            },\r\n            link: function ($scope, element) {\r\n                element.on(\"click\", function (e) {\r\n                    var _a = $scope.dialogOptions, dialogOptions = _a === void 0 ? {} : _a, dialogPreset = $scope.dialogPreset, _b = $scope.dialogScopes, dialogScopes = _b === void 0 ? {} : _b, _c = $scope.dialogResolve, dialogResolve = _c === void 0 ? function () { return null; } : _c, _d = $scope.dialogReject, dialogReject = _d === void 0 ? function () { return null; } : _d, _e = $scope.dialogNotify, dialogNotify = _e === void 0 ? function () { return null; } : _e;\r\n                    dialogOptions.targetEvent = e;\r\n                    dialogOptions.scopes = dialogScopes;\r\n                    if (dialogPreset) {\r\n                        $crud.dialog(dialogPreset, dialogOptions).then(function ($data) {\r\n                            dialogResolve({ $data: $data });\r\n                        }, function ($data) {\r\n                            dialogReject({ $data: $data });\r\n                        }, function ($data) {\r\n                            dialogNotify({ $data: $data });\r\n                        });\r\n                    }\r\n                });\r\n            }\r\n        };\r\n    }\r\n]);\r\n\n\n//# sourceURL=webpack:///./src/angular-material.ts?");

/***/ }),

/***/ "angular":
/*!**************************!*\
  !*** external "angular" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = angular;\n\n//# sourceURL=webpack:///external_%22angular%22?");

/***/ }),

/***/ "lodash":
/*!********************!*\
  !*** external "_" ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = _;\n\n//# sourceURL=webpack:///external_%22_%22?");

/***/ })

/******/ });