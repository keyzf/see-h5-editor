// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '容器',
	icon: 'iconfont iconjuxing',
	valueType: '',
    hasSlot: true,
    defaultStyle: {
		width: 375,
		height: 300,
		borderColor: '#999999',
		borderStyle: 'solid',
		borderWidth: 2
	}
})

export default Component
