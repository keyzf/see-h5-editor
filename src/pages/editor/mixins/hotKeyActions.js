import { mapActions, mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
/**
 *  元素点击事件相关方法
 * */
export default {
  data() {
    return {
      clipboard: null,
      actionMap: {
        // 'rect-全选': {
        //   doF: '_actionRectSelectAll',
        //   hotkey: 'command + a, ctrl + a',
        // },
        'rect-复制': {
          checkF: '_checkActiveElement',
          doF: '_actionElementCopy',
          hotkey: 'command + c, ctrl + c'
        },
        'rect-粘贴': {
          doF: '_actionElementPaste',
          hotkey: 'command + v, ctrl + v'
        },
        'rect-删除': {
          checkF: '_checkActiveElement',
          doF: '_actionElementDelete',
          hotkey: 'backspace, delete'
        },
        // 'rect-锁定': {
        //   checkF: '_actionCanRectLock',
        //   doF: '_actionRectLock',
        //   hotkey: 'command + l, ctrl + l'
        // },
        // 'rect-解锁': {
        //   checkF: '_actionCanRectUnLock',
        //   doF: '_actionRectUnLock',
        //   hotkey: 'command + shift + l, ctrl + shift + l'
        // },
        // 'rect-组合': {
        //   checkF: '_actionCanGroup',
        //   doF: '_actionGroup',
        //   hotkey: 'command + g, ctrl + g'
        // },
        // 'rect-打散': {
        //   checkF: '_actionCanUnGroup',
        //   doF: '_actionUnGroup',
        //   hotkey: 'command + shift + g, ctrl + shift + g'
        // },
        // 'rect-上移': {
        //   checkF: '_actionCanCurrRect',
        //   doF: '_actionRectMoveUp',
        //   hotkey: 'command + alt + up, ctrl + alt + up',
        // },
        // 'rect-下移': {
        //   checkF: '_actionCanCurrRect',
        //   doF: '_actionRectMoveDown',
        //   hotkey: 'command + alt + down, ctrl + alt + down',
        // },
        // 'rect-置顶': {
        //   checkF: '_actionCanCurrRect',
        //   doF: '_actionRectMoveTop',
        //   hotkey: 'command + shift + up, ctrl + shift + up',
        // },
        // 'rect-置底': {
        //   checkF: '_actionCanCurrRect',
        //   doF: '_actionRectMoveBottom',
        //   hotkey: 'command + shift + down, ctrl + shfit + down',
        // },
        'rect-keyupMove': {
          checkF: '_checkActiveElement',
          doF: '_actionMoveTop',
          hotkey: 'up',
        },
        'rect-keydownMove': {
          checkF: '_checkActiveElement',
          doF: '_actionMoveDown',
          hotkey: 'down',
        },
        'rect-keyleftMove': {
          checkF: '_checkActiveElement',
          doF: '_actionMoveLeft',
          hotkey: 'left',
        },
        'rect-keyrightMove': {
          checkF: '_checkActiveElement',
          doF: '_actionMoveRight',
          hotkey: 'right',
        },
        // sys
        'sys-撤销': {
          // checkF: () => {
          //   return !me.mouse.ing && 
          //     me._historyCanBack()
          // },
          doF: '_actionUndo',
          hotkey: 'command + z, ctrl + z',
        },
        'sys-重做': {
          // checkF: () => {
          //   return !me.mouse.ing && 
          //     me._historyCanGo()
          // },
          doF: '_actionRedo',
          hotkey: 'command + shift + z, ctrl + shift + z',
        },
      }
    }
  },

  mounted() {
    this._actionSetHotKey()
  },

  computed: {
    ...mapGetters([
      'activeElement',
      'activeElementUUID'
    ]),
  },
  methods: {
    ...mapActions(['editorUndo', 'editorRedo', 'copyElement', 'deleteElement', 'addHistoryCache']),
    _checkActiveElement() {
      return !!this.activeElement
    },
    /**
     * 键盘按上
     */
    _actionMoveTop() {
      this.activeElement.commonStyle.top -= 1
      this.addHistoryCache()
    },
    /**
     * 键盘按下
     */
    _actionMoveDown() {
      this.activeElement.commonStyle.top += 1
      this.addHistoryCache()
    },
    /**
     * 键盘按左
     */
    _actionMoveLeft() {
      this.activeElement.commonStyle.left -= 1
      this.addHistoryCache()
    },
    /**
     * 键盘按右
     */
    _actionMoveRight() {
      this.activeElement.commonStyle.left += 1
      this.addHistoryCache()
    },
    /**
     * 复制
     */
    _actionElementCopy() {
      this.clipboard = cloneDeep(this.activeElement)
    },
    /**
     * 粘贴
     */
    async _actionElementPaste() {
      const pastedData = await this.copyElement(this.clipboard)
      this.clipboard = pastedData
    },
    /**
     * 删除
     */
    _actionElementDelete() {
      this.deleteElement(this.activeElementUUID)
    },
    /**
     * 撤销
     */
    _actionUndo() {
      this.editorUndo()
    },
    /**
     * 重做
     */
    _actionRedo() {
      this.editorRedo()
    },

    _actionGet(type) {
      let action = this.actionMap[type]
      let checkF = action.checkF || (() => true)
      if (typeof checkF === 'string') {
        checkF = this[checkF]
      }
      let doF = action.doF || (() => { })
      if (typeof doF === 'string') {
        doF = this[doF]
      }
      let text = type.split('-')[1] || 'unknow'
      return {
        ...action,
        doF,
        checkF,
        text,
      }
    },

    _actionSetHotKey() {
      for (let type in this.actionMap) {
        let { checkF, doF, hotkey } = this._actionGet(type)
        if (hotkey) {
          hotkey.split(',').forEach(key => {
            this._hotkey(key, async (e) => {
              if (checkF.call(this)) {
                e.preventDefault()
                doF.call(this)
              }
            })
          })
        }
      }
    }
  }
}