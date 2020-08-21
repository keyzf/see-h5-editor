<template>
  <el-form-item :label="`${label}:`">
    <el-input-number size="mini" :value="value" @change="val=>{$emit('update:value', val)}" :precision="0" controls-position="right" :min="0"/>
  </el-form-item>
</template>

<script>
export default {
  name: 'attr-see-number',
  props: {
    value: {
      type: Number,
      default: 0
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
