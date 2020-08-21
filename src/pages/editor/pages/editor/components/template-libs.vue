<template>
  <div class="components-libs-wrapper">
    <el-tree
      ref="tree"
      node-key="uuid"
      :data="componentsListName"
      highlight-current
      :props="defaultProps"
      @node-click="handleElementClick"
      :default-expand-all="true"
      :expand-on-click-node="false"
      :current-node-key="currentNodeKey"
    >
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <div v-if="data.icon" class="components-icon"><i :class="data.icon"/></div>
                <span class="node-label">{{ node.label }}</span>
                <span v-if="data.type===NODE_TYPE.ELEMENT" class="teee-node-action">
                    <i class="el-icon-delete" @click.stop="removeNode(node, data)"></i>
                </span>
            </span>
    </el-tree>
  </div>
</template>

<script>
import plugins from '@/plugins'
import { mapState, mapGetters } from 'vuex'

const NODE_TYPE = { // 节点类型
  'STATUS': 'STATUS',// 状态节点
  'ELEMENT': 'ELEMENT'// 元素节点
}

function ergodic (arr) {
  return arr.map(v => {
    const findPlugins = plugins[v.elName] || {}
    if (v.elements && v.elements.length > 0) {
      v.elements = ergodic(v.elements)
    }
    return {
      ...v,
      title: findPlugins.title,
      icon: findPlugins.icon,
      type: NODE_TYPE.ELEMENT // 节点类型-元素
    }
  })
    // TODO 不应该在这里排序，应该对原始数据排序
    .sort((a, b) => b.commonStyle.zIndex - a.commonStyle.zIndex)
}

export default {
  name: 'template-libs',
  data () {
    return {
      NODE_TYPE,
      defaultProps: {
        children: 'elements',
        label: 'title'
      },
      currentNodeKey: null,
      key: 0 // 让树形组件强制渲染
    }
  },

  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID
    }),

    ...mapGetters([
      'currentPageIndex',
      'activeElement',
      'activePage'
    ]),
    componentsListName () {
      return [{
        ...this.activePage,
        elements: ergodic(this.activePage.elements),
        title: this.activePage.name + ' - Root',
        icon: '',
        type: NODE_TYPE.STATUS // 节点类型-状态
      }]
    }
  },
  watch: {
    activeElementUUID (val) {
      this.currentNodeKey = val
      this.$refs.tree.setCurrentKey(val)
    },
    'projectData.pages': {
      handler () {
        // this.key = this.key + 1 // 让整个树重新渲染
      },
      deep: true
    }
  },
  methods: {
    /**
     * 元素被点击
     * @param uuid
     */
    handleElementClick (data) {
      this.$store.dispatch('setActiveElementUUID', data.type === NODE_TYPE.ELEMENT ? data.uuid : null)
    },
    removeNode (node, data) {
      this.$store.dispatch('deleteElement', data.uuid)
    }
  }
}
</script>

<style lang="scss" scoped>
  .components-libs-wrapper {
    .el-tree {
      font-size: 12px;
    }

    .iconfont {
      font-size: 14px;
    }

    .custom-tree-node {
      width: 100%;
      display: flex;
      align-items: center;

      .components-icon {
        width: 16px;
        height: 16px;
        border: 1px solid #606266;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
      }

      .node-label {
        flex: 1;
      }

      .teee-node-action {
        margin-right: 8px;
        font-size: 16px;
        cursor: pointer;

        i:hover {
          color: #25A589;
        }
      }
    }
  }

</style>
