;(function (app) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ Properties

    var moduleName     = 'fileView',
        cfg            = {},
        moduleScope    = '.js_imagePreviewList',
        insertScope    = moduleScope,
        itemScope      = '.js_imagePreviewListItem',
        lazyScope      = '.js_lazy',
        itemColClass   = '',
        listWidth      = 1, // in px
        itemWidth      = 1, // in px
        itemColAmount  = 1, // in px
        scrollBarWidth = 1, // in px
        screenWidth    = 1; // in px

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
        addPreviewList();
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
            init   : init,
            run    : run,
            update : update,
            reset  : reset,

            addPreviewList : addPreviewList
        };

        return moduleApi;
    }

    // --------------------------------------------------------------------------------------------------------- Methods

    function addPreviewList() {
        $(insertScope).html(getTestImagesMarkup());

        itemWidth     = getItemWidth();
        listWidth     = getListWidth();
        itemColAmount = Math.floor(listWidth / itemWidth);
        itemColClass  = 'col-' + itemColAmount;

        $(moduleScope).addClass(itemColClass);
        $(moduleScope).find(lazyScope).lazyload();

        bindEvents();

        $.publish(moduleName + ':previewListUpdated', {});
    }


    function updatePreviewList(sizes) {
        var oldItemColAmount = itemColAmount;

        scrollBarWidth = sizes.scrollbar;
        screenWidth    = sizes.window;
        listWidth      = getListWidth();
        itemColAmount  = Math.floor(listWidth / itemWidth);

        if (itemColAmount != oldItemColAmount) {
            $(moduleScope).removeClass(itemColClass);

            itemColClass  = 'col-' + itemColAmount;
            $(moduleScope).addClass(itemColClass);

            $.publish(moduleName + ':previewListUpdated', {});
            $(moduleScope).find(lazyScope).lazyload();
        }
    }


    function bindEvents() {
        $(itemScope).on('click.imagePreviewList', function(e) {
            var item   = $(this),
            imgSrc = $(this).find('.js_image').attr('data-original');

            $.publish('imagePreviewList:itemClick', {
                imgSrc : imgSrc,
                item   : item
            });

        });

        $.subscribe('resize:resize', function (e, data) {
            updatePreviewList(data);
        });

    }


    function getItemWidth() {
        return $(itemScope).outerWidth(true);
    }


    function getListWidth() {
        return $(moduleScope).width();
    }


    function getTestImagesMarkup() {
        var markup = '',
            ext    = 'jpg',
            i;

        for (i = 1; i <= 200; i++) {
            ext = 'jpg';

            if (i == 4 || i == 65 || i == 66 || i == 67 || i == 87 || i == 108 || i == 110 || i == 112 || i == 113 || i == 144 || i == 145 || i == 146 || i == 147) {
                ext = 'gif';
            }

            markup += '<li class="js_imagePreviewListItem image-preview-list-item">';
            markup += '    <div class="inner">';
            markup += '        <img class="lazy js_image js_lazy" data-original="data/img/' + i + '.' + ext + '" src="" />';
            markup += '    </div>';
            markup += '</li>';
        }

        return markup;
    }

    // --------------------------------------------------------------------------------------------------------- Returns

    // Append module with public methods and properties
    app.appendModule(getModuleApi());

})(window[APPKEY]);
