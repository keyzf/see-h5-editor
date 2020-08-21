<template>
  <div class="components-libs-wrapper">
    <ul>
      <li
        v-for="(item, index) in componentsList"
        :key="index"
        class="clearfix"
      >
        <h3 class="components-libs-title">{{ item.name }}</h3>
        <div class="clearfix components-libs-box" v-if="item.components && item.components.length">
          <div
            class="components-lib-item"
            v-for="(element, i) in item.components"
            :key="i"
            @click="handleClick(element)"
            @dragstart="handleDragStart($event, element)"
            draggable="true"
          >
            <div class="lib-item-img">
              <i :class="[element.icon]"></i>
            </div>
            <p class="lib-item-title">{{ element.title }}</p>
          </div>
        </div>
        <div v-else>
          <p class="gray text-center paddingT20">待完善...</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { components } from '@/plugins'
import { getComponentProps } from '@editor/common/js/mUtils'

export default {
  name: 'component-libs',
  data () {
    return {
      componentsList: components
    }
  },
  methods: {
    /**
     * 点击事件, 向父组件派发add-element事件，参数： 当前组件对象
     * @param item
     */
    handleClick (item) {
      const props = getComponentProps(item.elName)
      item.defaultStyle.top = document.getElementById(
        'device-wrapper'
      ).scrollTop // 添加到当前视口最顶部

      this.$store.dispatch('addElement', { elData: { ...item, needProps: props } })
    },

    handleDragStart (e, item) {
      const props = getComponentProps(item.elName)
      e.dataTransfer.setData(
        'dragElement',
        JSON.stringify({ ...item, needProps: props })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@editor/common/styles/mixin.scss";
  .components-libs-box {
    margin: 8px 0;
  }
  .components-libs-title{
    font-weight: 600;
    font-size: 16px;
    color: $black;
  }

  .components-lib-item {
    text-align: center;
    background: $white;
    width: 80px;
    min-height: 80px;
    float: left;
    margin: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: 5px;

    &:hover {
      @include bg-gradient;

      .lib-item-img {
        i {
          @include font-white;
        }
      }

      .lib-item-title {
        color: $white;
      }
    }

    .lib-item-img {
      transition: all 0.3s ease-in-out;

      i {
        transition: all 0.3s ease-in-out;
        font-size: 18px;
        font-weight: 600;
        @include font-gradient;
      }
    }

    .lib-item-title {
      transition: all 0.3s ease-in-out;
      color: $black;
      font-size: 12px;
    }
  }
</style>
