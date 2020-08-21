<template>
    <div
        class="page-wrapper-menu-operation menu-item-on-edit-panel"
        :class="{ active: activeElementUUID }"
    >
        <el-tooltip
            v-for="(item, index) in menuOptions"
            :key="index"
            effect="dark"
            :content="item.title"
            placement="right"
            v-once
        >
            <div
                class="menu-item menu-item-on-edit-panel"
                @click="handleElementCommand(item.value)"
            >
                <i class="menu-item-on-edit-panel" :class="[item.icon]"></i>
            </div>
        </el-tooltip>
        <el-popover
            placement="right"
            width="160"
            trigger="hover"
            v-model="syncPageVisible"
        >
            <div class="sync-title">添加/替换到其他状态</div>
            <ul class="sync-list">
                <li class="sync-item" @click="handleSyncPage()">全部状态</li>
                <template v-for="item in pages">
                    <li
                        class="sync-item"
                        v-if="activePageUUID !== item.uuid"
                        @click="handleSyncPage(item.uuid)"
                        :key="item.uuid"
                    >
                        状态{{ item.name }}
                    </li>
                </template>
            </ul>
            <div slot="reference" class="menu-item menu-item-on-edit-panel">
                <i class="menu-item-on-edit-panel iconfont iconredo1"></i>
            </div>
        </el-popover>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "ToolTips",
    data() {
        return {
            menuOptions: [
                {
                    title: "复制",
                    icon: "iconfont iconfuzhi",
                    value: "copy"
                },
                {
                    title: "删除",
                    icon: "iconfont iconshanchu",
                    value: "delete"
                },
                {
                    title: "字体放大",
                    icon: "iconfont iconzitifangda",
                    value: "fontA+"
                },
                {
                    title: "字体缩小",
                    icon: "iconfont iconzitisuoxiao",
                    value: "fontA-"
                },
                {
                    title: "字体加粗",
                    icon: "iconfont iconzitijiacu",
                    value: "fontB"
                },
                {
                    title: "图层上移",
                    icon: "iconfont iconziyuan1",
                    value: "layerUp"
                },
                {
                    title: "图层下移",
                    icon: "iconfont iconxiayiyiceng",
                    value: "layerDown"
                },
                {
                    title: "图层置顶",
                    icon: "iconfont iconcontrol-top",
                    value: "layerTop"
                },
                {
                    title: "图层置底",
                    icon: "iconfont iconcontrol-bottom",
                    value: "layerBottom"
                }
            ],
            syncPageVisible: false
        };
    },
    computed: {
        ...mapState({
            pages: state => state.editor.projectData.pages,
            projectData: state => state.editor.projectData,
            activePageUUID: state => state.editor.activePageUUID,
            activeElementUUID: state => state.editor.activeElementUUID
        })
    },
    methods: {
        /**
         * 对元素进行操作命令
         */
        handleElementCommand(command) {
            this.$store.dispatch("elementCommand", command);
        },
        // 同步状态数据
        handleSyncPage(targetPageUuid) {
            this.syncPageVisible = false;
            this.$store.dispatch("asyncPage", targetPageUuid);
        }
    }
};
</script>

<style lang="scss" scoped>
.page-wrapper-menu-operation {
    position: absolute;
    right: 100px;
    top: 5%;
    width: 0;
    background: white;
    color: #333;
    text-align: center;
    z-index: 1002;
    border-radius: 4px;
    display: none;
    transition: all 0.28s;
    opacity: 0;
    transform-origin: center top;

    .menu-item {
        padding: 10px;
        cursor: pointer;

        &.i {
            font-size: 24px;
            line-height: 30px;
        }

        &:hover {
            background: rgba(37, 165, 137, 0.09);
            color: $primary;

            &.i {
                font-weight: bold;
                font-size: 26px;
            }
        }
    }

    &.active {
        display: block;
        width: 60px;
        opacity: 1;
    }
}

.sync-title {
    font-size: 12px;
    text-align: center;
    background-color: #edf7f4;
    margin-bottom: 5px;
    line-height: 2;
}

.sync-item {
    cursor: pointer;
    font-size: 12px;
    line-height: 26px;
    margin-bottom: 1px;
    padding: 0 10px;

    &:hover {
        background-color: #f2f2f2;

        .status-icon {
            display: inline-block;
        }
    }

    &.active {
        background-color: #f2f2f2;
    }
}
</style>
