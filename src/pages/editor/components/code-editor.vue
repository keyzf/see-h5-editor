<template>
    <div class="code-editor" :style="{width,height}"></div>
</template>

<script>
// import * as monaco from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export default {
    name: 'code-editor',
    components: {},
    props: {
        value: String,
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '400px'
        }
    },
    data () {
        return {
            monacoEditor: null
        }
    },
    watch: {
        value: {
            handler (val) {
                if (this.monacoEditor && (val !== this.monacoEditor.getValue())) {
                    this.monacoEditor.setValue(val)
                }
            }
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

<style lang="scss" scoped>
    .code-editor {
        text-align: left;
    }
</style>
