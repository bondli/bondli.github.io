define(function(require, exports, module) {

    var actionsheet = require('../components/actionsheet');

    $('.confirm-show').tap(function(){
        actionsheet.show({
            title: '你将删除改记录，删除后无法恢复',
            list: [
                {
                    "name" : "确认删除",
                    "callback" : function(){
                        alert(1);
                    }
                },
            ],
            cancelWord: '取消'
        });
    });

});
