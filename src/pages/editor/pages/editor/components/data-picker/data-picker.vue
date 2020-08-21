<template>
    <el-tree
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
    >
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span style="color: #e36eec; flex: none">{{ node.label }}：</span
            >
            <span :style="{ color: data.color }" class="text"> {{ data.value }}</span>
            <span class="copy-btn">
                <el-button type="text" size="mini" @click.stop="copyPath(node)">
                    复制路径
                </el-button>
            </span>
        </span>
    </el-tree>
</template>

<script>
import groupBy from "lodash/groupBy";
import { copyText } from "@/utils/index";

export default {
    name: "DataPicker",
    data() {
        return {
            defaultProps: {
                children: "children",
                label: "label"
            }
        };
    },
    computed: {
        treeData() {
            return this.processState(this.sharedData || {});
        }
    },
    methods: {
        processState(state) {
            return Object.keys(state).map(key => {
                const treeItem = {};
                const value = state[key];
                const stateType = this.valueType(value);
                const color = stateType === value ? "#e33e3a" : "#bdc6cf"; // 展示的颜色
                treeItem.label = key;
                treeItem.value = stateType;
                treeItem.color = color;

                if (value !== stateType) {
                    treeItem.children = this.processState(value);
                }

                return treeItem;
            });
        },

        valueType(value) {
            if (Array.isArray(value)) {
                return `Array [${value.length}]`;
            } else if (value && typeof value === "object") {
                return "Object";
            } else {
                return value;
            }
        },

        findPath(node, pathArr) {
            if (node.data.label) {
                pathArr.unshift(node.data.label);
            }
            if (node.parent) {
                this.findPath(node.parent, pathArr);
            }
        },

        copyPath(node) {
            const path = [];
            this.findPath(node, path);
            copyText(path.join("."));
            this.$toast("复制成功");
        },

        handleNodeClick(data, node) {
            // console.log(data, node, el)
            const path = [];
            this.findPath(node, path);
            console.log(path);
        }
    }
};
</script>

<style lang="scss">
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    width: 9%;

    .text {
        // width: calc(100% - 60px);
        overflow: auto;
        flex: 1;
    }

    .label {
        color: #e36eec;
    }

    .value {
        // &.text {
        //     color: ;
        // }
    }

    .copy-btn {
        display: none;
        // position: absolute;
        // right: 0;
        // background-color: #fff;
        flex: none;
        // width: 60px;
        text-align: center;
        padding-left: 5px;
    }

    &:hover {
        .copy-btn {
            display: block;
        }
    }
}
</style>
