<template>
  <div class="see-list-view">
    <div v-if="list.length === 0">
      <!-- <img class="empty-img" :src="imageSrc_emptyBg" alt=""> -->
    </div>
    <ul v-if="list.length > 0">
      <li v-for="(item, index) in list" :key="index">
        <slot :item="{...item, index}"/>
      </li>
    </ul>
  </div>
</template>

<script>
import { RUN_ENV_EDITOR } from '@/constant/global'

export default {
  name: 'SeeListView',
  props: {
    text_url: {
      label: '接口地址',
      type: String,
      default: ''
    },
    code_handleMethod: {
      label: '处理方法',
      type: String,
      default: 'function(data){ return data }'
    },
    text_dataPath: {
      label: '数据路径',
      type: String,
      default: '',
      placeholder: '请输入数据路径例如：data.list'
    },
    number_start: {
      label: '开始位置',
      type: Number,
      default: 0
    },
    number_end: {
      label: '结束位置',
      type: Number,
      default: 20
    }
  },
  data () {
    return {}
  },
  computed: {
    list () {
      let list = this.dGet(
        this.text_dataPath,
        undefined,
        []
      )
      if (!Array.isArray(list)) {
        return []
      }
      // 编辑器环境只操作一条数据方便操作
      return RUN_ENV_EDITOR === this.RUNTIME_ENV ? list.slice(0, 1) : list.slice(this.number_start, this.number_end)
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      if (!this.text_url) return
      this.$request({
        method: 'get',
        url: this.text_url
      }).then(({ data }) => {
        const finalData = this.runCodeWithData(
          this.code_handleMethod,
          data
        )
        this.dSet('data', finalData)
      })
    },
    runCodeWithData (obj, data) {
      return Function('"use strict";return (' + obj + ')')()(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .see-list-view {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
