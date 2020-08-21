import { throttle } from 'lodash'

export default {
    data () {
        return {
            guide: {
                line: {
                    top: new Set(),
                    left: new Set()
                },
                show: {
                    top: new Set(),
                    left: new Set()
                }
            },
            movingElement: { // 当前移动中的元素
                left: 0, top: 0, width: 0, height: 0
            }
        }
    },

    created () {
        this._updateGuideLine = throttle(this._updateGuideLine, 50)
        this._checkIsInGuideLine = throttle(this._checkIsInGuideLine, 50)
    },

    computed: {
        // 当前元素的上线左右点
        activePoint () {
            if (!this.movingElement) return ({
                left: 0, top: 0, right: 0, bottom: 0, hCenter: 0, vCenter: 0
            })
            const { left, top, width, height } = this.movingElement
            const right = left + width
            const bottom = top + height
            // 水平中线
            const hCenter = (bottom - top) / 2 + top
            // 垂直中线
            const vCenter = (right - left) / 2 + left

            return { left, top, right, bottom, hCenter, vCenter }
        }
    },

    mounted () {
    },
    methods: {
        /**
         * 清空辅助线
         */
        _clearGuideLine () {
            this.guide.line.left = new Set()
            this.guide.line.top = new Set()
        },
        /**
         * 清空显示的辅助线
         */
        _clearGuideShow () {
            this.guide.show.left = new Set()
            this.guide.show.top = new Set()
        },
        /**
         * 更新辅助线位置
         */
        _updateGuideLine () {
            this._clearGuideLine()
            this.elements.forEach(element => {
                // 不对比自己
                if (element.uuid === this.activeElementUUID) return
                // 拿到上下左右点
                const { left, top, width, height } = element.commonStyle
                const right = left + width
                const bottom = top + height
                // 水平中线
                const hCenter = (bottom - top) / 2 + top
                // 垂直中线
                const vCenter = (right - left) / 2 + left
                // 添加到画板辅助线中
                if (!isNaN(left)) {
                    this.guide.line.left.add(left)
                }
                if (!isNaN(top)) {
                    this.guide.line.left.add(top)
                }
                if (!isNaN(right)) {
                    this.guide.line.left.add(right)
                }
                if (!isNaN(vCenter)) {
                    this.guide.line.left.add(vCenter)
                }
                if (!isNaN(bottom)) {
                    this.guide.line.top.add(bottom)
                }
                if (!isNaN(hCenter)) {
                    this.guide.line.top.add(hCenter)
                }
            })
        },

        _checkIsInGuideLine () {
            this._clearGuideShow()
            ;['left', 'right', 'vCenter'].forEach(key => {
                const { isIn, value } = this._checkInGuide(this.guide.line.left, this.activePoint[key])
                if (isIn) {
                    this.guide.show.left.add(value)
                }
            })

            ;['top', 'bottom', 'hCenter'].forEach(key => {
                const { isIn, value } = this._checkInGuide(this.guide.line.top, this.activePoint[key])
                if (isIn) {
                    this.guide.show.top.add(value)
                }
            })
        },

        // 不直接用 has 对比，因为可能有 1px 的精度损失
        _checkInGuide (guide, num) {
            for (let g of guide) {
                if (Math.abs(g - num) < 10) {
                    return {
                        isIn: true,
                        value: g
                    }
                }
            }
            return {
                isIn: false,
                value: 0
            }
        }
    }
}
