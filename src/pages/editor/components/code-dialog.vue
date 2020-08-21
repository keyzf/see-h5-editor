<template>
    <div>
        <el-button size="mini" @click="dialogVisible=true">代码编辑器</el-button>
        <el-dialog
            title="代码编辑器"
            :visible.sync="dialogVisible"
            width="1000px"
            :close-on-click-modal="false"
            :before-close="handleClose">
            <code-editor height="60vh" v-model="content"/>
            <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import CodeEditor from './code-editor'

export default {
    name: 'code-dialog',
    components: { CodeEditor },
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            dialogVisible: false,
            content: this.value
        }
    },
    watch: {
        value: {
            immediate: true,
            handler (val) {
                this.content = val
            }
        }
    },
    mounted () {
    },
    methods: {
        handleClose () {
            this.$confirm('取消编辑？')
                .then(_ => {
                    this.content = this.value
                    this.dialogVisible = false
                })
                .catch(_ => {})
        },
        handleSave () {
            this.$emit('input', this.content)
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="scss">
</style>
