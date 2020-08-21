<template>
    <el-dialog
        class="components-image-libs-wrapper"
        title="我的图片"
        :visible.sync="dialogVisible"
        width="50%">
        <div class="components-image-libs">
            <div class="image-lib-side-bar">

            </div>
            <div class="image-lib-inner">
                <div class="image-lib-btn">
                    <el-upload
                        :action="`${root.bossapi}common/upload/image`"
                        :before-upload="beforeUpload"
                        name="image"
                        multiple
                        :on-success="handleUploadSuccess"
                        accept="jpg,jpeg,png,gif"
                        :show-file-list="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span slot="tip" class="el-upload__tip marginL20">只能上传jpg/png/gif文件，且不超过2M</span>
                    </el-upload>
                    <el-button @click="handleClearAll" icon="el-icon-delete-solid" size="small" type="info">清空
                    </el-button>
                </div>
                <ul class="image-list-wrapper" v-if="imageList.length">
                    <li class="image-item" v-for="(item, index) in imageList" :key="index"
                        @click="handleImageClick(item.url)">
                        <i @click.stop="handleClearOne(index)" class="el-icon-circle-close clear-one-img"></i>
                        <img :src="item.url" alt="">
                    </li>
                </ul>
                <div class="padding60 text-center gray" v-else>暂无数据</div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import $bus from '@/utils/eventBus'
import root from '@/config/apiRoots'
import $utils from '@/utils/index'

export default {
    name: 'image-libs',
    data () {
        return {
            root,
            dialogVisible: false,
            uploading: false,
            hasLoadData: false,
            imageList: [],
            selectId: ''
        }
    },
    created () {
        $bus.$on('show-select-image', selectId => {
            this.dialogVisible = true
            this.selectId = selectId
        })
    },
    watch: {
        dialogVisible (val) {
            if (val && !this.uploading) {
                this.getMyImages()
            }
        }
    },
    methods: {
        beforeUpload (file) {
            if (file.size > 2 * 1024 * 1024) {
                this.$message.error('图片不能超过2M！，请选择chan长图组件！')
                return
            }
            let temp1 = file.name.split('.')
            let temp = temp1[temp1.length - 1]
            if (!['jpg', 'png', 'gif', 'jpeg'].includes(temp)) {
                this.$message.error('请上传jpg/png/gif文件')
                return false
            }
            // this.uploadPsd(file);
            // return false;
        },
        handleUploadSuccess (res) {
            if (res.data) {
                this.imageList.unshift({ url: res.data.url.replace(/https?:/, '') })
                $utils.saveLocalData('image_list', this.imageList)
            }
        },
        /* uploadPsd (file) {
          let params = new FormData()
          params.append('file', file)
          this.uploading = true
          this.$axios.post('/person/uploadImage', params).then(res => {
            this.uploading = false
            this.imageList.splice(0, 0, res.body)
          }).catch(() => {
            this.uploading = true
          })
        }, */
        getMyImages () {
            // this.hasLoadData = true
            this.imageList = $utils.getLocalData('image_list') || []
            // this.$axios.get('/person/images').then(res => {
            //   this.imageList = res.body || []
            // })
        },
        /**
         * 点击图片
         * @param url
         */
        handleImageClick (url) {
            $bus.$emit('select-image', this.selectId, url)
            this.dialogVisible = false
        },
        /**
         * 清空图片列表
         * @param url
         */
        handleClearAll () {
            this.$confirm('确定清空?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.imageList = []
                $utils.saveLocalData('image_list', this.imageList)
            }).catch(() => {

            })
        },
        handleClearOne (index) {
            this.imageList.splice(index, 1)
            $utils.saveLocalData('image_list', this.imageList)
        }
    }
}
</script>

<style lang="scss" scoped>
    .image-list-wrapper {
        display: flex;
        flex-wrap: wrap;
        height: 400px;
        overflow-y: auto;
        padding-top: 20px;

        li {
            width: 120px;
            height: 120px;
            background: #eee 50%/contain no-repeat;
            cursor: pointer;
            justify-content: center;
            align-items: center;
            display: flex;
            transition: all 0.28s;
            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;

            &:hover {
                box-shadow: 0 0 16px 0 rgba(0, 0, 0, .16);
                transform: translate3d(0, -2px, 0);
                .clear-one-img{
                    display: block;
                }
            }

            img {
                display: inline-block;
                max-width: 100%;
                max-height: 100%;
            }

            .clear-one-img {
                display: none;
                position: absolute;
                top: 5px;
                right: 5px;
                z-index: 1;
                font-size: 20px;
            }
        }
    }
</style>
<style lang="scss">
    .components-image-libs-wrapper {
        .image-lib-btn {
            display: flex;
            justify-content: space-between;
        }

        .el-dialog__body {
            padding: 0 20px 20px;
        }
    }
</style>
