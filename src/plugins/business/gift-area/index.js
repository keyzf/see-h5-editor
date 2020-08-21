// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '礼品组件',
	icon: 'el-icon el-icon-present',
	valueType: '',
	defaultStyle: {
		height: 'auto',
		width: 375,
		top: 0
	}
})

export default Component
