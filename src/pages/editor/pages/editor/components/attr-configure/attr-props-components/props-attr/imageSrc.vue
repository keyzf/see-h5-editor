<template>
  <el-form-item class="image-src">
    <template v-slot:label>
      <div>
        {{label}}:
        <el-popover
          v-if="tip"
          placement="top-start"
          trigger="hover"
          width="100"
        >
          <div v-html="tip" class="html-render"></div>
          <i slot="reference" class="el-icon-question"></i>
        </el-popover>
      </div>
    </template>
    <imageSelect :url.sync="tempValue"/>
  </el-form-item>
</template>

<script>
import imageSelect from '@editor/components/image-select'

export default {
  name: 'attr-see-imageSrc',
  props: {
    value: String,
    label: {
      type: String,
      default: '图片'
    },
    tip: {
      type: String,
      default: ''
    }
  },
  components: {
    imageSelect
  },
  data () {
    return {
      tempValue: ''
    }
  },
  mounted () {
    this.tempValue = this.value
  },
  watch: {
    value (val) {
      this.tempValue = val
    },
    tempValue () {
      this.$emit('update:value', this.tempValue)
    }
  }
}
</script>

<style lang="scss">
  .image-src {
    .el-form-item__content {
      position: static;
    }
  }
</style>
