<template>
  <div class="see-gift-area">
    <ul v-if="list.length > 0" :class="cx('list')">
      <li v-for="(item, index) in list" :class="cx('item')" :key="index">
        <div :class="cx('gift-row')">
          <template v-if="Array.isArray(item.condition)">
            <div :class="cx('add-block')" v-for="(points,pointsIndex) in item.condition" :key="pointsIndex">
              <template v-if="points.card_info">
                <div :class="cx('add-block-content')">
                  <img v-if="points.hasNum>=points.num" :class="cx('marker')" :src="imageSrc_complete" alt="">
                  <van-image :class="cx('img')" width="60" height="60" :src="points.card_info.thumb" alt=""/>
                  <p :class="cx('text')">{{points.card_info.name}}</p>
                  <p :class="cx('num')">x{{points.num}}</p>
                </div>
                <span v-if="pointsIndex===item.condition.length-1" :class="cx('add-block-icon')"> = </span>
                <span v-else :class="cx('add-block-icon')"> + </span>
              </template>
            </div>
          </template>
          <div :class="cx('add-block')">
            <div :class="cx('add-block-content')">
              <van-image :class="cx('img')" width="60" height="60" :src="item.thumb" alt=""/>
              <p :class="cx('text')">{{item.name}}</p>
              <p :class="cx('num')">限领取{{item.num}}次/人</p>
            </div>
          </div>
        </div>
        <div :class="cx('btn-row')">
          <img :src="imageSrc_exchange" class="exchange-btn" @click="handleExchange(item.id)"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Image, Toast } from 'vant'
import Bus from '@/utils/eventBus'
import { E_REFRESH } from '@/constant/eventBusConstant'
import API from './apis'
import { demoList } from './mock'

const classPrefix = 'see-gift-area' // 我的积分

export default {
  name: 'SeeGiftArea',
  components: { VanImage: Image },
  props: {
    configBtn: {
      label: '奖品添加',
      type: String,
      default: `/pages/activity/prize/index.html`
    },
    imageSrc_exchange: {
      label: '兑换按钮',
      type: String,
      default: 'https://img.ikstatic.cn/MTU4ODkwNTU5MTAwNCMyMTkjcG5n.png'
    },
    imageSrc_complete: {
      label: '条件达成图标',
      tip: `<img width="80" src="https://img.ikstatic.cn/MTU4OTUyNDIwNDc0MyMxOTQjcG5n.png"/>`,
      type: String,
      default: 'https://img.ikstatic.cn/MTU4ODkwNTY4NTI2NiM1OTMjcG5n.png'
    }
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    handleExchange (prizeId) {
      API.POST_PRIZE_RECEIVE(this.globalVariable, { prize_id: prizeId }).then(res => {
        if (res) {
          Toast('兑换成功~')
          Bus.$emit(E_REFRESH) // 刷新组件 并且通知其他组件
        }
      })
    },
    cx (s) {
      return `${classPrefix}-${s}`
    },
    fetchList () {
      // 获取兑奖礼品列表
      Promise.all([API.GET_PRIZE_LIST(this.globalVariable), API.GET_USER_CARD(this.globalVariable)]).then(res => {
        const [res1, res2] = res
        let myPointList = [] // 我已有的积分列表
        if (res2.data) {
          myPointList = res2.data.lists || []
        }
        if (res1.data && res1.data.lists && res1.data.lists.length > 0) {
          this.list = res1.data.lists || []
          this.list.forEach(item => {
            if (Array.isArray(item.condition)) {
              item.condition.forEach(card => {
                const findCard = myPointList.find(point => +card.card_id === +point.card_id)
                card.hasNum = findCard ? findCard.num : 0
              })
            }
          })
        } else if (this.isPreview) {
          this.list = demoList
          console.log(this.list)
        }
      })
    },
    // 自定义刷新组件的方法
    refresh () {
      this.fetchList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .see-gift-area {
    text-align: center;
    margin-bottom: 20px;

    &-list {
      padding: 0 13px;
    }

    &-item {
      margin-bottom: 10px;
      overflow-y: auto;
    }

    &-gift-row {
      margin-top: 36px;
      overflow-x: auto;
      overflow-y: hidden;
      display: flex;
    }

    &-add-block {
      margin-right: 6px;
      display: flex;
    }

    &-img {
      margin-top: 9px;
      border-radius: 4px;
      overflow: hidden;
    }

    &-text {
      margin-top: 5px;

      b {
        font-weight: 600;
      }
    }

    &-num {
      margin-top: 3px;
    }

    &-result-img {
      width: 70px;
      height: 70px;
      margin-top: 9px;
    }

    &-add-block-icon {
      margin-top: 30px;
      margin-left: 6px;
      align-items: center;
    }

    &-btn-row {
      text-align: center;
      margin-top: 22px;
    }

    .exchange-btn {
      width: 87px;
      height: 33px;
      /*background-image: url("//img.ikstatic.cn/MTU4ODkwNTU5MTAwNCMyMTkjcG5n.png");*/
      background-size: 100% 100%;
      border: none;
      background-color: transparent;
    }

    &-marker {
      display: inline-block;
      width: 20px;
      height: 20px;
      position: absolute;
      top: 2px;
      right: -3px;
      background-image: url(//img.ikstatic.cn/MTU4ODkwNTY4NTI2NiM1OTMjcG5n.png);
      background-size: 100% 100%;
      z-index: 1;
    }

    &-add-block-content {
      position: relative;
    }
  }
</style>
