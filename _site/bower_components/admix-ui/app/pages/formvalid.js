define(function(require, exports, module) {

    var FormValid = require('../components/formvalid');
    var toast = require('../components/toast');

    var fv = new FormValid({
        handAllResult: function(errors){
            console.log(errors);
            if(errors.length){
                toast.show(errors[0].msg);
            }
        },
        handFieldResult: function(elem, msg, isShow){
            isShow && console.log(msg);
        }
    });

    $('#save').tap(function(){
        var b = fv.checkAll();
        if(!b){
            //toast.show('表单验证不通过');
            return;
        }
        else{
            toast.show('表单验证通过');
        }
    });

});
