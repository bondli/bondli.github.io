define(function(require){
    var Edit = function($route, routers){
        var $route =$route;
        $route.append('<p>this is edit route, return index <a href="#/index" class="btn">go index</a></p>')
        $route.on('click','.btn',function(){
            var route = $(this).attr('data-route');
            routers.switchRoute(route);
        });
    }
    Edit.prototype = {
        destory: function(){
            console.log(666);
        }
    };
    return Edit;
});
