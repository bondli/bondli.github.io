define(function(require, exports, module) {

    return {
        /**
         * 唤起锁
         * @type {Boolean}
         */
        locked: false,

        /**
         * 是否android系统
         * @return {Boolean} [description]
         */
        isAndroid : function () {
            return window.navigator.userAgent.indexOf('Android') > -1;
        },

        /**
         * 是否IOS系统
         * @return {Boolean} [description]
         */
        isIOS : function () {
            var ua = navigator.userAgent;
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

            if (ipad || iphone || ipod) {
                return true;
            }
            else{
                return false;
            }

        },

        /**
         * 判断是否三星手机
         * @return {Boolean} [description]
         */
        isSamsung : function () {
            var ua = (window.navigator.userAgent).toLowerCase();
            return ua.indexOf('samsung') > -1 ||
                ua.indexOf('sm-') > -1 || ua.indexOf('gt-') > -1;
        },

        /**
         * 尝试唤起app,失败后转向下载地址
         * @param  {[type]} nativeUrl   [description]
         * @param  {[type]} downloadUrl [description]
         * @return {[type]}             [description]
         */
        openApp : function (nativeUrl, downloadUrl) {
            // 唤起锁定，避免重复唤起
            if (this.locked) {
                return;
            }
            this.locked = true;

            var startTime = new Date().valueOf();

            var appleOS = this.isIOS();

            if(this.isSamsung()){
                var nativeUrlArr = nativeUrl.split('://');
                var scheme = nativeUrlArr[0];
                nativeUrl = nativeUrl + '#Intent;scheme=' + scheme + ';package=com.taobao.shoppingstreets;end';

                setTimeout(function(){
                    window.location.replace(nativeUrl);
                },100);
            }
            else{
                var iframe = document.createElement('iframe');
                iframe.id = 'J_RedirectNativeFrame';
                iframe.style.display = 'none';
                iframe.src = nativeUrl;
                //运行在head中
                if (!document.body) {
                    setTimeout(function () {
                        document.body.appendChild(iframe);
                    }, 0);
                } else {
                    document.body.appendChild(iframe);
                }
            }


            //网页进入后台后会挂起js 的执行，但是这个期间有600-1000ms的时间js仍然会执行
            setTimeout(function () {
                if (new Date().valueOf() - startTime < 2000) {
                    setTimeout(function(){
                        document.location.href = downloadUrl;
                    }, 200);
                }
            }, (appleOS) ? 800 : 1500);

            //释放按钮，可以继续点击
            var self = this;
            setTimeout(function () {
                self.locked = false;
            }, 2000);

        },

        /**
         * 下载功能（包含唤起）
         * @param  {[type]} aUrl [description]
         * @param  {[type]} iUrl [description]
         * @param  {[type]} nUrl [description]
         * @return {[type]}      [description]
         */
        download : function(aUrl, iUrl, nUrl) {
            var url = aUrl; //android下载地址
            if (this.isIOS()) {
                url = iUrl; //ios下载地址
            }

            this.openApp(nUrl, url);

        }
    };

});
