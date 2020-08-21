<template>
    <div class="see-jiugongge">
        <ul class="box" :style="{ backgroundImage: `url(${imageSrc_drawBackground})` }">
            <li class="row">
                <div
                    :class="['col-4', { active: activeClass[index] }]"
                    v-for="(prize, index) in lis1"
                    :key="index"
                >
                    <img :src="prize.thumb"/>
                </div>
            </li>
            <li class="row row-2">
                <div :class="['col-4', { active: activeClass[7] }]">
                    <img :src="prizesList[7].thumb"/>
                </div>
                <div class="col-4 start-button" @click="startLottery">
                    <img :src="lock? imageSrc_lotteryBtnDisable:imageSrc_lotteryBtn"/>
                </div>
                <div :class="['col-4', { active: activeClass[3] }]">
                    <img :src="prizesList[3].thumb"/>
                </div>
            </li>
            <li class="row">
                <div
                    :class="['col-4', { active: activeClass[6 - index] }]"
                    v-for="(prize, index) in lis2"
                    :key="index"
                >
                    <img :src="prize.thumb"/>
                </div>
            </li>
        </ul>
        <!-- 剩余抽奖次数占位 -->
        <div v-if="radio_surplus===1" class="surplus-block"></div>
        <!-- 滚动播报 -->
        <section v-if="radio_broadcast===1" class="broadcast-wrapper"
                 :style="{ backgroundImage: `url(${imageSrc_broadcastBg})` }">
            <vue-seamless-scroll
                :data="broadcastList"
                :class-option="seamlessOption"
                :style="{height:number_broadcastHeight+'px'}"
                class="seamless-warp">
                <ul>
                    <li class="seamless-item" v-for="(item,index) in broadcastList" :key="index">{{item.title}}</li>
                </ul>
            </vue-seamless-scroll>
        </section>

        <!-- 抽奖成功弹窗 -->
        <van-popup class="receive-popup" v-model="popupShow" :get-container="getContainer">
            <div class="pop-content">
                <img class="bg-aperture" src="//img.ikstatic.cn/MTU4OTc5NTMxNTgyNyMgNDEjcG5n.png" alt="">
                <h3 class="pop-title">恭 喜 获 得</h3>
                <img class="pop-img" :src="prizeResult.thumb" alt=""/>
                <p class="pop-text"><b>{{prizeResult.name}}</b> x {{prizeResult.num}}</p>
                <img class="pop-to-accept" :src="imageSrc_popupBtn" @click="handleClose">
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Popup, Toast } from 'vant'
import { RUN_ENV_H5 } from '@/constant/global'
import VueSeamlessScroll from 'vue-seamless-scroll'
import API from './apis'
import { demoList } from './mock'

const LIST_LENGTH = 8 // 列表长度

