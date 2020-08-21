import request from '@/utils/request'

class Apis {
    /**
     * 获取活动排行榜数据
     * @param {uid:123,activity_id:2}
     */
    GET_RANK_DATA (params, url) {
        return request({
            method: 'get',
            url: url || '/activity/rank/rank-data',
            params
        })
    }
}

export default new Apis()
