<template>
    <div class="editor-wrapper" v-loading="loading">
        <div class="control-bar-wrapper">
            <controlBar
                :scale.sync="canvasConfig.scale"
                @import-psd-data="importPsdData"
                @showPreview="showPreviewFn"
                @cancel="cancelFn"
                @publish="publishFn"
                @export="exportFn"
                @import="importFn"
                @save="saveFn"
            />
        </div>
        <!--左侧导航-->
        <div class="editor-side-bar border-R">
            <el-tabs class="editor-side-bar-top" v-model="activeSideBarTop" :stretch="true">
                <el-tab-pane label="组件库" name="component-libs">
                    <componentLibs/>
                </el-tab-pane>
            </el-tabs>
            <div class="editor-side-bar-line"></div>
            <el-tabs class="editor-side-bar-bottom" v-model="activeSideBarBottom" :stretch="true">
                <el-tab-pane label="组件树" name="component-tree">
                    <templateLibs/>
                </el-tab-pane>
                <el-tab-pane label="状态切换" name="toggle-status">
                    <toggle-page/>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!--页面编辑区域-->
        <div class="editor-main">
            <editorPan :scale.sync="canvasConfig.scale"/>
        </div>
        <!--属性编辑区域-->
        <div class="el-attr-edit-wrapper scrollbar-wrapper">
            <el-tabs v-model="activeAttr" stretch>
                <template v-if="activeElementUUID">
                    <el-tab-pane label="属性" name="属性">
                        <attrEdit></attrEdit>
                    </el-tab-pane>
                    <el-tab-pane label="事件" name="事件">
                        <eventEdit></eventEdit>
                    </el-tab-pane>
                    <el-tab-pane label="动画" name="动画">
                        <animationEdit></animationEdit>
                    </el-tab-pane>
                </template>
                <!-- <el-tab-pane v-else label="页面设置" name="页面属性"> -->
                <pageAttrEdit v-else></pageAttrEdit>
                <!-- </el-tab-pane> -->
            </el-tabs>
        </div>
        <!--预览-->
        <previewPage
            v-if="showPreview"
            :pageData="projectData"
            :pageId="id"
            @closePreview="showPreview = false"
            @publishFn="publishFn"
            @saveFn="saveFn"
        ></previewPage>
        <!--我的图片-->
        <imageLibs/>
    </div>
</template>

<script>
import plugins from '@/plugins/index'
import $config from '@/config'
import { getComponentProps } from '@editor/common/js/mUtils'

import componentLibs from './components/component-libs/Index'
import templateLibs from './components/template-libs'
import togglePage from './components/toggle-page'
import editorPan from './components/editor-panel/Index'
// 属性编辑相关组件
import attrEdit from './components/attr-configure/attr-edit'
import animationEdit from './components/attr-configure/animation-edit'
import eventEdit from './components/attr-configure/event-edit'
import pageAttrEdit from './components/attr-configure/page-attr-edit'

import controlBar from './components/control-bar'

import previewPage from './components/preview'
import imageLibs from '@editor/components/image-libs'


import { mapState } from 'vuex'
import { saveAs } from 'file-saver'
//import API from '@/apis/common'

import hotKeyActionsMixin from '@editor/mixins/hotKeyActions'
import hotKeyMixin from '@editor/mixins/hotKey'
import windowEventMixin from '@editor/mixins/window-event-reg'

function isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

const DEFAULT_ATTR = '属性'

