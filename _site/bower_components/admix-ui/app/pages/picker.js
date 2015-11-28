define(function(require, exports, module) {

    var Picker = require('../components/picker');


    var app = {

        /**
         * 启动程序
         * @return {[type]} [description]
         */
        init : function () {

            var picker1 = new Picker({
                input: '#device',
                data: {
                    1 : 'iphone5',
                    2 : 'iphone6',
                    3 : 'iphone6s',
                    4 : 'iphone7',
                    5 : 'iphone8',
                    6 : 'iphone20'
                }
            });

            //设置默认选中的值
            picker1.setValue(2);

        }

    };

    app.init();

});
