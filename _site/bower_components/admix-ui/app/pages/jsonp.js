define(function(require, exports, module) {
    var jsonp = require('../components/jsonp');
    var xhr = require('../components/xhr');

    $('#send').tap(function(){
        jsonp.get({
            'url':'http://www.taobao.com/go/rgn/share/o2ovenuevoucher.php',
            'cbName':'callback'
        }, function(data){
            $('#ret-content').append(JSON.stringify(data));
        });
    });

    $('#sendajax').tap(function(){
        xhr({
            'url': '/demo/test.json',
            'type': 'post',
            'data': {"abc":"asd"}
        }, function(data){
            $('#ret-content').append(JSON.stringify(data));
        }, function(err, status){
            alert(err);
        });
    });
});
