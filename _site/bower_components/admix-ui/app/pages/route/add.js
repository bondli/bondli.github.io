define(function(require){
    return {
        i: 0,
        init: function($route, routers){
            var self = this;
            self.$route = $route.append('<p>this is add route, return index <a href="#/index" class="btn">go index</a></p>');
            self._bind();

            /*$route.on('click', '.add',function(){
                console.log('add', self.i++);
            });

            self.$route.on('click','.btn',function(){
                var route = $(this).attr('data-route');
                routers.switchRoute(route);

            });

            $(window).off('scroll').on('scroll',function(){
                console.log('add',self.i++);
            });*/
        },

        _bind: function(){
            var self = this;
        },

        destory: function(){
            console.log(4444);
        }
    }
});
