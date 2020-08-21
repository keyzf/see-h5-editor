<template>
  <div class="see-my-points">
    <ul v-if="list.length > 0" :class="cx('list')">
      <li v-for="(item, index) in list" :class="cx('item')" :key="index">
        <template v-if="item.card_info">
          <div :class="cx('img')">
            <div v-if="!item.num" class="mask"></div>
            <van-image
              width="100%"
              height="100%"
              :src="item.card_info.thumb"
              alt=""
            />
          </div>
          <p :class="cx('text')"><b>{{ item.card_info.name }}</b></p>
          <p :class="cx('text')">x{{ item.num }}</p>
        </template>
      </li>
    </ul>
    <van-popup class="receive-popup" v-model="show" :get-container="getContainer">
      <div class="pop-content">
        <img class="bg-aperture" src="//img.ikstatic.cn/MTU4OTc5NTMxNTgyNyMgNDEjcG5n.png" alt="">
        <h3 class="pop-title">恭 喜 获 得</h3>
        <img class="pop-img" :src="currentWaitItem.card_info.thumb" alt=""/>
        <p class="pop-text"><b>{{ currentWaitItem.card_info.name }}</b> x{{currentWaitItem.num }}</p>
        <img class="pop-to-accept" :src="imageSrc_popupBtn" @click="handleClose">
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Image, Popup } from 'vant'
import { RUN_ENV_H5 } from '@/constant/global'
import API from './apis'
import Bus from '@/utils/eventBus'
import { demoList } from './mock'

const classPrefix = 'see-my-points' // 我的积分

export default {
  name: 'SeeMyPoints',
  components: { VanImage: Image, VanPopup: Popup },
  props: {
    configBtn: {
      label: '卡片添加',
      type: String,
      default: `/pages/activity/card/index.html`
    },
    imageSrc_popupBtn: {
      label: '弹窗按钮',
      type: String,
      default: '//img.ikstatic.cn/MTU5MjI5NDYyNzM2MiM2NjkjcG5n.png'
    }
  },
  data () {
    return {
      list: [], // 我的卡片数量
      waitList: [], // 待领取卡片列表
      currentWaitIndex: 0, // 当前待领取卡片的数组索引
      show: true
    }
  },
  computed: {
    currentWaitItem () {
      return this.waitList[this.currentWaitIndex] || { card_info: {} }
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    getContainer () {
      // 编辑器的时候插入到编辑器面板 否则插入到 body
      return this.RUNTIME_ENV === RUN_ENV_H5
        ? document.querySelector('body')
        : document.querySelector('#editor-main')
    },
    handleClose () {
      API.POST_CARD_RECEIVE({ card_id: this.currentWaitItem.card_id }).then(res => {
        if (res.data) {
          this.show = false
          this.currentWaitIndex = this.currentWaitIndex + 1
          setTimeout(() => {
            this.showPopup()
          }, 500)
        }
      })
    },
    cx (s) {
      return `${classPrefix}-${s}`
    },
    fetchList () {
      API.GET_USER_CARD(this.globalVariable).then((res) => {
        if (res.data && res.data.lists && res.data.lists.length > 0) {
          this.list = res.data.lists || []
          this.waitList = res.data.wait_list || []
          this.currentWaitIndex = 0
          this.showPopup()
          Bus.$emit('CACULATE_PAGE_SIZE')
        } else if (this.isPreview) {
          this.list = demoList
        }
      })
    },
    // 展示弹窗内容
    showPopup () {
      if (this.currentWaitIndex < this.waitList.length) {
        this.show = true
      }
    },
    // 自定义刷新组件的方法
    refresh () {
      this.fetchList()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/style/receive-popup.scss";

  .see-my-points {
    text-align: center;

    &-list {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 13px;
      margin-top: 36px;
    }

    &-item {
      & + .see-my-points-item {
        margin-left: 14px;
      }
    }

    &-img {
      border-radius: 5px;
      overflow: hidden;
      width: 60px;
      height: 60px;
      position: relative;

      .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(255, 255, 255, 0.7);
        z-index: 1;
      }
    }

    &-text {
      margin-top: 5px;

      b {
        font-weight: 600;
      }
    }

  }

</style>
