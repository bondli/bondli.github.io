define(function(require, exports, module) {

    var scrape = require('../components/scrape');

    //模拟初始化
    var initDraw = function () {
        return {
            status : true,
            msg : 'ok'
        };
        /*return {
            status : false,
            msg : '没有抽奖资格了'
        };*/
    };

    //模拟抽奖
    var requestDraw = function () {
        //未中奖
        return {
            status : true,
            isAward : false,
            leftTime : 0
        };
        /*中奖：return {
            status : true,
            isAward : true,
            prizeType : 1,
            prizeName : "元宝8个",
            viewUrl : "http://www.baidu.com",
            leftTime : 0
        };*/
    };

    scrape.init({
        startBtnTxt : "开始刮奖",
        restartBtnTxt : "再刮一次",
        noAwardTxt : "很抱歉，你没有中奖",
        guideStartTxt : "开始刮刮",
        el : "#mycard",
        coverColor : "#BEBFBE",
        initFn : function(callback){ //初始化接口
            var flag = initDraw();
            callback && callback(flag);
        },
        drawFn : function(callback){ //抽奖接口
            var flag = requestDraw();
            if(flag.status == false) {
                alert(flag.msg);
            }
            callback && callback(flag);
        }
    });

});
