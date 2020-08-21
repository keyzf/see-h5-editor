<template>
    <el-scrollbar class="components-attr-edit">
        <h4 class="row-title">当前页样式</h4>
        <el-row  class="form-row" type="flex" align="middle">
            <el-col class="label" :span="6">背景颜色：</el-col>
            <el-col :span="18">
                <el-color-picker
                    size="mini"
                    :show-alpha="true"
                    v-model="activePage.commonStyle.backgroundColor"
                ></el-color-picker>
            </el-col>
        </el-row>
        <el-row  class="form-row" type="flex" align="middle">
            <el-col class="label" :span="6">
                背景图片：
            </el-col>
            <el-col :span="18">
                <imageSelect
                    @change="handleBackgroundImageChange"
                    :url.sync="activePage.commonStyle.backgroundImage"
                />
                <div class="attr-tips">为保证展示效果，建议图片尺寸宽为750px</div>
            </el-col>
        </el-row>

        <el-row  class="form-row" type="flex" align="middle">
            <el-col class="label" :span="6">背景是否重复：</el-col>
            <el-col :span="18">
                <el-radio-group v-model="activePage.commonStyle.backgroundRepeat">
                    <el-radio label="no-repeat">否</el-radio>
                    <el-radio label="repeat">是</el-radio>
                </el-radio-group>
            </el-col>
        </el-row>

        <h4 class="row-title">页面尺寸</h4>
        <el-row  class="form-row" type="flex" align="middle">
            <el-col class="label" :span="6">宽：</el-col>
            <el-col :span="18">
                <el-input-number
                    size="mini"
                    v-model="activePage.commonStyle.width"
                    controls-position="right"
                    :min="0"
                    disabled=""
                />
            </el-col>
        </el-row>
        <el-row class="form-row" type="flex" align="middle">
            <el-col class="label" :span="8">高：</el-col>
            <el-col >
                <el-input-number
                    size="mini"
                    v-model="activePage.commonStyle.height"
                    controls-position="right"
                    :min="0"
                />
            </el-col>
        </el-row>
        <h4 class="row-title">图片长按保存（禁用可能会影响长按扫码）</h4>
        <el-row  class="form-row" type="flex" align="middle">
            <el-col class="label" :span="6">是否禁用：</el-col>
            <el-col :span="18">
                <el-checkbox v-model="projectData.disableImageLongTouch">禁用</el-checkbox>
            </el-col>
        </el-row>
    </el-scrollbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import sizeOf from '@/utils/image-size'
import { BASE_WIDTH } from '@/constant'
import imageSelect from '@editor/components/image-select'

export default {
    components: {
        imageSelect
    },
    computed: {
        ...mapState({
            projectData: (state) => state.editor.projectData,
            activePageUUID: (state) => state.editor.activePageUUID,
            activeElementUUID: (state) => state.editor.activeElementUUID
        }),
        ...mapGetters([
            'currentPageIndex',
            'activeElement',
            'activePage'
        ])
    },
    methods: {
        async handleBackgroundImageChange (url) {
            try {
                const { height, width } = await sizeOf(url)
                this.projectData.height = Math.floor(height / width * BASE_WIDTH)
            } catch (error) {
                console.log('图片检测错误')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .row-title{
        padding: 5px 0;
        font-size: 16px;
    }
    .form-row{
        margin: 10px 0;
        .label{
            text-align: right;
            font-size: 12px;
        }
    }
    .components-attr-edit {
        height: 100%;
        padding: 0 15px;
    }

    .attr-item-edit-wrapper {
        padding-left: 18px;
        display: flex;
        width: 100%;
        text-align: center;
        padding-bottom: 10px;

        .attr-item-title {
            text-align: left;
            min-width: 60px;
            font-size: 12px;
        }

    }

    .attr-tips {
        font-size: 12px;
        margin-top: 10px;
        color: $primary;
    }
</style>
