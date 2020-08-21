<template>
  <el-form-item :label="`${label}:`">
    <el-color-picker show-alpha size="mini" :value="value" @change="val=>{$emit('update:value', val)}"/>
  </el-form-item>
</template>

<script>
export default {
  name: 'attr-see-color',
  props: {
    value: {
      type: [String, Object],
      default: null
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
