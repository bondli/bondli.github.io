define(function(require, exports, module) {

    var monitor = require('../components/scrollmonitor');

    monitor.init({
        'scrollToBottom': function(){
            //出现加载提示
            console.log('atBottom');
            //加载数据
            monitor.after();
            //如果没有了就调用stop方法停止监控
            //monitor.stop();
            $('#bottom').html('触底了');
            setTimeout(function(){
                $('#bottom').html('');
            },3000);
        },
        'scrollToTop': function(){
            //出现加载提示
            console.log('atTop');
            //加载数据
            monitor.after('top');
            //如果没有了就调用stop方法停止监控
            //monitor.stop('top');
            $('#top').html('触顶了');
            setTimeout(function(){
                $('#top').html('');
            },3000);
        }
    });


});
