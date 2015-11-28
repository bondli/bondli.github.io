define(function(require, exports, module) {

    //定义需要操作的dom
    var $body = $('body'),
        $wxWrapper = $('<div class="wx-wrapper" style="display: none;"></div>'),
        $wxOverlay = $('<div class="wx-overlay"></div>'),
        $wxTips = $('<div class="wx-tips"></div>'),
        $wxClose = $('<div class="close">关闭</div>');

    return {

        isInited : false,

        _initModal : function (msg) {
            msg = msg || '下载和打开喵街被微信屏蔽了！';

            $wxWrapper.append($wxOverlay);
            $wxWrapper.append($wxTips);

            $wxTips.append('<h3>'+msg+'</h3>');
            $wxTips.append('<p>1、点击右上角菜单。</p><p>2、选择【浏览器】打开，再下载。</p>');
            $wxTips.append($wxClose);

            $body.append($wxWrapper);

            this.isInited = true;
        },

        _initEvent : function () {
            var me = this;
            $wxClose.on('touchend', function(e){
                e.preventDefault();
                me.hide();
            });

        },

        hide : function () {
            $wxWrapper.hide();
        },

        show : function (msg) {
            if( !this.isInited ){
                this._initModal(msg);
                this._initEvent();
            }
            $wxWrapper.show();
        }

    };

});
