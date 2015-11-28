define(function(require, exports, module) {

    //定义需要操作的dom
    var $body = $('body'),
        $overlay = $('<div class="dialog-overlay"></div>'),
        $modal = $('<div class="dialog"></div>');

    return {

        _stopEventTap : function () {
            var $el = $('<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; "></div>');
            $('body').append($el);
            setTimeout(function () {
                $el.remove();
            }, 350);

        },

        _initModal : function () {
            var me = this;

            //防止distory之后这个dom不存在了
            $overlay = $('<div class="dialog-overlay"></div>');
            $modal = $('<div class="dialog"></div>');

            $body.append($overlay);
            $body.append($modal);

        },

        _initEvent : function () {
            var me = this;
            $('.dialog-overlay').one('touchend', function(e){
                e.preventDefault();
                me._stopEventTap();
                me.hide();
            });

        },

        hide : function () {
            $modal.addClass('dialog-out');
            $overlay.removeClass('dialog-overlay-visible');

            setTimeout(function(){
                $overlay.remove();
                $modal.remove();
            },200);

        },

        show : function () {
            $overlay.addClass('dialog-overlay-visible');
            $modal.addClass('dialog-in');
        },

        _position : function () {
            //计算$modal的高度，需要做位置改变
            var height = parseInt($modal.height())/2;
            $modal.css('marginTop', '-' + height + 'px');
        },

        alert : function (msg, callback) {
            var me = this,
                $modalAlert = $('<div class="dialog-inner"></div>');

            me._initModal();

            //title and msg
            var msgBody = msg,
                msgTitle = '温馨提示';
            if(typeof msg === "object" && msg.title){
                msgBody = msg.body || '';
                msgTitle = msg.title;
            }

            var $title = $('<div class="dialog-title">'+msgTitle+'</div>'),
                $body = $('<div class="dialog-text">'+msgBody+'</div>');
            $modalAlert.append($title);
            $modalAlert.append($body);

            $modal.append($modalAlert);

            //footer
            var $footer = $('<div class="dialog-buttons"></div>'),
                $close = $('<span class="dialog-button dialog-button-bold">确定</span>');

            $footer.append($close);
            $modal.append($footer);

            $close.on('click', function(){
                me.hide();
                callback && callback();
            });

            //计算$modal的高度，需要做位置改变
            me._position();

            me.show();
        },

        confirm : function (msg, okCallback, cancelCallBack) {
            var me = this,
                $modalConfirm = $('<div class="dialog-inner"></div>');

            me._initModal();

            me._initEvent();

            //title and msg
            var option = {
                title: '温馨提示',
                body: (typeof msg === 'object') ? '' : msg,
                okText: '确定',
                cancelText: '取消'
            };

            if(typeof msg === 'object'){
                option = $.extend(option, msg);
            };

            var $title = $('<div class="dialog-title">'+ option.title +'</div>'),
                $body = $('<div class="dialog-text">'+option.body+'</div>');
            $modalConfirm.append($title);
            $modalConfirm.append($body);

            $modal.append($modalConfirm);

            //footer
            var $footer = $('<div class="dialog-buttons"></div>'),
                $cancel = $('<span class="dialog-button">'+ option.cancelText +'</span>');
                $close = $('<span class="dialog-button dialog-button-bold">'+ option.okText +'</span>');

            $footer.append($cancel);
            $footer.append($close);
            $modal.append($footer);

            $cancel.on('click', function(){
                me.hide();
                cancelCallBack && cancelCallBack();
            });

            $close.on('click', function(){
                me.hide();
                okCallback && okCallback();
            });


            //计算$modal的高度，需要做位置改变
            me._position();

            me.show();
        }

    };

});
