<!--button.vue-->
<template>
  <div class="see-button">
    {{text}}
  </div>
</template>

<script>
export default {
  name: 'SeeButton', // 这个名字很重要，它就是未来的标签名
  props: {
    text: {
      type: String,
      default: '按 钮'
    },
    imageSrc_activeBg: {
      label: '激活状态背景',
      type: String,
      default: '//img.ikstatic.cn/MTU5NDYyODcwMTE2NyM3NDUjcG5n.png'
    }
  }
}
</script>

<style lang="scss" scoped>
  .see-button {
    background-size: 100% 100%;
  }
</style>
