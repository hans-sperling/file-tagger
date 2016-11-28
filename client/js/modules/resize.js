;(function (app) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ Properties

    var moduleName     = 'resize',
        cfg            = {},
        scrollbarWidth = 0;

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
        bindEvents();
    }


    /**
     * Updates this module, will be called on init and on general updating the app.
     *
     * @public
     * @param  {Object} config
     * @return {void}
     */
    function update(config) {
        config = config || {};
        cfg    = app.getModule('merge').deep(cfg, config);

        scrollbarWidth = getScrollbarWidth();
    }


    /**
     * Resets this module.
     *
     * @public
     * @return {void}
     */
    function reset() {
        unbindEvents();
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
            init   : init,
            run    : run,
            update : update,
            reset  : reset
        };

        return moduleApi;
    }

    // --------------------------------------------------------------------------------------------------------- Methods

    function getScrollbarWidth() {
        var $outer          = $('<div>').css({visibility: 'hidden', width: '100%', overflow: 'scroll'}).appendTo('body'),
            widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();

        $outer.remove();
        return 100 - widthWithScroll;
    }


    function bindEvents() {
        var timer,
            delay = 100;

        $(window).on('resize', function() {
            timer && clearTimeout(timer);

            timer = window.setTimeout(function() {
                $.publish('resize:resize', {
                    scrollbar : scrollbarWidth,
                    window    : $(window).width()
                });
            }, delay);
        });
    }


    function unbindEvents() {
        $(window).off('resize');
    }

    // --------------------------------------------------------------------------------------------------------- Returns

    // Append module with public methods and properties
    app.appendModule(getModuleApi());

})(window[APPKEY]);
