define(function(require) {
    var win = window;

    // 构造函数
    function Route(config) {
        this.config = $.extend({
            container: 'body', //必填触发节点
            hashPrefix: '',
            clsPrefix: 'km-route',
            clsAnimate: 'km-route-transform-left', //启动动画移除该cls
            clsCur: 'km-route-cur', //结束动画移除该cls
            defaultTitle: document.title,
            defaultRoute: 'index', //默认的路由
            isSetTitle: true, //设置标题
            isAnimate: false, //动画开启
            isSetHistory: true, //是否history记录
            resizeTime: 100,
            transitionTime: 300
        }, config || {});

        this._init();
    }

    $.extend(Route.prototype, {
        _init: function() {
            this.$container = $(this.config.container);
            this.routes = {};
            this.curRoute = {};
            this._bindEvent();
        },

        //启动
        init: function(){
            var self = this;
            var route = self._getHash();
            if(route){
                self._doSwitch(route,{isAnimate: true})
            }else{
                self._setHash(self.config.defaultRoute, {
                    isAnimate: true,
                    isSetHistory: false
                });
            }
            return this;
        },

        //添加路由 {ctr,cls,title}
        addRoute: function(route, config){
            if($.isPlainObject(route)){
                config = route;
                if(config.routeName){
                    this.routes[config.routeName] = config || {};
                }else{
                    console.log('添加路由失败');
                }
            }else{
                 config = config || {};
                 config.routeName = route;
                 this.routes[route] = config;
            }
            if(config && !config.ctr){
                console.log('添加路由错误,路由必须包含ctr', config);
            }
            return this;
        },

        //删除路由
        removeRoute: function(route){
            route && delete this.routes.route;
            return this;
        },

        getRoutes: function(){
            return this.routes();
        },

        //切换到某个route
        switchRoute: function(route, config){
            if(route && this.routes[route]){
                this._setHash(route, $.extend(true, {}, this.config, config || {}));
            }else{
                console.log('切换的route有问题', route, this.routes);
            }
            return this;
        },

        _changeTitle: function(config){
            if(config.isSetTitle === false) return;
            document.title = config.title || config.defaultTitle;
            this.$container.trigger('changeTitle', config);
        },

        //直接改变
        _doSwitch: function(route, conf){
            var self = this;
            var config = self.routes[route];
            //未匹配到当前route内容
            if(config){
                config = $.extend(true, {}, self.config, config, conf || {});
                config.routeName = route;
            }else{
                self.switchRoute(self.config.defaultRoute, {isSetHistory: false});
                return;
            }
            self.$container.trigger('beforeSwitch', self.curRoute);
            self._changeTitle(config);
            config = $.extend(self._doRoute(config), config);

            self._doAnimate(config, function(){
                self.curRoute = config;
                self.$container.trigger('endSwitch', self.curRoute);
            });
        },

        //获取当前路由信息
        getCurRoute: function(){
            return this.curRoute;
        },

        //处理新建的route 的逻辑
        _doRoute: function(config){
            var self = this;
            var $route = $(self._getStrRoute(config));
            var $slibings = self.$container.children();
            config.isAnimate ? self.$container.append($route) :  self.$container.html($route)
            var ctr = config.ctr;
            config.$route = $route;
            if(ctr){
                //清除内存重置解除绑定等
                self.newCtr && self.newCtr.destroy && self.newCtr.destroy();
                self.newCtr = null;
                if(typeof ctr === 'string'){
                    if(/^[.\/\\]+/.test(ctr)){
                        var b = require && require(ctr);
                        if(b){
                            ctr = b;
                        }else{
                            console.log('路径读取模块', ctr);
                        }
                    }else{
                        $route.append(ctr);
                    }
                }
                if($.isFunction(ctr)){
                    self.newCtr = new ctr($route, self);
                }
                if($.isPlainObject(ctr)){
                    self.newCtr = ctr;
                    ctr && ctr.init && ctr.init($route,self);
                }
            }else{
                console.log('ctr 不能为空',config)
            }
            return {
                $route: $route,
                $slibings: $slibings
            }
        },

        _getStrRoute: function(config){
            var arr = ['<div class="'+config.clsPrefix+'-'+config.routeName];
            arr.push(' ' + config.clsPrefix);
            config.isAnimate && config.clsAnimate && arr.push(' '+config.clsAnimate);
            config.isAnimate && config.clsCur && arr.push(' '+config.clsCur);
            arr.push('"></div>');
            return arr.join('');
        },

        //动画逻辑
        _doAnimate: function(config, fn){
            var self = this;
            var $route = config.$route;
            var isSuccess = false;
            if(config.isAnimate === false){
                return fn();
            }
            //监听transition动画 如果存在动画或者支持动画
            var isSupport = $route.css('transition');
            if(isSupport || $route.css('WebkitTransition')){
                self.setRouteSize($route);
                //通过删除该cls启动动画
                config.clsAnimate && config.$route.removeClass(config.clsAnimate);
                self.$container.trigger('beforeAnimate', config);
                isSupport && $route.one('transitionEnd', TransitionEnd);
                !isSupport && $route.one('WebkitTransitionEnd', TransitionEnd);
                self.animateTime && clearTimeout(self.animateTime);
                self.animateTime = setTimeout(TransitionEnd, config.transitionTime);
            }else{
                return fn();
            }

            function TransitionEnd(){
                if(isSuccess){
                    return;
                }
                isSuccess = true;
                //将相邻的dom清空
                config.$slibings &&  config.$slibings.length && config.$slibings.remove();
                config.clsCur && $route.removeClass(config.clsCur);
                $route.css({minHeight:'inherit'});
                self.$container.trigger('endAnimate', config);
                fn();
            }
        },

        //获取hash值
        _getHash: function(){
            var hash = win.location.hash.replace('#/'+this.config.hashPrefix, '');
            return this.routes[hash]? hash: null
        },

        _setHash: function(hash, config){
            var self = this;
            if(self.curRoute && hash === self.curRoute.routeName) {
                return;
            }
            self.hashConfig = config || {};
            //需要历史记录直接使用hash
            if(config && config.isSetHistory === true){
                win.location.hash = '#/'+self.config.hashPrefix+hash;
            }
            else{
                var href = win.location.href.replace(/(javascript:|#).*$/, '');
                win.location.replace(href + '#/'+self.config.hashPrefix+hash);
            }
        },

        setRouteSize: function($route){
            var self = this;
            $route.css({
                width: self.$container.width(),
                minHeight: self.$container.height()
            })
        },

        _bindEvent: function(){
            var self = this;
            var timer = null;

            self._hashChangeFn =  function(e) {
                var route = self._getHash();
                route && self._doSwitch(route,self.hashConfig);
                self.hashConfig = {};
            };
            self._resizeFn = function(e) {
                timer && clearTimeout(timer);
                timer = setTimeout(function(){
                    self.curRoute && self.curRoute.$route && self.setRouteSize(self.curRoute.$route);
                }, self.config.resizeTime);
            };

            //以hash为中心  history的方式就算了不去实现
            $(win).on('hashchange', self._hashChangeFn);
            $(win).on('resize deviceorientation', self._resizeFn);
        },

        destroy: function(){
            var self = this;
            $(win).off('hashchange', self._hashChangeFn);
            $(win).off('resize deviceorientation', self._hashChangeFn);
        }
    });

    return Route;
});
