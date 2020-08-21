<template>
    <el-form-item class="image-src">
        <template v-slot:label>
            <div>
                {{label}} :
                <el-popover
                    v-if="tip"
                    placement="top-start"
                    trigger="hover"
                    width="100"
                >
                    <div v-html="tip" class="html-render"></div>
                    <i slot="reference" class="el-icon-question"></i>
                </el-popover>
            </div>
        </template>

        <el-upload
            action="''"
            accept="jpg,jpeg,png"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleFileChange">
            <el-button :loading="loading" size="mini" icon="el-icon-upload">上传图片
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
    </el-form-item>
</template>

<script>
import Apis from '@/apis/common'

export default {
    name: 'attr-see-longImageSrc',
    props: {
        value: String,
        label: {
            type: String,
            default: '长图'
        },
        tip: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tempValue: '',
            loading: false
        }
    },
    mounted () {
        this.tempValue = this.value
    },
    watch: {
        value (val) {
            this.tempValue = val
        },
        tempValue () {
            this.$emit('update:value', this.tempValue)
        }
    },
    methods: {
        async handleFileChange (file) {
            this.loading = true
            const fileObj = file.raw
            try {
                // file 转base 64
                const source = await this._fileToBase64(fileObj)
                // 转成 img 对象
                const img = new Image()
                img.onload = async () => {
                    // 切割图片 上传到服务器 并且返回 imgList
                    const imgList = await this._createPiece(img)
                    this.tempValue = imgList.join(',')
                    this.loading = false
                }
                img.src = source
            } catch (e) {
                this.loading = false
            }

        },
        /** 图片切割 上传 到服务器
         * @params img 对象
         * */
        async _createPiece (img) {
            const SPLIT_SIZE = 300 // 分割大小 为原图 300px
            let row = Math.floor(img.naturalHeight / SPLIT_SIZE) || 1 // 分割块数 至少1块
            console.log(row)

            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')

            const wpiece = img.naturalWidth // 每张图宽度
            let hpiece = SPLIT_SIZE // 每张图的高度

            let src = ''
            const imgList = []

            for (let i = 0; i < row; i++) {
                // 如果是最后一张的时候，把剩余的高度计算在内合并成一张图
                if (i === row - 1) {
                    hpiece = img.naturalHeight - i * SPLIT_SIZE
                }
                canvas.width = wpiece
                canvas.height = hpiece
                // 绘图
                ctx.drawImage(img, 0, i * SPLIT_SIZE, wpiece, hpiece, 0, 0, wpiece, hpiece)
                // canvas 转 base64
                src = canvas.toDataURL()
                // base64 转blob
                const res = await fetch(src)
                const blob = await res.blob()
                // base 64转 file
                const file = new File([blob], 'File name', { type: 'image/png' })
                // file 上传到 文件服务器
                const uploadRes = await Apis.UPLOAD_IMAGE(file)
                // 返回 url 图片存储的 地址
                const url = uploadRes.data.url
                // 按切片顺序 保存url
                imgList.push(url)
            }
            return imgList
        },
        // 本地file 转base64
        _fileToBase64 (file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = function (event) {
                    let source = event.target.result
                    resolve(source)
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
        }
    }
}
</script>

<style lang="scss">
    .image-src {
        .el-form-item__content {
            position: static;
        }
    }
</style>
