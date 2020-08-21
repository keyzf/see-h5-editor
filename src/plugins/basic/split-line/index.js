// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '分割线',
	icon: 'iconfont icon758bianjiqi_fengexian',
	valueType: '',
	defaultStyle: {
		height: 1,
		width: 300,
		backgroundColor: '#999999'
	}
})

export default Component
