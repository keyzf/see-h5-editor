<template>
    <div class="base-attr">
        <p class="page-title fontBold">基础属性</p>
        <div class="attr-item-edit-wrapper marginB15">
            <p class="attr-item-title">组件ID</p>
            <div class="sizeAndPosition-wrapper">
                <el-input
                    type="text"
                    size="mini"
                    disabled=""
                    v-model="activeElement.uuid"
                >
                </el-input>
            </div>
        </div>
        <div class="attr-item-edit-wrapper">
            <p class="attr-item-title">显示组件</p>
            <div class="sizeAndPosition-wrapper">
                <el-radio v-model="activeElement.visible" label="return true"
                >是
                </el-radio
                >
                <el-radio v-model="activeElement.visible" label="return false"
                >否
                </el-radio
                >
            </div>
        </div>
        <div class="attr-item-edit-wrapper marginB15">
            <p class="attr-item-title">条件</p>
            <div class="sizeAndPosition-wrapper">
                <!--<el-input
                    type="textarea"
                    :rows="2"
                    size="mini"
                    v-model="activeElement.visible"
                >
                </el-input>-->
                <code-dialog v-model="activeElement.visible"/>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import CodeDialog from '@editor/components/code-dialog'

export default {
    components: {
        CodeDialog
    },
    data () {
        return {}
    },
    computed: {
        ...mapState({
            projectData: state => state.editor.projectData,
            activePageUUID: state => state.editor.activePageUUID,
            activeElementUUID: state => state.editor.activeElementUUID,
            activeAttrEditCollapse: state => state.editor.activeAttrEditCollapse
        }),
        ...mapGetters(['currentPageIndex', 'activeElement', 'activePage'])
    },
    watch: {},
    created () {
    },
    mounted () {
    },
    methods: {}
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

        &:hover,
        &.active {
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

