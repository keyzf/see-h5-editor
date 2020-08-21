<template>
    <div class="see-countdown">
        <count-down :time="countdownTime" :format="text_format" :style="styles" />
    </div>
</template>

<script>
import { CountDown } from 'vant'
import omit from 'lodash/omit'
export default {
    name: 'SeeCountDown',
    props: {
        text_time: {
            label: '结束时间戳',
            type: String,
            default: ''
        },
        text_format: {
            label: '日期显示格式',
            type: String,
            default: 'DD 天 HH 时 mm 分 ss 秒'
        }
    },
    components: {
        CountDown
    },
    data () {
        return {

        }
    },
    computed: {
        styles() {
            return omit(this.defaultStyle, ['top', 'left', 'bottom', 'right', 'position'])
        },
        countdownTime() {
            return (this.text_time || Date.now()) - Date.now()
        }
    },
    created () {

    },
    mounted () {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.see-countdown {

}
</style>
