<template>
    <div class="main-page">
        <div
            class="main-page-content"
            :class="pageData.disableImageLongTouch ? 'disable-image-longtouch' : ''"
            :style="
                    getCommonStyle(
                        {
                            ...currentPage.commonStyle,
                            top: pageTop,
                            height: currentPage.commonStyle.height || pageData.height,
                            width: currentPage.commonStyle.width || pageData.width,
                            position: 'relative',
                        },
                        scalingRatio
                    )
                "
        >
            <h5-node
                v-for="(item) in currentPage.elements"
                :key="item.brotherUuid"
                :nodeInfo="item"
                @toggle-status="setCurrentPage"
                :currentPageIndex="currentPageIndex">
            </h5-node>
        </div>
        <van-loading v-if="loading" class="loading">加载中</van-loading>
    </div>
</template>

<script>
import editorProjectConfig from '@editor/pages/editor/DataModel'
import H5Node from './h5-node'
import $config from '@/config'
import $utils from '@/utils'

import { Loading, Toast } from 'vant'
import { mapGetters } from 'vuex'

export default {
    name: 'engineH5Long',
    components: {
        H5Node,
        VanLoading: Loading
    },
    mixins: [],
    computed: {
        ...mapGetters(['sharedData'])
    },
    data () {
        return {
            id: this.$route.query.id,
            getCommonStyle: editorProjectConfig.getCommonStyle,
            scalingRatio: 1,
            pageData: {
                height: '',
                width: '',
                pages: []
            },
            pages: [],
            currentPage: {
                commonStyle: {}
            },
            currentPageIndex: 0,
            pageTop: 0,
            loading: true
        }
    },
    mounted () {
        this.scalingRatio = document.body.clientWidth / $config.canvasH5Width
        const projectData = $utils.getLocalData(`project_data_${this.id}`)
        this.pageData = projectData
        this.pages = this.pageData.pages || []
        // 默认展示第一页
        this.setCurrentPage(this.pages[this.currentPageIndex].uuid)
        this.loading = false

        // API.GET_ACTIVITY_DETAIL(this.globalVariable).then((res) => {
        //     this.pageData = JSON.parse(res.data.page_data)
        //     document.title = res.data.name
        //     this.pages = this.pageData.pages || []
        //     // 默认展示第一页
        //     this.setCurrentPage(this.pages[this.currentPageIndex].uuid)
        //     this.loading = false
        // }).catch((err) => {
        //     this.loading = false
        //     console.error(err)
        //     Toast('出现了错误，请稍后再试')
        // })
    },
    methods: {
        //  设置显示当前页面
        setCurrentPage (uuid) {
            this.currentPageIndex = this.pages.findIndex(v => v.uuid === uuid)
            if (this.currentPageIndex > -1) {
                this.currentPage = this.pages[this.currentPageIndex]
                const commonStyle = this.currentPage.commonStyle
                Object.keys(commonStyle).forEach((style) => {
                    document.documentElement.style[style] = commonStyle[style]
                })
            } else {
                Toast('该状态不存在')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .main-page {
        position: relative;
        width: 100%;
        height: 100%;

        &::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
        }
    }

    .main-page-content {
        overflow: visible;
        background-size: 100% auto !important;
    }

    .loading {
        height: 100vh;
        width: 100vw;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }
</style>

<style lang="scss">
    .disable-image-longtouch {
        img {
            pointer-events: none;
        }
    }
</style>
