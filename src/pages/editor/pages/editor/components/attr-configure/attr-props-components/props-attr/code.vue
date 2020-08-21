<template>
    <el-form-item :label="`${label}:`">
        <code-dialog :value="value" @input="val=>{$emit('update:value', val)}"/>
    </el-form-item>
</template>

<script>
import CodeDialog from '@editor/components/code-dialog'
export default {
    name: 'attr-see-code',
    components: {
        CodeDialog
    },
    props: {
        value: {
            type: [String, Object],
            default: null
        },
        label: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped>

</style>
