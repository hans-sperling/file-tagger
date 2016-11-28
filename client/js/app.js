var APPKEY = 'FILETAGGER';

/*! FileLoader - Async file loader - Version: 0.2.0 - https://github.com/hans-sperling/script-loader */
var AppLoader=function(){"use strict";function e(e){return"[object Array]"==Object.prototype.toString.call(e)}function n(e){return"[object Function]"==Object.prototype.toString.call(e)}function t(){--i||u()}function o(e){var n=document.createElement("link");return n.rel="stylesheet",n.async=!0,n.href=e,n}function r(e){var n=document.createElement("script");return n.type="text/javascript",n.async=!0,n.src=e,n}function a(e){var n=null,a=document.getElementsByTagName("head")[0],c=e.split("."),i=c[c.length-1];switch(i.toLocaleLowerCase()){case"js":n=r(e);break;case"css":n=o(e);break;default:return d(e),void t()}n.addEventListener?n.addEventListener("load",function(){l(e),t()},!1):n.attachEvent?n.attachEvent("load",function(){l(e),t()}):n.onreadystatechange=function(){n.readyState in{loaded:1,complete:1}&&(l(e),t())},n.onerror=function(){d(e),t()},a.appendChild(n)}function c(t){var o,r,c=t||{};for(e(c.files)||(c.files=[]),n(c.onFileLoaded)||(c.onFileLoaded=function(){}),n(c.onAllLoaded)||(c.onAllLoaded=function(){}),n(c.onError)||(c.onError=function(){}),r=c.files.length,i=r,l=c.onFileLoaded,u=c.onAllLoaded,d=c.onError,o=0;r>o;o++)a(c.files[o])}var i=0,l=function(){},u=function(){},d=function(){};return{require:c}};

/* http://beeker.io/jquery-document-ready-equivalent-vanilla-javascript */
var domReady=function(a){var b=!1,c=function(){document.addEventListener?(document.removeEventListener("DOMContentLoaded",d),window.removeEventListener("load",d)):(document.detachEvent("onreadystatechange",d),window.detachEvent("onload",d))},d=function(){b||!document.addEventListener&&"load"!==event.type&&"complete"!==document.readyState||(b=!0,c(),a())};if("complete"===document.readyState)a();else if(document.addEventListener)document.addEventListener("DOMContentLoaded",d),window.addEventListener("load",d);else{document.attachEvent("onreadystatechange",d),window.attachEvent("onload",d);var e=!1;try{e=null==window.frameElement&&document.documentElement}catch(f){}e&&e.doScroll&&!function g(){if(!b){try{e.doScroll("left")}catch(d){return setTimeout(g,50)}b=!0,c(),a()}}()}};

var prefixPath = '';
var files = [
    // Layout
    prefixPath + 'css/reset.css',
    prefixPath + 'css/layout.css',

    // Library scripts
    prefixPath + 'js/lib/merge.js',
    prefixPath + 'js/lib/type.js',

    // Application module scripts
    prefixPath + 'js/modules/fileView.js',
    prefixPath + 'js/modules/lightbox.js',
    prefixPath + 'js/modules/resize.js'
];

window[APPKEY] = (function () {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ Properties

    var modules = {};

    // --------------------------------------------------------------------------------------------------------- Modules

    /**
     * Appends a given module object.
     *
     * @param   {Object} module
     * @returns {void}
     */
    function appendModule(module) {
        var id;

        if ((!module) || (typeof module !== 'object')) {
            console.error('Parameter <module> is not a valid PerspectiveView module :: ', '{' , typeof module, '} :: ', module);
        }

        for (id in module) {
            if (module.hasOwnProperty(id) && modules.hasOwnProperty(id)) {
                console.error('There already exists a module named \'' + id + '\'');
            }
            else {
                modules[id] = module[id];
            }
        }
    }


    /**
     * Initializes all appended modules. Will call all init methods of the appended modules with the given
     * configuration.
     *
     * @param   {Object} config
     * @returns {void}
     */
    function initModules(config) {
        var i;
        for (i in modules) {
            if (modules.hasOwnProperty(i)) {
                if (typeof modules[i].init === 'function') {
                    modules[i].init(config);
                }
            }
        }
    }


    /**
     * Calls all run methods of the appended modules.
     *
     * @returns {void}
     */
    function runModules() {
        var i;

        for (i in modules) {
            if (modules.hasOwnProperty(i)) {
                if (typeof modules[i].run === 'function') {
                    modules[i].run();
                }
            }
        }
    }


    /**
     * Updates all appended modules. Will call all update methods of the appended modules with the given configuration.
     *
     * @param   {Object} config
     * @returns {void}
     */
    function updateModules(config) {
        var i;

        for (i in modules) {
            if (modules.hasOwnProperty(i)) {
                if (typeof modules[i].update === 'function') {
                    modules[i].update(config);
                }
            }
        }
    }


    /**
     * Resets all appended modules. Will call all reset methods of the appended modules.
     *
     * @returns {void}
     */
    function resetModules() {
        var i;

        for (i in modules) {
            if (modules.hasOwnProperty(i)) {
                if (typeof modules[i].reset === 'function') {
                    modules[i].reset();
                }
            }
        }
    }


    /**
     * Returns all modules.
     *
     * @returns {Object}
     */
    function getModules() {
        return modules;
    }


    /**
     * Returns a requested module by the given id.
     *
     * @param   {String} id - ID of the requested module
     * @returns {Object}
     */
    function getModule(id) {
        if (modules[id]) {
            return modules[id];
        }
        else {
            console.warn('The requested module <' + id + '> does not exist!');
            return null;
        }
    }

    // ---------------------------------------------------------------------------------------------------------- Events

    /**
     * Binds global PJAX events to track the requests from github.
     *
     * @private
     */
    function bindPjaxEvents() {
        // A PJAX request is send
        $(document).on('pjax:send', function() {
            resetModules();
        });

        // The requested PJAX is complete
        $(document).on('pjax:complete', function() {
            runModules();
        })
    }

    // ------------------------------------------------------------------------------------------------------------ Init

    /**
     * Initialize this app.
     *
     * @returns {void}
     */
    function init() {
        initModules(modules.config);
        runModules();

        bindPjaxEvents();
    }

    // ------------------------------------------------------------------------------------------------------- DEV return

    return {
        modules       : modules,
        appendModule  : appendModule,
        getModules    : getModules,
        getModule     : getModule,
        init          : init
    };

})();

domReady(function() {
    'use strict';

    var appLoader = new AppLoader();

        appLoader.require({
        files : files,
        onAllLoaded  : function onAllLoaded() {
            window[APPKEY].init();
        },
        onError      : function onError(file) {
            console.warn('File <' + file + '> has not been loaded!');
        },
        onFileLoaded : function onFileLoaded(file) {
            // ...
        }
    });
});
