define(function(require, exports, module) {

    var validatorType = {
        require : /[^(^\s*)|(\s*$)]/,
        email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        phone : /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
        mobile : /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
        alipay : /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|(^1\d{10}$)/,
        id : /^\d{6}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i,
        currency : /^\d+(\.\d+)?$/,
        number : /^\d+$/,
        zip : /^[0-9]\d{5}$/,
        ip  : /^[\d\.]{7,15}$/,
        price : /^(0|[1-9]\d*)\.\d{2}$/,
        discount : /^(\d\.\d)$/,
        integer : /^[-\+]?\d+$/,
        english : /^[A-Za-z]+$/,
        chinese : /^[\u0391-\uFFE5]+$/,
        userName : /^[A-Za-z0-9_]{3,}$/i,
        unSafe : /^(([^\^\.<>,;=?$"':#@！，。；《》｛｝【】￥…\]\[{}`])*)$/
    };

    function FormValid (options) {
        var defaults = {
            container: 'body',
            checkIntime: true,
            handAllResult: function(){console.log(0);},
            handFieldResult: function(){console.log(1);}
        };

        var self = this;

        $.extend(defaults, options || {});

        this.$root = $(defaults.container);

        //实时校验
        if(defaults.checkIntime) {
            self.$root.on('blur', '[data-rule]', function(){
                var me = $(this);
                self.checkField(me);
            });
        }

        this.errors = [];

        //是否需要校验
        this._isNeedCheck = function (elem) {
            //主动声明不需要校验
            var chk = elem.attr('data-check');
            var id = elem.attr('id');

            //alert(id+' check:'+chk);
            //非必填项为空，也不需要校验
            elem.val()
            var isNoRequireEmpty = (elem.attr('data-rule').indexOf('require')<0) && (elem.val()=='');
            //alert(id+' empty '+isNoRequireEmpty+':'+(elem.attr('data-rule').indexOf('require')<0)+':'+(elem.val()=='')+':'+elem.val());
            if( (chk == 'false' || chk == false ) || isNoRequireEmpty){
                return false;
            }
            return true;
        };

        //校验
        this._check = function (elem) {
            var self = this;
            var val = (elem.val()).replace(/(^\s*)|(\s*$)/g,'');
            var id = elem.attr('id');
            var rules = elem.attr('data-rule');
            var msg = elem.attr('data-msg');

            var min = elem.attr('data-min');
            var max = elem.attr('data-max');
            var minlength = elem.attr('data-minlength');
            var maxlength = elem.attr('data-maxlength');
            var compare = elem.attr('data-compare');
            var pattern = elem.attr('data-pattern');

            //先对正则验证
            var ruleArr = rules.split('|');
            for(var i in ruleArr){
                var rule = ruleArr[i];

                if(validatorType[rule]){
                    var ret = validatorType[rule].test(val);

                    self._handResult(elem, msg, ret, rule);

                    if(ret == false){
                        return false;
                    }
                }
            }

            //对外部pattern校验
            //alert(id+ 'pattern',pattern);
            if(pattern){
                var regx = new RegExp(pattern);
                //alert(val+'-'+pattern);
                var ret = regx.test(val);
                //alert(val+'-'+pattern+'-'+ret);
                self._handResult(elem, msg, ret, 'pattern');

                if(ret == false){
                    return false;
                }
            }

            //对最小值的验证
            if(min){
                min = parseFloat(min);
                val = parseFloat(val);
                var ret = min <= val;
                self._handResult(elem, msg, ret,'min');

                if(ret == false){
                    return false;
                }
            }

            //对最大值的验证
            if(max){
                max = parseFloat(max);
                val = parseFloat(val);
                var ret = max >= val;
                self._handResult(elem, msg, ret,'max');

                if(ret == false){
                    return false;
                }
            }

            //对最小长度的验证
            if(minlength){
                minlength = parseInt(minlength, 10);
                val = val.length;
                var ret = minlength <= val;
                self._handResult(elem, msg, ret, 'minlength');

                if(ret == false){
                    return false;
                }
            }

            //对最大长度的验证
            if(maxlength){
                maxlength = parseInt(maxlength, 10);
                val = val.length;
                var ret = maxlength >= val;
                self._handResult(elem, msg, ret,'maxlength');

                if(ret == false){
                    return false;
                }
            }

            if(compare){
                var arr = compare.split('|');
                if(arr.length != 2){ //错误的配置，直接抛错
                    throw('错误的配置');
                    return false;
                }
                var compVal = $('#'+ arr[1]).val() || arr[1];
                var compType = arr[0];

                var type = elem.attr('type');

                //涉及到比较，如果输入框是number,需要转类型
                if(type == 'number'){
                    val = parseFloat(val);
                    compVal = parseFloat(compVal);
                }
                //如果输入框是date/datetime-local，需要转时间类型
                if(type == 'date' || type == 'datetime-local'){
                    val = val.replace('T',' ');
                    //兼容三星的问题
                    val = val.replace('z','')+ ':00';
                    val = new Date(val.replace(/-/g, '/'));

                    compVal = compVal.replace('T',' ');
                    //兼容三星的问题
                    compVal = compVal.replace('z','')+ ':00';
                    compVal = new Date(compVal.replace(/-/g, '/'));
                }

                //避免eval,采用switch来枚举
                switch(compType){
                    case '>':
                        var ret = (val > compVal);
                        break;
                    case '<':
                        var ret = (val < compVal);
                        break;
                    case '=':
                        var ret = (val == compVal);
                        break;
                    case '>=':
                        var ret = (val >= compVal);
                        break;
                    case '<=':
                        var ret = (val <= compVal);
                        break;
                }

                self._handResult(elem, msg, ret,'compare');

                if(ret == false){
                    return false;
                }
            }

            return true;

        };

        //处理校验结果
        this._handResult = function (elem, msg, ret, type) {
            this._handFieldMsg(elem, msg, !ret, type);
            if(!ret){
                this.errors.push({
                    elem: elem,
                    msg: msg,
                    type: type
                });
            }

        }

        //处理消息
        this._handAllMsgs = function () {
            if(this.errors.length){
                defaults.handAllResult(this.errors);
            }

        };

        //处理单条消息
        this._handFieldMsg = function (elem, msg, isShow,type) {
            defaults.handFieldResult(elem, msg, isShow,type);
        };

        if (typeof FormValid._initialized === 'undefined') {

            /**
             * 对单个输入框校验
             * @param  {[type]} $dom [description]
             * @return {[type]}      [description]
             */
            FormValid.prototype.checkField = function (elem) {
                if(typeof elem === 'string'){
                    elem = $(elem);
                }

                if(self._isNeedCheck(elem) == false){
                    return;
                }
                return self._check(elem);

            };

            /**
             * 对整个表单校验
             * @return {[type]} [description]
             */
            FormValid.prototype.checkAll = function () {

                self.errors = [];
                this.$root.find('[data-rule]').each(function(){
                    var me = $(this);

                    var id =me.attr('id');

                    //alert(id+' need check:'+self._isNeedCheck(me));

                    if(self._isNeedCheck(me) == false){
                        return;
                    }
                    self._check(me);
                });

                self._handAllMsgs();

                if(self.errors.length){
                    return false;
                }
                return true;

            };

        }

        FormValid._initialized = true;

    };

    return FormValid;

});
