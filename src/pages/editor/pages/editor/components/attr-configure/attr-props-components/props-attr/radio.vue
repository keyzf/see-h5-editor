<template>
    <el-form-item :label="`${label}:`">
        <el-radio-group v-model="tempText">
            <el-radio v-for="item in options" :label="item.value" :key="item.value">
                <span v-html="item.content"></span>
            </el-radio>
        </el-radio-group>
    </el-form-item>
</template>

<script>
export default {
    name: 'attr-see-radio',
    props: {
        value: [Number, String],
        label: {
            type: String,
            default: '文本内容'
        },
        options: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        tempText: {
            get () {
                return this.value
            },
            set (val) {//监视当前属性值的变化，当属性值发生变化时执行，更新相关的属性数据
                //val就是fullName3的最新属性值
                this.$emit('update:value', val)
            }
        }
    }
}
</script>

<style scoped>

</style>
