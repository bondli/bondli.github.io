define(function(require, exports, module) {
    // 通过 require 引入依赖

    $('#show1').tap(function(){
        xmtop(
            {
                api: 'mtop.citylife.eticket.list.get',
                v: '1.0',
                data: {
                    'pageNo': 1,
                    'pageSize': 10
                }
            },
            function (resJson, retType) {
                console.log(resJson);
                $('#ret').text(JSON.stringify(resJson));
            },
            function (resJson, retType, errMsg) {
                console.log(resJson, errMsg);
                $('#ret').text(JSON.stringify(resJson));
            }
        );
    });

    console.log('page inited');

});
