define(function(require, exports, module) {
    var console = require('../components/console');
    var Base = require('../components/base');

    console.log('你当前所在的APP：' + Base.getApp());
    console.log('页面开始时间：', g_start.getTime());
    console.log('模块开始时间：', g_mstart.getTime());
    console.log('模块完成时间：', (new Date()).getTime());

    var toast = require('../components/toast');
    toast.show();

    var datetime = require('../components/datetime');

    console.log('当前时间：'+datetime.formatDate('yyyy-M-dd HH:mm:ss'));

    var countlen = require('../components/countlen');

    console.log(countlen('中国人123'));

    $('h1').html('你当前所在的APP：' + Base.getApp());
    $('h2').html('页面开始时间：' + datetime.formatDate('yyyy-M-dd HH:mm:ss',g_start));
    $('h3').html('模块开始时间：' + datetime.formatDate('yyyy-M-dd HH:mm:ss',g_mstart));
    $('h4').html('模块完成时间：' + datetime.formatDate('yyyy-M-dd HH:mm:ss'));
    $('h5').html('需要统计字符长度的字符串：中国人123');
    $('h6').html('字符统计长度结果：' + countlen('中国人123'));
});
