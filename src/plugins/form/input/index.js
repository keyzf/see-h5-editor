// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '文本框',
	icon: 'iconfont iconwenbenkuang',
	isForm: true,
	defaultStyle: {
		height: 38,
		width: 250,
		paddingTop: 2,
		paddingBottom: 2,
		paddingLeft: 10,
		paddingRight: 10,
		borderColor: '#999999',
		borderStyle: 'solid',
		borderWidth: 1,
		borderRadius: 4
	}
})

export default Component
