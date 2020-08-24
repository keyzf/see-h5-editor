<template>
    <div class="base-attr">
        <p class="page-title fontBold">基础样式</p>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="尺寸与位置：" name="1">
                <div class="attr-item-edit-wrapper marginB15">
                    <p class="attr-item-title">定位：</p>
                    <div class="sizeAndPosition-wrapper">
                        <el-select v-model="activeElement.commonStyle.position" placeholder="请选择" size="mini">
                            <el-option label="固定定位" value="fixed"></el-option>
                            <el-option label="绝对定位" value="absolute"></el-option>
                            <el-option label="相对定位" value="relative"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper marginB15">
                    <p class="attr-item-title">快捷定位：</p>
                    <div class="sizeAndPosition-wrapper">
                        <div
                            class="align-type-item"
                            v-for="item in alignTypeList"
                            :key="item.type"
                            @click="changeAlignType(item.type)"
                            v-once
                        >
                            <el-tooltip
                                effect="dark"
                                :content="item.title"
                                placement="bottom"
                            >
                                <i :class="[item.icon]"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">尺寸：</p>
                    <div class="col-1 attr-item-edit-input">
                        <el-checkbox
                            disabled
                            v-model="activeElement.autoWidth"
                            @input="handleAutoWidth"
                        />
                        <div class="attr-item-edit-input-des">自动宽度</div>
                    </div>
                    <div class="col-1 attr-item-edit-input">
                        <el-checkbox
                            v-model="activeElement.autoHeight"
                            @input="handleAutoHeight"
                        />
                        <div class="attr-item-edit-input-des">自动高度</div>
                    </div>
                    <div class="col-1 attr-item-edit-input">
                        <el-checkbox v-model="activeElement.lockRatio"/>
                        <div class="attr-item-edit-input-des">锁定比例</div>
                    </div>
                    <div class="col-1 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            :disabled="activeElement.autoWidth"
                            v-model="activeElement.commonStyle.width"
                            controls-position="right"
                            :min="0"
                            @input="handleWidthChange"
                        />
                        <div class="attr-item-edit-input-des">宽度</div>
                    </div>
                    <div class="col-1 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            :disabled="activeElement.autoHeight"
                            v-model="activeElement.commonStyle.height"
                            controls-position="right"
                            :min="0"
                            @input="handleHeightChange"
                        />
                        <div class="attr-item-edit-input-des">高度</div>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">快捷resize：</p>
                    <div class="sizeAndPosition-wrapper">
                        <div
                            class="align-type-item clearFlex"
                            v-once
                            @click="handleResizeClick('wh')"
                        >
                            <el-tooltip
                                effect="dark"
                                content="满屏"
                                placement="bottom"
                            >
                                <i class="iconfont iconquanping"></i>
                            </el-tooltip>
                        </div>
                        <div
                            class="align-type-item clearFlex"
                            @click="handleResizeClick('w')"
                            v-once
                        >
                            <el-tooltip
                                effect="dark"
                                content="宽100%"
                                placement="bottom"
                            >
                                <i class="iconfont iconcolumn-width"></i>
                            </el-tooltip>
                        </div>
                        <div
                            class="align-type-item clearFlex"
                            @click="handleResizeClick('h')"
                            v-once
                        >
                            <el-tooltip
                                effect="dark"
                                content="高100%"
                                placement="bottom"
                            >
                                <i class="iconfont iconcolum-height"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">位置：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            v-model="activeElement.commonStyle.left"
                            controls-position="right"
                        />
                        <div class="attr-item-edit-input-des">left</div>
                    </div>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            v-model="activeElement.commonStyle.top"
                            controls-position="right"
                        />
                        <div class="attr-item-edit-input-des">top</div>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title"></p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            v-model="activeElement.commonStyle.bottom"
                            controls-position="right"
                        />
                        <div class="attr-item-edit-input-des">bottom</div>
                    </div>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            v-model="activeElement.commonStyle.right"
                            controls-position="right"
                        />
                        <div class="attr-item-edit-input-des">right</div>
                    </div>
                </div>
                <!-- <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">旋转：</p>
                    <div class="col-1 attr-item-edit-input">
                        <el-slider
                            v-model="activeElement.commonStyle.rotate"
                            @change="throttleAddHistory"
                            show-input
                            :min="-180"
                            :max="180"
                            :marks="{ 0: '', 90: '', '-90': '' }"
                            input-size="mini"
                        ></el-slider>
                    </div>
                </div> -->
            </el-collapse-item>

            <el-collapse-item title="边框边距：" name="2">
                <!--边框-->
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">边框：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            v-model="activeElement.commonStyle.borderWidth"
                            @change="throttleAddHistory"
                            controls-position="right"
                            :min="0"
                        />
                        <div class="attr-item-edit-input-des">尺寸</div>
                    </div>
                    <div class="col-3 attr-item-edit-input">
                        <el-color-picker
                            show-alpha
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.borderColor"
                        ></el-color-picker>
                        <div class="attr-item-edit-input-des">颜色</div>
                    </div>
                    <div class="col-2 attr-item-edit-input">
                        <el-select
                            v-model="activeElement.commonStyle.borderStyle"
                            @change="throttleAddHistory"
                            size="mini"
                        >
                            <el-option
                                v-for="item in borderStyleList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                        <div class="attr-item-edit-input-des">样式</div>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">边框圆弧：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.borderRadius"
                            controls-position="right"
                            :min="0"
                        />
                    </div>
                </div>
                <!--边距-->

                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">上下边距：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.paddingTop"
                            controls-position="right"
                            :min="0"
                        />
                    </div>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.paddingBottom"
                            controls-position="right"
                            :min="0"
                        />
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">左右边距：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.paddingLeft"
                            controls-position="right"
                            :min="0"
                        />
                    </div>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.paddingRight"
                            controls-position="right"
                            :min="0"
                        />
                    </div>
                </div>
                <!--外边距-->
            </el-collapse-item>
            <el-collapse-item title="阴影样式：" name="3">
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">阴影位置：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="boxShadowChange"
                            v-model="boxShadow.h"
                            controls-position="right"
                        />
                        <div class="attr-item-edit-input-des">水平阴影位置</div>
                    </div>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="boxShadowChange"
                            v-model="boxShadow.v"
                            controls-position="right"
                        />
                        <div class="attr-item-edit-input-des">垂直阴影位置</div>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">阴影位置：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="boxShadowChange"
                            v-model="boxShadow.blur"
                            controls-position="right"
                        />
                        <div class="attr-item-edit-input-des">水平阴影位置</div>
                    </div>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="boxShadowChange"
                            v-model="boxShadow.spread"
                            controls-position="right"
                        />
                        <div class="attr-item-edit-input-des">垂直阴影位置</div>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">阴影颜色：</p>
                    <div class="attr-item-edit-input">
                        <el-color-picker
                            show-alpha
                            size="mini"
                            @change="boxShadowChange"
                            v-model="boxShadow.color"
                        ></el-color-picker>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="字体：" name="4">
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">字体大小：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.fontSize"
                            controls-position="right"
                            :min="0"
                        />
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">字体粗细：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.fontWeight"
                            controls-position="right"
                            :min="300"
                            :step="100"
                            :max="900"
                        />
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">行间距：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.lineHeight"
                            controls-position="right"
                            :min="0"
                            :step="0.1"
                        />
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">字间距：</p>
                    <div class="col-2 attr-item-edit-input">
                        <el-input-number
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.letterSpacing"
                            controls-position="right"
                            :min="0"
                        />
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">对齐方式：</p>
                    <div class="sizeAndPosition-wrapper">
                        <div
                            class="align-type-item clearFlex"
                            :class="{active:activeElement.commonStyle.textAlign==='left'}"
                            @click="handleTextAlignClick('left')"
                        >
                            <el-tooltip
                                v-once
                                effect="dark"
                                content="左对齐"
                                placement="bottom"
                            >
                                <i class="iconfont iconzuoduiqi1"></i>
                            </el-tooltip>
                        </div>
                        <div
                            class="align-type-item clearFlex"
                            :class="{active:activeElement.commonStyle.textAlign==='center'}"
                            @click="handleTextAlignClick('center')"
                        >
                            <el-tooltip
                                effect="dark"
                                content="居中对齐"
                                placement="bottom"
                                v-once
                            >
                                <i class="iconfont iconjuzhongduiqi"></i>
                            </el-tooltip>
                        </div>
                        <div
                            class="align-type-item clearFlex"
                            :class="{active:activeElement.commonStyle.textAlign==='right'}"
                            @click="handleTextAlignClick('right')"
                        >
                            <el-tooltip
                                effect="dark"
                                content="右对齐"
                                placement="bottom"
                                v-once
                            >
                                <i class="iconfont iconyouduiqi2"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>

                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">字体颜色：</p>
                    <div class="attr-item-edit-input">
                        <el-color-picker
                            show-alpha
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.color"
                        ></el-color-picker>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="背景&&透明度：" name="5">
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">背景颜色：</p>
                    <div class="attr-item-edit-input no-top">
                        <el-color-picker
                            show-alpha
                            size="mini"
                            @change="throttleAddHistory"
                            v-model="activeElement.commonStyle.backgroundColor"
                        ></el-color-picker>
                    </div>
                </div>
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">背景图片：</p>
                    <div class="attr-item-edit-input">
                        <imageSelect
                            :url.sync="
                                activeElement.commonStyle.backgroundImage
                            "
                            @change="throttleAddHistory"
                        />
                    </div>
                </div>

                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">透明度：</p>
                    <div class="col-1 attr-item-edit-input">
                        <el-slider
                            v-model="opacity"
                            @change="throttleAddHistory"
                            show-input
                            :min="0"
                            :max="100"
                            :marks="{ 0: '', 50: '' }"
                            input-size="mini"
                        ></el-slider>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="过度动画：" name="6">
                <div class="attr-item-edit-wrapper">
                    <p class="attr-item-title">是否开启过度动画：</p>
                    <div class="attr-item-edit-input no-top">
                        <el-radio-group v-model="activeElement.commonStyle.transition">
                            <el-radio label="all 0.15s">是</el-radio>
                            <el-radio label="unset">否</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { ceil, divide, subtract, throttle } from 'lodash'
