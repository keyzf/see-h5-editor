/**
 *  全局变量mixins
 * */
import Bus from '@/utils/eventBus'
import { E_REFRESH } from '@/constant/eventBusConstant'
import get from 'lodash/get'
import $utils from '@/utils'

const IS_DEV = process.env.NODE_ENV === 'development'

export default {
    data () {
        return {
            globalVariable: {}
        }
    },
    computed: {
        // url上是否有预览参数
        isPreview () {
            return this.globalVariable.is_preview === '1'
        }
    },
    created () {
        this.getUrlParams()
    },
    mounted () {
        Bus.$on(E_REFRESH, this.refresh)
    },
    watch: {
        $route () {
            this.getUrlParams()
        }
    },
    methods: {
        getUrlParams () {
            this.globalVariable = $utils.getUrlParams()
            // 兼容生产环境的 activity_id 加在 url 的 params上 例如 http://www.aaa.com/1 这种 可以优先取值 参数
            if (this.$route && this.$route.params.activity_id && !IS_DEV) {
                this.globalVariable.activity_id = this.$route.params.activity_id
            }
        },

        renderString (source, ctx, uuid) {
            if (typeof source !== 'string') return source
            return source.replace(/\{\{(.*?)\}\}/g, (match, key) => {
                if (uuid) {
                    key = key.indexOf(uuid) >= 0 ? key : `${uuid}.${key}`
                    // console.log(key)
                }
                return get(ctx, key.trim()) !== undefined ? get(ctx, key.trim()) : match
            })
        },
        // 刷新组件的方法 可在 组件内覆盖该方法
        refresh () {
            // console.log(`通知 ${this.$options.name} 组件刷新`)
        }
    }
}
