define(function(require, exports, module) {
    return {

        _getToast : function () {

            if (!$('.admix-ui-toast').length) {
                var $toast  = '<div class="admix-ui-toast">';
                    $toast += '</div>';

                $('body').append($toast);
            }

            return $('.admix-ui-toast');

        },

        show : function (msg) {
            var $el = this._getToast();

            $('.admix-ui-toast').text(msg || '数据加载中');

            var w = $el.width();
            $el.css('marginLeft', '-'+(w/2 - 10)+'px');

            //$el.show();
            $el.addClass('toast-in');

            setTimeout(function() {
                //$el.hide();
                $el.removeClass('toast-in');
            }, 3000);

        }

    };

});
