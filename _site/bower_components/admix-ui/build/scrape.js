/**
 * 刮刮卡组件
 */
define(function(require, exports, module) {

    var win = window,
        doc = win.document,
        ua = win.navigator.userAgent,
        requestAnimationFrame = window['requestAnimationFrame'] ||
                                window['msRequestAnimationFrame'] ||
                                window['mozRequestAnimationFrame'] ||
                                window['webkitRequestAnimationFrame'];
    var proto = {
        init : function () {
            var self = this,
                opt = self.options,
                el = self.el = typeof opt.el === 'string' ? document.querySelector(opt.el): opt.el,
                canvas = self.canvas = document.createElement('canvas'), context,
                wrap = self.wrap = document.createElement('div'),
                region = self.region = el.getClientRects()[0];

            el.appendChild(wrap);
            el.appendChild(canvas);
            // el.style.cssText += 'position:relative;';

            canvas.width = region.right - region.left;
            canvas.height = region.bottom - region.top;
            wrap.style.cssText = 'width:100%;height:100%;position:relative;';
            canvas.style.cssText = 'width:' + canvas.width + 'px;height:' + canvas.height + ';position:absolute;top:0;left:0;z-index:9;display:none;';

            if(!(context = self.context = canvas.getContext('2d'))) {
                throw new Error('not support context 2d');
            }

            function ontouchstart (event) {
                if (!self.scraping) return;

                for(var i = 0; i < event.changedTouches.length; i++) {
                    startScrape(event.changedTouches[i]);
                }
            }

            function startScrape (startTouch) {
                var moving = true, x, y;

                function ontouchmove (event) {
                    //fix 页面滚动后刮的位置错位的问题
                    region = self.region = el.getClientRects()[0];

                    var touch;
                    for(var i = 0; i < event.changedTouches.length; i++) {
                        if(event.changedTouches[i].identifier == startTouch.identifier) {
                            touch = event.changedTouches[i];
                            break;
                        }
                    }
                    if(!touch) return;

                    if (x && y) {
                        context.moveTo(x, y);
                    }
                    if ( checkRegion(touch) ) {
                        x = touch.clientX - region.left;
                        y = touch.clientY - region.top;
                        //console.log(x, y);
                        context.lineTo(x, y);
                        context.stroke();
                    }

                    if (opt.forceRefresh) {
                        if(!canvas.style.opacity){
                            canvas.style.opacity = 0.999;
                        }
                        else{
                            canvas.style.opacity = '';
                        }
                    }
                }

                function ontouchend(event){
                    moving = false;

                    var touch;
                    for(var i = 0; i < event.changedTouches.length; i++) {
                        if(event.changedTouches[i].identifier == startTouch.identifier) {
                            touch = event.changedTouches[i];
                            break;
                        }
                    }
                    if(!touch) return;

                    if(checkElements() > opt.activePercent) {
                        endScrape();
                    }

                    doc.removeEventListener('touchmove', ontouchmove, false);
                    doc.removeEventListener('touchend', ontouchend, false);
                }

                doc.addEventListener('touchmove', ontouchmove, false);
                doc.addEventListener('touchend', ontouchend, false);

                if ( checkRegion(startTouch) ) {
                    x = startTouch.clientX - region.left;
                    y = startTouch.clientY - region.top;
                    //console.log(x, y);
                }

                context.beginPath();

                if (requestAnimationFrame && opt.moveChecking) {
                    requestAnimationFrame(function() {
                        if (!moving) return;

                        if(checkElements() > opt.activePercent) {
                            endScrape();
                            doc.removeEventListener('touchmove', ontouchmove, false);
                            doc.removeEventListener('touchend', ontouchend, false);
                        } else {
                            requestAnimationFrame(arguments.callee);
                        }
                    });
                }
            }

            function checkRegion (touch) {
                // 检查是否在刮的区域内
                return (touch.clientX > region.left && touch.clientX < region.right &&
                        touch.clientY > region.top && touch.clientY < region.bottom);
            }

            function checkElements () {
                var elements = wrap.querySelectorAll('.active-el'),
                    pixels = 0, clearedPixels = 0,
                    rect, left, top, width, height;

                if (elements.length === 0) {
                    elements = wrap.querySelectorAll('*');
                }

                for(var j = 0; j < elements.length; j++) {
                    rect = elements[j].getClientRects()[0];
                    if (!rect) continue;
                    left = rect.left - region.left;
                    top = rect.top - region.top;
                    width = rect.right - rect.left;
                    height = rect.bottom - rect.top;
                    data = context.getImageData(left, top, width, height).data;

                    for (var i = 0; i < data.length; i += 4) {
                        pixels ++;
                        if(data[i+3] == 0) clearedPixels++;
                    }
                }

                return clearedPixels/pixels;
            }

            function endScrape () {
                self.scraping = false;
                canvas.style.webkitTransition = 'opacity 0.6s ease';
                canvas.style.opacity = 0;
                setTimeout(function(){
                    canvas.style.display = 'none';
                    opt.onfinish && opt.onfinish();
                }, 600);
            }

            // 在document上监听，解决从区域外滑入无法走下去的问题
            doc.addEventListener('touchstart', ontouchstart, false);


            function checkTouchNearRegion (touch) {
                var offsetX = 10;
                var offsetY = 40;
                // 检查是否在刮的区域内
                return (touch.clientX > (region.left - offsetX) && touch.clientX < (region.right + offsetX) &&
                    touch.clientY > (region.top - offsetY) && touch.clientY < (region.bottom + offsetY));
            }

            function ondocmove (event) {
                var visible = '';
                var computedStyle;
                if (computedStyle = doc.defaultView.getComputedStyle(el, null)) {
                    visible = computedStyle.getPropertyValue('visibility') || computedStyle['visibility'];
                }

                if (!visible) {
                    return;
                }

                if (checkTouchNearRegion(event.changedTouches[0])) {
                    event.preventDefault();
                }
            }

            // 在document上监听，解决页面上有滚动条时，刮的同时偶尔页面会滚动的问题
            doc.addEventListener('touchmove', ondocmove, false);
        },

        replace : function (elements) {
            var self = this,
                wrap = self.wrap,
                canvas = self.canvas;

            if (elements instanceof HTMLElement) {
                elements = [elements];
            }

            wrap.style.visibility = 'hidden';

            if (typeof elements === 'string') {
                wrap.innerHTML = elements;
            } else if (elements instanceof Array){
                wrap.innerHTML = '';
                for (var i = 0; i < elements.length; i++)  {
                    wrap.appendChild(elements[i]);
                }
            }

            wrap.style.visibility = '';

        },

        refresh : function (options) {
            var self = this,
                el = self.el,
                wrap = self.wrap,
                opt = self.options,
                canvas = self.canvas,
                region = self.region,
                context = self.context;

            options || (options = {});

            for (var k in options) {
                opt[k] = options[k];
            }

            wrap.style.visibility = 'hidden';

            canvas.width = region.right - region.left;
            context.globalCompositeOperation = 'source-over'; //解决部分手机白屏问题

            var setScrapeStroke = function () {

                context.globalCompositeOperation = 'destination-out';
                context.lineJoin = 'round';
                context.lineCap = 'round';
                context.strokeStyle = 'rgba(0,0,0,255)';
                context.lineWidth = opt.lineWidth || 30;

                canvas.style.opacity = 1;
                canvas.style.webkitTransition = '';
                canvas.style.display = '';

                wrap.style.visibility = '';
            };

            if (opt.font) {

                context.fillStyle = opt.coverColor;
                context.fillRect(0, 0, region.right - region.left, region.bottom - region.top);

                context.font = opt.font.size + ' ' + (opt.font.family || 'serif');
                context.fillStyle = opt.font.color;
                if (opt.font.x === 'center' || opt.font.y === 'center') {
                    var matrics = context.measureText(opt.font.text);
                    if (opt.font.x === 'center') {
                        opt.font.x = canvas.width/2 - matrics.width/2;
                    }
                    if (opt.font.y === 'center') {
                        opt.font.y = canvas.height/2 - matrics.height/2;
                    }
                }
                context.fillText(opt.font.text, opt.font.x || 0, opt.font.y || 0);

                setScrapeStroke();

                self.scraping = true;   // refresh 表示开始刮了

            } else if (opt.imgSrc) {

                // 拿到图片对象后的绘制回调
                var imgLoadCallback = function (img) {

                    context.drawImage(img, 0, 0, region.right - region.left, region.bottom - region.top);

                    setScrapeStroke();

                    self.scraping = true;   // refresh 表示开始刮了
                };

                // 如果图片
                var imgSrc = opt.imgSrc;
                if(!self.imgs || !(imgSrc in self.imgs)) {

                    var img = new Image();

                    // 避免跨域问题
                    img.crossOrigin = "Anonymous";

                    img.onload = function () {

                        imgLoadCallback(img);

                    };

                    img.src = opt.imgSrc;

                    // 缓存该图片，避免重复加载
                    !self.imgs && (self.imgs = {});
                    self.imgs[imgSrc] = img;

                } else {

                    // 从缓存中查找该图片
                    imgLoadCallback(self.imgs[imgSrc]);

                }
            }
        }
    };

    var scrapeProto = function(options) {
        var self = Object.create({});
        options.activePercent || (options.activePercent = 0.7);
        options.lineWidth || (options.lineWidth = 30);
        self.options = options;
        for (var k in proto) {
            self[k] = proto[k];
        }
        self.init();
        return self;
    };

    var card = null;
    var drawResultFlag = {
        isAward : false
    };

    /**
     * 初始化一个刮刮卡游戏
     * @type {Object}
     */
    var scrape = {

        config : null,

        init : function (config) {
            var me = this;

            me.config = config;

            document.addEventListener('touchmove', function(e){
                e.preventDefault();
            }, false);

            card = scrapeProto({
                el: config.el,
                coverColor: config.coverColor || '#BEBFBE',
                onfinish: function() {
                    var createFinishEle = me.createFinishElements();
                    card.replace(createFinishEle);
                }
            });

            me.config.initFn && me.config.initFn(function(ret) {
                var createInitEle = me.createInitElements(ret);
                card.replace(createInitEle);
            });
        },

        createInitElements : function(initRet) {
            var me = this;
            var button = document.createElement('button');
            button.className = 'scrape-button';
            button.innerHTML = me.config.startBtnTxt || '开始刮奖';

            if(initRet.status == false){
                button.className = 'scrape-button disabled';
                var p = document.createElement('p');
                p.style.cssText = 'position:absolute;top:20px;left:0;width:100%;text-align:center;';
                p.innerHTML = initRet.msg || '系统错误，无法刮奖';
                return [p, button];
            }
            else {
                button.onclick = function() {
                    me.doScrape();
                };

                return button;
            }

        },

        createFinishElements : function() {
            var me = this;
            var p = document.createElement('p'),
                button = document.createElement('button');

            p.style.cssText = 'position:absolute;top:20px;left:0;width:100%;text-align:center;';
            if(drawResultFlag.isAward == true) {
                var prizeLink = drawResultFlag.viewUrl;
                p.innerHTML = '恭喜你中奖了! <a href="'+prizeLink+'">查看奖品</a>';
            } else {
                p.innerHTML = me.config.noAwardTxt || '很遗憾你没有中奖~';
            }
            button.className = 'scrape-button';
            button.onclick = function() {
                me.doScrape();
            };
            button.innerHTML = me.config.restartBtnTxt || '再刮一次';

            //没有抽奖资格了
            if(drawResultFlag.leftTime == 0){
                var p1 = document.createElement('p');
                p1.style.cssText = 'position:absolute;top:50px;left:0;width:100%;text-align:center;';
                p1.innerHTML = '抽奖机会已用完';
                return [p, p1];
            }

            return [p, button];
        },

        createAwardElements : function ( txt ) {
            var me  = this;
            var p = document.createElement('p');
            var noAwardTxt = me.config.noAwardTxt || '很遗憾你没有中奖';

            p.innerHTML = txt == '' ? noAwardTxt : '恭喜你获得：' + txt;
            p.className = 'scrape-prize-area';

            return p;
        },

        doScrape : function () {
            var me = this;

            me.config.drawFn && me.config.drawFn(function(prizeObject) {
                if(prizeObject.status == false){ //抽奖异常等情况
                    return;
                }

                card.refresh({
                    font: {
                        size: '30px',
                        family: '微软雅黑',
                        color: 'black',
                        text: me.config.guideStartTxt || '开始刮刮',
                        x: 'center',
                        y: 80
                    }
                });

                drawResultFlag = prizeObject;
                var prizeName = prizeObject.prizeName || '';
                var createAwardEle = me.createAwardElements(prizeName);

                card.replace(createAwardEle);

            });

        }
    };

    module.exports = scrape;
});
