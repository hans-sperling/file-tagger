;(function (app) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ Properties

    var moduleName = 'type';

    // ------------------------------------------------------------------------------------------------ Module interface

    /**
     * Initializes this module - will be called at the beginning from the app. Updates the module with the given config.
     *
     * @public
     * @param  {Object} config
     * @return {void}
     */
    function init(config) {
        update(config);
    }


    /**
     * Will be called from app if all other modules has been loaded.
     *
     * @public
     * @return {void}
     */
    function run() {
        // Nothing to do yet
    }


    /**
     * Updates this module, will be called on init and on general updating the app.
     *
     * @public
     * @param  {Object} config
     * @return {void}
     */
    function update(config) {
        // Nothing to do yet
    }


    /**
     * Resets this module.
     *
     * @public
     * @return {void}
     */
    function reset() {
        // Nothing to do yet
    }


    /**
     * Returns the public module api.
     * Used to append this module to the app.
     *
     * @private
     * @returns {object}
     */
    function getModuleApi() {
        var moduleApi = {};

        moduleApi[moduleName] = {
            init        : init,
            run         : run,
            update      : update,
            reset       : reset,
            isArray     : isArray,
            isBoolean   : isBoolean,
            isFunction  : isFunction,
            isNull      : isNull,
            isNumber    : isNumber,
            isObject    : isObject,
            isString    : isString,
            isUndefined : isUndefined
        };

        return moduleApi;
    }

    // --------------------------------------------------------------------------------------------------------- Methods

    /**
     * Checks if the type of the given parameter is an array.
     *
     * @public
     * @param  {*} value
     * @return {boolean}
     */
    function isArray(value) {
        return Object.prototype.toString.call(value) == "[object Array]";
    }


    /**
     * Checks if the type of the given parameter is a boolean.
     *
     * @public
     * @param  {*} value
     * @return {boolean}
     */
    function isBoolean(value) {
        return Object.prototype.toString.call(value) == "[object Boolean]";
    }


    /**
     * Checks if the type of the given parameter is a function.
     *
     * @public
     * @param  {*} value
     * @return {boolean}
     */
    function isFunction(value) {
        return Object.prototype.toString.call(value) == "[object Function]";
    }


    /**
     * Checks if the type of the given parameter is null.
     *
     * @public
     * @param  {*} value
     * @return {boolean}
     */
    function isNull(value) {
        return Object.prototype.toString.call(value) == "[object Null]";
    }


    /**
     * Checks if the type of the given parameter is a number.
     *
     * @public
     * @param  {*} value
     * @return {boolean}
     */
    function isNumber(value) {
        return !isNaN(value);
    }


    /**
     * Checks if the type of the given parameter is an object.
     *
     * @public
     * @param  {*} value
     * @return {boolean}
     */
    function isObject(value) {
        return Object.prototype.toString.call(value) == "[object Object]";
    }


    /**
     * Checks if the type of the given parameter is a string.
     *
     * @public
     * @param  {*} value
     * @return {boolean}
     */
    function isString(value) {
        return Object.prototype.toString.call(value) == "[object String]";
    }


    /**
     * Checks if the type of the given parameter is undefined.
     *
     * @public
     * @param  {*} value
     * @return {boolean}
     */
    function isUndefined(value) {
        return Object.prototype.toString.call(value) == "[object Undefined]";
    }

    // --------------------------------------------------------------------------------------------------------- Returns

    // Append module with public methods and properties
    app.appendModule(getModuleApi());

})(window[APPKEY]);
