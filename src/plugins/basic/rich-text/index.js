// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '富文本',
	icon: 'iconfont icontupian',
	valueType: '',
	defaultStyle: {
		height: 22.5,
		width: 375,
		top: 0
	},
	autoHeight: true,
	autoWidth: true
})

export default Component
