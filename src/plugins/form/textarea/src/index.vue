<template>
  <div class="see-textarea">
    <textarea class="see-textarea-item" :placeholder="placeholder" v-model="tempValue"/>
  </div>
</template>

<script>
	export default {
		name: 'SeeTextarea',
		props: {
			placeholder: {
				type: String,
				default: '请输入'
			},
			value: {
				require: false
			}
		},
		data() {
			return {
				tempValue: ''
			}
		},
		created() {
			this.tempValue = this.value;
		},
		watch: {
			value(val) {
				this.tempValue = val;
			},
			tempValue() {
				this.$emit('input', this.temp)
			}
		}
	}
</script>

<style lang="scss" scoped>
  .see-textarea-item {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
  }
</style>
