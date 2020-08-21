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
    // 由于 github pages 部署不支持 history 模式，采用hash模式，实际项目建议使用 history 模式
    // mode: 'history'
})
