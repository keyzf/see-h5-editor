/**
 * 组件库入口
 * */
// 基础组件
import basicComponents from './basic'
// 表单组件
import formComponents from './form'
// 功能组件
import functionalComponents from './functional'
// 业务组件
import businessComponents from './business'

// 所有组件列表
export const components = [
  basicComponents,
  formComponents,
  functionalComponents,
  businessComponents
]

let registerComponents = {}
components.forEach(item => {
  // item.componentsType =
  // registerComponents[item.name] = item
  if (item.components) {
    item.components.forEach(component => {
      component.componentsType = item.componentsType
      component.elName = component.name
      registerComponents[component.name] = component
    })
  }
})

// console.log(registerComponents)

// 定义 install 方法，接收 Vue 作为参数
export const install = function (Vue) {
  // 判断是否安装，安装过就不继续往下执行
  if (install.installed) return
  install.installed = true
  // 遍历注册所有组件
  components.forEach(component => Vue.component(component.name, component))
}

export default registerComponents

// export default {
//   install
//   // 所有组件，必须具有 install，才能使用 Vue.use()
// }
