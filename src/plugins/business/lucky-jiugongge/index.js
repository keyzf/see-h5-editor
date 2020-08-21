// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '九宫格抽奖',
	icon: 'el-icon el-icon-s-grid',
	valueType: '',
	defaultStyle: {
		height: 375,
		width: 375,
		top: 330
	}
})

export default Component
