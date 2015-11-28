define(function(require, exports, module) {
    var toast = require('../components/toast');

    $('#show').click(function(){
        toast.show('后台返回错误，请稍后再试');
    });
});
