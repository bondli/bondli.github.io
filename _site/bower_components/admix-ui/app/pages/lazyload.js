define(function(require, exports, module) {
    // 通过 require 引入依赖
    var lazyload = require('../components/lazyload');

    lazyload('.media-object', {attr: 'data-src'});

});
