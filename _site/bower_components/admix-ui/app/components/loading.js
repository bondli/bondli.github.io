define(function(require, exports, module) {

    return {

        hide : function(){
            $('.admix-ui-loading-overlay, .admix-ui-loading, .admix-ui-loading-inline').remove();
        },

        show: function(options){
            var msg = '数据加载中...';

            //标签加载器
            if(typeof options === 'object'){
                msg = options.msg || msg;
                var $renderTo = $(options.renderTo),
                    $loaderLabel = $('<div class="admix-ui-loading-inline"></div>'),
                    $loaderIcon = $('<span class="loading-icon"></span>'),
                    $loaderText = $('<span class="loading-text">'+msg+'</span>');

                $loaderIcon.appendTo($loaderLabel);
                $loaderText.appendTo($loaderLabel);

                //防止加载多个
                if($renderTo.find('.admix-ui-loading-inline').length === 0){
                    $loaderLabel.appendTo($renderTo);
                }

                var w = parseInt($loaderText.width());
                //25是loading图标20px,marginLeft:5px, 1是bugfix
                $loaderLabel.css('width', (w + 25 + 1) + 'px');

            }
            //全局加载器
            else{
                msg = options || msg;
                var $loaderOverlay = $('<div class="admix-ui-loading-overlay"></div>'),
                    $loaderModal = $('<div class="admix-ui-loading"></div>'),
                    $loaderIcon = $('<span class="loading-icon"></span>'),
                    $loaderText = $('<span class="loading-text">'+msg+'</span>');

                $loaderIcon.appendTo($loaderModal);
                $loaderText.appendTo($loaderModal);

                $loaderOverlay.appendTo($('body'));
                $loaderModal.appendTo($('body'));

                var w = parseInt($loaderModal.width())/2;
                var h = parseInt($loaderModal.height())/2;

                $loaderModal.css({
                    'marginLeft': '-' + w + 'px',
                    'marginTop': '-' + h + 'px'
                });
            }
        }

    };

});
