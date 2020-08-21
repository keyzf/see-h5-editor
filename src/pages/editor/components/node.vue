/** 组件编辑外层拖拽，可编辑按钮，缩放改变盒子大小 */
<template>
    <div
        class="components-moveable"
        v-show="visible"
        :class="{ active: nodeInfo.uuid === activeElementUUID ,'drop-inner':dropInner}"
        :style="{
            ...getCommonStyle(nodeInfo.commonStyle),
            transition: 'unset'
        }"
        @dragover="handleDragOver"
        @dragleave="handleDragleave"
        @drop="handleDrop"
        @dragenter="handleDragEnter"
        @click="handleMousedown"
    >
        <div class="component-name">{{ nodeInfo.name }}</div>
        <component
            :is="nodeInfo.elName"
            :defaultStyle="getCommonStyle(nodeInfo.commonStyle)"
            :uuid="nodeInfo.brotherUuid"
            :ref="`component_${nodeInfo.uuid}`"
            v-bind="computedProps"
            class="see-node-info"
        >
            <template
                v-if="
                    nodeInfo.elements &&
                        nodeInfo.elements.length > 0 &&
                        nodeInfo.hasSlot
                "
                v-slot="{ item }"
            >
                <node
                    v-for="element in nodeInfo.elements"
                    :key="element.uuid"
                    :scope="item"
                    :nodeInfo.sync="element"
                    :verticalGuidelines="verticalGuidelines"
                    :horizontalGuidelines="horizontalGuidelines"
                />
            </template>
        </component>
    </div>
</template>

<script>
import runAnimations from '@editor/common/js/runAnimations'
import editorProjectConfig from '@editor/pages/editor/DataModel'
import plugins from '@/plugins/index'
import Bus from '@/utils/eventBus'
import getOffset from '@/utils/getOffset'
import { mapGetters, mapState } from 'vuex'
import Moveable from 'moveable'
import globalVariable from '@/mixins/globalVariable'

