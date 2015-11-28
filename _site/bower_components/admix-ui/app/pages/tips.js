define(function(require, exports, module) {
    var tips = require('../components/tips');

    $('#showOk').tap(function(){
        tips.show({
            type: 'success',
            title: '提交成功',
            text: '你的信息已提交，等待管理员审核'
        });
    });

    $('#showWarn').tap(function(){
        tips.show({
            type: 'warn',
            title: '提交失败',
            text: '系统很忙，小二很累，请稍后'
        });
    });

    $('#showErr').tap(function(){
        tips.show({
            type: 'error',
            title: '提交失败',
            text: '系统很忙，小二很累，请稍后'
        });
    });
});
