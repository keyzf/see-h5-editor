/*
* 编辑器和H5的全部接口
* plugin 里面的即可随plugin维护
* */

import request from '@/utils/request'

class Apis {
    /**
     * 获取活动详情
     * @param {activity_id:1}
     */
    GET_ACTIVITY_DETAIL (params) {
        return request({
            method: 'get',
            url: 'page/queryDetail',
            params
        })
    }

    /**
     * 更新活动组件&&渲染 json
     * @param {component:组件数据,page_data:页面渲染数据,activity_id:1}
     */
    UPDATE_ACTIVITY (data) {
        return request({
            method: 'post',
            url: 'page/upDateDetail',
            data
        })
    }

    // 图片上传
    UPLOAD_IMAGE (file) {
        const formData = new FormData()
        formData.append('image', file)
        return request({
            method: 'post',
            url: 'common/upload/image',
            data: formData
        })
    }

    // 发布
    PUBLISH_ACTIVITY (params) {
        return request({
            method: 'get',
            url: 'page/publish',
            params
        })
    }
}

export default new Apis()
