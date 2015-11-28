define(function(require, exports, module) {

    return {

        /**
         * __WPO上报
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        _report : function (data) {
            typeof(__WPO) !== 'undefined' && __WPO.retCode(data.api, data.type, data.delay, data.msg);

        },

        get : function (url, callback, timeout) {
            var self = this,
                isSuc = false,
                start = new Date().getTime();

            var callbackName = 'callback';

            if(typeof(url) !== 'string') {
                callbackName = url.cbName || '_callback';
                url = url.url;
            }

            timeout = timeout || 3000; //默认的超时时间是3s

            var timeoutId = window.setTimeout(function(){
                if(isSuc == false) {
                    window.clearTimeout(timeoutId);
                    self._report({
                        type: false,
                        delay: timeout,
                        api: url,
                        msg: '接口超时'
                    });
                }
            }, timeout);

            var jsonp = 'jp'+( new Date().getTime()),
                script = document.createElement('script');

            script.type = 'text/javascript';
            script.src = url + (url.match(/\?/) ? '&' : '?') + callbackName + '='+jsonp;

            //在服务器端我们生成的代码 如callbackname(data);形式传入data.
            window[jsonp] = function (tmp) {
                isSuc = true; //设置为成功
                if(timeoutId) window.clearTimeout(timeoutId);

                callback(tmp);

                //__WPO上报
                self._report({
                    type: true,
                    delay: new Date().getTime() - start,
                    api: url,
                    msg: 0
                });

                //垃圾回收,释放变量，删除jsonp的对象，除去head中加的script元素
                window[jsonp] = null;
                try { delete window[jsonp]; } catch (e) {}
                document.getElementsByTagName('head')[0].removeChild(script);//解决IE6的bug
            };
            //捕获出错
            if( typeof script.onreadystatechange != 'undefined' ) {
                //ie，opera
                script.onload = script.onreadystatechange = function(){
                    if(/loaded|complete/i.test(this.readyState)){
                        window.clearTimeout(timeoutId);
                        //延迟2s检查执行结果,判断后台是否挂了
                        var tid = window.setTimeout(function(){
                            if(isSuc == false) {
                                window.clearTimeout(tid);
                                //__WPO上报
                                self._report({
                                    type: false,
                                    delay: new Date().getTime() - start,
                                    api: url,
                                    msg: '接口异常'
                                });
                            }
                        },2000);
                    }
                };
            }
            else if( typeof script.onerror != 'undefined' ) {
                //非IE
                script.onerror = function(){
                    window.clearTimeout(timeoutId);
                    //__WPO上报
                    self._report({
                        type: false,
                        delay: new Date().getTime() - start,
                        api: url,
                        msg: '接口异常'
                    });
                };
            }

            //在head之后添加js文件
            document.getElementsByTagName('head')[0].appendChild(script);

        }

    };

});
