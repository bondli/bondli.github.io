define(function(require, exports, module) {
    var Tabview = require('../components/tabview');
    var tv = new Tabview({
        renderTo : '#tabsContainer',
        items : [
            {
                name : 'tab1',
                func : function(){
                    $('.tabs-content').html('<div class="tc1">11111</div>');
                }
            },
            {
                name : 'tab2',
                isActive : true,
                func : function(){
                    $('.tabs-content').html('<div class="tc1">222222</div>');
                }
            },
            {
                name : 'tab3',
                func : function(){
                    $('.tabs-content').html('<div class="tc1">333333</div>');
                }
            }
        ]
    });

    tv.init();
});
