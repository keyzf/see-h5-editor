/** * 控制按钮 */
<template>
    <div class="components-contrl-bar">
        <div class="button-item scale-wrappper">
            <span class="scale-btn" @click="updateScale('reduce')">
                <i class="el-icon-zoom-out"></i>
            </span>
            <span class="scale-input"
                >{{ parseFloat(scaleValue * 100).toFixed(0) }}%</span
            >
            <span class="scale-btn" @click="updateScale('plus')">
                <i class="el-icon-zoom-in"></i>
            </span>
        </div>
        <div
            class="button-item"
            :class="{ disabled: !canUndo }"
            @click="editorUndo"
        >
            <i class="iconfont iconundo1"></i>
            <p>撤销</p>
        </div>
        <div
            class="button-item"
            :class="{ disabled: !canRedo }"
            @click="editorRedo"
        >
            <i class="iconfont iconredo1"></i>
            <p>重做</p>
        </div>
        <!-- <UploadPsd @upload-success="uploadSuccessPsd">
            <div class="button-item">
                <i class="iconfont iconps"></i>
                <p>导入psd</p>
            </div>
        </UploadPsd> -->
        <div class="button-item" @click="exportData">
            <i class="el-icon-download"></i>
            <p>导出</p>
        </div>
        <div class="button-item">
            <i class="el-icon-upload2"></i>
            <p>导入</p>
            <input type="file" id="files" @change="importData" />
        </div>
        <div class="button-item" @click="showPreview">
            <i class="iconfont iconyulan"></i>
            <p>预览</p>
        </div>
        <div class="button-item" @click="save">
            <i class="iconfont iconbaocun"></i>
            <p>保存</p>
        </div>
        <div class="button-item" @click="publishFn">
            <i class="iconfont iconfabu"></i>
            <p>发布</p>
        </div>
        <div class="button-item" @click="showDataSelect = true">
            <i class="el-icon-coin"></i>
            <p>数据选择</p>
        </div>
        <el-dialog
            title="数据选择器"
            :visible.sync="showDataSelect"
            append-to-body
            width="600px"
        >
            <data-picker />
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DataPicker from './data-picker/data-picker'
// import UploadPsd from '@editor/components/upload-psd';
export default {
    components: {
        // UploadPsd,
        DataPicker
    },
    props: {
        // 是否loading
        loading: {
            type: Boolean,
            default: false
        },
        scale: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            // 画板缩放
            scaleValue: 1,
            showDataSelect: false,
            defaultProps: {
                children: "children",
                label: "label"
            }
        };
    },
    computed: {
        ...mapGetters(["canUndo", "canRedo"])
    },
    created() {
        this.scaleValue = this.scale;
    },
    methods: {
        ...mapActions(["editorUndo", "editorRedo"]),
        /**
         * 更新画板大小
         */
        updateScale(type, value) {
            if (type === "plus") {
                this.scaleValue =
                    this.scaleValue + (value || 0.1) > 2
                        ? 2
                        : this.scaleValue + (value || 0.1);
            } else if (type === "reduce") {
                this.scaleValue =
                    this.scaleValue - (value || 0.1) > 0.5
                        ? this.scaleValue - (value || 0.1)
                        : 0.5;
            } else if (type === "reset") {
                this.scaleValue = value || 1;
            }

            this.$emit("update:scale", this.scaleValue);
        },
        /**
         * 获取psd数据
         */
        uploadSuccessPsd(dataList) {
            this.$emit("import-psd-data", dataList);
        },
        /**
         * 点击保存按钮
         */
        save() {
            this.$emit("save");
        },
        exportData() {
            this.$emit("export");
        },

        importData(e) {
            const file = e.target.files[0];
            this.$emit("import", file);
        },
        /**
         * 显示预览
         */
        showPreview() {
            this.$emit("showPreview");
        },
        /**
         * 发布
         */
        publishFn() {
            this.$emit("publish");
        },
        cancelFn() {
            this.$emit("cancel");
        }
    }
};
</script>

<style lang="scss" scoped>
.components-contrl-bar {
    display: inline-block;
    z-index: 3;
    padding: 2px 12px;
    height: 30px;
    .button-item {
        display: inline-block;
        width: 60px;
        cursor: pointer;
        text-align: center;
        vertical-align: bottom;
        font-size: 14px;
        transition: color 0.28s, transform 0.28s;
        user-select: none;
        position: relative;
        input {
            position: absolute;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
            opacity: 0;
            // visibility: hidden;
        }
        &.scale-wrappper {
            width: 110px;
            margin-right: 10px;
            &:hover {
                color: inherit;
                transform: none;
            }
            & > .scale-btn {
                display: inline-block;
                vertical-align: middle;
                padding: 6px 2px;
                font-size: 20px;
                transition: all 0.28s;
                &:hover {
                    color: $primary;
                }
            }
        }
        &:hover {
            color: $primary;
            transform: scale(1.02);
            font-weight: bold;
        }
        &.disabled {
            cursor: not-allowed;
            color: $gray !important;
        }
        & > i {
            font-size: 18px;
            display: inline-block;
            transition: all 0.28s;
        }
        & > p {
            font-size: 14px;
        }
    }
}

.scale-input {
    display: inline-block;
    position: relative;
    padding: 7px 0;
    width: 46px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 17px;
    margin: 0 4px;
    &:hover {
        background: #dfdfdf;
    }
}
</style>
