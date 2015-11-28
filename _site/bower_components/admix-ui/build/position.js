define(function(require, exports, module) {
    var ua = window.navigator.userAgent;

    var getApp = (function () {
        var s = /AliApp\(([A-Z\-]+)\/([\d\.]+)\)/i.exec(ua),
            name = (s && s[1]) ? s[1] : 'unknown';

        if(name.indexOf('TB') > -1){ //TBIOS TB-PAD
            return 'TB';
        }
        return name.toUpperCase();
    })();

    var isTaobao = getApp == 'TB' || getApp == 'ShoppingStreet' || getApp == 'ShoppingManagement',
        isAlipay = getApp == 'AP';

    return {

        /**
         * 获取地理位置
         * @param  {Function} callback 获取成功/失败的回调函数
         */
        fetch : function (callback) {
            if(isTaobao || window.WindVane) {
                var n = {
                    enableHighAcuracy: true,
                    address: true
                };
                window.WindVane.call('WVLocation', 'getLocation', n, function(e) {
                    callback(e);//将e.coords调整为e，满足通用需求
                }, function(e) {
                    //定位失败后把错误信息也传递到回调函数中捕获
                    callback(e);
                });
            }
            else if(isAlipay){  //支付宝
                document.addEventListener('AlipayJSBridgeReady', function () {
                    AlipayJSBridge.call('getLocation', function (result) {
                        if (result.error || !result.longitude) { //定位失败
                            //定位失败后返回空值
                            callback();
                        }
                        else {  //定位成功
                            callback(result);
                        }
                    });
                });
            }
            else{
                //浏览器定位会有提示用户，所以这里不处理中，业务代码中支持取默认值即可
                callback();
            }
        }

    };
});
