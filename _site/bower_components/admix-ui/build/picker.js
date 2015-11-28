define(function(require, exports, module) {

    //定义需要操作的dom
    var $body = $('body'),
        $overlay = $('<div class="dialog-overlay picker-dialog-overlay"></div>');

    function Picker (options) {

        this.$input = $(options.input).attr('readonly', true);

        this.data = options.data || {};

        this.$picker = $('<div class="picker-dialog"></div>');
        this.$pickerToolbar = $('<div class="toolbar"><a href="javascript:;" class="close-picker">完成</a></div>');
        this.$pickerInner = $('<div class="picker-dialog-inner picker-items"></div>');
        this.$pickerItemsCol = $('<div class="picker-items-col picker-items-col-center"></div>');
        this.$pickerItemsWrapper = $('<div class="picker-items-col-wrapper" style="transform: translate3d(0px, 90px, 0px);"></div>');
        this.$pickerHighLight = $('<div class="picker-center-highlight"></div>');

        /**
         * 绑定点击事件
         * @return {[type]} [description]
         */
        this._bindEvent = function () {
            var self = this;

            //输入框点击事件
            this.$input.on('click', function () {
                self._show();
            });

            //点击完成，关闭选择框
            this.$pickerToolbar.on('click', '.close-picker', function(){
                self._hide();
            });

            //点击遮罩层，关闭选择框
            $('.picker-dialog-overlay').on('touchend', function(e){
                self._hide();
            });

            //选择可选项
            this.$pickerItemsWrapper.on('click', '.picker-item', function(){
                var me = $(this);
                var index = me.attr('name') - 0;

                self._choise(index);

            });

            //滚动选择
            this.$pickerItemsWrapper.on('touchstart touchmove', function(e){
                switch (e.type) {
                    case 'touchstart':
                        self._startY = e.touches[0].pageY;
                        break;
                    case 'touchmove':
                        self._endY = e.touches[0].pageY;
                        break;
                }
            });

            this.$pickerItemsWrapper.on('touchend', function(e){
                //console.log(self._startY, self._endY, self._endY - self._startY);
                var moved = self._endY - self._startY;
                var absMoved = Math.abs(self._endY - self._startY);
                var step = Math.ceil(absMoved/36);

                var $curSelected = self.$pickerItemsWrapper.find('.picker-selected');
                var index = $curSelected.attr('name') - 0;

                if(moved<0 && absMoved>10){ //上拉
                    self._choise(index+step);
                }
                else if(moved>0 && absMoved>10){ //下拉
                    self._choise(index-step);
                }
            });

        };

        //选择
        this._choise = function (index) {
            var self = this;
            var itemLength = self.$pickerItemsWrapper.find('.picker-item').length;

            if(index > itemLength-1) {
                index = itemLength - 1;
            }

            if(index < 0){
                index = 0;
            }

            self.$pickerItemsWrapper.css('transform', 'translate3d(0px, '+(90-index*36)+'px, 0px)');
            self.$pickerItemsWrapper.find('.picker-selected').removeClass('picker-selected');

            var $item = self.$pickerItemsWrapper.find('div[name="'+index+'"]');

            self.$input.val($item.text());
            self.$input.attr('_val', $item.attr('_value'));

            $item.addClass('picker-selected');

        };

        /**
         * 初始化选择框html
         * @return {[type]} [description]
         */
        this._initPicker = function () {
            if (!$('.picker-dialog-overlay').length) {
                $body.append($overlay);
            }
            this.$picker.append(this.$pickerToolbar);
            this.$picker.append(this.$pickerInner);
            this.$pickerInner.append(this.$pickerItemsCol);
            this.$pickerInner.append(this.$pickerHighLight);
            this.$pickerItemsCol.append(this.$pickerItemsWrapper);
            $body.append(this.$picker);
        };

        /**
         * 初始化选项数据
         */
        this._setData = function (data) {
            var str = '';
            var index = 0;
            for(var i in data){
                if(index == 0){
                    str += '<div class="picker-item picker-selected" name="'+index+'" _value="'+i+'">'+data[i]+'</div>';
                }
                else {
                    str += '<div class="picker-item" name="'+index+'" _value="'+i+'">'+data[i]+'</div>';
                }
                index++;
            }
            this.$pickerItemsWrapper.append(str);

        };

        /**
         * 显示选择框
         * @return {[type]} [description]
         */
        this._show = function () {
            var self = this;
            $overlay.addClass('dialog-overlay-visible');
            this.$picker.css('display', 'block');
            this.$picker.removeClass('dialog-out');

            setTimeout(function(){
                self.$picker.addClass('dialog-in');
            },100);
        };

        /**
         * 隐藏显示框
         * @return {[type]} [description]
         */
        this._hide = function () {
            var self = this;
            this.$picker.addClass('dialog-out');
            $overlay.removeClass('dialog-overlay-visible');

            setTimeout(function(){
                self.$picker.removeClass('dialog-in');
                self.$picker.css('display', 'none');
            },200);
        };

        //初始化
        this._initPicker();
        this._setData(this.data);
        this._bindEvent();

        if (typeof Picker._initialized === 'undefined') {

            /**
             * 设置选中的值
             * @param {[type]} val [description]
             */
            Picker.prototype.setValue = function (val) {
                var self = this;
                var items = this.$pickerItemsWrapper.find('.picker-item');
                for(var i in items){
                    var me = $(items[i]);
                    var _val = me.attr('_value');

                    self.$input.val(me.text());
                    self.$input.attr('_val', _val);

                    //去掉已选择的
                    me.removeClass('picker-selected');

                    if(_val == val){
                        me.addClass('picker-selected');
                        //改变偏移值
                        var index = 90 - (i)*36;
                        self.$pickerItemsWrapper.css('transform', 'translate3d(0px, '+index+'px, 0px)');
                        break;
                    }
                }
            };

        }

        Picker._initialized = true;

    };

    return Picker;

});
