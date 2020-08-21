// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '按钮',
	icon: 'iconfont iconanniuzu',
	// 每个组件设置props来展示哪些显示哪些编辑项
	valueType: '', // 标识数据类型，用于表单组件
	defaultStyle: {
		width: 140,
		height: 40,
		paddingTop: 10,
		paddingBottom: 10,
		borderColor: '#999999',
		borderStyle: 'solid',
		borderWidth: 1,
		borderRadius: 4,
        textAlign: 'center'
	}
})
export default Component