export default {
    name: 'SeeLuckyJiugongge',
    components: { VanPopup: Popup, VueSeamlessScroll },
    data () {
        return {
            // 无缝滚动配置
            seamlessOption: {
                step: 0.5
            },
            // 图片列表
            prizesList: [{}, {}, {}, {}, {}, {}, {}, {}],
            // 广播内容
            broadcastList: [
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' }
            ],
            activeClass: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ],
            prizeResultIndex: -1, // 抽奖结果的位置
            prizeResult: {}, // 抽奖结果 对象
            speed: 100, // 速度
            cycle: 20, // 周期
            index: -1,
            count: 8,
            timer: null,
            times: 0,
            speedData: 100,
            lock: false,
            popupShow: false,
            remainedChance: 0
        }
    },
    props: {
        configBtn_prize: {
            label: '奖品添加',
            type: String,
            default: `/pages/activity/prize/index.html`,
            urlParams: 'type=3' // 表示抽奖活动
        },
        configBtn_config: {
            label: '抽奖配置',
            type: String,
            default: `/pages/activity/draw-config/add.html`,
        },
        imageSrc_drawBackground: {
            label: '九宫格背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjIwMTU1OTQ2NSMzNzgjcG5n.png'
        },
        imageSrc_lotteryBtn: {
            label: '开始按钮',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjIwMzc2NTY4NSMzNDgjcG5n.png'
        },
        imageSrc_lotteryBtnDisable: {
            label: '禁止按钮',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjIwMzc1NzYxMCM0NDUjcG5n.png'
        },
        imageSrc_popupBtn: {
            label: '弹窗按钮',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjI5NDYyNzM2MiM2NjkjcG5n.png'
        },
        radio_broadcast: {
            label: '中奖名单播报',
            type: [Number, String],
            default: 1,
            options: [
                { content: '开启', value: 1 },
                { content: '关闭', value: 2 }
            ]
        },
        imageSrc_broadcastBg: {
            label: '播报背景图片',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjIwMjY4MDkwMCM2MjIjcG5n.png'
        },
        number_broadcastHeight: {
            label: '播报展示高度',
            type: Number,
            default: 120
        },
        radio_surplus: {
            label: '剩余抽奖机会',
            type: [Number, String],
            default: 1,
            options: [
                { content: '开启', value: 1 },
                { content: '关闭', value: 2 }
            ]
        },
        beforeLottery: {
            type: Function,
            default (resolve) {
                setTimeout(() => {
                    resolve()
                }, 1000)
            }
        }
    },
    computed: {
        lis1 () {
            return this.prizesList.slice(0, 3)
        },
        lis2 () {
            return this.prizesList.slice(4, 7).reverse()
        }
    },
    mounted () {
        this.speedData = this.speed
        this.getLuckyDraw()
        this.fetchList()
    },
    beforeDestroy () {
    },
    methods: {
        fetchList () {
            // 获取兑奖礼品列表
            API.GET_PRIZE_LIST(this.globalVariable).then(res => {
                let list = []
                if (res.data && res.data.lists && res.data.lists.length > 0) {
                    list = res.data.lists
                } else if (this.isPreview) {
                    list = demoList
                }
                // 把数组 根据 position 扁平
                list = list.reduce((prev, cur) => {
                    cur.position = cur.position || []
                    return [...prev, ...cur.position.map(v => ({ ...cur, giftPosition: +v }))]
                }, [])

                // 把数组 根据 giftPosition 放入九宫格 相应的位置
                const positionList = new Array(LIST_LENGTH).fill({})
                list.forEach(item => {
                    positionList[item.giftPosition - 1] = item
                })
                this.prizesList = positionList
            })
        },
        // 绑定共享数据
        getLuckyDraw () {
            this.remainedChance = 10
            this.$emit('setSharedData', { '抽奖剩余机会': `剩余抽奖机会: ${this.remainedChance}次` })
        },
        getContainer () {
            // 编辑器的时候插入到编辑器面板 否则插入到 body
            return this.RUNTIME_ENV === RUN_ENV_H5
                ? document.querySelector('body')
                : document.querySelector('#editor-main')
        },
        handleClose () {
            this.popupShow = false
        },
        startLottery () {
            if (this.lock) return
            console.log('开始抽奖')
            this.lock = true
            API.POST_DRAW_PRIZE({ num: 1 }).then(res => {
                let prizeResult = {}
                if (res.data && res.data.prize && res.data.prize.length > 0) {
                    prizeResult = res.data.prize[0]
                }
                // if (this.isPreview) { // 在预览环境下填充模拟数据
                //     prizeResult = demoDrawPrizeList.prize[0]
                // }
                this.prizeResultIndex = this.prizesList.findIndex(v => v.id === prizeResult.id)

                if (!prizeResult.id || this.prize === -1) {
                    this.lock = false
                    Toast('很遗憾，未中奖～')
                    return
                }
                this.prizeResult = prizeResult

                this.roll()
            }).catch(() => {
                this.lock = false
            })
        },
        _rollHandler () {
            var index = this.index
            var count = this.count
            for (let i = 0, len = this.activeClass.length; i < len; i++) {
                this.activeClass[i] = false
            }
            index += 1
            if (index > count - 1) {
                index = 0
            }
            this.activeClass[index] = true
            this.index = index
            return false
        },
        roll () {
            // eslint-disable-next-line
            this.activeClass = this.activeClass.map(item => (item = false))
            this.times += 1
            this._rollHandler()
            if (this.times > this.cycle + 10 && this.prizeResultIndex === this.index) {
                clearTimeout(this.timer)
                setTimeout(() => {
                    this._showResult()
                }, 1000)
                this.lock = false
                // this.index = -1
                this.count = 8
                this.timer = null
                this.speedData = this.speed
                this.times = 0
            } else {
                if (this.times < this.cycle) {
                    this.speedData -= 2
                } else {
                    if (this.times > this.cycle + 10 && ((this.prizeResultIndex === 0 && this.index === 7) || this.prizeResultIndex === this.index + 1)) {
                        this.speedData += 110
                    } else {
                        this.speedData += 20
                    }
                }
                if (this.speedData < 40) {
                    this.speedData = 40
                }
                this.timer = setTimeout(() => {
                    this.roll()
                }, this.speedData)
            }
            return false
        },
        _showResult () {
            this.popupShow = true
            console.log('抽奖结束', this.prizeResult)
        },
        // 自定义刷新组件的方法
        refresh () {
            this.fetchList()
        }
    }
}
</script>
<style lang="scss" scoped>
    // 弹窗样式
    @import "~@/style/receive-popup.scss";

    .see-jiugongge {
        width: 100%;
        height: 100%;
        background-size: 100% 100%;

        .box {
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
            background-size: 100% 100%;
            position: relative;
            z-index: 1;

            li {
                overflow: hidden;
                position: relative;
                display: flex;
                justify-content: space-between;
            }

            .row-2 {
                margin: 2% 0;
            }

            li div {
                box-sizing: border-box;
                width: 32%;
                padding-top: 32%;
                position: relative;

                &.active:before {
                    content: "";
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    background-color: rgba(255, 135, 46, 0.62);
                    z-index: 9;
                }
            }

            li div img {
                position: absolute;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .start-button:active {
                opacity: 0.8;
            }
        }

        .broadcast-wrapper {
            margin-top: 10px;
            padding: 50px 20px 20px 20px;
            background-size: 100% 100%;
        }

        .seamless-warp {
            height: 120px;
            overflow: hidden;
        }

        .seamless-item {
            text-align: center;
            border-bottom: 1px dotted #f0c4b3;
        }

        .surplus-block {
            height: 50px;
        }
    }

</style>
