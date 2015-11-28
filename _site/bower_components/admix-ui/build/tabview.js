define(function(require, exports, module) {

    function Tabview (config) {
        this.config = config || (config = {});

        if (typeof Tabview._initialized === 'undefined') {

            Tabview.prototype.init = function () {
                var self = this,
                    config = self.config,
                    items = config.items;

                if($(config.renderTo).length === 0){
                    console.log('出错了，要render的dom不存在');
                    return;
                }

                $(config.renderTo).addClass('admix-ui-tabs');//.css({'width':config.width+'px'});

                this.$tabs = $('<div>').addClass('segmented-control');

                this.$tabs.appendTo( $(config.renderTo) );

                this.$tabsCont = $('<div>').addClass('tabs-content').addClass('content-padded');
                this.$tabsCont.appendTo( $(config.renderTo) );

                //tabs a
                for(var i in items){
                    var item = items[i];

                    var $a = $('<a href="javascript:;" class="control-item">'+item.name+'</a>');
                    self.$tabs.append($a);

                    if(item.isActive){
                        $a.addClass('active');
                        //同时该方法被执行一次
                        item.func();
                    }

                    //经典的闭包实例
                    var fun = (function(f){

                        return function(){
                            var me = $(this);
                            if(me.hasClass('active')){ //当前所在的tab不允许点击
                                return;
                            }

                            self.$tabs.find('a').removeClass('active');
                            me.addClass('active');

                            return f && f();
                        };

                    })(item.func);

                    $a.on('click', fun);
                }

            };

            Tabview._initialized = true;
        }
    }

    return Tabview;
});
