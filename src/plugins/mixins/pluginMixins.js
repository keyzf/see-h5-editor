import { mapGetters } from 'vuex'
import get from 'lodash/get'
import set from 'lodash/set'

export default {
  props: {
    uuid: {
      type: String,
      default: ''
    },
    defaultStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['sharedData'])
  },
  methods: {
    get,
    set,
    dSet(path, val) {
      const sharedData = this.sharedData[this.uuid]
      if (!sharedData) {
        this.$set(this.sharedData, this.uuid, {})
      }
      this.$set(this.sharedData[this.uuid], path, val)
      this.$store.dispatch("setSharedData", { uuid: this.uuid, data: this.sharedData[this.uuid] });
      this.$emit('setSharedData');
    },
    /**
     * @desc 从数据总线获取数据
     * @param {*} path 路径可为多级 `a.b.c`
     */
    dGet(path = '', uuid = this.uuid, defaultValue = undefined) {
      path = uuid ? `${uuid}.${path}` : path
      path = path.split('.').filter(Boolean)
      return get(this.sharedData, path, defaultValue)
    },
  }
}
