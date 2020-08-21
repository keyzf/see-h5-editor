// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '弹窗',
	visible: 'return false',
	icon: 'iconfont iconkuangjiaframe23',
	valueType: '',
	defaultStyle: {
		height: 471,
		width: 275,
		backgroundColor: '#ffffff'
	}
})

export default Component
