define(function(require, exports, module) {

    //定义需要操作的dom
    var $body = $('body'),
        $overlay = $('<div class="dialog-overlay"></div>'),
        $modal = $('<div class="actions-dialog" style="display:none"></div>');

    //为了解决三星下的bug,先隐藏，点击的时候通过setTimeout来还原原来的动画效果

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

            $modal.children().remove();

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

            $('.actions-dialog-button-bold').one('touchend', function(e){
                e.preventDefault();
                me._stopEventTap();
                me.hide();
            });

        },

        _setData : function ( data ) {
            var me = this,
                $modalGroupMain = $('<div class="actions-dialog-group"></div>');

            //title
            if(data && data.title){
                var $title = $('<span class="actions-dialog-label">'+data.title+'</span>');
                $modalGroupMain.append($title);
            }

            //btns
            if(data && data.list){ //菜单
                var list = data.list;

                for(var i in list){
                    var $btn = $('<span class="actions-dialog-button">'+list[i].name+'</span>');
                    $modalGroupMain.append($btn);

                    //经典的闭包实例
                    var func = (function(f){
                        return function(){
                            me.hide();
                            return f && f();
                        };
                    })(list[i].callback);

                    //绑定按钮点击事件
                    $btn.on('click',func);
                }
            }
            else{
                console.log('confirm component inited error');
            }

            $modal.append($modalGroupMain);

            //cancel btn
            var $modalGroupCancel = $('<div class="actions-dialog-group"></div>'),
                $cancelBtn;
            if(data && data.cancelWord){
                $cancelBtn = $('<span class="actions-dialog-button actions-dialog-button-bold">'+data.cancelWord+'</span>');
            }
            else{
                $cancelBtn = $('<span class="actions-dialog-button actions-dialog-button-bold">取消</span>');
            }
            $modalGroupCancel.append($cancelBtn);
            $modal.append($modalGroupCancel);

            /*/定义cancel按钮事件
            $cancelBtn.on('click', function(){
                me.hide();
            });*/
        },

        hide : function () {
            $overlay.removeClass('dialog-overlay-visible');
            $modal.addClass('dialog-out');
            $modal.removeClass('dialog-in');
            setTimeout(function(){
                $overlay.remove();
                $modal.remove();
            },200);

        },

        show : function ( data ) {
            this._initModal();
            this._setData(data);

            $modal.css({'marginTop':'-102px','display':'block'});
            setTimeout(function(){
                $overlay.addClass('dialog-overlay-visible');
                $modal.addClass('dialog-in');
                $modal.removeClass('dialog-out');
            },50);

            this._initEvent();

        }

    };

});
