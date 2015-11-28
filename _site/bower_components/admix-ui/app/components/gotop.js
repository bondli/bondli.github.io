define(function(require, exports, module) {

    return function(config) {

        config = $.extend({
            html: '<a class="admix-ui-gotop"></a>',
            right: 16,
            bottom: 60,
            distance: 30,
            animate: true
        }, config || (config = {}));

        var el = $(config.html),
            requestAnimFrame = (function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame;
            })(),
            anim = function() {
                if ($(window).scrollTop() < 1) {
                    $(window).scrollTop(0);
                } else {
                    $(window).scrollTop($(window).scrollTop() / 2);
                    requestAnimFrame(anim);
                }
            };

        el
            .css({
                'right': config.right + 'px',
                'bottom': config.bottom + 'px',
                'display': ($(window).scrollTop() <= config.distance ? 'none' : 'block')
            })
            .appendTo('body')
            .on('click', function() {
                config.animate ? anim() : $(window).scrollTop(0);
            });

        $(window).on('scroll', function() {
            $(this).scrollTop() > config.distance ? el.show() : el.hide();
        });

    };

});
