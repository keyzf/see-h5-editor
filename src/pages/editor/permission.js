/**
 *  路由权限相关管理
 * */
import router from '@editor/router'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

