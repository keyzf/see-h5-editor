<template>
  <el-form-item label="占行数：">
    <el-input-number size="mini" v-model="temp" controls-position="right" :min="1" />
  </el-form-item>
</template>

<script>
	export default {
		name: "attr-see-rows",
		props: {
			value: {
				type: Number,
				default: 3
			}
		},
		data() {
			return {
				temp: 3
			}
		},
		mounted() {
			this.temp = this.value;
		},
		watch: {
			value(val) {
				this.temp = val;
			},
			tempText() {
				this.$emit('update:value', this.temp)
			}
		}
	}
</script>

<style scoped>

</style>
