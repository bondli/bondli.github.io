define(function(require, exports, module) {

	var isWeixin = window.navigator.userAgent.indexOf('MicroMessenger') > -1;

	function DownloadBar (options) {
        var defaults = {
            renderTo: 'body',           //加载到的dom
            mainCont: '.page-content',  //主页面dom，用来计算页面高度的
            callback: function() {}     //点击事件
        };

        $.extend(defaults, options || {});

        this.$renderTo = $(defaults.renderTo);

        if(!defaults.renderTo && this.$renderTo.length === 0){
            console.log('downloadbar要渲染的dom对象不存在');
            return;
        }

        this.$el = $('<div id="download-bar"></div>');
        this.$elText = $('<span>下载<b style="font-weight:400;color:#fff;font-size:18px;">喵街</b>参与活动</span>').appendTo(this.$el);
        this.$elBtn = $('<a id="download-btn" href="javascript:;">立即下载</a>').appendTo(this.$el);

        //定义各个dom的样式
        this.$el.css({
            'display': 'none',
            'zIndex': 16,
            'width': '100%',
            'height': '50px',
            'background': '#000'
        });
        this.$elText.css({
            'color': '#d4d4d4',
            'font-size': '16px',
            'float': 'left',
            'height': '50px',
            'line-height': '50px',
            'marginLeft': '15px'
        });
        this.$elBtn.css({
            'float': 'right',
            'width': '130px',
            'height': '30px',
            'line-height': '30px',
            'margin': '10px',
            'background': '#eb4643',
            'borderRadius': '3px',
            'color': '#fff',
            'text-align': 'center',
            'text-decoration': 'none'
        });

        //追加到指定的dom中
        this.$el.appendTo(this.$renderTo);

        //展示到指定的位置
        if (isWeixin) {
            var pageHeight = $(defaults.mainCont).height();
            var mgHeight = $(window).height() - pageHeight - 50;
            this.$el.css('marginTop', mgHeight < 0 ? 0 : mgHeight+'px');
        }
        else {
            this.$el.css({
                position : 'fixed',
                bottom : '-1px'
            });
            $('body').css({
                paddingBottom: '50px'
            });
        }

        this.$el.show();

        //绑定点击事件
        this.$el.on('click', function(e){
            e.preventDefault();
            //如果是微信，直接跳转到应用宝
            if(isWeixin){
                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.taobao.shoppingstreets';
            }
            else {
                defaults.callback && (defaults.callback)();
            }

        });

        if (typeof DownloadBar._initialized === 'undefined') {
            //原型方法这里定义
            DownloadBar._initialized = true;
        }

    };

    return DownloadBar;

});
