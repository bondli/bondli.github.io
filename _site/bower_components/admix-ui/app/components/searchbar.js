define(function(require, exports, module) {

    var isAndroid = function () {
        return window.navigator.userAgent.indexOf('Android')>-1 ? true : false;
    };

    /**
     * 阻止点透
     * @return {[type]} [description]
     */
    var stopEventTap = function () {
        var $el = $('<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; "></div>');
        $('body').append($el);
        setTimeout(function () {
            $el.remove();
        }, 350);
    };

    function Searchbar (options) {
        var defaults = {
            name: 'searchKey',     //input的name，获取搜索值需要用到
            isShow: false,         //是否自动显示出来
            action: '',            //提交查询的页面
            onsubmit: function(){ return true; }, //提交查询前的函数
            data: '',              //默认的数据
            placeholder: 'Search', //默认的提示语
        };

        $.extend(defaults, options || {});

        this.$renderTo = $(defaults.renderTo);
        this.name = defaults.name;
        this.data = defaults.data;
        this.isShow = defaults.isShow;
        this.placeholder = defaults.placeholder;
        this.action = defaults.action;

        if(!defaults.renderTo && this.$renderTo.length === 0){
            console.log('searchbar要渲染的dom对象不存在');
            return;
        }

        //判断searchbar是否直出了
        var isExist = this.$renderTo.find('.searchbar');
        if(isExist && isExist.length){
            this.$el = this.$renderTo.find('.searchbar');
            this.$elInner = this.$renderTo.find('.searchbar-input');
            this.$elInput = this.$renderTo.find('input');

            this.$elCancel = this.$renderTo.find('.searchbar-cancel');

            if(this.action){
                this.$el.attr('action', this.action);
            }
            if(this.name){
                this.$elInput.attr('name', this.name);
            }
            if(this.placeholder){
                this.$elInput.attr('placeholder', this.placeholder);
            }
        }
        else{
            this.$el = $('<form class="searchbar" action="'+this.action+'"></form>');
            this.$elInner = $('<div class="searchbar-input"></div>').appendTo(this.$el);
            this.$elInput = $('<input type="search" name="'+this.name+'" placeholder="'+this.placeholder+'" autocomplete="off">').appendTo(this.$elInner);

            this.$elCancel = $('<button type="submit" class="searchbar-cancel">搜索</button>').appendTo(this.$el);
        }

        //初始化
        this.$renderTo.append(this.$el);

        //提交前函数定义
        this.$el.on('submit', function(){
            me.$el.removeClass('searchbar-active');
            addOverlay(false);

            if(defaults.onsubmit){
                return defaults.onsubmit();
            }
        });

        /**
         * 添加遮罩效果
         */
        var addOverlay = function (isShow) {
            var $searchOverlay = $('body').find('.searchbar-overlay');
            if($searchOverlay.length === 0){
                $searchOverlay = $('<div class="searchbar-overlay"></div>');
                $searchOverlay.appendTo($('body'));
            }
            if(isShow){
                $searchOverlay.addClass('searchbar-overlay-active');
            }
            else {
                $searchOverlay.removeClass('searchbar-overlay-active');
            }
        };

        var me = this;
        //聚焦事件
        this.$elInput.on('focus', function(){
            if(!me.$el.hasClass('searchbar-active')){
                me.$el.addClass('searchbar-active');
                addOverlay(true);
            }
        });

        //失焦事件
        $('body').on('touchend', '.searchbar-overlay', function(){
            stopEventTap();
            me.$el.removeClass('searchbar-active');
            $(this).removeClass('searchbar-overlay-active');

        });

        if(this.data){
            this.$elInput.val(this.data);
        }

        if(this.isShow){
            this.$el.css('height', this.height);
        }

        if (typeof Searchbar._initialized === 'undefined') {

            Searchbar.prototype.show = function () {
                var height = this.height;
                this.$el.css('height', height);
            };

            Searchbar.prototype.hide = function () {
                this.$el.css('height', 0);
            };

            Searchbar.prototype.setData = function (data) {
                this.$elInput.val(data);
            };

            Searchbar.prototype.getData = function () {
                return this.$elInput.val();
            };

            Searchbar._initialized = true;
        }
    };

    return Searchbar;

});
