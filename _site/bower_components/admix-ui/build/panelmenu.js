define(function(require, exports, module) {

    var $body = $('body'),
        $overlay = $('<div class="panel-overlay"></div>'),
        $panel = $('<div class="panel panel-left panel-cover panel-dark active" style="display:block">');

    return {

        position: 'left',

        _initMenu : function () {
            var me = this;

            if(me.position == 'right') {
                $panel = $('<div class="panel panel-right panel-cover panel-dark active" style="display:block">');
            }
            $body.prepend($panel);
            $body.prepend($overlay);

        },

        _initEvent : function () {
            var me = this;
            $('.panel-overlay').one('touchend', function(e){
                e.preventDefault();
                me.hide();
            });

        },

        hide : function () {
            $body.removeClass('with-panel-'+this.position+'-cover');

        },

        show : function () {
            $body.addClass('with-panel-'+this.position+'-cover');
            this._initEvent();
        },

        _setData : function (data) {
            var me = this;
            if(data && data.title){
                var $title = $('<div class="panel-menu-title">'+data.title+'</div>');
                $panel.append($title);
            }
            if(data && data.list){ //一级菜单
                var list = data.list,
                    $link = $('<ul class="panel-menu-link" />');

                $panel.append($link);

                for(var i in list){
                    var $menu = $('<li class="panel-menu-item"><a href="'+list[i].url+'">'+list[i].name+'</a></li>');
                    $link.append($menu);

                    if(list[i].class){
                        $menu.addClass(list[i].class);
                    }

                    if(list[i].callback){
                        //经典的闭包实例
                        var func = (function(f){
                            return function(){
                                me.hide();
                                return f && f();
                            };
                        })(list[i].callback);
                        $menu.on('click',func);
                    }

                    if(list[i].sublist){ //二级菜单，只支持到二级
                        var $sublistCont = $('<li class="panel-menu-item"></li>');
                            $sublist = $('<ul class="panel-menu-sublist"></ul>');

                        $link.append($sublistCont);
                        $sublistCont.append($sublist);

                        var sublist = list[i].sublist;
                        for(var t in sublist){
                            var $sublistItem = $('<li class="panel-menu-item"><a href="'+sublist[t].url+'">'+sublist[t].name+'</a></li>');
                            $sublist.append($sublistItem);

                            if(sublist[t].class){
                                $sublistItem.addClass(sublist[t].class);
                            }

                            if(sublist[t].callback){
                                //经典的闭包实例
                                var func = (function(f){
                                    return function(){
                                        me.hide();
                                        return f && f();
                                    };
                                })(sublist[t].callback);
                                $sublistItem.on('click',func);
                            }
                        }
                    }
                }
            }

        },

        init : function (data) {
            var me = this;

            me.position = 'left';
            if(data.position && data.position == 'right'){
                me.position = 'right';
            }
            me._initMenu();
            me._setData(data);

        }

    };

});
