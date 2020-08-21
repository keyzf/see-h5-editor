// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '音乐播放器',
	icon: 'el-icon el-icon-video-play',
	valueType: '',
	defaultStyle: {
		height: 52,
		width: 52
	}
})

export default Component
