import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from '@/config'
import filters from './filters/index'
import globalVariable from '@/mixins/globalVariable'
import pluginMixin from '@/plugins/mixins/pluginMixins'
import $utils from '@/utils'

import Element from 'element-ui'
import './common/styles/element-variables.scss'
import './common/styles/index.scss' // 自定义 css
import 'animate.css'

import { RUN_ENV_EDITOR } from '@/constant/global'

Vue.use(Element)

/**
 * 引入公共方法mUtils
 */
Vue.prototype.$utils = $utils;


/**
 * 公共配置信息
 */
Vue.prototype.$config = config
Vue.prototype.RUNTIME_ENV = RUN_ENV_EDITOR // 组件的运行环境 因为同一个组件在编辑器和H5 可能有不同的展现形式

// 注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

// 全局注册mixin
Vue.mixin(globalVariable);
Vue.mixin(pluginMixin)
;

String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

Vue.config.productionTip = false

// Vue.config.devtools = true
// Vue.config.performance = true

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