import imageSelect from '@editor/components/image-select'

export default {
    components: {
        imageSelect
    },
    data () {
        return {
            activeNames: ['1'],
            alignTypeList: [
                {
                    title: '左对齐',
                    icon: 'iconfont iconzuoduiqi',
                    type: 'l'
                },
                {
                    title: '上对齐',
                    icon: 'iconfont iconshangduiqi',
                    type: 't'
                },
                {
                    title: '右对齐',
                    icon: 'iconfont iconyouduiqi',
                    type: 'r'
                },
                {
                    title: '下对齐',
                    icon: 'iconfont iconxiaduiqi',
                    type: 'b'
                },
                {
                    title: '垂直居中对齐',
                    icon: 'iconfont iconshuipingjuzhongduiqi',
                    type: 'tb'
                },
                {
                    title: '水平居中对齐',
                    icon: 'iconfont iconchuizhijuzhongduiqi',
                    type: 'lr'
                }
            ],
            // 'none', 'solid', 'dashed', 'dotted', 'double'
            borderStyleList: [
                {
                    label: '实线',
                    value: 'solid'
                },
                {
                    label: '虚线',
                    value: 'dashed'
                },
                {
                    label: '点状',
                    value: 'dotted'
                },
                {
                    label: '双线',
                    value: 'double'
                }
            ],
            boxShadow: {
                h: 0,
                v: 0,
                blur: 0,
                spread: 0,
                color: '#000000'
            },
            lastActiveUUID: '',
            ratio: 0
        }
    },
    computed: {
        ...mapState({
            projectData: state => state.editor.projectData,
            activePageUUID: state => state.editor.activePageUUID,
            activeElementUUID: state => state.editor.activeElementUUID,
            activeAttrEditCollapse: state => state.editor.activeAttrEditCollapse
        }),
        ...mapGetters([
            'currentPageIndex',
            'activeElement',
            'activePage'
        ]),
        opacity: {
            get () {
                return this.activeElement.commonStyle.opacity * 100
            },
            set (val) {
                this.activeElement.commonStyle.opacity = val / 100
            }
        }
    },
    watch: {
        activeElementUUID () {
            // 设置boxShadow
            this.$nextTick(() => {
                this.initBoxShadowEdit()
            })
        },
        activeNames () {
            this.$store.commit(
                'updateActiveAttrEditCollapse',
                this.activeNames
            )
        },
        activeElement: {
            deep: true,
            handler () {
                if (this.activeElement.autoSize) {
                    this.handleAutoHeight(true)
                    this.handleAutoWidth(true)
                }
                // 如果不是autosize 就设置一个宽高比例 以供后面计算用
                if (
                    !this.activeElement.autoHeight &&
                    !this.activeElement.autoWidth
                ) {
                    this.ratio =
                        this.activeElement.commonStyle.height /
                        this.activeElement.commonStyle.width
                } else {
                    this.ratio = 0
                }
            }
        }
    },
    created () {
        this.throttleAddHistory = throttle(this.addHistory, 3000)
    },
    mounted () {
        this.initBoxShadowEdit()
        this.activeNames = this.activeAttrEditCollapse
    },
    methods: {
        /**
         * 纪录一条历史纪录
         * */
        addHistory () {
            // console.log('common style change addHistoryCache')
            this.$store.dispatch('addHistoryCache')
        },
        /**
         *
         * @param type
         */
        changeAlignType (type) {
            let canvasW = this.$config.canvasH5Width
            let canvasH = this.$config.canvasH5Height
            let eleW = this.activeElement.commonStyle.width
            let eleH = this.activeElement.commonStyle.height

            switch (type) {
                case 't':
                    this.activeElement.commonStyle.top = 0
                    this.activeElement.commonStyle.bottom = 'static'
                    break
                case 'b':
                    this.activeElement.commonStyle.top = 'static'
                    this.activeElement.commonStyle.bottom = 0
                    break
                case 'l':
                    this.activeElement.commonStyle.left = 0
                    break
                case 'r':
                    this.activeElement.commonStyle.left = subtract(
                        canvasW - eleW
                    )
                    break
                case 'tb':
                    this.activeElement.commonStyle.top = ceil(
                        divide(subtract(canvasH - eleH), 2),
                        2
                    )
                    break
                case 'lr':
                    this.activeElement.commonStyle.left = ceil(
                        divide(subtract(canvasW - eleW), 2),
                        2
                    )
                    break
            }
        },
        /**
         * 初始化阴影编辑对象
         */
        initBoxShadowEdit () {
            let boxShadow = this.activeElement.commonStyle.boxShadow
            let boxShadowEditConfig = {
                h: 0,
                v: 0,
                blur: 0,
                spread: 0,
                color: '#000000'
            }
            if (!boxShadow || boxShadow === 'none') {
                this.boxShadow = boxShadowEditConfig
                return
            }
            let str = boxShadow.split(' ')

            boxShadowEditConfig = {
                h: parseInt(str[0].replace('px', '')),
                v: parseInt(str[1].replace('px', '')),
                blur: parseInt(str[2].replace('px', '')),
                spread: parseInt(str[3].replace('px', '')),
                color: str[4]
            }
            this.boxShadow = boxShadowEditConfig
        },
        boxShadowChange () {
            let str = `${this.boxShadow.h}px ${this.boxShadow.v}px ${this.boxShadow.blur}px ${this.boxShadow.spread}px ${this.boxShadow.color}`
            this.activeElement.commonStyle.boxShadow = str
        },
        /**
         * 字体样式设置对齐方式
         * @param str
         */
        handleTextAlignClick (str) {
            this.activeElement.commonStyle.textAlign = str
        },
        /**
         * 字体样式设置对齐方式
         * @param str
         */
        handleResizeClick (type) {
            if (type.includes('w')) {
                this.activeElement.commonStyle.left = 0
                this.activeElement.commonStyle.width = this.$config.canvasH5Width
            }
            if (type.includes('h')) {
                this.activeElement.commonStyle.top = 0
                this.activeElement.commonStyle.height = this.$config.canvasH5Height
            }
        },

        handleAutoHeight (enable) {
            if (enable) {
                this.activeElement.commonStyle.height = 'auto'
            } else {
                this.activeElement.commonStyle.height = 300
            }
        },

        handleAutoWidth (enable) {
            if (enable) {
                this.activeElement.commonStyle.width = 'auto'
            } else {
                this.activeElement.commonStyle.width = this.$config.canvasH5Width
            }
        },

        handleWidthChange (width) {
            // 锁定比例计算
            if (this.activeElement.lockRatio && this.ratio) {
                this.activeElement.commonStyle.height = +(
                    width * this.ratio
                ).toFixed(2)
            }
        },

        handleHeightChange (height) {
            if (this.activeElement.lockRatio && this.ratio) {
                this.activeElement.commonStyle.width = +(
                    height / this.ratio
                ).toFixed(2)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .sizeAndPosition-wrapper {
        display: flex;
        width: 100%;
    }

    .align-type-item {
        flex: 1;
        cursor: pointer;
        text-align: center;

        &.clearFlex {
            width: 42px;
            flex: none;
        }

        i {
            line-height: 1;
            display: inline-block;
            padding: 6px;
            border-radius: 4px;
            background: rgba(37, 165, 137, 0.08);
        }

        &:hover,&.active {
            i {
                color: white;
                background: $primary;
            }
        }
    }

    .attr-item-edit-wrapper {
        padding-left: 18px;
        display: flex;
        width: 100%;
        text-align: center;
        padding-bottom: 10px;

        .attr-item-title {
            text-align: left;
            padding-top: 4px;
            min-width: 60px;
            font-size: 12px;
        }

        .attr-item-edit-input {
            &.col-2 {
                width: 90px;
                margin-left: 10px;
            }

            &.col-1 {
                width: 250px;
            }

            &.col-3 {
                width: 60px;
                margin-left: 10px;
            }

            &.col-4 {
                width: 50px;
                margin-left: 10px;
            }

            .attr-item-edit-input-des {
                text-align: center;
                line-height: 1;
                margin-top: 2px;
                font-size: 12px;
                color: $gray;
            }
        }
    }
</style>
<style lang="scss">
    .base-attr{
        .el-collapse-item__content{
            padding-bottom: 0;
        }
        .attr-item-edit-wrapper {
            .el-input-number.is-controls-right .el-input__inner {
                padding-left: 2px;
                padding-right: 32px;
                width: 90px;
            }

            .el-input-number--mini {
                width: 90px;
            }

            .el-slider__runway.show-input {
                margin-right: 108px;
            }
        }
    }

</style>
