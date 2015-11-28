define(function(require, exports, module) {

    //定义需要操作的dom
    var $body = $('body'),
        $overlay = $('<div class="dialog-overlay calendar-dialog-overlay"></div>');

    function Calendar (option) {

        var options = {
            beginyear : 1970,                 //日期--年--份开始
            endyear : 2020,                   //日期--年--份结束
            beginmonth : 1,                   //日期--月--份结束
            endmonth : 12,                    //日期--月--份结束
            beginday : 1,                     //日期--日--份结束
            endday : 31,                      //日期--日--份结束
            beginhour : 1,
            endhour : 23,
            beginminute : 00,
            endminute : 59,
            type: 'date'
        };

        $.extend(options, option || {});

        this.$input = $(options.input).attr('readonly', true);

        var initDate = new Date();

        if(this.$input.val() && options.type != 'time'){
            var dateStr = this.$input.val().replace(/-/g,'/');
            initDate = new Date(dateStr);
        }

        if(this.$input.val() && options.type == 'time'){
            var arr = (this.$input.val()).split(':');
            initDate = new Date(new Date().setHours(arr[0], arr[1], 0, 0));
        }


        this.$picker = $('<div class="picker-dialog"></div>');
        this.$pickerToolbar = $('<div class="toolbar"></div>');
        this.$dateText = $('<div class="date-text pull-left"></div>');
        this.$closePicker = $('<a href="javascript:;" class="close-picker">今天</a>');
        this.$pickerInner = $('<div class="picker-dialog-inner picker-items"></div>');
        this.$pickerItemsColY = $('<div class="picker-items-col picker-items-col-center"></div>');
        this.$pickerItemsColM = $('<div class="picker-items-col picker-items-col-center"></div>');
        this.$pickerItemsColD = $('<div class="picker-items-col picker-items-col-center"></div>');
        this.$pickerItemsColH = $('<div class="picker-items-col picker-items-col-center"></div>');
        this.$pickerItemsColI = $('<div class="picker-items-col picker-items-col-center"></div>');
        this.$pickerItemsWrapperY = $('<div class="picker-items-col-wrapper picker-year"></div>');
        this.$pickerItemsWrapperM = $('<div class="picker-items-col-wrapper picker-month"></div>');
        this.$pickerItemsWrapperD = $('<div class="picker-items-col-wrapper picker-day"></div>');
        this.$pickerItemsWrapperH = $('<div class="picker-items-col-wrapper picker-hour"></div>');
        this.$pickerItemsWrapperI = $('<div class="picker-items-col-wrapper picker-minute"></div>');
        this.$pickerHighLight = $('<div class="picker-center-highlight"></div>');

        /**
         * 绑定点击时间
         * @return {[type]} [description]
         */
        this._bindEvent = function () {
            var self = this;

            //输入框点击事件
            this.$input.on('click', function () {
                self._show();
            });

            //点击完成，关闭选择框
            this.$closePicker.on('click', function(){
                self._setChoiseTime(new Date());
                self._hide();
            });

            //点击遮罩层，关闭选择框
            $('.calendar-dialog-overlay').on('touchend', function(e){
                self._hide();
            });

            //选择可选项
            this.$pickerInner.on('click', '.picker-item', function(){
                var me = $(this);
                var index = me.attr('name') - 0;
                var type = me.attr('_type');

                self._choise(index, type);

            });

            //滚动选择
            this.$pickerInner.on('touchstart touchmove', function(e){
                switch (e.type) {
                    case 'touchstart':
                        self._startY = e.touches[0].pageY;
                        break;
                    case 'touchmove':
                        self._endY = e.touches[0].pageY;
                        break;
                }
            });

            this.$pickerInner.on('touchend', function(e){
                var type = $(e.srcElement).attr('_type');
                var moved = self._endY - self._startY;
                var absMoved = Math.abs(self._endY - self._startY);
                var step = Math.ceil(absMoved/36);

                var $curSelected = self.$pickerInner.find('.picker-'+type+' .picker-selected');
                var index = $curSelected.attr('name') - 0;

                if(moved<0 && absMoved>10){ //上拉
                    self._choise(index+step, type);
                }
                else if(moved>0 && absMoved>10){ //下拉
                    self._choise(index-step, type);
                }
            });

        };

        //选择
        this._choise = function (index, type) {
            var self = this;
            var itemLength = self.$pickerInner.find('.picker-'+type+' .picker-item').length;

            //纠正长度
            if(type == 'day'){
                itemLength = itemLength - self.$pickerInner.find('.picker-day .hide').length;
            }

            if(index > itemLength - 1) {
                index = itemLength - 1;
            }

            if(index < 0){
                index = 0;
            }

            self.$pickerInner.find('.picker-'+type).css('transform', 'translate3d(0px, '+(90-index*36)+'px, 0px)');
            self.$pickerInner.find('.picker-'+type+' .picker-selected').removeClass('picker-selected');

            var $item = self.$pickerInner.find('.picker-'+type+' div[name="'+index+'"]');

            self.$input.val($item.text());
            self.$input.attr('_val', $item.attr('_value'));

            $item.addClass('picker-selected');

            var year = self.$pickerInner.find('.picker-year .picker-selected').text();
            var month = self.$pickerInner.find('.picker-month .picker-selected').text();

            //防止选择错误的日期
            if(type == 'year' || type == 'month'){
                this._correctDate(year, month);
            }

            //计算时间
            var day = self.$pickerInner.find('.picker-day .picker-selected').text();
            var dateStr = year + '/' + month + '/' + day;
            if(options.type == 'datetime'){
                var hour = self.$pickerInner.find('.picker-hour .picker-selected').text();
                var minute = self.$pickerInner.find('.picker-minute .picker-selected').text();
                dateStr += ' ' + hour + ':' + minute;
            }
            else if(options.type == 'time'){
                var hour = self.$pickerInner.find('.picker-hour .picker-selected').text();
                var minute = self.$pickerInner.find('.picker-minute .picker-selected').text();
                dateStr = '2015-10-10 ' + hour + ':' + minute;
            }

            this._setChoiseTime(new Date(dateStr));

        };

        /**
         * 纠正日期
         * @param  {[type]} year  [description]
         * @param  {[type]} month [description]
         * @return {[type]}       [description]
         */
        this._correctDate = function (year, month) {
            var days = new Date(year,month,0).getDate();
            var $daySelectItemWrapper = this.$pickerInner.find('.picker-day');
            var selectItemIndex = $daySelectItemWrapper.find('.picker-selected').attr('name');
            if (days == 28) {
                $daySelectItemWrapper.find('div[name="28"]').addClass('hide');
                $daySelectItemWrapper.find('div[name="29"]').addClass('hide');
                $daySelectItemWrapper.find('div[name="30"]').addClass('hide');
                if(selectItemIndex > 27){
                    $daySelectItemWrapper.find('.picker-selected').removeClass('picker-selected');
                    $daySelectItemWrapper.find('div[name="27"]').addClass('picker-selected');
                    $daySelectItemWrapper.css('transform', 'translate3d(0px, '+(90-27*36)+'px, 0px)');
                }
            }
            else if (days == 29) {
                $daySelectItemWrapper.find('div[name="28"]').removeClass('hide');
                $daySelectItemWrapper.find('div[name="29"]').addClass('hide');
                $daySelectItemWrapper.find('div[name="30"]').addClass('hide');
                if(selectItemIndex > 28){
                    $daySelectItemWrapper.find('.picker-selected').removeClass('picker-selected');
                    $daySelectItemWrapper.find('div[name="28"]').addClass('picker-selected');
                    $daySelectItemWrapper.css('transform', 'translate3d(0px, '+(90-28*36)+'px, 0px)');
                }
            }
            else if (days == 30) {
                $daySelectItemWrapper.find('div[name="28"]').removeClass('hide');
                $daySelectItemWrapper.find('div[name="29"]').removeClass('hide');
                $daySelectItemWrapper.find('div[name="30"]').addClass('hide');
                if(selectItemIndex > 29){
                    $daySelectItemWrapper.find('.picker-selected').removeClass('picker-selected');
                    $daySelectItemWrapper.find('div[name="29"]').addClass('picker-selected');
                    $daySelectItemWrapper.css('transform', 'translate3d(0px, '+(90-29*36)+'px, 0px)');
                }
            }
            else {
                $daySelectItemWrapper.find('div[name="28"]').removeClass('hide');
                $daySelectItemWrapper.find('div[name="29"]').removeClass('hide');
                $daySelectItemWrapper.find('div[name="30"]').removeClass('hide');
            }

        };

        /**
         * 设置选中的时间
         */
        this._setChoiseTime = function (time) {
            var tmpYear = time.getFullYear();
            var tmpMonth = time.getMonth() + 1;
            var tmpDate = time.getDate();
            var tmpHour = time.getHours();
            var tmpMinute = time.getMinutes();

            if(tmpMonth<10){ tmpMonth = '0' + tmpMonth;}
            if(tmpDate<10){ tmpDate = '0' + tmpDate;}
            if(tmpHour<10){ tmpHour = '0' + tmpHour;}
            if(tmpMinute<10){ tmpMinute = '0' + tmpMinute;}

            var output = tmpYear + '-' + tmpMonth + '-' + tmpDate;
            if(options.type == 'datetime'){
                output += ' ' + tmpHour + ':' + tmpMinute;
            }
            else if(options.type == 'time'){
                output = tmpHour + ':' + tmpMinute;
            }

            this.$dateText.text(output);
            this.$input.val(output);
        };

        /**
         * 初始化选择框html
         * @return {[type]} [description]
         */
        this._initPicker = function () {
            if (!$('.calendar-dialog-overlay').length) {
                $body.append($overlay);
            }
            this.$pickerToolbar.append(this.$dateText);
            this.$pickerToolbar.append(this.$closePicker);
            this.$picker.append(this.$pickerToolbar);

            if(options.type == 'date' || options.type == 'datetime'){
                this.$pickerItemsColY.append(this.$pickerItemsWrapperY);
                this.$pickerItemsColM.append(this.$pickerItemsWrapperM);
                this.$pickerItemsColD.append(this.$pickerItemsWrapperD);

                this.$pickerInner.append(this.$pickerItemsColY);
                this.$pickerInner.append(this.$pickerItemsColM);
                this.$pickerInner.append(this.$pickerItemsColD);
            }

            if(options.type == 'datetime' || options.type == 'time'){
                this.$pickerItemsColH.append(this.$pickerItemsWrapperH);
                this.$pickerItemsColI.append(this.$pickerItemsWrapperI);
                this.$pickerInner.append(this.$pickerItemsColH);
                this.$pickerInner.append(this.$pickerItemsColI);
            }


            this.$pickerInner.append(this.$pickerHighLight);
            this.$picker.append(this.$pickerInner);

            $body.append(this.$picker);
        };

        /**
         * 初始化选项数据
         */
        this._setData = function (initDate) {
            var initY = parseInt(initDate.getFullYear());
            var initM = parseInt(initDate.getMonth())+1;
            var initD = parseInt(initDate.getDate());
            var initH = parseInt(initDate.getHours());
            var initI = parseInt(initDate.getMinutes());

            //console.log(initY,initM,initD,initH,initI);

            if(options.type == 'date' || options.type == 'datetime'){
                //YEAR
                this._setView(options.beginyear, options.endyear, 'year', initY);
                //MONTH
                var str = '';
                this._setView(options.beginmonth, options.endmonth, 'month', initM);
                //DAY
                this._setView(options.beginday, options.endday, 'day', initD);
            }

            if(options.type == 'datetime' || options.type == 'time'){
                this._setView(options.beginhour, options.endhour, 'hour', initH);
                this._setView(options.beginminute, options.endminute, 'minute', initI);
            }

        };

        //渲染到页面上
        this._setView = function (start, end, type, selectedValue) {
            var self = this;
            var str = '';
            var index = 0;
            var selectedIndex = 0;
            var $wrapper = this.$pickerInner.find('.picker-'+type);
            for(var y = start; y <= end; y++){
                if(y == selectedValue){
                    selectedIndex = index;
                    str += '<div class="picker-item picker-selected" _type="'+type+'" name="'+index+'" _value="'+y+'">'+self._padd(y, type)+'</div>';
                }
                else {
                    str += '<div class="picker-item" _type="'+type+'" name="'+index+'" _value="'+y+'">'+self._padd(y, type)+'</div>';
                }
                index++;
            }
            $wrapper.append(str);
            //改变到选中的位置
            var index = 90 - (selectedIndex)*36;
            $wrapper.css('transform', 'translate3d(0px, '+index+'px, 0px)');
        };

        //时间补位
        this._padd = function (value, type) {
            if( (type == 'hour' || type == 'minute') && value<10 ){
                return '0' + value;
            }
            return value;
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
        this._setData(initDate);
        this._bindEvent();

        if (typeof Calendar._initialized === 'undefined') {

        }

        Calendar._initialized = true;

    };

    return Calendar;

});
