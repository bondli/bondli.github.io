define(function(require, exports, module) {

    /**
     * Slider
     * @param {[type]} renderTo   要加载到的dom
     * @param {[type]} data 数据
     * @param {[type]} isAuto 是否自动开始
     * @param {[type]} interval 间隔时间（毫秒）
     */
    function Slider(options){
        var defaults = {
            isAuto: true,   //是否自动开始
            interval: 3000     //滚动事件触发延迟时间
        };

        $.extend(defaults, options || {});

        this.currentItem = 0;
        this.$renderTo = $(defaults.renderTo);
        this.data = defaults.data;
        this.len = defaults.data.length;
        this.isAuto = defaults.isAuto;
        this.interval = defaults.interval;
        this.timer = null;

        this.$el = $('<div class="admix-ui-slider"></div>');
        this.$elInner = $('<div class="slider-inner"></div>').appendTo(this.$el);
        this.$elText = $('<div class="slider-text"></div>').appendTo(this.$el);
        this.$elNav = $('<div class="silder-nav"></div>').appendTo(this.$el);

        this._setAnimation = function(itemIndex){
            //this.$elInner.css({'marginLeft':  (itemIndex*(-100))+'%' });
            var w = itemIndex * (this.$elInner.width())/(this.len);
            this.$elInner.css({
                'transform': 'translate3d(-'+w+'px,0px,0px)',
                '-webkit-transform': 'translate3d(-'+w+'px,0px,0px)'
            });

            if(this.data[itemIndex].text){
                this.$elText.html('<span>'+this.data[itemIndex].text+'</span>');
            }
            this.$elNav.find('label').removeClass('current');
            (this.$elNav.find('label')).each(function(index, el) {
                if(index == itemIndex){
                    $(el).addClass('current');
                }
            });
        };

        this._bindEvent = function(){
            var self = this;

            /*/修复IOS下卡的问题
            this.$el.on('touchstart', function(e){
                e.preventDefault();
            });*/

            //左滑事件
            this.$el.swipeLeft(function(){
                self.currentItem ++;
                if(self.currentItem >= 0 && self.currentItem <= self.len-1){
                    self._setAnimation(self.currentItem);
                }
                if(self.currentItem == self.len){
                    self.currentItem = 0;
                    self._setAnimation(self.currentItem);
                }
                clearInterval(self.timer);
            });
            //右滑事件
            this.$el.swipeRight(function(){
                self.currentItem --;
                if(self.currentItem >= 0 && self.currentItem < self.len){
                    self._setAnimation(self.currentItem);
                }
                if(self.currentItem < 0){
                    self.currentItem = self.len - 1;
                    self._setAnimation(self.currentItem);
                }
                clearInterval(self.timer);
            });
            //点击事件
            this.$elNav.find('label').on('tap', function(){
                $(this).addClass('current');
                $(this).siblings().removeClass('current');
                self.currentItem = $(this).attr('_val') - 0;
                self._setAnimation(self.currentItem);
                clearInterval(self.timer);
            });
            //自动循环事件
            if(this.isAuto){
                var cIndex = 0;
                this.timer = setInterval(function(){
                    cIndex ++;
                    self.currentItem = cIndex % (self.len);
                    self._setAnimation(self.currentItem);
                },self.interval);
            }
        };

        if (typeof Slider._initialized === 'undefined') {

            Slider.prototype.init = function () {

                var isShowText = false,
                    len = this.len,
                    data = this.data;
                this.$renderTo.append(this.$el);

                if(!data || data.length<1){
                    return;
                }

                //变成float布局，更好的兼容性
                this.$elInner.css({
                    'width': (100*len)+'%'
                });
                console.log(100*len);

                //初始化数据
                for(i in data){
                    this.$elInner.append('<a _val="'+i+'" href="'+(data[i].href ? data[i].href : 'javascript:;')+'"><img src="'+data[i].img+'"></a>');
                    this.$elNav.append('<label _val="'+i+'"></label>');

                    if(data[i].text){
                        isShowText = true;
                    }
                }

                //变成float布局，更好的兼容性
                this.$elInner.find('a').css({
                    'width': (100/len)+'%'
                });

                if(isShowText){
                    this.$elText.html('<span>'+this.data[0].text+'</span>');
                }

                this.$elNav.find('label').first().addClass('current');

                if(data.length > 1){
                    this._bindEvent();
                }
                else {
                    this.$elNav.hide();
                }
            };

            Slider._initialized = true;
        }
    }

    return Slider;
});
