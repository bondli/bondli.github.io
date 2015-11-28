define(function(require, exports, module) {

    var Dialog = require('../components/dialog');


    $('.modal-alert').tap(function(){
        Dialog.alert('你没有权限执行下架！');
    });

    $('.modal-confirm').tap(function(){
        Dialog.confirm({'title':'删除提示：','body':'你确定要删除该记录?'}, function(){
            alert('Great!');
        });
    });

});
