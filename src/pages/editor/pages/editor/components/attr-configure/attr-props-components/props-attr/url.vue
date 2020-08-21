<template>
  <el-form-item label="url地址：">
    <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入url地址"
            v-model="tempValue">
    </el-input>
  </el-form-item>
</template>

<script>
	export default {
		name: "attr-see-url",
		props: {
			value: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				tempValue: ''
			}
		},
		mounted() {
			this.tempValue = this.value;
		},
		watch: {
			value(val) {
				this.tempValue = val;
			},
			tempValue() {
				this.$emit('update:value', this.tempValue);
			}
		}
	}
</script>

<style scoped>

</style>
