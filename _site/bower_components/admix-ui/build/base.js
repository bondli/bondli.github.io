define(function(require, exports, module) {
    var ua = window.navigator.userAgent;

    return {
        /**
         * 获取页面运行在的APP名称
         * @return {String} TB:手淘, AP:支付宝, QN:千牛, WX:旺信, LW:来往
         */
        getApp : function () {
            var s = /AliApp\(([A-Z\-]+)\/([\d\.]+)\)/i.exec(ua),
                name = (s && s[1]) ? s[1] : 'unknown';

            if(name.indexOf('TB') > -1){ //TBIOS TB-PAD
                return 'TB';
            }
            return name.toUpperCase();
        },

        /**
         * 获取喵街版本号
         * @return {[type]} [description]
         */
        getAppVersion: function() {
            var r = ua.match(/(AliApp\()(ShoppingStreets|taojie)\/([\d.]+)/);

            if(r != null && r[3]) {
                return parseInt(r[3].replace(/\./g, ''));
            }

            return 0;
        },

        /**
         * 当前环境是否日常
         * @return {Boolean} [description]
         */
        isDaily : function () {
            var l = window.location;

            if ( ~l.hostname.indexOf('waptest.taobao.com') ||
                 ~l.hostname.indexOf('daily.taobao.net') ) {
                return true;
            }
            return false;
        },

        /**
         * 获取URL参数
         * @param  {String} name 参数名
         * @return {String} 参数值
         */
        getUrlParam : function (name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = decodeURIComponent(window.location.search.substr(1)).match(reg);
            if (r!=null) return unescape(r[2]); return null;
        },

        /**
         * 首字母大写
         * @param  {String} word 传入的单词
         * @return {String}      [description]
         */
        ucwords : function (word) {
            return word.substring(0,1).toUpperCase() + word.substring(1);
        },

        /**
         * 格式化时间
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        formatDate : function (date) {
            if(typeof date === 'string'){
                date = this.strToDate(date);
            }
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();

            if(month < 10){
                month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }
            return year + '-' + month + '-' + day;
        },

        /**
         * 字符串格式转时间
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         */
        strToDate : function (str) {
            var newStr = str.replace(/-/g,'/');
            return new Date(newStr);
        },

        /**
         * 数字格式化显示
         * @param  {[type]} s [数字]
         * @param  {[type]} n [保留小数点后n位]
         * @return {[type]}   [1234.567 => 1,234.56]
         */
        fmoney : function (s, n) {
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
            var l = s.split('.')[0].split('').reverse(), r = s.split(".")[1],
                t = "";

            for (i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
            }
            return t.split('').reverse().join('') + '.' + r;
        },

        /**
         * 设置页面标题
         * @param {[type]} s [description]
         */
        setDocTitle : function (s) {
            document.title = s;

            if(typeof(TOP) != 'undefined'){ //千牛中有方法
                TOP.mobile.vpage.title(s);
            }
            else if(this.isMiaojie()){
                window.WindVane && window.WindVane.call('TBMiaojie', 'setTitle', {
                    title: s
                }, function(e) {

                });
            }
        },

        /**
         * 获取网络状态是否良好
         * @return {[type]} [description]
         */
        getNetworkState : function () {
            var timingTime = 150;
            //默认网络状况不好
            var isGoodState = false;

            if(window.performance){
                var timing = window.performance.timing;
                var time = timing.responseEnd - timing.domainLookupStart; //从请求发起到返回的时间
                isGoodState = time > timingTime ? false : true;   //(本地pc10~ms   chorme network 模拟效果3g 100~ 图片加载比较流畅 edge 250 300~ 图片不流畅)
            }

            return isGoodState;
        },

        /**
         * 图片优化
         * @param  {[type]} originImgUrl [原始url]
         * @param  {[type]} width        [期望宽度]
         * @return {[type]}              [优化后的url]
         */
        imgPixel: function (originImgUrl, width) {

            var regExp = /.jpg|.png|.bmp|.jpeg|.gif/g;
            var res = (typeof originImgUrl == 'string') ? originImgUrl.match(regExp) : [];
            //已经优化过，可以从url中匹配到两次
            if(res.length>=2){
                return originImgUrl;
            }else{
                var size = 'q75.jpg';
                var suffix = width ? ("_" + width + "x" + width + size) : "_"+size;
                return originImgUrl + suffix;
            }

            var suffix = width ? ('_' + width + "x" + width) : '';
            return originImgUrl + suffix;
        },

        /**
         * 隐藏键盘
         * @return {[type]} [description]
         */
        hideKeyboard: function () {
            var $a = $('<a style="width: 0;height: 0;font-size: 0;display: block"></a>');
            $('body').append($a);
            $a.focus();
            setTimeout(function(){
                $a.remove();
            }, 0);
        },

        /**
         * 判断是否IOS操作系统，判断android也可以采用这个方法
         * @return {Boolean} [description]
         */
        isIOS : function() {
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
         * 是否android系统
         * @return {Boolean} [description]
         */
        isAndroid: function() {
            return ua.indexOf('Android') > -1;
        },

        /**
         * 判断是否微信
         * @return {Boolean} [description]
         */
        isWeixin: function() {
            return ua.indexOf('MicroMessenger') > -1;
        },

        /**
         * 判断是否喵街
         * @return {Boolean} [description]
         */
        isMiaojie: function() {
            return (ua.indexOf('taojie') > -1 || ua.indexOf('ShoppingStreet') > -1);
        }

    };
});
