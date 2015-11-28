define(function(require, exports, module) {
    var nodata = require('../components/nodata');

    $('.show-nodata').tap(function(){
        nodata.show();
    });

    $('.hide-nodata').tap(function(){
        nodata.hide();
    });

});
