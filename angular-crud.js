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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/angular-crud.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/angular-crud.ts":
/*!*****************************!*\
  !*** ./src/angular-crud.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar module_1 = __webpack_require__(/*! ./module */ \"./src/module.js\");\r\nvar CrudService = /** @class */ (function () {\r\n    function CrudService($injector) {\r\n        this.$injector = $injector;\r\n    }\r\n    CrudService.prototype.send = function ($options) {\r\n        return this.$injector.invoke(CrudService.$config.callbacks.sendRequest, this, {\r\n            $options: $options\r\n        });\r\n    };\r\n    CrudService.prototype.create = function (url, data, options) {\r\n        return this.send(__assign({ method: \"post\", prefix: \"create/\" }, options, { url: url, data: data }));\r\n    };\r\n    CrudService.prototype.update = function (url, data, options) {\r\n        return this.send(__assign({ method: \"post\", prefix: \"update/\" }, options, { url: url,\r\n            data: data }));\r\n    };\r\n    CrudService.prototype.delete = function (url, data, options) {\r\n        return this.send(__assign({ method: \"post\", prefix: \"delete/\" }, options, { url: url,\r\n            data: data }));\r\n    };\r\n    CrudService.prototype.retrieve = function (url, data, options) {\r\n        return this.send(__assign({ method: \"get\", prefix: \"retrieve/\", checkDataType: false, notify: false }, options, { url: url,\r\n            data: data }));\r\n    };\r\n    CrudService.prototype.alert = function ($options) {\r\n        return this.$injector.invoke(CrudService.$config.callbacks.alert, this, {\r\n            $options: $options\r\n        });\r\n    };\r\n    CrudService.prototype.confirm = function ($options) {\r\n        return this.$injector.invoke(CrudService.$config.callbacks.confirm, this, {\r\n            $options: $options\r\n        });\r\n    };\r\n    CrudService.prototype.prompt = function ($options) {\r\n        return this.$injector.invoke(CrudService.$config.callbacks.prompt, this, {\r\n            $options: $options\r\n        });\r\n    };\r\n    CrudService.prototype.dialog = function ($dialogName, $options) {\r\n        return this.$injector.invoke(CrudService.$config.callbacks.dialog, this, {\r\n            $dialogName: $dialogName,\r\n            $options: $options\r\n        });\r\n    };\r\n    CrudService.prototype.notify = function ($options) {\r\n        return this.$injector.invoke(CrudService.$config.callbacks.notify, this, {\r\n            $options: $options\r\n        });\r\n    };\r\n    CrudService.prototype.chooseFile = function ($options) {\r\n        if ($options === void 0) { $options = {}; }\r\n        return this.$injector.invoke(CrudService.$config.callbacks.prompt, this, {\r\n            $options: $options\r\n        });\r\n    };\r\n    CrudService.$dialogPresets = {};\r\n    CrudService.$config = {\r\n        baseUrl: \"\",\r\n        callbacks: {\r\n            notify: [\r\n                '$options',\r\n                '$q',\r\n                function ($options, $q) {\r\n                    if ($options === void 0) { $options = {}; }\r\n                    return $q(function (resolve, reject) {\r\n                        alert($options.message);\r\n                        resolve();\r\n                    });\r\n                }\r\n            ],\r\n            alert: [\r\n                '$options',\r\n                '$q',\r\n                function ($options, $q) {\r\n                    if ($options === void 0) { $options = {}; }\r\n                    return $q(function (resolve, reject) {\r\n                        alert($options.title + \" - \" + $options.message);\r\n                        resolve();\r\n                    });\r\n                }\r\n            ],\r\n            confirm: [\r\n                '$options',\r\n                '$q',\r\n                function ($options, $q) {\r\n                    if ($options === void 0) { $options = {}; }\r\n                    return $q(function (resolve, reject) {\r\n                        var _a = $options.title, title = _a === void 0 ? \"Are you sure?\" : _a;\r\n                        if (confirm(title)) {\r\n                            resolve();\r\n                        }\r\n                        else {\r\n                            reject();\r\n                        }\r\n                    });\r\n                }\r\n            ],\r\n            prompt: [\r\n                '$options',\r\n                '$q',\r\n                function ($options, $q) {\r\n                    if ($options === void 0) { $options = {}; }\r\n                    return $q(function (resolve, reject) {\r\n                        var _a = $options.title, title = _a === void 0 ? \"Type here...\" : _a;\r\n                        var value = prompt(title);\r\n                        if (value !== null) {\r\n                            resolve(value);\r\n                        }\r\n                        else {\r\n                            reject();\r\n                        }\r\n                    });\r\n                }\r\n            ],\r\n            checkSuccess: [\r\n                '$data',\r\n                function ($data) {\r\n                    if ($data.type === 'success') {\r\n                        return true;\r\n                    }\r\n                    else {\r\n                        return false;\r\n                    }\r\n                }\r\n            ]\r\n        }\r\n    };\r\n    return CrudService;\r\n}());\r\nexports.CrudService = CrudService;\r\nvar CrudProvider = /** @class */ (function () {\r\n    function CrudProvider() {\r\n        this.$get = [\r\n            '$injector',\r\n            function ($injector) {\r\n                return new CrudService($injector);\r\n            }\r\n        ];\r\n    }\r\n    CrudProvider.prototype.config = function (callback) {\r\n        CrudService.$config = callback.apply(this, [__assign({}, CrudService.$config)]);\r\n        return this;\r\n    };\r\n    CrudProvider.prototype.setDialogPreset = function (name, options) {\r\n        CrudService.$dialogPresets[name] = options;\r\n        return this;\r\n    };\r\n    return CrudProvider;\r\n}());\r\nexports.CrudProvider = CrudProvider;\r\nmodule_1.module\r\n    .provider(\"$crud\", CrudProvider);\r\n\n\n//# sourceURL=webpack:///./src/angular-crud.ts?");

/***/ }),

/***/ "./src/module.js":
/*!***********************!*\
  !*** ./src/module.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar angular = __webpack_require__(/*! angular */ \"angular\");\r\nexports.module = angular.module(\"ngCrud\", []);\r\n//# sourceMappingURL=module.js.map\n\n//# sourceURL=webpack:///./src/module.js?");

/***/ }),

/***/ "angular":
/*!**************************!*\
  !*** external "angular" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = angular;\n\n//# sourceURL=webpack:///external_%22angular%22?");

/***/ })

/******/ });