import { createUUID } from '@/utils'
import { cloneDeep, merge } from 'lodash'
import $config from '@/config'

// 元素配置信息字段
let elementConfig = {
    elName: '', // 组件名
    animations: [], // 动画
    commonStyle: {
        position: 'absolute',
        width: $config.canvasH5Width,
        height: 30,
        top: 200,
        left: 0,
        // rotate: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        borderWidth: 0,
        borderColor: '',
        borderStyle: 'solid',
        borderRadius: 0,
        boxShadow: '',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: 0,
        textAlign: 'left',
        color: '#000000',
        backgroundColor: '',
        backgroundImage: '',
        backgroundSize: 'cover',
        opacity: 1,
        zIndex: 1,
        transition: 'unset'
    }, // 公共样式
    events: [], // 事件
    propsValue: {}, // 属性参数
    value: '', // 绑定值
    valueType: 'String' // 值类型
}
// 页面配置信息字段
let pageConfig = {
    name: '默认状态',
    elements: [],
    commonStyle: {
        backgroundColor: '',
        backgroundImage: '',
        backgroundSize: '100% auto',
        backgroundRepeat:'no-repeat',
        width: $config.canvasH5Width,
        height: $config.canvasH5Height
    },
    config: {}
}
// 项目配置信息字段
let projectConfig = {
    name: 1,
    title: '页面标题',
    description: '这是一个H5可视化编辑器制作的H5',
    coverImage: '',
    auther: '',
    script: '',
    // width: $config.canvasH5Width,
    // height: $config.canvasH5Height,
    pages: []
}


let getElementConfig = function (element, extendStyle = {}) {
    let elementData = cloneDeep(element)
    let type = elementData.valueType || 'String' // 默认string类型
    let dict = {
        'Sting': '',
        'Array': [],
        'Object': {},
        'Boolean': false,
        'Number': 0
        // 待扩展数据类型
    }
    const uuid = createUUID()
    let elementConfigData = cloneDeep(elementConfig)
    let config = {
        ...elementConfigData,
        uuid: uuid,
        brotherUuid: uuid,
        elName: elementData.elName,
        propsValue: cloneDeep(elementData.needProps || {})
    }

    // 样式
    config.commonStyle = merge(config.commonStyle, elementData.defaultStyle)
    config.commonStyle = merge(config.commonStyle, extendStyle)

    config.resizable = elementData.resizable
    config.movable = elementData.movable
    config.autoHeight = elementData.autoHeight || false
    config.autoWidth = elementData.autoWidth || false

    config.value = element.defaultValue || dict[type]
    config.valueType = type
    config.isForm = !!element.isForm
    config.componentsType = element.componentsType
    config.visible = typeof element.visible === 'string' ? element.visible : 'return true'
    config.hasSlot = !!element.hasSlot

    return config
}
let copyElement = function (element, extendStyle = {}) {
    const uuid = createUUID()
    element = cloneDeep(element)
    element.uuid = uuid
    element.brotherUuid = uuid
    element.commonStyle = merge(element.commonStyle, extendStyle)
    // 加上一点偏移量，以作区分
    element.commonStyle.top = element.commonStyle.top + 10
    element.commonStyle.left = element.commonStyle.left + 10
    if (element.elements) {
        element.elements = element.elements.map(item => copyElement(item))
    }
    return element
}

let getPageConfig = function (pageName = 1) {
    return {
        ...cloneDeep(pageConfig),
        uuid: createUUID(),
        name: pageName
    }
}
let copyPage = function (data, pageName) {
    let pageData = cloneDeep(data)
    pageData.uuid = createUUID()
    pageData.name = pageName
    pageData.elements = pageData.elements.map(element => {
        return {
            ...element,
            uuid: createUUID()
        }
    })
    return pageData
}

let getProjectConfig = function () {
    let project = cloneDeep(projectConfig)
    let onePage = getPageConfig()
    project.pages.push({
        ...onePage
    })
    return { ...project }
}

/**
 * 获取元素样式
 * @param styleObj
 * @param scalePoint 缩放比例
 */
let getCommonStyle = function (styleObj) {
    let needUnitStr = ['width', 'height', 'top', 'left', 'bottom', 'right', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom', 'marginTop', 'marginLeft', 'marginRight', 'marginBottom', 'borderWidth', 'fontSize', 'borderRadius', 'letterSpacing']
    let style = {}

    for (let key in styleObj) {
        if (needUnitStr.includes(key) && typeof styleObj[key] === 'number') {
            if ((key === 'width' || key === 'height') && styleObj[key] === 0) {
                style[key] = 'auto'
            } else {
                style[key] = styleObj[key] + 'px'
            }
        } else {
            style[key] = styleObj[key]
        }
    }

    if (style.bottom) {
        delete style.top
    }
    if (style.right) {
        delete style.left
    }
    style.backgroundImage = style.backgroundImage ? `url(${style.backgroundImage})` : ''
    style.backgroundRepeat = style.backgroundRepeat || 'no-repeat'
    return style
}
export default {
    elementConfig,
    pageConfig,
    projectConfig,
    getElementConfig,
    getPageConfig,
    getProjectConfig,
    copyPage,
    copyElement,
    getCommonStyle
}
