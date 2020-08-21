<template>
  <el-form-item :label="`${label}:`">
    <el-input
            type="textarea"
            :rows="2"
            :placeholder="`${placeholder||'请输入'+label}`"
            v-model="tempText">
    </el-input>
  </el-form-item>
</template>

<script>
	export default {
		name: "attr-see-text",
		props: {
			value: String,
			label: {
				type: String,
				default: '文本内容'
			},
            placeholder:{
                type: String,
                default: ''
            }
		},
		data() {
			return {
				tempText: ''
			}
		},
		mounted() {
			this.tempText = this.value;
		},
		watch: {
			value() {
				this.tempText = this.value;
			},
			tempText() {
				// console.log(this.tempText)
				this.$emit('update:value', this.tempText)
			}
		}
	}
</script>

<style scoped>

</style>
