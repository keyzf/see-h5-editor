import request from '@/utils/request'

class Apis {
  /**
   * 用户的卡片信息
   * @param {uid:123,activity_id:2}
   */
  GET_PRIZE_LIST (params) {
    return request({
      method: 'get',
      url: '/activity/activity/prize-list',
      params
    })
  }
  // 兑换奖品
  POST_PRIZE_RECEIVE (params,data) {
    return request({
      method: 'post',
      url: '/activity/activity/prize-receive',
      params,
      data
    })
  }
  /**
   * 用户的卡片信息
   * @param {uid:123,activity_id:2}
   */
  GET_USER_CARD (params) {
    return request({
      method: 'get',
      url: '/activity/activity/user-card',
      params
    })
  }
}

export default new Apis()
