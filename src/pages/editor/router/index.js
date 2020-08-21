import Vue from 'vue'
import Router from 'vue-router'
import PageList from '@editor/pages/page-list/index'

Vue.use(Router)

/**  各个模块 */
export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			// component: () => import('@/pages/home/index'),
			redirect: { name: 'PageList' },
		},
        {
            path: '/page-list',
            name: 'PageList',
            component: PageList
        },
		{
			path: '/editor',
			name: 'Editor',
			component: () => import('@editor/pages/editor/Index')
		},
        {
            path: '/demo',
            name: 'Demo',
            component: () => import('@editor/pages/Demo')
        },
	]
})
