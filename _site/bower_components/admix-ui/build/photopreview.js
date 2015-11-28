define(function(require, exports, module) {

    //定义需要操作的dom
    var $body = $('body'),
        $modal = $('<div class="modal modal-preview"></div>');


    return {

        /**
         * 初始化
         * @param  {[type]} renderTo  [description]
         * @param  {[type]} addFun [description]
         * @return {[type]}           [description]
         */
        init : function (renderTo, maxLength, addFun) {
            var self = this,
                $el = $(renderTo),
                $elAdd = $('<a class="new-photo icon icon-plus"></a>');

            if($el.length === 0){
                console.log('要渲染的对象不存在');
                return;
            }

            this.$el = $el;
            this.max = maxLength;
            this.items = [];

            //当前图片的索引
            this.currIndex = 0;
            //是否修改过封面或者删除了
            this.isSetFirstOrDelete = false;
            //封面的位置
            this.firstIndex = 0;

            //editBtn
            this.$editBtn = null;
            //navText
            this.$navText = null;

            this.$photoWrapper = null;

            $el.html('');

            $elAdd.appendTo($el);

            //添加按钮事件
            $elAdd.on('click', function(){
                addFun && addFun();
            });

            this._initEvent();

        },

        /**
         * 事件定义
         * @return {[type]} [description]
         */
        _initEvent : function () {
            var self = this;

            //点击缩略图，显示相册预览
            $('body').on('tap', '.photo', function(){
                var _index = $(this).attr('_index');
                self.currIndex = _index - 0;
                self._render();
            });

            //点击图片或者空白区域关闭
            $('body').on('tap', '.preview-slider', function(){
                self._close();
            });

            //点击设置封面
            $('body').on('click', '.photo-edit', function(){
                if($(this).hasClass('disabled')){
                    return;
                }
                self.isSetFirstOrDelete = true;
                var _index = self.currIndex;
                self.firstIndex = _index;
                $(this).addClass('disabled');
                //修改图片数组顺序
                self._setFirst();
            });

            //点击删除
            $('body').on('click', '.photo-del', function(){
                self.isSetFirstOrDelete = true;
                var _index = self.currIndex;
                //删除的是封面,则第一张就是封面了
                if(_index === self.firstIndex){
                    self.firstIndex = 0;
                }
                //图片数组中删除
                self._delete();
                //跳到下一张
                self._switchTo(true);
            });

            //切换图片事件
            $('body').on('swipeLeft', '.slider-inner', function(){
                if(self.currIndex >= self.items.length-1){
                    return;
                }
                self.currIndex ++ ;
                self._switchTo();
            });
            $('body').on('swipeRight', '.slider-inner', function(){
                if(self.currIndex <= 0){
                    return;
                }
                self.currIndex -- ;
                self._switchTo();
            });

        },

        /**
         * 直接显示相册
         * @param  {[type]} photoArray [description]
         * @param  {[type]} index      [description]
         * @return {[type]}            [description]
         */
        show : function (photoArray, index) {
            this.max = photoArray.length;
            this.items = photoArray;
            //当前图片的索引
            this.currIndex = index || 0;
            //封面的位置
            this.firstIndex = 0;
            //editBtn
            this.$editBtn = null;
            //navText
            this.$navText = null;

            this.$photoWrapper = null;

            this._render();

            $modal.find('.bar').hide();

        },

        /**
         * 点击图片的缩略图出现的相册效果
         * @return {[type]} [description]
         */
        _render : function () {
            var self = this;

            if (!$('.modal-preview').length) {
                $body.append($modal);
            }

            self._setPhotoHtml();
            self._show();

        },

        /**
         * 把图片数据转成html
         */
        _setPhotoHtml : function () {
            var self = this,
                items = this.items,
                total = this.items.length,
                $modalNavbar = $('<header class="bar bar-nav"><h1 class="title">'+(self.currIndex+1)+'/'+total+'</h1></header>'),
                $modalPage = $('<div class="preview-slider"></div>'),
                $modalToolbar = $('<nav class="bar bar-tab"><div class="bar-inner"><a class="tab-item photo-edit" href="javascript:;"><span class="tab-label">设为封面</span></a><a class="tab-item photo-del" href="javascript:;"><span class="tab-label">删除</span></a></div></nav>'),
                $photoWrapper = $('<div class="slider-inner clearfix"></div>');

            $modal.append($modalNavbar);

            $modal.append($modalPage);

            $modal.append($modalToolbar);

            $modalPage.append($photoWrapper);

            for(var i in items){
                var $photo = $('<img src="'+items[i]+'" style="width:'+self._getWindowWidth()+'px">');
                $photoWrapper.append($photo);
            }

            //设置宽度
            $photoWrapper.css({
                width : total*(self._getWindowWidth()) + 'px'
            });

            $modalPage.css({
                marginTop : 0.5*(self._getWindowHeight() - $photoWrapper.find('img').height()) + 'px'
            });

            self.$navText = $modalNavbar.find('.title');
            self.$photoWrapper = $photoWrapper;

        },

        _getWindowWidth : function () {
            return $(window).width();
        },

        _getWindowHeight : function () {
            return $(window).height();
        },

        /**
         * 切换到当前的照片
         * @return {[type]} [description]
         */
        _switchTo : function (isDel) {
            var self = this,
                total = this.items.length,
                $editBtn = $modal.find('.photo-edit');

            if(self.currIndex == self.firstIndex){
                $editBtn.addClass('disabled');
            }
            else{
                $editBtn.removeClass('disabled');
            }
            self.$navText.html((self.currIndex+1)+'/'+total);
            //图片展示
            var w = self.currIndex * (self._getWindowWidth());
            if(isDel){
                //如果删除了最后一张
                if(self.currIndex === total || total === 1){
                    self.currIndex = 0;
                    self.$navText.html((self.currIndex+1)+'/'+total);
                    w = 0;
                }
                else{
                    w = (self.currIndex) * (self._getWindowWidth());
                }
                //如果是删除，需要重新设置相册的图片
                self.$photoWrapper.html('').css({
                    width : total*(self._getWindowWidth()) + 'px'
                });
                for(var i in self.items){
                    var $photo = $('<img src="'+self.items[i]+'" style="width:'+self._getWindowWidth()+'px">');
                    self.$photoWrapper.append($photo);
                }
            }
            self.$photoWrapper.css({
                'transform': 'translate3d(-'+w+'px,0px,0px)',
                '-webkit-transform': 'translate3d(-'+w+'px,0px,0px)'
            });
        },

        /**
         * 显示图片浏览器
         * @return {[type]} [description]
         */
        _show : function () {
            var self = this;
            $modal.addClass('active');
            this._switchTo();
            //防止动画抖动
            setTimeout(function(){
                self.$photoWrapper.css({
                    'visibility': 'visible'
                });
            },500);

        },

        /**
         * 从数据对象中删除一个item
         * @return {[type]} [description]
         */
        _delete : function () {
            var self = this,
                currIndex = self.currIndex,
                tmpItems = self.items;

            self.items = [];

            for(var i in tmpItems){
                if(i != currIndex){
                    self.items.push(tmpItems[i]);
                }
            }

            //最后一张照片也被删除了
            if(self.items.length === 0){
                self._close();
                return;
            }

            self.currIndex = currIndex;
        },

        /**
         * 设置数据中的某一个到第一个
         */
        _setFirst : function () {
            var self = this,
                currIndex = self.currIndex,
                tmpItems = self.items;

            self.items = [];

            self.items.push(tmpItems[self.firstIndex]);

            for(var i in tmpItems){
                if(i != self.firstIndex){
                    self.items.push(tmpItems[i]);
                }
            }

        },

        /**
         * 关闭相册预览效果
         * @return {[type]} [description]
         */
        _close : function () {
            $modal.removeClass('active');

            //如果修改过，则需要重新渲染列表
            if(this.isSetFirstOrDelete){
                this.set(this.items);
            }

            setTimeout(function(){
                $modal.children().remove();
            }, 200);
        },

        /**
         * 添加一个图片
         */
        add : function (imageItem) {
            if(this.items.length >= this.max){
                return;
            }
            this.items.push(imageItem);
            this.set(this.items);
        },

        /**
         * 设置图片预览器中的图片
         * @param {[type]} itemList [description]
         */
        set : function (itemList) {
            this.items = itemList;

            //删除原来有的数据
            this.$el.find('.photo').remove();

            this.firstIndex = 0;

            //达到上限就不再是append,没有添加功能
            var str = '';
            for(var i in itemList){
                var url = itemList[i];
                if(i == 0){
                    str += '<a class="photo" _index="'+i+'"><img src="'+url+'" width="100%" /><span class="first">封面</span></a>';
                }
                else{
                    str += '<a class="photo" _index="'+i+'"><img src="'+url+'" width="100%" /></a>';
                }
            }
            if(itemList.length >= this.max) {
                this.$el.find('.new-photo').hide();
            }
            else{
                this.$el.find('.new-photo').show();
            }
            $(str).insertBefore(this.$el.find('.new-photo'));

        },

        /**
         * 获取图片列表数据
         * @return {[type]} [description]
         */
        get : function () {
            return this.items;
        }

    };

});
