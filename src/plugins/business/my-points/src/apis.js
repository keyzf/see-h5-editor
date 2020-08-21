import request from '@/utils/request'

class Apis {
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
  /**
   * 用户的卡片信息
   * @param {uid:123,activity_id:2}
   */
  POST_CARD_RECEIVE (data) {
    return request({
      method: 'post',
      url: '/activity/activity/card-receive',
      data
    })
  }
}

export default new Apis()
