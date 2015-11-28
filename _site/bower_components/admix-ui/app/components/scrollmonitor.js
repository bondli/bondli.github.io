define(function(require, exports, module) {

    return {
        /**
         * 初始化组件
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        init : function (options) {
            var self = this,
                $el = $('body'),
                _empty = function(){};

            this.winHeight = window.innerHeight;

            //节流timer
            this.moveTimer = null;

            //回调函数是否正在加载
            this._loadingTop = false;
            this._loadingBottom = false;

            //是否被设置不可用
            this._enabledTop = true;
            this._enabledBottom = true;

            //传递上拉和下拉函数到组件中
            this._scrollToBottomHandler = options.scrollToBottom ? options.scrollToBottom : _empty;
            this._scrollToTopHandler = options.scrollToTop ? options.scrollToTop : _empty;

            //传递滚动事件函数
            this._scrollMore10pxHandler = options.scrollEvent ? options.scrollEvent : _empty;

            //开始监控
            $el.on('touchstart touchmove', function(e){

                switch (e.type) {
                    case 'touchstart':
                        self._startHandler(e);
                        break;
                    case 'touchmove':
                        self._moveHandler(e);
                        break;
                }

            });
        },

        /**
         * 开始滚动事件
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        _startHandler : function (e) {
            //console.log('start move');
            this._startY = e.touches[0].pageY;
        },

        /**
         * 滚动事件
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        _moveHandler : function (e) {
            //console.log('moving');
            var self = this,
                startY = self._startY,
                movedY = startY - e.touches[0].pageY;

            //如果上一次触发的事件还没有完成，或者移动小于10px就不响应移动事件了
            if ( Math.abs(movedY) < 10 ||
                ( self._loadingTop && movedY < 0) ||
                ( self._loadingBottom && movedY > 0) ) {
                return;
            }

            if (self.moveTimer) {
                return;
            }
            //连续2次的move间隔是200毫秒
            self.moveTimer = setTimeout(function(){

                var pageHeight = document.body.scrollHeight,
                    scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

                //console.log('page height:',pageHeight, 'scrollTop:',scrollTop);

                //fix 三星手机下总是相差1px才触底的问题，反应很难触发触底时间，调整为10px
                var plus1px = 10;

                //触底了
                if ( self._enabledBottom && movedY > 10 && (plus1px + scrollTop + self.winHeight >= pageHeight) ) {
                    self._loadingBottom = true;
                    self._scrollToBottomHandler();
                    //辅组功能：帮用户滚动到底部，能看到loading或者数据，50是loading的高度
                    $(window).scrollTop(scrollTop + 50);
                }

                //达到了顶部
                else if( self._enabledTop && movedY < -10 && scrollTop <= 0 ){
                    self._loadingTop = true;
                    self._scrollToTopHandler();
                }

                else if(movedY > 10 || movedY < -10){
                    self._scrollMore10pxHandler(movedY);
                }

                self.moveTimer = null;
                clearTimeout(self.moveTimer);

            }, 200);

        },


        /**
         * 外部调用，通知组件，触发的函数执行完成了
         * @return {[type]} [description]
         */
        after : function (pos) {
            if(pos == 'top'){
                this._loadingTop = false;
            }
            else{
                this._loadingBottom = false;
            }

        },

        /**
         * 停掉监控事件
         * @return {[type]} [description]
         */
        stop : function (pos) {
            if(pos == 'top'){
                this._loadingTop = false;
                this._enabledTop = false;
            }
            else{
                this._loadingBottom = false;
                this._enabledBottom = false;
            }

        },

        /**
         * 重启监控事件
         * @param  {[type]} pos [description]
         * @return {[type]}     [description]
         */
        reopen : function (pos) {
            if(typeof(pos) === 'undefined'){
                this._enabledTop = true;
                this._enabledBottom = true;
            }
            else if(pos == 'top'){
                this._enabledTop = true;
            }
            else{
                this._enabledBottom = true;
            }

        }
    };

});
