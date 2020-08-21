<template>
    <div class="rich-text" @keyup="(e) => { e.stopPropagation() && e.preventDefault() }">
        <div class="rich-text-label">{{label}}</div>
        <rich-text v-model="tempText"/>
    </div>
</template>

<script>

import richText from '@editor/components/rich-text'

export default {
    name: 'attr-see-richText',
    components: { richText },
    props: {
        value: String,
        label: {
            type: String,
            default: '富文本内容'
        }
    },
    data () {
        return {
            tempText: '',
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                        [{ color: [] }, { background: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ 'align': [] }]
                    ]
                }
            }
        }
    },
    mounted () {
        this.tempText = this.value
    },
    watch: {
        value () {
            this.tempText = this.value
        },
        tempText () {
            // console.log(this.tempText)
            this.$emit('update:value', this.tempText)
        }
    }
}
</script>

<style lang="scss" scoped>
    .rich-text {
        margin-bottom: 10px;

        .rich-text-label {
            padding-right: 12px;
            width: 120px;
            text-align: right;
            color: #606266;
            margin-bottom: 10px;
            font-size: 14px;
        }
    }
</style>
