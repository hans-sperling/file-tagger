;(function (app) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ Properties

    var moduleName  = 'lightbox',
        cfg         = {},
        insertScope = 'body',
        moduleScope = '.js_lightbox',
        lazyScope   = '.js_lazy',
        currentItem = null;

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
            reset  : reset,

            updateLightbox : updateLightbox,
            addLightbox    : addLightbox,
            removeLightbox : removeLightbox
        };

        return moduleApi;
    }

    // --------------------------------------------------------------------------------------------------------- Methods

    $.subscribe('imagePreviewList:itemClick', function(e, data) {
        currentItem = data.item;
        addLightbox(data.imgSrc);
    });

    // ---------------------------------------------------------------------------------------------------------- Public

    function addLightbox(imgSrc) {
        var markup = '';

        markup += '<div class="js_lightbox lightbox">';
        markup += '    <div class="lightbox-inner js_imageContainer">';
        markup +=          getImageMarkup(imgSrc);
        markup += '    </div>';
        markup += '    <div class="navigation close"></div>';
        markup += '    <div class="navigation prev"></div>';
        markup += '    <div class="navigation next"></div>';
        markup += '</div>';

        $(insertScope).append(markup);
        $(moduleScope).find(lazyScope).lazyload();
        bindEvents();
    }


    function getImageMarkup(imgSrc) {
        return '<img class="lazy js_image js_lazy" data-original="' + imgSrc + '" src=""/>';
    }


    function updateLightbox(imgSrc) {
        $('.js_imageContainer').html(getImageMarkup(imgSrc));
        $(moduleScope).find(lazyScope).lazyload();
    }


    function removeLightbox() {
        unbindEvents();
        $(moduleScope).remove();
    }

    // ---------------------------------------------------------------------------------------------------------- Events

    function bindEvents() {
        $(insertScope).on('keydown.lightbox', function(e) {
            if (e.keyCode == 27) { removeLightbox(); } // escape key
            if (e.keyCode == 37) { showPrevImg();    } // left arrow key
            if (e.keyCode == 39) { showNextImg();    } // left arrow key
        });

        $(moduleScope).find('.navigation.close').on('click.lightbox', removeLightbox);
        $(moduleScope).find('.navigation.prev').on('click.lightbox', showPrevImg);
        $(moduleScope).find('.navigation.next').on('click.lightbox', showNextImg);
    }


    function unbindEvents() {
        $(insertScope).off('.lightbox');
        $(moduleScope).off('.lightbox');
    }

    // ------------------------------------------------------------------------------------------------------ Navigation

    function showPrevImg() {
        var prevItem = currentItem.prev(),
            imgSrc;

        if (prevItem.length <= 0) {
            prevItem = $(currentItem.parent()[0].lastChild);
        }

        currentItem  = prevItem;
        imgSrc       = prevItem.find('img').attr('data-original');

        updateLightbox(imgSrc);
    }


    function showNextImg() {
        var nextItem = currentItem.next(),
            imgSrc;

        if (nextItem.length <= 0) {
            nextItem = $(currentItem.parent().children()[0]);
        }

        currentItem = nextItem;
        imgSrc      = nextItem.find('img').attr('data-original');

        updateLightbox(imgSrc);
    }

    // --------------------------------------------------------------------------------------------------------- Returns

    // Append module with public methods and properties
    app.appendModule(getModuleApi());

})(window[APPKEY]);


(function () {

    var insertScope = 'body',
        moduleScope = '.js_lightbox',
        lazyScope   = '.js_lazy',
        currentItem = null;

    // ------------------------------------------------------------------------------------------------- External events

    $.subscribe('imagePreviewList:itemClick', function(e, data) {
        currentItem = data.item;
        addLightbox(data.imgSrc);
    });

    // ---------------------------------------------------------------------------------------------------------- Public

    this.addLightbox = function(imgSrc) {
        var markup = '';

        markup += '<div class="js_lightbox lightbox">';
        markup += '    <div class="lightbox-inner js_imageContainer">';
        markup +=          getImageMarkup(imgSrc);
        markup += '    </div>';
        markup += '    <div class="navigation close"></div>';
        markup += '    <div class="navigation prev"></div>';
        markup += '    <div class="navigation next"></div>';
        markup += '</div>';

        $(insertScope).append(markup);
        $(moduleScope).find(lazyScope).lazyload();
        bindEvents();
    };


    function getImageMarkup(imgSrc) {
        return '<img class="lazy js_image js_lazy" data-original="' + imgSrc + '" src=""/>';
    }


    this.updateLightbox = function(imgSrc) {
        $('.js_imageContainer').html(getImageMarkup(imgSrc));
        $(moduleScope).find(lazyScope).lazyload();
    };


    this.removeLightbox = function() {
        unbindEvents();
        $(moduleScope).remove();
    };

    // ---------------------------------------------------------------------------------------------------------- Events

    function bindEvents() {
        $(insertScope).on('keydown.lightbox', function(e) {
            if (e.keyCode == 27) { removeLightbox(); } // escape key
            if (e.keyCode == 37) { showPrevImg();    } // left arrow key
            if (e.keyCode == 39) { showNextImg();    } // left arrow key
        });

        $(moduleScope).find('.navigation.close').on('click.lightbox', removeLightbox);
        $(moduleScope).find('.navigation.prev').on('click.lightbox', showPrevImg);
        $(moduleScope).find('.navigation.next').on('click.lightbox', showNextImg);
    }


    function unbindEvents() {
        $(insertScope).off('.lightbox');
        $(moduleScope).off('.lightbox');
    }

    // ------------------------------------------------------------------------------------------------------ Navigation

    function showPrevImg() {
        var prevItem = currentItem.prev(),
            imgSrc;

        if (prevItem.length <= 0) {
            prevItem = $(currentItem.parent()[0].lastChild);
        }

        currentItem  = prevItem;
        imgSrc       = prevItem.find('img').attr('data-original');

        updateLightbox(imgSrc);
    }


    function showNextImg() {
        var nextItem = currentItem.next(),
            imgSrc;

        if (nextItem.length <= 0) {
            nextItem = $(currentItem.parent().children()[0]);
        }

        currentItem = nextItem;
        imgSrc      = nextItem.find('img').attr('data-original');

        updateLightbox(imgSrc);
    }

})();
