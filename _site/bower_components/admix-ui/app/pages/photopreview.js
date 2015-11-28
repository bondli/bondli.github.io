define(function(require, exports, module) {
    var photo = require('../components/photopreview');

    var demoPhotoUrl = 'http://img04.config-vip.taobaocdn.net/imgextra/i4/3640992416/TB2VNJXXXXXXXXGXXXXXXXXXXXX_!!3640992416-0-circles_B2C.jpg';

    photo.init('#photopreview', 5, function(){
        alert('todo:添加图片动作');
    });

    photo.set([demoPhotoUrl]);

    $('#show').tap(function(){
        photo.show([
            demoPhotoUrl,
            demoPhotoUrl,
            demoPhotoUrl
        ],1);
    });

    $('#add').tap(function(){
        photo.add(demoPhotoUrl);
    });

});
