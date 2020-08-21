<!--test.vue-->
<template>
  <div class="see-image" :style="styles">
    <img :src="imageSrc" alt="" :style="{ objectFit: text_objectFit }" @load="handleImgLoad" @error="handleImgError"/>
  </div>
</template>

<script>
import omit from 'lodash/omit'

export default {
  name: 'SeeImage',
  props: {
    imageSrc: {
      type: String,
      default: '//img.ikstatic.cn/MTU5NzcyOTc4MzQ0MSM2NjYjcG5n.png'
    },
    text_objectFit: {
      type: String,
      label: '填充属性',
      default: 'cover'
    }
  },
  computed: {
    styles () {
      return omit(this.defaultStyle, [
        'top',
        'left',
        'bottom',
        'right',
        'position',
        'width',
        'height'
      ])
    }
  },
  methods: {
    handleImgError (e) {
      const { target } = e
      console.log(target)
      target.style.display = 'none'
    },

    handleImgLoad (e) {
      const { target } = e
      target.style.display = 'block'
    }
  }
}
</script>

<style lang="scss" scoped>
  .see-image {
    width: 100%;
    height: 100%;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }

  img[src=""], img:not([src]) {
    opacity: 0;
  }
</style>
