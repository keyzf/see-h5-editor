<template>
  <div class="see-modal">
    <van-popup v-model="show" :get-container="getContainer" style="background-color: transparent">
      <div class="see-modal-content" :style="parentStyle" v-html="richText_content"></div>
      <img :src="imageSrc_closeBtn"
           @click="show=false"
           v-if="radio_closeBtn===1"
           :class="`see-modal-close-btn ${radio_closeBtnPosition===1?'top-right':'bottom'}`"/>
    </van-popup>
  </div>
</template>

<script>
import { Popup } from 'vant'
import omit from 'lodash/omit'
import $Bus from '@/utils/eventBus'
import { RUN_ENV_EDITOR } from '@/constant/global'

export default {
  name: 'SeeModal',
  components: { VanPopup: Popup },
  props: {
    uuid: {
      type: String,
      value: ''
    },
    defaultStyle: {
      type: Object,
      default: () => ({})
    },
    radio_defaultShow: {
      label: '首次进入打开弹窗',
      type: [Number, String],
      default: 2,
      options: [
        { content: '是', value: 1 },
        { content: '否', value: 2 }
      ]
    },
    radio_closeBtn: {
      label: '展示关闭按钮',
      type: [Number, String],
      default: 1,
      options: [
        { content: '是', value: 1 },
        { content: '否', value: 2 }
      ]
    },
    radio_closeBtnPosition: {
      label: '关闭按钮位置',
      type: [Number, String],
      default: 2,
      options: [
        { content: '右上角', value: 1 },
        { content: '底部', value: 2 }
      ]
    },
    imageSrc_closeBtn: {
      label: '关闭按钮图片',
      type: String,
      // default: '//img.ikstatic.cn/MTU5NjE2NzA2NzQxMiM0MTMjcG5n.png'
      default: '//img.ikstatic.cn/MTU5NzEzMjQ2MjI3MiM2NTIjcG5n.png'
    },
    richText_content: {
      label: '弹窗内容:',
      type: String,
      default: '<p>这里是弹窗内容</p>'
    }
  },
  data () {
    return {
      // show: this.RUNTIME_ENV === RUN_ENV_EDITOR
      show: this.RUNTIME_ENV === RUN_ENV_EDITOR || this.shouldShow()
    }
  },
  computed: {
    parentStyle () {
      // console.log(this.defaultStyle)
      return omit(this.defaultStyle, ['position', 'left', 'top'])
    }
  },
  created () {},
  mounted () {
    $Bus.$on('openModal', ({ uuid }) => {
      if (uuid === this.uuid) {
        this.show = true
      }
    })
  },
  methods: {
    // 自定义刷新组件的方法
    refresh () {
      // this.fetchList();
    },
    getContainer () {
      // 编辑器的时候插入到编辑器面板 否则插入到 body
      return this.RUNTIME_ENV === RUN_ENV_EDITOR
        ? document.querySelector('#editor-main')
        : document.querySelector('body')
    },
    shouldShow () {
      if (this.radio_defaultShow === 1) {
        if (!window.localStorage.getItem(`modal_${this.uuid}_has_show`)) {
          window.localStorage.setItem(`modal_${this.uuid}_has_show`, true)
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .see-modal {
  }

</style>
<style lang="scss">
  .see-modal-content {
    overflow: auto;
  }

  .see-modal-close-btn {
    width: 30px;
    height: 30px;
    display: block;

    &.top-right {
      position: absolute;
      right: 10px;
      top: 10px;
    }

    &.bottom {
      margin: 47px auto 0;
    }
  }
</style>

