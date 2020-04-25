var state = {
  version: 1,
  vagrant_binary_location: '',
  vagrant_tmp_folder: ''
}

const mutations = {
  SET_CONFIG_KEY (key, value) {
    state[key] = value
  },
  SET_DEFAULT_KEY (object) {
    state = object
  },
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  saveConfig (config) {
    return new Promise((resolve, reject) => {
      console.log(`aaaaaaaaaaaaaa ${config}`)
      this.commit('SET_DEFAULT_KEY', config)
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}
