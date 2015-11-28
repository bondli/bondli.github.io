define(function(require, exports, module) {

    return {
        /**
         * 调用支付宝支付窗口
         * @param orderId 订单号
         * @param signStr 订单签名信息
         * @param succCallBack 成功时 回调函数
         * @param succCallBack 取消或者失败时 回调函数
         */
        openPayWindow : function (signStr,callback) {

            //订单参数
            var param = JSON.stringify({orderInfo:signStr});

            //调用windVane支付接口
            window.WindVane.call('TBMiaojie', 'pay', param, function(result) {

                var data = JSON.parse(result.data);

                //支付宝返回支付成功
                if (data && data.ResultStatus == '9000') {
                    callback && callback('PAY_SUCCESS', result);
                }
                //用户取消支付或者支付错误，停止计时器，跳转到失败页面
                else if (data.ResultStatus == '6001' || data.ResultStatus == '4000') {
                    callback && callback('PAY_FAIL', result);
                }

            }, function(result) {

                callback && callback('PAY_FAIL', result);

            });

        }

    };

});
