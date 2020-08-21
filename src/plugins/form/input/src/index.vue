<!--test.vue-->
<template>
  <div class="see-input">
    <input
      class="see-input-item"
      v-model="value"
      :placeholder="placeholder"
      type="text"
    />
    <span class="error" v-if="error">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'SeeInput',
  props: {
    placeholder: {
      type: String,
      default: '请输入'
    },
    text_name: {
      label: 'name',
      type: String,
      default: ''
    },
    text_rule: {
      label: '验证规则',
      type: String,
      default: `if (!value) return '请输入值';
                      return false;`
    }
  },
  data () {
    return {
      value: '',
      rule: () => {},
      error: ''
    }
  },
  watch: {
    text_rule: {
      immediate: true,
      handler (val) {
        this.rule = new Function('value', val)
      }
    },
    value () {
      this.validate()
    }
  },
  methods: {
    validate () {
      const err = this.rule(this.value)
      if (!err) {
        this.error = ''
        this.$emit('update:value', this.value)
        return true
      } else {
        this.error = err
        console.error(err)
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .see-input-item {
    display: block;
    width: 100%;
    height: 60%;
    outline: none;
    border: none;
  }

  .error {
    height: 40%;
    color: red;
    font-size: 12px;
  }
</style>