export default {
    name: 'Node',
    mixins: [globalVariable],
    components: {
        ...plugins
    },
    data () {
        return {
            show: true,
            dropInner: false
        }
    },
    props: {
        nodeInfo: {},
        defaultStyle: {
            require: true,
            type: Object
        },
        verticalGuidelines: {
            type: Array,
            default: () => []
        },
        horizontalGuidelines: {
            type: Array,
            default: () => []
        },
        scope: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapState({
            pages: state => state.editor.projectData.pages,
            projectData: state => state.editor.projectData,
            activePageUUID: state => state.editor.activePageUUID,
            activeElementUUID: state => state.editor.activeElementUUID
        }),
        ...mapGetters([
            'currentPageIndex',
            'activeElement',
            'activePage',
            'sharedData'
        ]),
        computedProps () {
            const props = {}
            for (const propKey in this.nodeInfo.propsValue) {
                props[propKey] = this.renderString(
                    this.nodeInfo.propsValue[propKey],
                    {
                        ...this.globalVariable,
                        ...this.scope,
                        ...this.sharedData
                    }
                )
            }
            // console.log(props)
            return props
        },
        visible () {
            const { visible, invisible } = this.nodeInfo
            if (typeof visible !== 'string' && typeof invisible === 'boolean') return !invisible // 当visible不存在 兼容老代码
            let result = undefined
            try {
                result = new Function('props', 'scope', '"use strict";' + visible)(this.computedProps, this.scope)
            } catch (error) {
                // console.log(error)
            }
            return result // 动态执行这段逻辑
        }
    },
    watch: {
        scope: {
            handler () {
                // console.log("(this.scope", this.scope);
            },
            deep: true
        },
        defaultStyle: {
            handler () {
                this.moveable && this.moveable.updateRect()
            },
            deep: true
        },
        activeElementUUID (val) {
            this.moveable.resizable = val === this.nodeInfo.uuid
        },
        verticalGuidelines (val) {
            this.moveable && (this.moveable.verticalGuidelines = val)
        },
        horizontalGuidelines (val) {
            this.moveable && (this.moveable.horizontalGuidelines = val)
        }
    },
    mounted () {
        this.animatePlaying = false
        Bus.$on('RUN_ANIMATIONS', (uuid, animations) => {
            if (uuid !== this.nodeInfo.uuid) {
                return
            }
            // 正在执行的动画不允许插入新动画
            if (this.animatePlaying) return
            let cssText = this.$el.style.cssText
            this.animatePlaying = true
            runAnimations(this.$el, animations, true, () => {
                this.$el.style.cssText = cssText
                this.animatePlaying = false
            })
        })
        this.initMovable()
        window.addEventListener('resize', this.moveable.updateRect, {
            passive: true
        })
    },
    methods: {
        getCommonStyle: editorProjectConfig.getCommonStyle,
        handleMousedown (e) {
            e.preventDefault()
            e.stopPropagation()
            if (this.activeElementUUID !== this.nodeInfo.uuid) {
                this.$store.dispatch(
                    'setActiveElementUUID',
                    this.nodeInfo.uuid
                )
            }
        },

        initMovable () {
            // console.log(this)
            const parent =
                this.$el.parentElement.id === 'editor-main'
                    ? this.$el.parentElement
                    : this.$parent.$el
            this.moveable = new Moveable(parent, {
                target: this.$el,
                draggable: true,
                resizable: this.activeElementUUID === this.nodeInfo.uuid,
                snappable: true,
                snapCenter: true,
                // throttleResize: 1,
                // throttleDrag: 1,
                // snapThreshold: 3,
                // bounds: {
                //     left: 0, // 拖动范围
                //     top: 0 // 拖动范围
                // },
                origin: false,
                verticalGuidelines: this.verticalGuidelines,
                horizontalGuidelines: this.horizontalGuidelines
            })
                .on('drag', e => {
                    const { target, left, top } = e
                    // console.log(target)
                    if (!target.classList.contains('active')) return
                    target.style.left = `${left}px`
                    target.style.top = `${top}px`
                })
                .on('resizeStart', ({ setOrigin }) => {
                    setOrigin(['%', '%'])
                })
                .on('resize', e => {
                    const { target, width, height, drag } = e
                    // console.log(target)
                    if (!target.classList.contains('active')) return
                    target.style.width = `${width}px`
                    target.style.height = `${height}px`
                    target.style.left = `${drag.left}px`
                    target.style.top = `${drag.top}px`
                })
                .on('dragEnd', ({ target }) => {
                    this.handleResizeEnd(target)
                })
                .on('resizeEnd', ({ target }) => {
                    // console.log("resize");
                    this.handleResizeEnd(target)
                })
        },
        handleResizeEnd (target) {
            const newerStyle = {
                ...this.nodeInfo.commonStyle,
                top: Number(target.style.top.replace('px', '')),
                left: Number(target.style.left.replace('px', '')),
                width: Number(target.style.width.replace('px', '')),
                height: Number(target.style.height.replace('px', ''))
            }
            this.$store.commit('updateElement', {
                key: 'commonStyle',
                data: newerStyle,
                uuid: this.nodeInfo.uuid
            })
            this.$emit('resizeEnd')
        },
        handleDragEnter (e) {
            if (this.nodeInfo.hasSlot) {
                this.dropInner = true
            }
            e.preventDefault()
        },
        handleDragleave () {
            this.dropInner = false
            // e.currentTarget.classList.remove('drop-inner')
        },
        handleDragOver (e) {
            e.preventDefault()
        },
        /**
         * 处理拖动
         */
        handleDrop (e) {
            this.dropInner = false
            e.preventDefault()
            e.stopPropagation()
            const transferedData = e.dataTransfer.getData('dragElement')
            if (transferedData) {
                let item = JSON.parse(transferedData)
                const targetPosition = { left: e.clientX, top: e.clientY }
                const panelPosition = getOffset(e.currentTarget)
                // 这里修改一下添加到到位置 算到组件到中心
                // panelPosition是画板的位置 clientX，clientY是元素拖动到的位置
                item.defaultStyle.left =
                    targetPosition.left -
                    panelPosition.left -
                    (item.defaultStyle.width &&
                    // 这里有可能是undefined或者auto
                    typeof item.defaultStyle.width === 'number'
                        ? item.defaultStyle.width / 2
                        : 0)
                item.defaultStyle.top =
                    targetPosition.top -
                    panelPosition.top -
                    (item.defaultStyle.height &&
                    typeof item.defaultStyle.height === 'number'
                        ? item.defaultStyle.height / 2
                        : 0)
                this.$store.dispatch('addElement', {
                    elData: item,
                    targetUUID: this.nodeInfo.uuid
                })
            }
        }
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.moveable.updateRect)
        this.moveable && this.moveable.destroy()
    }
}
</script>

<style lang="scss" scoped>
    .components-moveable {
        cursor: move;
        user-select: none;

        &.drop-inner {
            box-shadow: 0 0 5px 5px $white !important;
        }

        .component-name {
            display: none;
            position: absolute;
            top: 0;
            left: 10px;
            padding: 2px;
            background-color: $primary;
            color: $white;
            font-size: 10px;
        }

        &:hover,
        &.active {
            outline: 1px solid $primary;

            .component-name {
                display: inline-block;
            }
        }
    }
</style>
<style lang="scss">
    .editor-pane {
        .moveable-control-box .moveable-line.moveable-direction {
            background-color: transparent;
        }

        .rCS2a3loo .moveable-control {
            width: 12px;
            height: 12px;
            border: 1px solid $primary;
            background-color: $white;
        }
    }

    .see-node-info {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
</style>
