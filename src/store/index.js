/**
 * 用来存储各个组件间的共享数据
 */
const state = {
  sharedData: {}
}

const actions = {
  setSharedData ({ commit }, data) {
    commit('setSharedData', data)
  }
}

const mutations = {
  setSharedData (state, { uuid, data }) {
    if (!state[uuid]) {
      // 先创建uuid对应的对象
      state.sharedData[uuid] = {}
    }

    state.sharedData[uuid] = { ...state[uuid], ...data }
  }
}

const getters = {
  sharedData (state) {
    return state.sharedData
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
