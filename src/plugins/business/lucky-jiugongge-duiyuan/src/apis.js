import request from '@/utils/request'
import root from '@/config/apiRoots'

class Apis {
    /**
     * 获取奖品列表
     * @param {uid:123,activity_id:2}
     */
    GET_PRIZE_LIST (params) {
        return request({
            method: 'get',
            url: '/activity/activity/prize-list',
            params
        })
    }

    // 抽奖接口
    POST_DRAW_PRIZE (data, params) {
        return request({
            method: 'post',
            url: '/activity/prize/draw-prize',
            params,
            data
        })
    }

    // 我的奖品接口
    GET_ME_PRIZE (params) {
        return request({
            method: 'get',
            url: '/activity/prize/me-prize',
            params: params
        })
    }

    // 获取抽奖次数
    GET_DRAW_PRIZE_NUM (params) {
        return request({
            method: 'get',
            url: '/activity/prize/get-draw-prize-num',
            params
        })
    }

    // 获取 UID 通过sid
    GET_UID_BY_SID (data) {
        return request({
            baseURL: root.duiyuanapi,
            method: 'get',
            url: '/api/user/profile/info',
            data
        })
    }
}

export default new Apis()
