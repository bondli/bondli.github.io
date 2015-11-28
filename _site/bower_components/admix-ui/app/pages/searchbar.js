define(function(require, exports, module) {
    var Searchbar = require('../components/searchbar');

    var sb = new Searchbar({
        renderTo: '#searchbar',
        placeholder: '订单编号',
        name: 'abc',
        action: 'abc.html',
        data: 'abc',
        isShow: false,
        onsubmit: function(){
            alert(sb.getData());
            return false;
        }
    });

    $('#show').tap(function(){
        sb.show();
    });

    $('#hide').tap(function(){
        sb.hide();
    });

});
