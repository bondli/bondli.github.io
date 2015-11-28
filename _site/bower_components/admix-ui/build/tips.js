define(function(require, exports, module) {

    //定义需要操作的dom
    var $body = $('body'),
        $overlay = $('<div class="dialog-overlay"></div>'),
        $modal = $('<div class="dialog"></div>');

    return {

        _initModal : function () {
            var me = this;

            //防止distory之后这个dom不存在了
            $overlay = $('<div class="dialog-overlay"></div>');
            $modal = $('<div class="dialog dialog-no-buttons"></div>');

            $body.append($overlay);
            $body.append($modal);
        },

        _hide : function () {
            $modal.addClass('dialog-out');
            $overlay.removeClass('dialog-overlay-visible');

            setTimeout(function(){
                $overlay.remove();
                $modal.remove();
            },200);
        },

        _show : function () {
            $overlay.addClass('dialog-overlay-visible');
            $modal.addClass('dialog-in');
        },

        _position : function () {
            //计算$modal的高度，需要做位置改变
            var height = parseInt($modal.height())/2;
            $modal.css('marginTop', '-' + height + 'px');
        },

        show : function (options) {
            var me = this,
                $modalTips = $('<div class="dialog-inner"></div>');

            me._initModal();

            //title and msg
            var msgBody = options.text || '',
                msgTitle = options.title || '';
                msgType = options.type || 'success',
                callback = options.callback || null;

            if(msgType === 'success' && msgTitle === ''){
                msgTitle = '操作成功';
            }
            if(msgType === 'error' && msgTitle === ''){
                msgTitle = '操作失败';
            }

            var $icon = $('<div class="icon icon-'+msgType+'"></div>'),
                $title = $('<div class="dialog-title">'+msgTitle+'</div>'),
                $body = $('<div class="dialog-text">'+msgBody+'</div>');

            $modalTips.append($icon);
            $modalTips.append($title);
            $modalTips.append($body);

            $modal.append($modalTips);

            setTimeout(function(){
                me._hide();
                callback && callback();
            },2000);

            //计算$modal的高度，需要做位置改变
            me._position();

            me._show();

        }

    };

});
