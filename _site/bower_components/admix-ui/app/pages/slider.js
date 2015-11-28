define(function(require, exports, module) {
    var Slider = require('../components/slider');

    var sd = new Slider({
        renderTo: '#slider',
        data: [
            {'img': 'http://gtms01.alicdn.com/tps/i1/TB15zO3GVXXXXXWXXXXSutbFXXX.jpg_q50','text':'1', 'href':'http://url.cn/asdss'},
            {'img': 'http://gtms01.alicdn.com/tps/i1/TB1REgFGVXXXXXyaXXXSutbFXXX.jpg_q50','text':'2', 'href':'http://url.cn/asdss'},
            {'img': 'http://gtms02.alicdn.com/tps/i2/TB15pL6GVXXXXaDXFXXSutbFXXX.jpg_q50','text':'3', 'href':'http://url.cn/asdss'},
            {'img': 'http://gtms01.alicdn.com/tps/i1/TB15zO3GVXXXXXWXXXXSutbFXXX.jpg_q50','text':'4', 'href':'http://url.cn/asdss'},
            {'img': 'http://gtms01.alicdn.com/tps/i1/TB1REgFGVXXXXXyaXXXSutbFXXX.jpg_q50','text':'5', 'href':'http://url.cn/asdss'}
        ],
        isAuto: false
    });

    sd.init();

    var sd2 = new Slider({
        renderTo: '#slider2',
        data: [
            {'img': 'http://gtms01.alicdn.com/tps/i1/TB15zO3GVXXXXXWXXXXSutbFXXX.jpg_q50','text':'1', 'href':'http://url.cn/asdss'},
            {'img': 'http://gtms01.alicdn.com/tps/i1/TB1REgFGVXXXXXyaXXXSutbFXXX.jpg_q50','text':'2', 'href':'http://url.cn/asdss'},
            {'img': 'http://gtms02.alicdn.com/tps/i2/TB15pL6GVXXXXaDXFXXSutbFXXX.jpg_q50','text':'3', 'href':'http://url.cn/asdss'},
            {'img': 'http://gtms01.alicdn.com/tps/i1/TB15zO3GVXXXXXWXXXXSutbFXXX.jpg_q50','text':'4', 'href':'http://url.cn/asdss'},
            {'img': 'http://gtms01.alicdn.com/tps/i1/TB1REgFGVXXXXXyaXXXSutbFXXX.jpg_q50','text':'5', 'href':'http://url.cn/asdss'}
        ],
        isAuto: true,
        interval: 2000
    });

    sd2.init();
});
