import Vue from 'vue'
import Router from 'vue-router'
import Page from '../components/main-page'

Vue.use(Router)

/**  各个模块 */
export default new Router({
    routes: [
        {
            path: '/:activity_id?',
            name: 'page',
            component: Page
        }
    ],
    mode: 'history'
})
