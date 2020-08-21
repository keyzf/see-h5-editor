// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '倒计时',
	icon: 'el-icon el-icon-alarm-clock',
	valueType: '',
	defaultStyle: {
		height: 52,
		width: 280
	}
})

export default Component
