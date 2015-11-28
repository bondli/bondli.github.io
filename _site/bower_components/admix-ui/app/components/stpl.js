define(function (require, exports, module) {

    var str,
        formatTpl,
        w = (function() {
            return this || (0, eval)('this');
        }());

    function sTpl (str, data) {
        return data ? sTpl.compile(str).render(data) : sTpl.compile(str);
    }

    function preCompile (str) {
        str = str;

        function unescape(code) {
            return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
        }


        formatTpl = (function(str) {
            var el = document.getElementById(str),
                str = el ? el.innerHTML : str;

            return ("var out='" + (str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, ' ').replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, ''))
                .replace(/'|\\/g, '\\$&')
                .replace(/<%(.+?)%>/g, function(m, code) {
                    return code.substring(0, 1) === '=' ? ("';out+=(" + unescape(code.substring(1)) + ");out+='") : ("';" + unescape(code) + "\n out+='");
                }) + "';return out;")
            .replace(/\t/g, '\\t')
            .replace(/\r/g, '\\r')
            .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1')
            .replace(/\+''/g, '')
            .replace(/(\s|;|\}|^|\{)out\+=''\+/g, '$1out+=');

        })(str);
    }

    sTpl.compile = function (str) {
        preCompile(str);

        return {
            render: function (data) {
                var props = [],
                    vals = [],
                    func = null;

                for(var p in data){
                    props.push(p)
                    vals.push(data[p])
                }

                try {
                    func = new Function(props, formatTpl);
                } catch (e) {
                    if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
                    throw e;
                }

                return func.apply(null, vals);
            }
        };
    };

    return sTpl;

});
