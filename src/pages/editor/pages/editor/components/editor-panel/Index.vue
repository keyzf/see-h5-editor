<template>
    <div class="editor-pane" @mousedown="handleClickCanvas">
        <div class="editor-wrapper" :style="{ width: device.width + 'px',transform: `scale(${scale})` }">
            <div
                class="device-wrapper"
                id="device-wrapper"
                @dragover="handleDragOver"
                @drop="handleDrop"
                @dragenter="handleDragEnter"
                :style="{
                    width: activePage.commonStyle.width + 'px',
                    height: activePage.commonStyle.height + 'px'
                }"
            >
                <div
                    class="editor-main"
                    id="editor-main"
                    :style="{ ...getCommonStyle(activePage.commonStyle) }"
                >
                    <!-- 刻度尺子 -->
                    <div class="rulers">
                        <div class="horizontal ruler"></div>
                        <div
                            class="vertical ruler"
                            :style="{
                                height: activePage.commonStyle.height + 'px'
                            }"
                        ></div>
                    </div>
                    <node
                        v-for="item in elements"
                        :key="item.uuid"
                        :nodeInfo.sync="item"
                        :verticalGuidelines="verticalGuidelines"
                        :horizontalGuidelines="horizontalGuidelines"
                    />
                </div>
            </div>
        </div>
        <tool-tips />
    </div>
</template>

<script>
import plugins from "@/plugins/index";
import getOffset from "@/utils/getOffset";

import editShape from "@editor/components/edit-shape";
import editorProjectConfig from "@editor/pages/editor/DataModel";
import { mapGetters, mapState } from "vuex";
import html2canvas from "html2canvas";
import guideLineMixin from "@editor/mixins/guideLine";

import Guides from "@scena/guides";

import ToolTips from "./tooltips";
import Node from "@editor/components/node";

