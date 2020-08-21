<template>
    <editor
        v-model="content"
        api-key="uszthlo6rnqz13vdwjmavtlpesw1vd6va1j7rk5vbal8kt6l"
        tinymce-script-src="./tinymce/tinymce.min.js"
        :init="init"
        :initial-value="value"
        @onChange="handleChange"
    />
</template>

<script>
// 引入基本文件
import Editor from '@tinymce/tinymce-vue'

export default {
    name: 'rich-text',
    components: { Editor },
    props: {
        value: String,
        options: {
            type: Object,
            default: () => ({})
        }
    },
    mounted () {
    },
    data () {
        return {
            content: '',
            init: {
                fontsize_formats:'5px 6px 8px 10px 12px 14px 15px 18px 24px 36px',
                language_url: './tinymce/langs/zh_CN.js',// 语言包的路径
                language: 'zh_CN',//语言
                // skin_url: '/tinymce/skins/ui/oxide',// skin路径
                height: 300,//编辑器高度
                // branding: false,//是否禁用“Powered by TinyMCE”
                menubar: true, //顶部菜单栏显示,
                toolbar: 'lineheight',
                plugins: 'lineheight'
            }
        }
    },
    methods: {
        handleChange () {
            this.$emit('input', this.content)
        }
    }
}
</script>

<style lang="less">

</style>
