define(function(require, exports, module) {

    //为开启调试模式时不要打印到页面上
    if(window.location.href.indexOf('admix') === -1) return window.console;

    var $console = $('<div class="admix-ui-console"><h3>自定义控制台</h3><span>关闭</span></div>').appendTo($('body'));
    $console.css({
        'position': 'fixed',
        'bottom': '0',
        'left': '0',
        'right': '0',
        'background': 'rgb(241, 237, 237)',
        'padding': '5px',
        'font-size': '12px',
        'color': 'rgb(51, 51, 51)',
        'z-index': '9999',
        'max-height': '30%',
        'overflow': 'auto'
    });

    $console.find('span').css({
        color: '#fff',
        position: 'absolute',
        right: '5px',
        top: '5px',
        display: 'block',
        borderRadius: '3px',
        background: '#ff0000',
        padding: '5px'
    }).tap(function(){
        $console.hide();
    });

    return {
        log: function(){
            window.console['log'].apply(window.console, arguments);
            var str = '<div style="margin-bottom:5px;">'
            for(var i in arguments){
                str += arguments[i] + ' ';
            }
            str += '</div>';
            $console.append(str);
        }
    };



    return _console;
});
