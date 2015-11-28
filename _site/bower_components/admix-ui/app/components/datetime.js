define(function(require, exports, module) {

    /* 匹配正则 */
    var RegExpObject = /^(y+|M+|d+|H+|h+|m+|s+|E+|S|a)/;

    var _toFixedWidth = function (value, length) {
        var result = '00' + value.toString();
        return result.substr(result.length - length);
    };

    return {
        /**
         * 字符串格式转时间
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         */
        strToDate : function (str) {
            var newStr = str.replace(/-/g,'/');
            return new Date(newStr);
        },

        /* 匹配值处理 */
        _patternValue : {
            y: function(date) {
                return date.getFullYear().toString().length > 1 ? _toFixedWidth(date.getFullYear(), 2) : _toFixedWidth(date.getFullYear(), 1);
            },
            yy: function(date) {
                return _toFixedWidth(date.getFullYear(), 2);
            },
            yyyy: function(date) {
                return date.getFullYear().toString();
            },
            M: function(date) {
                return date.getMonth()+1;
            },
            MM: function(date) {
                return _toFixedWidth(date.getMonth()+1, 2);
            },
            d: function(date) {
                return date.getDate();
            },
            dd: function(date) {
                return _toFixedWidth(date.getDate(), 2);
            },
            H: function(date) {
                return date.getHours();
            },
            HH: function(date) {
                return _toFixedWidth(date.getHours(),2);
            },
            h: function(date) {
                return date.getHours()%12;
            },
            hh: function(date) {
                return _toFixedWidth(date.getHours() > 12 ? date.getHours() - 12 : date.getHours(), 2);
            },
            m: function(date) {
                return date.getMinutes();
            },
            mm: function(date) {
                return _toFixedWidth(date.getMinutes(), 2);
            },
            s: function(date) {
                return date.getSeconds();
            },
            ss: function(date) {
                return _toFixedWidth(date.getSeconds(), 2);
            },
            S: function(date) {
                return _toFixedWidth(date.getMilliseconds(), 3);
            }
        },

        /**
         * 格式化时间
         * @param  {[type]} pattern [description]
         * @param  {[type]} date    [description]
         * @return {[type]}         [description]
         */
        formatDate : function (pattern, date) {
            var self = this;
            /* 未传入时间,设置为当前时间 */
            if(date == undefined) date = new Date();

            /* 传入时间为字符串 */
            if(typeof(date) === 'string'){
                if(date == '') {
                    date = new Date();
                }
                else {
                    date = new Date(date.replace(/-/g, '/'));
                }
            }

            var result = [];
            while (pattern.length > 0) {
                RegExpObject.lastIndex = 0;
                var matched = RegExpObject.exec(pattern);
                if (matched) {
                    result.push(self._patternValue[matched[0]](date));
                    pattern = pattern.slice(matched[0].length);
                }else {
                    result.push(pattern.charAt(0));
                    pattern = pattern.slice(1);
                }
            }
            return result.join('');
        }
    };

});
