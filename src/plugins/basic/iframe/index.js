import $config from '@/config'
// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '内嵌iframe',
	icon: 'iconfont iconiframetianjia',
	valueType: '',
	defaultStyle: {
		width: $config.canvasH5Width,
		height: 300,
		paddingTop: 10,
		paddingBottom: 10
	}
})

export default Component
