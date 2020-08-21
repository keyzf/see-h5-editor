<template>
  <div class="components-attr-edit">
    <el-scrollbar class="components-attr-edit">
      <div class="attr-edit-inner" v-if="activeElementUUID">
        <div class="animate-edit-btn-wrapper">
          <el-dropdown>
            <el-button type="primary" size="small">
              添加操作事件<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in eventTypeList" :key="index">
                <div @click="addEvent(item.value)">{{item.label}}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <p class="gray inline-block fontsize-12 marginL10">事件在编辑模式下无效果</p>
        </div>
        <div class="el-animate-list-wrapper paddingT20" v-show="activeEvents.length">
          <el-collapse accordion>
            <el-collapse-item v-for="(item, index) in activeEvents" :key="index">
              <template slot="title">
                <span class="el-animate-title-name">事件 {{index + 1}}</span>
                <div class="el-animate-title-type-wrapper">
                  <span class="el-animate-title-type">{{item.type | getLabelText(eventTypeList)}}</span>
                </div>
                <span class="el-animate-title-btn" @click.stop.prevent="deleteEvent(index)"><i
                  class="el-icon-delete"></i></span>
              </template>
              <div class="el-animate-item">
                <div v-if="item.type === 'togglePage'" class="attr-item-edit-wrapper">
                  <p class="attr-item-title">点击切换到：</p>
                  <div class="col-1  attr-item-edit-input">
                    <el-select v-model="item.url" placeholder="请选择" size="small">
                      <el-option
                        v-for="item in projectData.pages.filter(v=>v.uuid!==activePageUUID)"
                        :key="item.uuid"
                        :label="item.name||'默认状态'"
                        :value="item.uuid">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div v-else-if="item.type === 'openModal'" class="attr-item-edit-wrapper">
                  <p class="attr-item-title">点击打开弹窗组件：</p>
                  <div class="col-1  attr-item-edit-input">
                    <el-select v-model="item.uuid" placeholder="请选择" size="small">
                      <el-option
                        v-for="(item, index) in activePage.elements.filter(v=>v.elName === modalPlugin.name)"
                        :key="item.brotherUuid"
                        :label="`弹窗${index+1}`"
                        :value="item.brotherUuid">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div v-else-if="item.type === 'copyText'" class="attr-item-edit-wrapper">
                  <p class="attr-item-title">要复制的文本：</p>
                  <div class="col-1  attr-item-edit-input">
                    <el-input type="textarea" :rows="3" placeholder="请输入文本" v-model="item.text"/>
                  </div>
                </div>
                <div v-else v-show="item.type !== 'share' " class="attr-item-edit-wrapper">
                  <p class="attr-item-title">链接/接口url：</p>
                  <div class="col-1  attr-item-edit-input">
                    <el-input type="textarea" :rows="3" placeholder="请输入url" v-model="item.url"/>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="animate-edit-btn-wrapper life-cycle-wrapper">
          <el-dropdown>
            <el-button type="warning" size="small">
              添加生命周期<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in lifeCycleScript" :key="index">
                <div @click="addEvent(item.value)">{{item.label}}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <p class="gray inline-block fontsize-12 marginL10">生命周期执行脚本编辑模式下无效</p>
        </div>
        <div class="el-animate-list-wrapper paddingT20" v-show="activeLifeCycle.length">
          <el-collapse accordion>
            <el-collapse-item v-for="(item, index) in activeLifeCycle" :key="index">
              <template slot="title">
                <span class="el-animate-title-name">周期 {{index + 1}}</span>
                <div class="el-animate-title-type-wrapper">
                  <span class="el-animate-title-type">{{item.type | getLabelText(lifeCycleScript)}}</span>
                </div>
                <span class="el-animate-title-btn" @click.stop.prevent="deleteEvent(index)"><i
                  class="el-icon-delete"></i></span>
              </template>
              <div class="el-animate-item">
                <div class="attr-item-edit-wrapper">
                  <p class="attr-item-title">脚本：</p>
                  <div class="col-1  attr-item-edit-input">
                    <el-input type="textarea" :rows="3" placeholder="请输入脚本" v-model="item.url"/>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div v-else>
        <p class="gray paddingT30 text-center">请在画板上选择需要编辑得元素</p>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import modalPlugin from '@/plugins/basic/modal/src/index'

export default {
  name: 'event-edit',
  data () {
    return {
      eventTypeList: [{
        label: '链接跳转',
        value: 'link'
      }, {
        label: '分享',
        value: 'share'
      }, {
        label: '表单提交',
        value: 'submitForm'
      }, {
        label: '点击事件',
        value: 'onClick'
      }, {
        label: '状态切换',
        value: 'togglePage'
      },{
        label: '打开弹窗',
        value: 'openModal'
      },{
        label: '复制文本',
        value: 'copyText'
      }],
      // 生命周期
      lifeCycleScript: [
        { label: '加载完成', value: 'mounted' },
        { label: '页面更新', value: 'updated' },
        { label: '页面销毁', value: 'beforeDestroy' }
      ],

      modalPlugin
    }
  },
  computed: {
    ...mapState({
      projectData: state => state.editor.projectData,
      activePageUUID: state => state.editor.activePageUUID,
      activeElementUUID: state => state.editor.activeElementUUID
    }),
    ...mapGetters([
      'currentPageIndex',
      'activeElement',
      'activePage'
    ]),
    // 当前的事件列表
    activeEvents () {
      return this.activeElement.events.filter(item => this.eventTypeList.findIndex(v => v.value === item.type) > -1)
    },
    // 当前的生命周期列表
    activeLifeCycle () {
      return this.activeElement.events.filter(item => this.lifeCycleScript.findIndex(v => v.value === item.type) > -1)
    }
  },
  methods: {
    /**
     * 添加事件
     * @param type 事件名称
     */
    addEvent (type) {
      this.$store.dispatch('addElementEvent', type)
    },
    /**
     * 删除事件
     * @param index
     */
    deleteEvent (index) {
      this.$store.dispatch('deleteElementEvent', index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .components-attr-edit {
    height: 100%;
  }

  .life-cycle-wrapper {
    margin-top: 20px;
  }

  .components-attr-animate-edit {
    position: relative;
  }

  .attr-title {
    font-weight: bold;
  }

  .attr-item-edit-wrapper {
    padding-left: 4px;
    display: flex;
    width: 100%;
    text-align: center;
    padding-bottom: 10px;

    .attr-item-title {
      text-align: left;
      width: 80px;
      font-size: 12px;
      line-height: 28px;
    }

    .attr-item-edit-input {
      text-align: left;
      flex: 1;
    }
  }

  .el-animate-list-wrapper {
    .el-animate-title-name {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      font-weight: bold;
      width: 55px;
    }

    .el-animate-title-type-wrapper {
      display: inline-block;
      width: 190px;
    }

    .el-animate-title-type {
      display: inline-block;
      vertical-align: middle;
      max-width: 140px;
      height: 24px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: #fafafa;
      border-radius: 60px;
      padding: 4px 20px;
      border: none;
      cursor: pointer;
      margin: 0 20px 0 10px;
      line-height: 14px;
    }

    .el-animate-title-btn {
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #666;
      width: 24px;
      height: 24px;
      cursor: pointer;
      border-radius: 4px;
      background: rgba(37, 165, 137, 0.08);
      margin-left: 6px;

      &:hover {
        color: white;
        background: $primary;
      }
    }
  }
</style>
