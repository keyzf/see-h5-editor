// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '数据获取',
	icon: 'el-icon el-icon-coin',
	valueType: '',
	defaultStyle: {
		height: 50,
		width: 50
	}
})

export default Component
