const state = {
  user: null
}

const getters = {
  user: state => {
    return state.user
  },
  check: state => state.user !== null,
  username: state => state.user ? state.user.name : ''
}

const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

const actions = {
  async register(context, data) {
    console.log('会員登録')
    const response = await axios.post('/api/register', data)
    context.commit('setUser', response.data)
  },
  async login(context, data) {
    console.log('ログイン')
    const response = await axios.post('/api/login', data)
    context.commit('setUser', response.data)
  },
  async logout(context, data) {
    console.log('ログアウト')
    const response = await axios.post('/api/logout')
    context.commit('setUser', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
