"use strict";

const Bundle = function() {

    const show = 'show';
    const open = 'open';
    const active = 'active';

    const body = $('body');

    let analyticsChart;

    /**
     * Check for dark mode
     * @returns {boolean}
     */
    const isDarkMode = function() {
        return localStorage.getItem('dark_mode') === 'true';
    }


    /**
     * Get CSS variable value
     * @param {string} name 
     * @returns {string}
     */
    const getCSSVarValue = function(name) {
        var hex = getComputedStyle(document.documentElement).getPropertyValue('--ns-' + name);
            if (hex && hex.length > 0) {
                hex = hex.trim();
            }

            return hex;
    }


    /**
     * Page loader
     */
    const loader = function() {
        const loading = $('#nsofts_loader');
        loading.fadeOut(500);
    }


    /**
     * Initialize perfect scrollbar
     */
    const initScrollbar = function() {
        $('[data-scroll="true"]').each(function() {
            // Bind perfect scrollbar with element.
            new PerfectScrollbar(this, {
                wheelSpeed: 2,
                swipeEasing: true,
                wheelPropagation: false,
                minScrollbarLength: 40
            });
        });
    }

   

    /**
     * Theme dark 
     */
    const themeOptions = function() {
        const toggler = $('#nsofts_theme_toggler');
        const dark = 'nsofts-theme-dark';
        const mode = 'dark_mode'

        if (localStorage.getItem(mode) === 'true') {
            body.addClass(dark);
            toggler.addClass(active);
        }

        toggler.on('click', function() {
            const _this = $(this);
            if (_this.hasClass(active)) {
                _this.removeClass(active);
                body.removeClass(dark);
                localStorage.removeItem(mode);

            } else {
                _this.addClass(active);
                body.addClass(dark);
                localStorage.setItem(mode, true);
            }
        });
    }


    /**
     * Password toggle
     */
    const password = function() {
        const passwordInput = $('#nsofts_password_input');
        const passwordToggler = $('#nsofts_password_toggler');
        const passwordOpen = $('.nsofts-eye-open');
        const passwordClose = $('.nsofts-eye-close');
        const none = 'd-none';
        
        passwordToggler.on('click', function() {
            const _this = $(this);
            if (_this.hasClass(active)) {
                _this.removeClass(active);
                passwordOpen.removeClass(none);
                passwordClose.addClass(none);
                passwordInput.attr('type', 'password');
                
            } else {
                _this.addClass(active);
                passwordOpen.addClass(none);
                passwordClose.removeClass(none);
                passwordInput.attr('type', 'text');
            }
        });
    }
    
    /**
     * Tooltip
     */
    const initTooltip = function() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }
    
    return {
        init() { 
            loader();
            initScrollbar();
            themeOptions();
            password();
            initTooltip();
        }
    }
    
}();

jQuery(window).on('load', Bundle.init());