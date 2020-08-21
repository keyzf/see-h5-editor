// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
import $config from '@/config'

Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '图片',
	icon: 'iconfont icontupian',
	valueType: '', // 标识数据类型，用于表单组件,
	defaultStyle: {
		height: 200,
		width: $config.canvasH5Width
	}
})

export default Component
