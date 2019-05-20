(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["consat"] = factory();
	else
		root["consat"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _extendableBuiltin9(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function _extendableBuiltin7(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function _extendableBuiltin5(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function _extendableBuiltin3(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

/**
 * Custom exceptions for use in the CSPSolver.
 */

var CSPSolverValueError = function (_extendableBuiltin2) {
  _inherits(CSPSolverValueError, _extendableBuiltin2);

  function CSPSolverValueError() {
    _classCallCheck(this, CSPSolverValueError);

    return _possibleConstructorReturn(this, (CSPSolverValueError.__proto__ || Object.getPrototypeOf(CSPSolverValueError)).apply(this, arguments));
  }

  return CSPSolverValueError;
}(_extendableBuiltin(Error));

;

var VariableValueError = function (_extendableBuiltin4) {
  _inherits(VariableValueError, _extendableBuiltin4);

  function VariableValueError() {
    _classCallCheck(this, VariableValueError);

    return _possibleConstructorReturn(this, (VariableValueError.__proto__ || Object.getPrototypeOf(VariableValueError)).apply(this, arguments));
  }

  return VariableValueError;
}(_extendableBuiltin3(Error));

;

var InvalidVariableError = function (_extendableBuiltin6) {
  _inherits(InvalidVariableError, _extendableBuiltin6);

  function InvalidVariableError() {
    _classCallCheck(this, InvalidVariableError);

    return _possibleConstructorReturn(this, (InvalidVariableError.__proto__ || Object.getPrototypeOf(InvalidVariableError)).apply(this, arguments));
  }

  return InvalidVariableError;
}(_extendableBuiltin5(Error));

;

var InvalidSolutionError = function (_extendableBuiltin8) {
  _inherits(InvalidSolutionError, _extendableBuiltin8);

  function InvalidSolutionError() {
    _classCallCheck(this, InvalidSolutionError);

    return _possibleConstructorReturn(this, (InvalidSolutionError.__proto__ || Object.getPrototypeOf(InvalidSolutionError)).apply(this, arguments));
  }

  return InvalidSolutionError;
}(_extendableBuiltin7(Error));

;

var NotImplementedError = function (_extendableBuiltin10) {
  _inherits(NotImplementedError, _extendableBuiltin10);

  function NotImplementedError() {
    _classCallCheck(this, NotImplementedError);

    return _possibleConstructorReturn(this, (NotImplementedError.__proto__ || Object.getPrototypeOf(NotImplementedError)).apply(this, arguments));
  }

  return NotImplementedError;
}(_extendableBuiltin9(Error));

;

exports.CSPSolverValueError = CSPSolverValueError;
exports.VariableValueError = VariableValueError;
exports.InvalidVariableError = InvalidVariableError;
exports.InvalidSolutionError = InvalidSolutionError;
exports.NotImplementedError = NotImplementedError;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * The assignment class provides one instance of an "assignment" - a list of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * all the variables in a CSP with some or all of them assigned a value.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _exceptions = __webpack_require__(1);

var _variable = __webpack_require__(4);

var _variable2 = _interopRequireDefault(_variable);

var _loglevel = __webpack_require__(0);

var log = _interopRequireWildcard(_loglevel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

var Assignment = function () {
    function Assignment(assignedVariableList) {
        _classCallCheck(this, Assignment);

        var varMap = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = assignedVariableList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var v = _step.value;

                logger.debug('Creating variable...');
                logger.debug('Var name: ' + v.getName());
                logger.debug('Var ID: ' + v.getId());
                logger.debug('Var value: ' + v.getValue());
                logger.debug('Var domain: ' + JSON.stringify(v.getDomain()));
                var newVar = _variable2.default.fromVariable(v);
                varMap[newVar.getId()] = newVar;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        this.varMap = varMap;
    }

    _createClass(Assignment, [{
        key: 'getVarList',
        value: function getVarList() {
            var varList = [];
            for (var key in this.varMap) {
                varList.push(this.varMap[key]);
            }
            return varList;
        }
    }, {
        key: 'getValueForVarByName',
        value: function getValueForVarByName(varName) {
            for (var vId in this.varMap) {
                if (this.varMap[vId].getName() === varName) {
                    return this.varMap[vId].getValue();
                }
            }
            throw new _exceptions.VariableValueError('A variable with the specified ' + 'name does not exist.');
        }
    }, {
        key: 'getValueForVarById',
        value: function getValueForVarById(varId) {
            if (varId in this.varMap) {
                return this.varMap[varId].getValue();
            }
            // If the variable ID isn't in the map, throw an error.
            throw new _exceptions.VariableValueError('A variable with the specified ' + 'ID does not exist.');
        }

        // Get the list of unassigned variables for this assignment

    }, {
        key: 'getUnassignedVariables',
        value: function getUnassignedVariables() {
            var unassignedVars = [];
            for (var key in this.varMap) {
                var v = this.varMap[key];
                if (!v.hasValue()) unassignedVars.push(v);
            }
            return unassignedVars;
        }

        /**
         * Check if this assignment is complete. An assignment that is
         * complete is one where all the variables in the assignment have values.
         */

    }, {
        key: 'isComplete',
        value: function isComplete() {
            for (var vId in this.varMap) {
                if (this.varMap[vId].getValue() === null) return false;
            }
            return true;
        }
    }, {
        key: 'printAssignment',
        value: function printAssignment() {
            var printStr = '';
            for (var vId in this.varMap) {
                printStr += this.varMap[vId].name + ' = ' + this.varMap[vId].value + '\t';
            }
            printStr += '\n';
            return printStr;
        }
    }], [{
        key: 'emptyAssignment',
        value: function emptyAssignment(variableMap) {
            var assignmentList = [];
            for (var varId in variableMap) {
                var newVar = _variable2.default.fromVariable(variableMap[varId]);
                newVar.setValue(null);
                assignmentList.push(newVar);
            }
            return new Assignment(assignmentList);
        }
    }]);

    return Assignment;
}();

exports.default = Assignment;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This is the base (abstract) CSPSolver class for the consat.js constraint
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * satisfaction solver library.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This library provides support for solving constraint satisfaction problems
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * either by formulating the problem programmatically or by loading in a
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * problem description in XML format that can be used to define the problem.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * At present, this module provides a basic backtracking solver for discrete
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * variables with finite domains.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _exceptions = __webpack_require__(1);

var _loglevel = __webpack_require__(0);

var log = _interopRequireWildcard(_loglevel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

var CSPSolver = function () {

    /**
     * This is an "abstract" class in that clients should instantiate a
     * specific solver implementation and this class contains only common
     * top-level implementation for CSP solvers. new.target is therefore used
     * to check if an attempt is made to instantiate this class directly.
     */
    function CSPSolver() {
        _classCallCheck(this, CSPSolver);

        logger.debug('Constructor name: ' + this.constructor);
        if (this.constructor === CSPSolver) {
            throw TypeError('CSPSolver is an abstract class and can\'t be ' + 'instantiated directly.');
        }

        logger.debug('Initialising CSPSolver object...');
        this._constraints = [];
        this._variables = {};
        this.varConstraintMap = {};
        this._solutions = [];
    }

    _createClass(CSPSolver, [{
        key: 'addVariable',
        value: function addVariable(v) {
            logger.debug('Adding variable named [' + v.getName() + '] with ID [' + v.getId() + '] to var list');
            logger.debug('Variables list: ' + JSON.stringify(this._variables));
            // Check of this variable has already been added
            if (v.getId() in this._variables) return false;
            this._variables[v.getId()] = v;
            return true;
        }
    }, {
        key: 'addConstraint',
        value: function addConstraint(c) {
            logger.debug('Adding constraint between variable [' + c.getV2Name() + '] and variable [' + c.getV1Name() + '] to constraint list.');
            // Add the two variables to the list of variables for this constraint
            // if they are not already present.
            if (!(c.getV1Name() in this._variables)) {
                this._variables[c.getV1Name()] = c.getV1();
            }
            if (!(c.getV2Name() in this._variables)) {
                this._variables[c.getV2Name()] = c.getV2();
            }

            // Add entry to the varConstraintsMap for the variables that this
            // constraint is involved with.
            if (!(c.getV1Id() in this.varConstraintMap)) {
                this.varConstraintMap[c.getV1Id()] = [];
            }
            if (!(c.getV2Id() in this.varConstraintMap)) {
                this.varConstraintMap[c.getV2Id()] = [];
            }
            this.varConstraintMap[c.getV1Id()].push(c);
            this.varConstraintMap[c.getV2Id()].push(c);

            return true;
        }

        /**
         * The solve function is not implemented here - an implementation of
         * solve must be provided in subclasses of this CSPSolver class
         */

    }, {
        key: 'solve',
        value: function solve() {
            var initialAssignment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var getAllSolutions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            this.getAllSolutions = getAllSolutions;
            this.initialAssignment = initialAssignment;
            this._solutions = [];
        }

        /**
         * Check if the provided assignment - an instance of the Assignment class
         * is consistent - that is, it does not violate any constraints. Note
         * that this does not mean that the assignment is complete, some
         * variables may still be unassigned.
         */

    }, {
        key: 'isConsistent',
        value: function isConsistent(assignment) {
            // Check through each of the constraints to see if we have variables.
            var varList = assignment.getVarList();
            logger.trace('Value of varlist is: ' + JSON.stringify(varList));
            var assignedVarMap = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = varList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var v = _step.value;

                    // If the variable provided is not in our list of variables for
                    // this solve, then we throw an error.
                    logger.trace('Checking for existence of variable <' + v.getId() + '> with name <' + v.getName() + '>');
                    if (!(v.getId() in this._variables)) {
                        throw new _exceptions.InvalidVariableError('Variable found in the ' + 'assigned variables with ID [' + v.getId() + '] and ' + 'name [' + v.getName() + '] is not registered for ' + 'this solver instance.');
                    }
                    assignedVarMap[v.getId()] = v;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = varList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _v = _step2.value;

                    // If this variable is not present in any constraints then we
                    // can ignore it and continue with the next variable. We can also
                    // ignore the variable if it is unset (i.e. value is null)
                    logger.debug('Value of v is: ' + _v.getValue());
                    if (!(_v.getId() in this.varConstraintMap) || _v.getValue() === null) continue;

                    // For a variable that exists in the constraint map, we need to
                    // check whether the variable's value is consistent with that of
                    // corresponding values of any variables in related constraints
                    var relatedConstraints = this.varConstraintMap[_v.getId()];
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = relatedConstraints[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var relConst = _step3.value;

                            var otherVar = null;
                            if (relConst.getV1Id() === _v.getId()) {
                                otherVar = relConst.getV2();
                            } else {
                                otherVar = relConst.getV1();
                            }

                            // Now we need to check if the value of "otherVar" is in the
                            // list of target values for v. We need to find otherVar in
                            // the assignment since the instance of the variable with the
                            // value is in the assignment list.
                            var targetVarValue = assignment.getValueForVarById(otherVar.getId());
                            if (targetVarValue === null) {
                                logger.debug('Target var value is null, don\'t need ' + 'check if the value is consistent.');
                                continue;
                            }
                            var tgt = relConst.getTargetValues(_v.getId(), _v.getValue());
                            if (!(tgt.indexOf(assignment.getValueForVarById(otherVar.getId())) >= 0)) {
                                logger.debug('The value of the corresponding ' + 'variable in this constraint is not valid.');
                                logger.debug('Variable value is <', assignment.getValueForVarById(otherVar.getId()), '>, source var is <', _v.getId(), ', ', _v.getValue(), '>, target values are ', relConst.getTargetValues(_v.getId(), _v.getValue()));
                                return false;
                            }
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return true;
        }

        /**
         * Check if the provided assignment is a solution. An assignment that is
         * a solution is one that is complete (i.e. all variables have values)
         * and where all constraints are satisfied.
         */

    }, {
        key: 'isSolution',
        value: function isSolution(assignment) {
            return assignment.isComplete() && this.isConsistent(assignment);
        }
    }]);

    return CSPSolver;
}();

exports.default = CSPSolver;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * A variable class representing a discrete variable with a finite domain of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * values.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * The variable has a name, a domain and an optional value.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _v = __webpack_require__(7);

var _v2 = _interopRequireDefault(_v);

var _loglevel = __webpack_require__(0);

var log = _interopRequireWildcard(_loglevel);

var _exceptions = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = log.noConflict();
logger.setLevel(logger.levels.DEBUG);

var Variable = function () {
    function Variable(name, domain) {
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        _classCallCheck(this, Variable);

        if (name === undefined || domain === undefined) {
            throw new TypeError('Name and domain are required parameters.');
        }
        if (name === '') throw new TypeError('Name cannot be an empty string.');
        if (domain.constructor !== Array) {
            throw new TypeError('Domain must be an array of possible values.');
        }
        if (domain.length === 0) {
            throw new TypeError('Domain array cannot be empty.');
        }

        // If a value is provided, it must be in the domain!
        if (value !== null) {
            if (domain.indexOf(value) === -1) {
                throw new _exceptions.VariableValueError('The specified value is not ' + 'in the provided domain of values.');
            }
        }

        // Assign the variable a unique ID
        if (id === null) this.id = (0, _v2.default)();else this.id = id;

        this.name = name;
        this.domain = domain;
        this.value = value;
    }

    _createClass(Variable, [{
        key: 'getId',
        value: function getId() {
            return this.id;
        }
    }, {
        key: 'getName',
        value: function getName() {
            return this.name;
        }
    }, {
        key: 'getDomain',
        value: function getDomain() {
            return this.domain;
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this.value;
        }
    }, {
        key: 'hasValue',
        value: function hasValue() {
            return this.value !== null;
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            if (!(this.domain.includes(value) || value === null)) {
                throw new _exceptions.VariableValueError('The value specified for variable' + ' [' + this.id + '] is not in the value domain.');
            } else {
                this.value = value;
            }
        }
    }, {
        key: 'valueInDomain',
        value: function valueInDomain(value) {
            return this.domain.includes(value);
        }

        /**
         * Create a new Variable object from an existing one
         */

    }], [{
        key: 'fromVariable',
        value: function fromVariable(v) {
            return new Variable(v.getName(), v.getDomain(), v.getValue(), v.getId());
        }
    }]);

    return Variable;
}();

exports.default = Variable;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _loglevel = __webpack_require__(0);

var log = _interopRequireWildcard(_loglevel);

var _assignment = __webpack_require__(2);

var _assignment2 = _interopRequireDefault(_assignment);

var _exceptions = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

/**
 * A solution is an assignment for which all variables have values and all
 * these values are consistent with the set of constraints for the given CSP.
 *
 * At present we don't check for consistency when creating a solution - this
 * is done by the target CSP solver class since this has access to the
 * variable and constraint details to make such checks. It is therefore
 * assumed that the provided solution is consistent and this is simply a
 * marker subclass to identify a given assignment as a solution.
 */

var Solution = function (_Assignment) {
    _inherits(Solution, _Assignment);

    function Solution(assignment) {
        _classCallCheck(this, Solution);

        var _this = _possibleConstructorReturn(this, (Solution.__proto__ || Object.getPrototypeOf(Solution)).call(this, assignment.getVarList()));

        if (!assignment.isComplete()) {
            throw new _exceptions.InvalidSolutionError('The provided assignment is ' + 'incomplete. Can\'t create a solution from this assignment.');
        }
        return _this;
    }

    return Solution;
}(_assignment2.default);

exports.default = Solution;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Solution = exports.Assignment = exports.BacktrackingSolver = exports.Constraint = exports.Variable = exports.CSPSolver = undefined;

var _cspsolver = __webpack_require__(3);

var _cspsolver2 = _interopRequireDefault(_cspsolver);

var _variable = __webpack_require__(4);

var _variable2 = _interopRequireDefault(_variable);

var _constraint = __webpack_require__(11);

var _constraint2 = _interopRequireDefault(_constraint);

var _assignment = __webpack_require__(2);

var _assignment2 = _interopRequireDefault(_assignment);

var _solution = __webpack_require__(5);

var _solution2 = _interopRequireDefault(_solution);

var _backtrackingsolver = __webpack_require__(12);

var _backtrackingsolver2 = _interopRequireDefault(_backtrackingsolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Entry point for the consat.js Constraint Satisfaction Solver library.
 *
 * This library provides support for solving constraint satisfaction problems
 * either by formulating the problem programmatically or by loading in a
 * problem description in XML format that can be used to define the problem.
 *
 * At present, this module provides a basic backtracking solver for discrete
 * variables with finite domains.
 */
exports.CSPSolver = _cspsolver2.default;
exports.Variable = _variable2.default;
exports.Constraint = _constraint2.default;
exports.BacktrackingSolver = _backtrackingsolver2.default;
exports.Assignment = _assignment2.default;
exports.Solution = _solution2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(8);
var bytesToUuid = __webpack_require__(10);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * A constraint class representing a constraint between two variables.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * The constraint is set up as a mapping between two variables, v1 and v2
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Since a constraint works in two directions, we need a two-way
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * representation of our constraint mapping. The client creating the instance
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * of this class only needs to specify the mapping in one direction and we
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * then generate the mapping in the other direction based on the information
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * from the provided mapping.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Mappings are represented as an associative array with the value of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * source variable as the key and then a list of valid values of the target
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * variable as the value.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _exceptions = __webpack_require__(1);

var _loglevel = __webpack_require__(0);

var log = _interopRequireWildcard(_loglevel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = log.noConflict();
logger.setLevel(logger.levels.INFO);

var Constraint = function () {
    function Constraint(v1, v2, mappingsV1toV2) {
        _classCallCheck(this, Constraint);

        if (v1.getName() === v2.getName()) {
            throw new _exceptions.VariableValueError('The two variables for this ' + 'constraint cannot have the same name.');
        }

        var mappingsV2toV1 = {};
        // Begin by setting up reverse mappings from v2 to v1
        // We go through the mappings and check for each item that the source
        // and all the target values appear in the domains of the relevant
        // variables. If they don't then the provided mapping is incorrect.
        for (var key in mappingsV1toV2) {
            if (!v1.valueInDomain(key)) {
                log.error('The provided variable mapping is invalid.' + 'Value [' + key + '] is specified as a mapping key' + ' is not a in the value domain for variable 1 [' + v1.getName() + ']');
                throw new _exceptions.VariableValueError('Value [' + key + '] is ' + 'specified as a mapping key is not a in the value ' + 'domain for variable 1 [' + v1.getName() + ']');
            }
            // Add the current value (key) to the V2toV1 table...
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = mappingsV1toV2[key][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var val = _step.value;

                    if (!(val in mappingsV2toV1)) {
                        mappingsV2toV1[val] = [];
                    }
                    mappingsV2toV1[val].push(key);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        // Store class variables
        this.v1 = v1;
        this.v2 = v2;
        this.mappingsV1toV2 = mappingsV1toV2;
        this.mappingsV2toV1 = mappingsV2toV1;
    }

    _createClass(Constraint, [{
        key: 'getV1',
        value: function getV1() {
            return this.v1;
        }
    }, {
        key: 'getV1Name',
        value: function getV1Name() {
            return this.v1.getName();
        }
    }, {
        key: 'getV1Id',
        value: function getV1Id() {
            return this.v1.getId();
        }
    }, {
        key: 'getV2',
        value: function getV2() {
            return this.v2;
        }
    }, {
        key: 'getV2Name',
        value: function getV2Name() {
            return this.v2.getName();
        }
    }, {
        key: 'getV2Id',
        value: function getV2Id() {
            return this.v2.getId();
        }

        /**
         * Get all the target values for the specified variable and value.
         */

    }, {
        key: 'getTargetValues',
        value: function getTargetValues(vId, vValue) {
            // Check whether we've been passed a value for var1 or var2 and then
            // get the corresponding values from the relevant mapping
            logger.trace('Getting target values for vId <', vId, '> with value <', vValue, '>.');
            if (vId === this.v1.getId()) {
                if (!(vValue in this.mappingsV1toV2)) {
                    logger.debug('The specified value <' + vValue + '> is not ' + 'a valid value for the variable with ID <' + vId + '>. ' + 'Mappings are ' + JSON.stringify(this.mappingsV1toV2));
                    throw new _exceptions.VariableValueError('The specified value is not ' + 'a valid value for the variable named.');
                }
                return this.mappingsV1toV2[vValue];
            } else if (vId === this.v2.getId()) {
                if (!(vValue in this.mappingsV2toV1)) {
                    logger.trace('The specified value <' + vValue + '> is not ' + 'a valid value for the variable with ID <' + vId + '>. ' + 'Mappings are ' + JSON.stringify(this.mappingsV2toV1));
                    throw new _exceptions.VariableValueError('The specified value is not ' + 'a valid value for the variable named.');
                }
                return this.mappingsV2toV1[vValue];
            } else {
                throw new _exceptions.InvalidVariableError('Invalid variable name provided.');
            }
        }
    }]);

    return Constraint;
}();

exports.default = Constraint;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cspsolver = __webpack_require__(3);

var _cspsolver2 = _interopRequireDefault(_cspsolver);

var _assignment = __webpack_require__(2);

var _assignment2 = _interopRequireDefault(_assignment);

var _solution = __webpack_require__(5);

var _solution2 = _interopRequireDefault(_solution);

var _loglevel = __webpack_require__(0);

var log = _interopRequireWildcard(_loglevel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Implementation of a simple backtracking CSP solver. Extends the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * main CSPSolver class defined in index.js.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This solver uses a recursive approach to identify possible solutions given
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * a CSP definition. For a given problem definition and assignment, the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * solver checks if the assignment is complete and if not:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Recursive stage: it selects one of the unassigned variables in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * assignment. It then checks if the new set of assignments is consistent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * If so it recurses to the next level of the tree, returning to the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * "Recursive stage" marker. If the assignment is not consistent, this branch
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * of the tree fails and we jump back to the previous state and try another
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * branch.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var logger = log.getLogger('backtracking');
logger.setLevel(logger.levels.INFO);

var BacktrackingSolver = function (_CSPSolver) {
    _inherits(BacktrackingSolver, _CSPSolver);

    // Variables and constraints set via superclass, this just provides an
    // implementation of solve using the backtracking method.
    // Superclass provides:
    // this._constraints = [];
    // this._variables = {}; - a map of variable ID to object
    // this.varConstraintMap = {}; - a map of variable ID to an array of
    //                               constraints with which that variable
    //                               is involved.
    function BacktrackingSolver() {
        var _ref;

        _classCallCheck(this, BacktrackingSolver);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = BacktrackingSolver.__proto__ || Object.getPrototypeOf(BacktrackingSolver)).call.apply(_ref, [this].concat(params)));

        logger.debug('Creating a backtracking solver instance...');
        return _this;
    }

    /**
     * The solve function is the entry point to the recursive solve process.
     * When calling the solve here we identify whether we want only the first
     * solution or a list of all solutions.
     *
     * initialAssignent: an assignment object containing the initial state
     * getAllSolutions: true: get all solutions, false: return first solution
     *
     * If you want to get only the first solution for an unassigned initial
     * state, call solve with (null, false)
     */


    _createClass(BacktrackingSolver, [{
        key: 'solve',
        value: function solve() {
            var initialAssignment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var getAllSolutions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            _get(BacktrackingSolver.prototype.__proto__ || Object.getPrototypeOf(BacktrackingSolver.prototype), 'solve', this).call(this, initialAssignment, getAllSolutions);
            if (initialAssignment === null) {
                // Prepare a blank initial assignment
                initialAssignment = _assignment2.default.emptyAssignment(this._variables);
            }
            logger.debug('About to start solve with initial assignment:\n' + initialAssignment.printAssignment());
            this.treeLevel = 0;
            var result = this.recursiveSolve(initialAssignment);
            logger.debug('Result: ' + JSON.stringify(result));

            // Format the output data as JSON that we can load in as an object
            // later in order to test the solver output.
            function replacer(key, value) {
                if (key === 'domain') return undefined;else if (key === 'id') return undefined;else return value;
            }

            logger.debug('{"solutions":[');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._solutions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var solution = _step.value;

                    logger.debug(JSON.stringify(solution, replacer) + ',');
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            logger.debug(']}');

            return result;
        }
    }, {
        key: 'recursiveSolve',
        value: function recursiveSolve(assignment) {
            this.treeLevel++;
            logger.debug('AT TREE LEVEL: ' + this.treeLevel);
            if (assignment.isComplete()) return new _solution2.default(assignment);
            var v = this.getUnassignedVar(assignment);
            // We now process the selected unassigned variable working through
            // each of its values in turn each time we return to this tree node
            var varDomain = v.getDomain();
            var updatedDomain = this.orderDomainValues(varDomain);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = updatedDomain[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var item = _step2.value;

                    v.setValue(item);
                    logger.debug('Assignment is: ' + assignment.printAssignment());
                    if (this.isConsistent(assignment)) {
                        var result = this.recursiveSolve(assignment);
                        this.treeLevel--;
                        logger.debug('AT TREE LEVEL: ' + this.treeLevel);
                        logger.debug('TYPE OF RESULT IS: ' + result.constructor.name);
                        if (this.isSolution(result)) {
                            logger.trace('RESULT TO RETURN: ' + result.printAssignment());
                            // return result;
                            if (this.getAllSolutions) {
                                this._solutions.push(new _solution2.default(result));
                            } else {
                                var localSolution = new _solution2.default(result);
                                this._solutions.push(localSolution);
                                return localSolution;
                            }
                        }
                        v.setValue(null);
                    } else {
                        v.setValue(null);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return assignment;
        }

        /**
         * Select an unassigned variable from the assignment. To this, we get all
         * the unassigned vars from the assignment and then pick one at random.
         * This function can be updated to add heuristics to improve the variable
         * selection in a way that will increase the solver performance.
         */

    }, {
        key: 'getUnassignedVar',
        value: function getUnassignedVar(assignment) {
            var unassignedList = assignment.getUnassignedVariables();
            // Get a random item from the list
            var randVar = unassignedList[Math.floor(Math.random() * unassignedList.length)];
            return randVar;
        }

        /**
         * Order the list of domain values. This process can be used to implement
         * heuristics that improve solver performance.
         *
         * NOTE: For now, this is a placeholder that simply returns the values
         * given in the order they were provided.
         */

    }, {
        key: 'orderDomainValues',
        value: function orderDomainValues(values) {
            return values;
        }
    }]);

    return BacktrackingSolver;
}(_cspsolver2.default);

exports.default = BacktrackingSolver;

/***/ })
/******/ ]);
});
//# sourceMappingURL=consat.js.map