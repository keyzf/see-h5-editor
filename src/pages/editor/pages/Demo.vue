<template>
    <div class="code-editor"></div>
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
    name: 'code-editor',
    components: {},
    props: {
        value: String
    },
    data () {
        return {
            monacoEditor: null
        }
    },
    mounted () {
        this.initCodeEditor()
    },
    methods: {
        initCodeEditor () {
            this.monacoEditor = monaco.editor.create(this.$el, {
                value: this.value,
                language: 'javascript'
                // theme: 'vs-dark' // vs-dark
            })
            this.monacoEditor.onDidChangeModelContent(event => {
                const val = this.monacoEditor.getValue()
                this.$emit('input', val)
                this.$emit('change', val, event)
            })
        }
    }
}
</script>

<style lang="scss">
    .code-editor {
        position: absolute;
        width: 375px;
        height: 667px;
        top: 100px;
        border: 1px solid gray;
    }
</style>