export default {
    mixins: [hotKeyMixin, hotKeyActionsMixin, windowEventMixin],
    components: {
        componentLibs,
        templateLibs,
        togglePage,
        imageLibs,
        editorPan,
        attrEdit,
        animationEdit,
        eventEdit,
        pageAttrEdit,
        controlBar,
        previewPage,
        ...plugins
    },
    data () {
        return {
            id: this.$route.query.id, // 当前页面id
            loading: true,
            showPreview: false,
            activeAttr: DEFAULT_ATTR,
            activeSideBarTop: 'component-libs',
            activeSideBarBottom: 'component-tree',
            canvasConfig: {
                scale: 1
            }
        }
    },
    computed: {
        ...mapState({
            projectData: (state) => state.editor.projectData,
            activePageUUID: (state) => state.editor.activePageUUID,
            activeElementUUID: (state) => state.editor.activeElementUUID
        })
    },
    created () {
        this.initPageData()
    },
    watch: {
        activeElementUUID (val) {
            if (val) {
                this.activeAttr = DEFAULT_ATTR
            }
        }
    },
    methods: {
        // 新老数据合并
        mergeProjectData (data) {
            for (const page of data.pages) {
                page.commonStyle.width = page.commonStyle.width || data.width || $config.canvasH5Width
                page.commonStyle.height = page.commonStyle.height || data.height || $config.canvasH5Height
                const elements = page.elements
                for (const el of elements) {
                    const propsMap = getComponentProps(el.elName)
                    Object.keys(propsMap).forEach((key) => {
                        const value = propsMap[key]
                        if (isObject(value)) {
                            propsMap[key] = { ...value, ...el.propsValue[key] }
                        } else {
                            propsMap[key] = el.propsValue[key] || propsMap[key]
                        }
                    })
                    el.propsValue = propsMap
                }
            }
            delete data.width
            delete data.height
            return data
        },
        /**
         * 初始化页面数据
         */
        initPageData () {
            if (!this.id) {
                this.$message.error('缺少id')
                return
            }
            this.loading = true
            const projectData = this.$utils.getLocalData(`project_data_${this.id}`)
            this.$store.dispatch('setPrjectData', projectData)

            this.loading = false
            // API.GET_ACTIVITY_DETAIL(this.globalVariable)
            //     .then((res) => {
            //         this.loading = false
            //         this.$store.dispatch('setPrjectData', {
            //             ...this.mergeProjectData(
            //                 JSON.parse(res.data.page_data || editorProjectConfig.getProjectConfig())
            //             )
            //         })
            //         this.$store.dispatch('addHistoryCache')
            //     })
            //     .catch((error) => {
            //         console.log(error)
            //         // window.location.href = '/'
            //     })
        },
        /**
         * 保存
         */
        async saveFn (showMessage = true) {
            this.$utils.saveLocalData(`project_data_${this.id}`, this.projectData)
            showMessage && this.$message.success('保存成功')
        },
        async exportFn () {
            const content = JSON.stringify(this.projectData)
            saveAs(
                new Blob([content], { type: 'text/plain;charset=utf-8' }),
                `exportData_${this.id}.json`
            )
        },
        async importFn (file) {
            const reader = new FileReader()
            const that = this

            reader.readAsText(file) //读取文件的内容
            reader.onload = function () {
                console.log('读取结果：', this.result) //当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。\
                let data = that.mergeProjectData(JSON.parse(this.result))
                data._id = that.projectData._id
                data.author = that.projectData.author
                that.$store.dispatch('setPrjectData', data)
            }
        },
        /**
         * 保存并发布
         */
        async publishFn () {
            await this.$confirm('确定保存并发布吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            await this.saveFn(false)
            this.$message.success('发布成功')
        },
        showPreviewFn () {
            this.showPreview = true
        },
        /**
         * 退出
         */
        cancelFn () {
            this.$confirm('确认退出编辑?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push('/page-list')
            }).catch(() => {})
        },
        /**
         * 提供截屏作为项目主图
         */
        screenshots () {
            // const el = document.querySelector('#canvas-panel');
            // return new Promise((resolve, reject) => {
            //     html2canvas(el, {
            //         proxy: `${this.$config.baseURL}/common/html2canvas/corsproxy`,
            //     }).then((canvas) => {
            //         const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            //         const blob = this.$mUtils.dataURItoBlob(dataUrl);
            //         const file = new window.File([blob], +new Date() + '.png', {
            //             type: 'image/png',
            //         });
            //         let params = new FormData();
            //         params.append('file', file);
            //         this.$axios
            //             .post('/common/uploadFile', params)
            //             .then((res) => {
            //                 // 替换主图链接
            //                 this.projectData.coverImage = res.body;
            //                 resolve(res.body);
            //             })
            //             .catch((err) => {
            //                 reject(err);
            //             });
            //     });
            // });
        },
        /**
         *
         * @param dataList
         */
        importPsdData () {
            // let elementsList = psdData.elements;
            // let psdWidth = psdData.document.width;
            // let scalingRatio = this.projectData.width / psdWidth;
            // elementsList.forEach((item) => {
            //     let {
            //         width,
            //         height,
            //         top,
            //         left,
            //         imageSrc,
            //         opacity,
            //         zIndex,
            //     } = item;
            //     setTimeout(() => {
            //         this.$store.dispatch('addElement', {
            //             elName: 'see-image',
            //             defaultStyle: {
            //                 width: width * scalingRatio,
            //                 height: height * scalingRatio,
            //                 top: top * scalingRatio,
            //                 left: left * scalingRatio,
            //                 zIndex: zIndex,
            //                 opacity,
            //             },
            //             needProps: {
            //                 imageSrc: imageSrc,
            //             },
            //         });
            //     }, 10);
            // });
        }
    }
}
</script>

<style lang="scss" scoped>
    .editor-wrapper {
        display: flex;
        height: 100%;
        min-width: 1000px;
        position: relative;
        background-color: #fbf8ff;

        .editor-side-bar {
            width: 295px;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            &-line {
                background-color: #F2F2F2;
                height: 1px;
            }

            &-top, &-bottom {
                overflow: hidden;
                display: flex;
                flex-direction: column;

                ::v-deep .el-tabs__content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0 10px;
                    margin-bottom: 10px;
                }
            }

            &-top {
                flex: 1;
            }

            &-bottom {
                height: 35%;
            }
        }

        .editor-page-edit-wrapper {
            width: 100%;
            height: calc(100% - 54px);
            box-sizing: border-box;
            overflow: auto;
            padding: 0 1px;
        }

        .editor-main {
            overflow: hidden;
            flex: 1;
            background: #f0f2f5;
            position: relative;
        }

        .el-attr-edit-wrapper {
            width: 380px;
            padding: 0;
        }
    }

    .control-bar-wrapper {
        position: absolute;
        top: -44px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        text-align: center;
        z-index: 999;
    }
</style>
<style lang="scss">
    .el-attr-edit-wrapper {
        .el-tabs {
            height: 100%;
        }

        .el-tabs__content {
            height: calc(100% - 55px);

            & > div {
                height: 100%;
            }

            .attr-edit-inner {
                padding: 0 15px;
            }
        }
    }
</style>
