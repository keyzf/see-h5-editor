<template>
    <div class="page-list clearfix">
        <el-card v-for="(item) in list" :body-style="{ padding: '0px' }" :key="item.id" shadow="hover">
            <img :src="item.coverImg" class="cover-image">
            <div class="page-info">
                <span>{{item.title}}</span>
                <div class="action-btns">
                    <el-button type="primary" size="mini" class="button" @click="handleEditPage(item.id)">编辑页面</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="add-card" :body-style="{ padding: '0px' }" shadow="hover" @click.native="handleAddPage">
            <div class="cover-image add-page">
                <i class="el-icon-plus"></i>
            </div>
            <div class="page-info">
                <div class="add">新建空白页面</div>
            </div>
        </el-card>
    </div>
</template>

<script>
import PageList from '../../../../../mock/pageList.json'

export default {
    name: 'page-list',
    components: {},
    data () {
        return {
            list: this.$utils.getLocalData('page_list') || PageList
        }
    },
    mounted () {

    },
    methods: {
        handleEditPage (id) {
            this.$router.push({
                path: '/editor',
                query: { id }
            })
        },
        handleAddPage () {
            this.$prompt('请输入页面名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '请输入页面名称',
                closeOnClickModal: false
            }).then(({ value }) => {
                const lastItem = this.list[this.list.length - 1]
                const newId = lastItem ? lastItem.id + 1 : 1
                this.list.push({
                    id: newId,
                    title: value,
                    coverImg: '//shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                })
                this.$utils.saveLocalData('page_list', this.list)
                this.$router.push({
                    path: '/editor',
                    query: { id: newId }
                })
            }).catch(() => {

            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .page-list {
        overflow-y: auto;

        .el-card {
            margin: 20px;
            float: left;
        }

        .add-card {
            cursor: pointer;
        }

        .cover-image {
            width: 200px;
            height: 300px;
            object-fit: cover;
        }

        .add-page {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .el-icon-plus {
            font-size: 70px;
            color: #bbb;
        }

        .action-btns {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }

        .page-info {
            padding: 10px;
            height: 84px;

            .add {
                text-align: center;
            }
        }
    }
</style>
