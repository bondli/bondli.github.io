/**
 * @jsdoc function
 * @name framework7-plugins.page:calendar
 * @description
 * # Calendar
 * page of the framework7-plugins
 */
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var Calendar = require('../components/calendar');


    var app = {

        /**
         * 启动程序
         * @return {[type]} [description]
         */
        init : function () {

            var calendarDefault = new Calendar({
                input: '#date',
                type: 'date'
            });

            var calendarDefault = new Calendar({
                input: '#datetime',
                type: 'datetime'
            });

            var calendarDefault = new Calendar({
                input: '#time',
                type: 'time'
            });

        }

    };

    app.init();

});
