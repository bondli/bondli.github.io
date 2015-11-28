define(function (require, exports, module) {
    var stpl = require('../components/stpl');

    var tmpl = $('#txTpl').html(),
        data = {list: [{name: 'john', age : 30},{name: 'bond', age : 30}]};

    var r = stpl(tmpl, data);

    $('#datalist').html(r);
});
