define(function(require, exports, module) {
    // 通过 require 引入依赖
    var loading = require('../components/loading');

    $('#show1').tap(function(){
        loading.show();
        setTimeout(function(){
            loading.hide();
        }, 5000);
    });

    $('#show2').tap(function(){
        loading.show({
            renderTo : '#loading'
        });

        /*setTimeout(function(){
            loading.hide();
        }, 5000);*/
    });

    console.log('page inited');

});
