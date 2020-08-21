<template>
  <el-form-item label="资源地址：">
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
		name: "attr-see-musicSrc",
		props: {
			value: String
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
