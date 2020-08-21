/**
组件编辑外层拖拽，可编辑按钮，缩放改变盒子大小
*/
<template>
    <div class="components-moveable"
         v-show="!invisible"
         :class="{active: this.uuid===activeElementUUID}"
         @mousedown="handleMousedown">
        <div class="component-name">{{name}}</div>
        <slot/>
    </div>
</template>

<script>
import runAnimations from '@editor/common/js/runAnimations'
import { mapGetters, mapState } from 'vuex'
import Bus from '@/utils/eventBus'
import Moveable from 'moveable'

export default {
    name: 'EditShape',
    data () {
        return {}
    },
    props: {
        invisible: {
            type: Boolean,
            default: false
        },
        defaultStyle: {
            require: true,
            type: Object
        },
        uuid: String,
        resizable: {
            type: [Boolean, Object],
            default: true
        },
        movable: {
            type: Boolean,
            default: true
        },
        autoSize: {
            type: Boolean,
            default: false
        },
        lockRatio: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ''
        },
        verticalGuidelines: {
            type: Array,
            default: () => []
        },
        horizontalGuidelines: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapState({
            pages: (state) => state.editor.projectData.pages,
            projectData: (state) => state.editor.projectData,
            activeElementUUID: (state) => state.editor.activeElementUUID
        }),
        ...mapGetters([
            'currentPageIndex',
            'activeElement',
            'activePage',
            'sharedData'
        ])
    },
    watch: {
        defaultStyle: {
            handler () {
                this.moveable && this.moveable.updateRect()
            },
            deep: true
        },
        activeElementUUID (val) {
            this.moveable.resizable = val === this.uuid
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
            if (uuid !== this.uuid) {
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
        window.addEventListener('resize', this.moveable.updateRect, { passive: true })
    },
    methods: {
        handleMousedown () {
            this.$emit('handleMousedown', this.uuid)
        },
        initMovable () {
            this.moveable = new Moveable(this.$el.parentElement, {
                target: this.$el,
                draggable: true,
                resizable: this.activeElementUUID === this.uuid,
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
                .on('drag', (e) => {
                    const { target, left, top } = e
                    target.style.left = `${left}px`
                    target.style.top = `${top}px`
                })
                .on('resizeStart', ({ setOrigin }) => {
                    setOrigin(['%', '%'])
                })
                .on('resize', (e) => {
                    const { target, width, height, drag } = e
                    target.style.width = `${width}px`
                    target.style.height = `${height}px`
                    target.style.left = `${drag.left}px`
                    target.style.top = `${drag.top}px`
                })
                .on('dragEnd', ({ target }) => {
                    this.emitResizeEnd(target)
                })
                .on('ResizeEnd', ({ target }) => {
                    this.emitResizeEnd(target)
                })
        },
        // 大小位置 变化 结束 更新 store 数据
        emitResizeEnd (target) {
            this.$emit('resizeEnd', {
                ...this.defaultStyle,
                top: Number(target.style.top.replace('px', '')),
                left: Number(target.style.left.replace('px', '')),
                width: Number(target.style.width.replace('px', '')),
                height: Number(target.style.height.replace('px', ''))
            })
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

        .component-name {
            display: none;
            position: absolute;
            top: 0;
            left: 10px;
            padding: 2px;
            background-color: #25A589;
            color: #fff;
            font-size: 10px;
        }

        &:hover, &.active {
            outline: 1px solid #25A589;

            .component-name {
                display: inline-block;
            }
        }


    }
</style>
<style lang="scss">

    .editor-pane {
        .moveable-control-box .moveable-line.moveable-direction {
            background-color: transparent
        }

        .rCS2a3loo .moveable-control {
            width: 12px;
            height: 12px;
            border: 1px solid #25A589;
            background-color: #fff;
        }
    }
</style>
