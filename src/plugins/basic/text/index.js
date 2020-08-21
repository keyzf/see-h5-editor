// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '文字',
	icon: 'iconfont iconwenben',
	// 每个组件设置props来展示哪些显示哪些编辑项
	valueType: '', // 标识数据类型，用于表单组件
	defaultStyle: {
		height: 40,
		width: 200
	}
})

export default Component
