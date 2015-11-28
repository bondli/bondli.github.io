define(function(require, exports, module) {

    var xhr = new window.XMLHttpRequest();
    var empty = function() {};

    /**
     * __WPO上报
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    var _report = function (data) {
        typeof(__WPO) !== 'undefined' && __WPO.retCode(data.api, data.type, data.delay, data.msg);

    };

    return function(options, sucCb, failCb) {
        var abortTimeout;
        var start = +new Date();

        options = $.extend({
            url: '',
            timeout: 3000,
            type: 'GET',
            dataType: 'json',
            cache: true
        }, options || (options = {}));

        var protocol = /^([\w-]+:)\/\//.test(options.url) ? RegExp.$1 : window.location.protocol;

        xhr.onreadystatechange = function(){
            if ( xhr.readyState == 4 ) {
                xhr.onreadystatechange = empty;
                clearTimeout(abortTimeout);

                var result, error = false;

                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    result = xhr.responseText;

                    try {
                        if (options.dataType == 'xml') {
                            result = xhr.responseXML;
                        }
                        else if (options.dataType == 'json') {
                            result = /^\s*$/.test(result) ? null : JSON.parse(result);
                        }
                    } catch (e) {
                        error = e;
                    }

                    if (error) {
                        failCb(error, 'parsererror', xhr);
                        _report({
                            type: false,
                            delay: new Date() - start,
                            api: options.url,
                            msg: JSON.stringify(error)
                        });
                    }
                    else {
                        sucCb(result, xhr);
                        _report({
                            type: true,
                            delay: new Date() - start,
                            api: options.url,
                            msg: 0
                        });
                    }
                } else {
                    failCb(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr);
                    _report({
                        type: false,
                        delay: new Date() - start,
                        api: options.url,
                        msg: '接口返回异常'
                    });
                }
            }
        };

        //get方式，把数据拼接URL
        if (options.data && options.type.toUpperCase() === 'GET') {
            var tmp = [];
            for(var i in options.data){
                tmp.push( i + '=' + encodeURIComponent(options.data[i]) );
            }
            options.url += ( (options.url).indexOf('?')>-1 ? '&' : '?' ) + tmp.join('&');
        }

        var async = 'async' in options ? options.async : true;
        xhr.open(options.type, options.url, async, options.username, options.password);

        if(options.data && options.type.toUpperCase() !== 'GET'){
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        if (options.timeout > 0) {
            abortTimeout = setTimeout(function(){
                xhr.onreadystatechange = empty;
                xhr.abort();
                failCb(null, 'timeout', xhr);
                _report({
                    type: false,
                    delay: new Date() - start,
                    api: options.url,
                    msg: '接口超时'
                });
            }, options.timeout);
        }

        xhr.send(options.data ? options.data : null);

    };

});
