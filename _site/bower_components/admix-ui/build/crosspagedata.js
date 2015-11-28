define(function(require, exports, module) {
    //千牛app
    var TOP = window.TOP || {},
    isAppQ = TOP && TOP.mobile && TOP.mobile.ua && TOP.mobile.ua.isInQianniu,
    application = isAppQ ? TOP.mobile.application : null,

    $win = $(window);

    return {

        /**
         * 打开窗口并监听回调
         * @param  {[type]} url [description]
         * @param  {[type]} suc [description]
         * @param  {[type]} err [description]
         * @return {[type]}     [description]
         */
        openAndListen: function(url, suc, err){
            if(isAppQ){
                application.request({
                    event: 'openWindow',
                    biz: {
                        url: url || ''
                    },
                    success: function(result) {
                        var result = typeof result === 'string' ? JSON.parse(result) || {} : result || {};
                        suc && suc(result.result || {});
                    },
                    error: function(result) {
                        var result = typeof result === 'string' ? JSON.parse(result) || {} : result || {};
                        err && err(result.result || {});
                    }
                });
            }
            else{
                window.open(url);
                //监听消息
                $win.off('message').on('message',function(res){
                    suc && suc(res.data || {});
                })
            }

        },

        /**
         * 关闭窗口
         * @return {[type]} [description]
         */
        close : function(){
            if(isAppQ){
                TOP.mobile.vpage.close();
            }else{
                window.close();
            }

        },

        /**
         * 子页面向父页面传替数据
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        postMessageToParent : function(data){
            var data = data || {};
            if(isAppQ){
                application.response({
                    "result": data
                });
            }
            else if(window.opener){
                window.opener.postMessage(data,'*');
            }

        }
    }
});