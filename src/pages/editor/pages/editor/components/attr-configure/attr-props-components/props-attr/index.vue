<template>
  <div v-if="currentElementProps.length" class="props-attr">
    <div class="attr-title marginB10 fontBold">
      <span>组件属性</span>
    </div>
    <el-form label-width="120px">
      <el-tabs v-if="Object.keys(currentElementPropsGroup).length>1" type="card">
        <el-tab-pane v-for="(group,key,index) in currentElementPropsGroup" :key="String(key)"
                     :label="key==='undefined'?'属性':key" :name="String(index)">
          <component
            v-for="item in group"
            :key="item.key"
            :is="'attr-see-' + item.key.split('_')[0]"
            v-bind.sync="item"
          />
        </el-tab-pane>
      </el-tabs>
      <template v-else>
        <div v-for="(group,key) in currentElementPropsGroup" :key="String(key)">
          <component
            v-for="item in group"
            :key="item.key"
            :is="'attr-see-' + item.key.split('_')[0]"
            v-bind.sync="item"
          />
        </div>
      </template>
    </el-form>
    </div>
</template>

<script>
import attrComponents from './index.js'
import { mapGetters, mapState } from 'vuex'
import { groupBy } from 'lodash'

export default {
  data () {
    return {
      currentElementProps: [],
      currentElementPropsGroup: [],
      activeNames: ['0']
    }
  },
  components: {
        ...attrComponents,
    },
    updated() {
        // console.log('update');
    },
    methods: {
        initCurrentElementProps() {
            if (!this.activeElement.propsValue) {
                this.currentElementProps = [];
            }
            const editPropsComponentNameList = Object.keys(attrComponents);

            const val = this.activeElement.propsValue ? Object.keys(this.activeElement.propsValue)
                .map((k) =>
                    Object.prototype.toString.call(
                        this.activeElement.propsValue[k]
                    ) === '[object Object]'
                        ? { key: k, ...this.activeElement.propsValue[k] }
                        : { key: k, value: this.activeElement.propsValue[k] }
                )
                .filter((v) => {
                    v = v.key.split('_')[0];
                    return editPropsComponentNameList.includes('attr-see-' + v);
                }) : [];
            // console.log('val', this.activeElement.propsValue, val)

          this.currentElementProps = val
          this.currentElementPropsGroup = groupBy(val, 'group')
        },


    },
    computed: {
        ...mapState({
            projectData: (state) => state.editor.projectData,
            activePageUUID: (state) => state.editor.activePageUUID,
            activeElementUUID: (state) => state.editor.activeElementUUID,
        }),
        ...mapGetters([
            'currentPageIndex',
            'activeElement',
            'activePage',
        ])
    },
    watch: {
        activeElement: {
            immediate: true,
            // deep: true,
            handler() {
                this.initCurrentElementProps();
                // console.log(this.activeElement, val);
            },
        },
        currentElementProps: {
            deep: true,
            handler(val) {
                // console.log('val', val)
                for (const item of val) {
                    // console.log(item);
                    if (
                        Object.prototype.toString.call(
                            this.activeElement.propsValue[item.key]
                        ) === '[object Object]'
                    ) {
                        if (
                            this.activeElement.propsValue[item.key].value !==
                            item.value
                        ) {
                            this.activeElement.propsValue[item.key].value =
                                item.value;
                        }
                    } else {
                        if (
                            this.activeElement.propsValue[item.key] !==
                            item.value
                        ) {
                            this.activeElement.propsValue[item.key] =
                                item.value;
                        }
                    }
                }
                // console.log(val);
            },
        },
    },
};
</script>

<style scoped>
  .props-attr .el-tabs {
    padding-left: 0;
    padding-right: 0;
  }
</style>
