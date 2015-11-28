define(function (require, exports, module) {
    var Route = require('../components/route');

    var Add = require('./route/add');
    var Eidt = require('./route/edit');
    var router = new Route({
         container: '#page',
         isAnimate: true
    });

	router.addRoute({
		routeName: 'index',
		title: 'index',
		ctr: 'index1 <a href="#/add" class="btn">add click</a> <a href="#/edit" class="btn">edit click</a>'
	});
	router.addRoute({
		title: 'add',
		routeName: 'add',
		ctr: Add
	});
	router.addRoute({
		routeName: 'edit',
		title: 'eidt',
		ctr: Eidt
	})
	router.init();
});