export default {
    props: {
        scale:{
            default: 1,
            type: Number
        }
    },
    components: {
        // 批量注册see组件
        ...plugins,
        // 画板组件
        [editShape.name]: editShape,
        ToolTips,
        Node
    },
    data() {
        return {
            getCommonStyle: editorProjectConfig.getCommonStyle,
            device: {
                height: 667,
                width: 375
            },
            elements: [],
            resizeListeners: null,
            syncPageVisible: false,
            guidesVertical: null,
            guidesHorizonta: null,
            verticalGuidelines: [], // [0, 150, 200]
            horizontalGuidelines: [] // [0, 150, 200]
        };
    },
    mixins: [guideLineMixin],
    computed: {
        ...mapState({
            pages: state => state.editor.projectData.pages,
            projectData: state => state.editor.projectData
        }),
        ...mapGetters([
            "currentPageIndex",
            "activeElement",
            "activePage",
            "sharedData"
        ])
    },
    created() {},
    mounted() {
        const rulersElement = document.querySelector(".rulers");
        this.horizontalRulerElement = rulersElement.querySelector(
            ".ruler.horizontal"
        );
        this.verticalRulerElement = rulersElement.querySelector(
            ".ruler.vertical"
        );

        this.guidesHorizonta = new Guides(this.horizontalRulerElement, {
            type: "horizontal",
            setGuides: this.refreshGuidelines.bind(this),
            backgroundColor: "transparent",
            lineColor: "#666",
            textColor: "#333"
        });
        this.guidesVertical = new Guides(this.verticalRulerElement, {
            type: "vertical",
            setGuides: this.refreshGuidelines.bind(this),
            backgroundColor: "transparent",
            lineColor: "#666",
            textColor: "#333"
        });
    },
    watch: {
        "activePage.elements": {
            immediate: true,
            deep: true,
            handler() {
                // this.initElements();
                // if (val) {
                this.elements = this.initElementss(this.activePage);
                this._updateGuideLine();
                this.refreshGuidelines();
                // }
            }
        },
        "activePage.commonStyle.height": {
            handler() {
                this.$nextTick(() => {
                    this.guidesVertical && this.guidesVertical.resize();
                });
            }
        }
    },
    methods: {
        initElements() {
            if (!this.activePage.elements) {
                this.elements = [];
            }
            const val = this.activePage.elements.map(item => {
                return {
                    ...item,
                    propsValue: {
                        ...this.getElementProps(item.propsValue, item.uuid),
                        value: item.value
                    },
                    name: plugins[item.elName] ? plugins[item.elName].title : ""
                };
            });
            this.elements = val;
            this._updateGuideLine();
            this.refreshGuidelines();
        },

        initElementss(page) {
            // let elements = [];
            if (!page.elements) return [];
            return page.elements.map(item => ({
                ...item,
                elements: this.initElementss(item),
                propsValue: {
                    ...this.getElementProps(item.propsValue),
                    value: item.value
                },
                name: plugins[item.elName] ? plugins[item.elName].title : ""
            }));
        },
        /**
         * 元素被选中
         * @param uuid
         */
        handleMousedown(uuid) {
            if (this.activeElementUUID !== uuid) {
                this.$emit("element-click", uuid);
                this.$store.dispatch("setActiveElementUUID", uuid);
            }
        },

        /**
         * 移动改变元素大小定位
         * @param pos 当pos有值表示移动中需要实时同步样式变化，pos为undefined时则表示移动结束，记一次历史纪录
         * 鼠标移动完成时才记入历史纪录
         */
        handleElementResizeEnd(pos) {
            // 更新元素commonStyle
            // const projectData = { ...this.projectData }
            // projectData.pages[this.currentPageIndex].elements[this.activeElementIndex].commonStyle = { ...pos }
            // this.$store.commit('setPrjectData', projectData)
            this._clearGuideLine();
            // this.$store.dispatch('addHistoryCache')
        },

        handleClickCanvas(e) {
            if (
                e.target.classList.contains("editor-pane") ||
                e.target.classList.contains("editor-main")
            ) {
                this.$store.dispatch("setActiveElementUUID", null);
            }
        },
        /**
         * 提供截屏作为项目主图
         */
        screenshots() {
            const el = document.querySelector("#canvas-panel");
            html2canvas(el, {
                width: 375,
                height: 667,
                proxy: "/htmltocanvas/corsproxy" // 设置跨域接口
            }).then(canvas => {
                let url = canvas.toDataURL("image/jpeg");
                this.$store.commit("updateCoverImage", url);
            });
        },
        getElementProps(props, $scope) {
            let tempProps = {};
            for (const i in props) {
                // console.log(i, props[i], Object.prototype.toString.call(props[i]))
                if (
                    Object.prototype.toString.call(props[i]) ===
                    "[object Object]"
                ) {
                    tempProps[i] = props[i].value;
                } else {
                    tempProps[i] = props[i];
                }
                tempProps[i] = this.renderString(
                    tempProps[i],
                    { ...this.globalVariable, ...this.sharedData },

                );
            }
            return tempProps;
        },
        // 刷新辅助线
        refreshGuidelines() {
            const guidesVertical = this.guidesVertical
                ? this.guidesVertical.getGuides()
                : [];
            const guidesHorizonta = this.guidesHorizonta
                ? this.guidesHorizonta.getGuides()
                : [];
            // this.verticalGuidelines = [...guidesVertical]
            // this.horizontalGuidelines = [...guidesHorizonta]
            this.verticalGuidelines = [
                ...guidesVertical,
                ...this.guide.line.left
            ];
            this.horizontalGuidelines = [
                ...guidesHorizonta,
                ...this.guide.line.top
            ];
        },
        // 同步状态数据
        handleSyncPage(pageUuid) {
            this.syncPageVisible = false;
            this.$store.dispatch("asyncPage", pageUuid);
        },
        setSharedData(uuid, data) {
            // console.log("on set share");
            // this.$nextTick(() => {
            // console.log(JSON.stringify(this.$store.getters.sharedData))
            this.initElements();
            // })
        },
        handleDragEnter(e) {
            e.preventDefault();
        },

        handleDragOver(e) {
            e.preventDefault();
        },
        /**
         * 处理拖动
         */
        handleDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            const transferedData = e.dataTransfer.getData("dragElement");
            if (transferedData) {
                let item = JSON.parse(transferedData);
                const targetPosition = { left: e.clientX, top: e.clientY };
                const panelPosition = getOffset(e.currentTarget);
                // 这里修改一下添加到到位置 算到组件到中心
                // panelPosition是画板的位置 clientX，clientY是元素拖动到的位置
                item.defaultStyle.left =
                    targetPosition.left -
                    panelPosition.left -
                    (item.defaultStyle.width &&
                    // 这里有可能是undefined或者auto
                    typeof item.defaultStyle.width === "number"
                        ? item.defaultStyle.width / 2
                        : 0);
                item.defaultStyle.top =
                    targetPosition.top -
                    panelPosition.top -
                    (item.defaultStyle.height &&
                    typeof item.defaultStyle.height === "number"
                        ? item.defaultStyle.height / 2
                        : 0);
                this.$store.dispatch('addElement', { elData:item })

            }
        }
    }
};
</script>

<style lang="scss" scoped>
.editor-pane {
    height: 100%;
    width: 100%;
    padding: 35px 0;
    overflow-y: auto;
    background-image: linear-gradient(
            45deg,
            #f5f5f5 25%,
            transparent 0,
            transparent 75%,
            #f5f5f5 0
        ),
        linear-gradient(
            45deg,
            #f5f5f5 25%,
            transparent 0,
            transparent 75%,
            #f5f5f5 0
        );
    background-position: 0 0, 13px 13px;
    background-size: 26px 26px;
    display: flex;
    justify-content: center;
}

.device-wrapper {
    border-radius: 3px;
    box-shadow: 0 3px 10px #dcdcdc;
    position: relative;
    transform: scaleX(1); /* 为了让 自组件的position:fixed 失效*/
    background-color: #fff;
    transform-origin: center top;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==");
}

.editor-main {
    height: 100%;
    background-size: 100% auto !important;
}

.rulers {
    position: absolute;
    width: 30px;
    height: 30px;
    left: -30px;
    top: -30px;
    box-sizing: border-box;
}

.ruler {
    position: absolute;
}

.ruler.horizontal {
    width: 375px;
    height: 30px;
    left: 30px;
    top: 0px;
}

.ruler.vertical {
    top: 30px;
    left: 0px;
    width: 30px;
    height: 667px;
}

.page-wrapper-mask {
    height: 100%;
    width: 100%;
    z-index: 1000;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    outline: rgba(236, 238, 240, 0.77) solid 10000px;
}

.element-on-edit-pane {
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.editor-wrapper {
    transform-origin: 50% 0;
}
</style>
