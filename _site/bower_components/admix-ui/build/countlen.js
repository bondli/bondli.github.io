define(function (require, exports, module) {


    /**
     * 计算字符串的字节长度。全角字符unicode编码范围65281~65374
     * @param str
     * @returns {number}
     */
    var countlen = function (str) {
        if (str) {
            var len = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                var c = str.charCodeAt(i);
                // ascii 字符，作为1个字符处理
                if (c < 0xFF) {
                    len++;
                }
                // 全角字符，每个计算2长度
                else {
                    var is_half = (0xFF61 <= c && c <= 0xFF9F) || (0xFFE8 <= c && c <= 0xFFEE);
                    len += is_half ? 1 : 2;
                }
            }
            return len;
        }
        else {
            return 0;
        }
    };

    return countlen;


});
