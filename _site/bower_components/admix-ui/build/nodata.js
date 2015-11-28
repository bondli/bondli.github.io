define(function(require, exports, module) {

    return {
        _getNodata : function () {

            if (!$('.admix-ui-nodata').length) {
                var $nodata  = '<div class="admix-ui-nodata">';
                    $nodata += '<i class="icon icon-nodata"></i><div></div>';
                    $nodata += '</div>';

                $('body').append($nodata);
            }

            return $('.admix-ui-nodata');

        },

        show : function (msg) {
            var $el = this._getNodata();

            $('.admix-ui-nodata div').text(msg || '还没有任何数据记录');

            $el.show();

        },

        hide : function () {
            var $el = this._getNodata();
            $el.hide();

        }
    };

});
