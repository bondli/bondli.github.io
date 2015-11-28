define(function(require, exports, module) {
    var DownloadBar = require('../components/downloadbar');
    new DownloadBar({
        renderTo: 'body',
        callback: function(){
            alert(1);
        }
    });
});
