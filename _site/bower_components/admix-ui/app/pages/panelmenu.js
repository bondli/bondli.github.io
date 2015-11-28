define(function(require, exports, module) {

    var Menu = require('../components/panelmenu');

    var menuData = {
        title : '商户管理',
        list: [
            {
                "name" : "工作台",
                "url" : '#',
                "class" : 'abc',
                "callback" : function(){
                    alert(1);
                }
            },
            {
                "name" : "圈人",
                "url" : '#',
            },
            {
                "name" : "核销",
                "url" : '#',
            },
            {
                "name" : "优惠券",
                "url" : '#',
                "sublist" : [
                    {
                        "name" : "优惠券管理",
                        "url" : '#'
                    }
                ]
            }
        ],
        position: 'right'
    }
    Menu.init(menuData);

    $('.menu-show-right').tap(function(){
        Menu.show();
    });

    $('.menu-show-left').tap(function(){
        Menu.show();
    });

});
