<template>
    <div class="toggle-page">
        <li
            v-for="(item) in pages"
            class="status-item"
            :class="{active: activePageUUID === item.uuid}"
            :key="item.uuid"
            @click="changeActivePage(item)"
        >
            {{item.name||'默认状态'}}
            <el-button
                @click.stop="editPage(item)"
                class="status-icon edit" type="text"
                icon="el-icon-edit-outline"/>
            <el-button
                v-if="pages.length > 1"
                @click.stop="deletePage(item)"
                class="status-icon" type="text"
                icon="el-icon-document-delete"/>
            <el-button
                @click.stop="copyPage(item)"
                class="status-icon copy" type="text"
                icon="el-icon-document-copy"/>
        </li>
        <el-button @click="addPage" class="status-add" size="small" type="primary" icon="el-icon-plus">新增状态</el-button>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'toggle-status',
    data () {
        return {}
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
         * 切换选中页面
         * @param item
         */
        changeActivePage (item) {
            this.$store.dispatch('setActivePageUUID', item.uuid)
        },
        copyPage (item) {
            this.$store.dispatch('copyPage', item.uuid)
        },
        editPage (item) {
            this.$prompt('请输入状态名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '请输入状态名称',
                closeOnClickModal: false,
                inputValue: item.name
            }).then(({ value }) => {
                this.$store.dispatch('editPage', { uuid: item.uuid, pageName: value })
            }).catch(() => {

            })
        },
        addPage () {
            this.$prompt('请输入状态名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                closeOnClickModal: false,
                inputErrorMessage: '请输入状态名称'
            }).then(({ value }) => {
                this.$store.dispatch('addPage', value)
            }).catch(() => {

            })
        },
        deletePage (item) {
            this.$confirm(`您确定要删除 状态${item.name} 吗?`, '删除状态', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('deletePage', item.uuid)
            }).catch(() => {
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .toggle-page {
        font-size: 12px;

        .status-item {
            padding: 0 80px 0 12px;
            line-height: 30px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 1px;

            &:hover {
                background-color: #F2F2F2;

                .status-icon {
                    display: inline-block;
                }
            }

            &.active {
                background-color: #F2F2F2;
            }

        }

        .status-icon {
            position: absolute;
            padding: 0;
            top: 6px;
            right: 2px;
            font-size: 18px;
            display: none;

            &.copy {
                right: 26px;
            }

            &.edit {
                right: 48px;
            }
        }

        .status-add {
            width: 100%;
            border-radius: 0;
            margin-top: 10px;
        }
    }
</style>
