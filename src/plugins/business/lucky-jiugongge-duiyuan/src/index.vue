<template>
  <div class="see-jiugongge">
    <ul class="box" :style="{ backgroundImage: `url(${imageSrc_drawBackground})` }">
      <li class="row">
        <div
          :class="['col-4', { active: activeClass[index] }]"
          v-for="(prize, index) in lis1"
          :key="index"
        >
          <img v-if="activeClass[index]" class="cell-bg-active" :src="imageSrc_cellBackgroundActive" alt="">
          <img class="cell-bg" :src="imageSrc_cellBackground" alt="">
          <img class="cell-prize-img" :src="prize.thumb"/>
          <div class="cell-prize-name" v-html="prize.name"></div>
        </div>
      </li>
      <li class="row row-2">
        <div :class="['col-4', { active: activeClass[7] }]">
          <img v-if="activeClass[7]" class="cell-bg-active" :src="imageSrc_cellBackgroundActive" alt="">
          <img class="cell-bg" :src="imageSrc_cellBackground" alt="">
          <img class="cell-prize-img" :src="prizesList[7].thumb"/>
          <div class="cell-prize-name" v-html="prizesList[7].name"></div>
        </div>
        <div class="col-4 start-button" @click="startLottery">
          <img v-if="!prizeResult.id" class="cell-bg"
               :src="lock? imageSrc_lotteryBtnDisable:imageSrc_lotteryBtn"/>
          <template v-if="prizeResult.id">
            <img class="cell-bg" :src="imageSrc_lotteryBtnResult"/>
            <div class="cell-text">
              <div>您已获得</div>
              <div v-html="prizeResult.name"></div>
            </div>
          </template>
          <div v-if="radio_surplus===1" class="surplus-block">剩余次数：1</div>
        </div>
        <div :class="['col-4', { active: activeClass[3] }]">
          <img v-if="activeClass[3]" class="cell-bg-active" :src="imageSrc_cellBackgroundActive" alt="">
          <img class="cell-bg" :src="imageSrc_cellBackground" alt="">
          <img class="cell-prize-img" :src="prizesList[3].thumb"/>
          <div class="cell-prize-name" v-html="prizesList[3].name"></div>
        </div>
      </li>
      <li class="row">
        <div
          :class="['col-4', { active: activeClass[6 - index] }]"
          v-for="(prize, index) in lis2"
          :key="index"
        >
          <img v-if="activeClass[6 - index]" class="cell-bg-active" :src="imageSrc_cellBackgroundActive"
               alt="">
          <img class="cell-bg" :src="imageSrc_cellBackground" alt="">
          <img class="cell-prize-img" :src="prize.thumb"/>
          <div class="cell-prize-name" v-html="prize.name"></div>
        </div>
      </li>
    </ul>
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

    <!-- 底部固定模块 -->
    <div class="fixed-bottom">
      <img class="fixed-bottom-bg" :src="imageSrc_bottomBg" alt="">
      <div class="fixed-bottom-content">
        <div class="fixed-bottom-left">{{text_bottomLeft}}{{chargeNum}}</div>
        <button @click="handleBottomRightClick" class="fixed-bottom-right">{{text_bottomRight}}</button>
      </div>
    </div>

    <!-- 抽奖成功弹窗 -->
    <van-popup class="receive-popup" v-model="popupShow" :get-container="getContainer">
      <div class="pop-content">
        <!--<img class="bg-aperture" src="//img.ikstatic.cn/MTU4OTc5NTMxNTgyNyMgNDEjcG5n.png" alt="">
        <h3 class="pop-title">恭 喜 获 得</h3>-->
        <img @click="handleClose" class="pop-close" src="//img.ikstatic.cn/MTU5MzQ5NzU4MTQ2MyM1ODgjcG5n.png"
             alt="">
        <img class="pop-bg" :src="imageSrc_popupBg" alt="">
        <img class="pop-img" :src="prizeResult.thumb" alt=""/>
        <p class="pop-text" v-html="replaceBR(prizeResult.name)"></p>
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
  name: 'SeeLuckyJiugonggeDuiyuan',
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
      prizeResultCatch: {}, // 缓存抽奖结果
      speed: 100, // 速度
      cycle: 20, // 周期
      index: -1,
      count: 8,
      timer: null,
      times: 0,
      speedData: 100,
      lock: false,
      popupShow: false,
      remainedChance: 0,
      chargeNum: 0 // 累计充值
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
      default: `/pages/activity/draw-config/add.html`
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
      default: '//img.ikstatic.cn/MTU5MzUwMzE2NjY5NCMxNDkjcG5n.png'
    },
    imageSrc_lotteryBtnResult: {
      label: '结果按钮',
      type: String,
      default: '//img.ikstatic.cn/MTU5MzUwNDQ0MTU5NSMyMzkjcG5n.png'
    },
    imageSrc_cellBackground: {
      label: '格子背景',
      type: String,
      default: '//img.ikstatic.cn/MTU5MzQ4Nzc4OTE1NCMgOTMjcG5n.png'
    },
    imageSrc_cellBackgroundActive: {
      label: '格子选中背景',
      type: String,
      default: '//img.ikstatic.cn/MTU5MzQ4Nzg3MDc4NiM5MzgjcG5n.png'
    },
    imageSrc_popupBg: {
      label: '弹窗背景',
      type: String,
      default: '//img.ikstatic.cn/MTU5MzUwOTM4NTg0MSMyNTkjcG5n.png'
    },
    imageSrc_popupBtn: {
      label: '弹窗按钮',
      type: String,
      default: '//img.ikstatic.cn/MTU5MzQ5NzU4OTkxMCM1MjkjcG5n.png'
    },
    imageSrc_bottomBg: {
      label: '底部背景',
      type: String,
      default: '//img.ikstatic.cn/MTU5MzQ5OTIwNjg0NSM1NjgjcG5n.png'
    },
    text_bottomLeft: {
      label: '底部左边',
      type: String,
      default: '活动期间累计充值（元）：'
    },
    text_bottomRight: {
      label: '底部右边',
      type: String,
      default: '去充值'
    },
    text_bottomRightLink: {
      label: '底部右边点击跳转链接',
      type: String,
      default: 'https://www.xxx.cn'
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
      label: '剩余抽奖次数',
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
  created () {
    this.speedData = this.speed
    this.initData()
  },
  methods: {
    async initData () {
      if (!this.globalVariable.uid && this.globalVariable.sid) {
        const { data } = await API.GET_UID_BY_SID({ sid: this.globalVariable.sid })
        this.globalVariable.uid = data.user.id
      }
      this.getLuckyDraw()
      this.fetchList()
    },
    replaceBR (str) {
      if (!str) return str
      const indexOf = str.indexOf('</br>')
      const len = str.substring(indexOf, str.length)
      return str.replace(len, '')
    },
    handleBottomRightClick () {
      try {
        if (!window.LXFlutter) throw new Error('bridge 不存在，请检查是否已将bridge注入')
        window.LXFlutter.postMessage(JSON.stringify({ message: 'recharge' }))
      } catch (error) {
        console.error(error)
      }
    },
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
      // 获取我的奖品
      API.GET_ME_PRIZE(this.globalVariable).then(res => {
        if (res.data.prize && res.data.prize.length > 0) {
          this.prizeResult = res.data.prize[0]
        }
      })
      // 获取我的奖品
      API.GET_DRAW_PRIZE_NUM(this.globalVariable).then(res => {
        if (res.data.ohter_info) {
          this.chargeNum = res.data.ohter_info.charge_num
        }
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
      if (this.lock || this.prizeResult.id) return
      console.log('开始抽奖')
      this.prizeResult = {}
      this.lock = true
      API.POST_DRAW_PRIZE({ num: 1 }, this.globalVariable).then(res => {
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

        this.prizeResultCatch = prizeResult

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
      this.prizeResult = this.prizeResultCatch
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

  .pop-img {
    max-width: 200px;
    top: 106px;
    animation: none;
  }

  .pop-text {
    top: 144px;
    color: #513509;
    font-weight: bold;
  }

  .pop-to-accept {
    width: 130px;
    bottom: 50px;
  }

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
        position: relative;
        display: flex;
        justify-content: space-between;
      }

      li div {
        box-sizing: border-box;
        width: 33.333%;
        position: relative;

        &.active:before {
          content: "";
          display: none;
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

      .start-button:active {
        opacity: 0.8;
      }

      .cell-prize-img {
        position: absolute;
        width: 62%;
        top: 0;
        left: 50%;
        margin-left: -31%;
        z-index: 2;
      }

      .cell-prize-name {
        position: absolute;
        width: 100%;
        bottom: 10px;
        top: 60%;
        z-index: 3;
        text-align: center;
      }

      .cell-bg, {
        width: 100%;
      }

      .cell-bg-active {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 1;
      }

      .surplus-block {
        position: absolute;
        width: 100%;
        bottom: 10px;
        top: 60%;
        z-index: 3;
        text-align: center;
      }

      .cell-text {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1;
        color: #fff;
        line-height: 20px;

        div {
          width: 100%;
        }
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
  }

  .fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: $zIndex-fixed;
    width: 100%;
    min-height: 40px;
    box-sizing: border-box;

    &-bg {
      width: 100%;
      display: block;
    }

    &-content {
      box-sizing: border-box;
      padding: 0 10px;
      position: absolute;
      z-index: 9;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-right {
      border: 1px solid #fff;
      background-color: transparent;
      border-radius: 30px;
      width: 85px;
      height: 30px;
      line-height: 30px;
      padding: 0;
    }

  }

</style>
