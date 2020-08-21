<template>
    <div class="h5-node"
         v-show="visible"
         @click.stop="handleClick"
         :style="getCommonStyle(nodeInfo.commonStyle, scalingRatio)"
    >
        <component
            :is="nodeInfo.elName"
            :defaultStyle="getCommonStyle(nodeInfo.commonStyle, scalingRatio)"
            class="h5-node-info"
            v-bind="{
                    ...computedProps,
                    uuid:nodeInfo.brotherUuid,
                    currentPageIndex:currentPageIndex
                }"
        >
            <template v-if="nodeInfo.elements && nodeInfo.elements.length > 0 && nodeInfo.hasSlot" v-slot="{item}">
                <h5-node
                    class="h5-node-info-wrapper"
                    v-for="element in nodeInfo.elements"
                    :key="element.brotherUuid"
                    :nodeInfo="element"
                    :scope="item"
                    v-on="$listeners"
                    :currentPageIndex="currentPageIndex"
                >
                </h5-node>
            </template>
        </component>
    </div>
</template>

<script>
import runAnimations from '@editor/common/js/runAnimations'
import plugins from '@/plugins/index'
import editorProjectConfig from '@editor/pages/editor/DataModel'
import globalVariable from '@/mixins/globalVariable'
import elementEvents from '@editor/mixins/elementEvents'
import $config from '@/config'

export default {
    name: 'h5-node',
    mixins: [globalVariable, elementEvents],
    components: {
        ...plugins
    },
    data () {
        return {
            getCommonStyle: editorProjectConfig.getCommonStyle,
            scalingRatio: 1,
            pageData: {
                height: '',
                width: '',
                pages: []
            },
            pages: [],
            currentPage: {
                commonStyle: {}
            },
            pageTop: 0,
            loading: true,
            updateKey: 'none' // 更新key强制更新整个页面
        }
    },
    computed: {
        computedProps () {
            const props = {}
            const tempProps = {}
            for (const propKey in this.nodeInfo.propsValue) {
                if (
                    Object.prototype.toString.call(this.nodeInfo.propsValue[propKey]) ===
                    '[object Object]'
                ) {
                    tempProps[propKey] = this.nodeInfo.propsValue[propKey].value
                } else {
                    tempProps[propKey] = this.nodeInfo.propsValue[propKey]
                }

                props[propKey] = this.renderString(tempProps[propKey], { ...this.globalVariable, ...this.scope, ...this.sharedData })
            }
            return props
        },
        visible () {
            const { visible, invisible } = this.nodeInfo
            if (typeof visible !== 'string' && typeof invisible === 'boolean') return !invisible // 当visible不存在 兼容老代码
            let result = undefined
            try {
                result = new Function('props', 'scope','"use strict";' + visible)(this.computedProps, this.scope)
            } catch (error) {
                // console.log(error)
            }
            return result // 动态执行这段逻辑
        }
    },
    props: {
        nodeInfo: {
            type: Object,
            require: true
        },
        scope: {
            type: Object,
            require: true
        },
        currentPageIndex: {
            type: Number,
            default: 0
        }
    },
    mounted () {
        let cssText = this.$el.style.cssText
        let animations = this.nodeInfo.animations || []
        this.scalingRatio = document.body.clientWidth / $config.canvasH5Width
        runAnimations(this.$el, animations, false, () => {
            this.$el.style.cssText = cssText
        })
    },
    methods: {
        async handleClick () {
            const eventsData = this.nodeInfo.events
            const element = this.nodeInfo
            for (let i = 0, len = eventsData.length; i < len; i++) {
                if (this['_event_' + eventsData[i].type]) {
                    if (eventsData[i].type === 'togglePage') {
                        this.$emit('toggle-status', eventsData[i].url)
                        continue
                    }
                    await this['_event_' + eventsData[i].type](
                        eventsData[i],
                        element,
                        this.pageData
                    )
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .h5-node-info {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
</style>
