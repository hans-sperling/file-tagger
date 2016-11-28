;(function (app) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ Properties

    var moduleName = 'merge';

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
     * @returns {object}
     */
    function getModuleApi() {
        var moduleApi = {};

        moduleApi[moduleName] = {
            init   : init,
            run    : run,
            update : update,
            reset  : reset,
            deep   : deep
        };

        return moduleApi;
    }

    // --------------------------------------------------------------------------------------------------------- Methods

    function deep(target, src) {
        var array = Array.isArray(src);
        var dst = array && [] || {};

        if (array) {
            target = target || [];
            dst = dst.concat(target);
            src.forEach(function (e, i) {
                if (typeof dst[i] === 'undefined') {
                    dst[i] = e;
                }
                else if (typeof e === 'object') {
                    dst[i] = deep(target[i], e);
                }
                else {
                    if (target.indexOf(e) === -1) {
                        dst.push(e);
                    }
                }
            });
        }
        else {
            if (target && typeof target === 'object') {
                Object.keys(target).forEach(function (key) {
                    dst[key] = target[key];
                })
            }
            Object.keys(src).forEach(function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    dst[key] = src[key];
                }
                else {
                    if (!target[key]) {
                        dst[key] = src[key];
                    }
                    else {
                        dst[key] = deep(target[key], src[key]);
                    }
                }
            });
        }

        return dst;
    }

    // --------------------------------------------------------------------------------------------------------- Returns

    // Append module with public methods and properties
    app.appendModule(getModuleApi());

})(window[APPKEY]);
