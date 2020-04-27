var state = {
  version: 1,
  vagrant_binary_location: '',
  vagrant_tmp_folder: ''
}

const mutations = {
  SET_DEFAULT_KEY (object) {
    state = object
  },
  SET_DEFAULT_MACHINES (object) {
    state.machine = object
  }
}

const actions = {
  saveConfig (config) {
    return new Promise((resolve, reject) => {
      console.log(`aaaaaaaaaaaaaazzzzzzzzzzzzzz ${JSON.stringify(config)}`)
      this.commit('SET_DEFAULT_KEY', config)
      resolve()
    })
  },
  saveMachines (config) {
    return new Promise((resolve, reject) => {
      console.log(`zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz ${JSON.stringify(config)}`)
      this.commit('SET_DEFAULT_MACHINES', config)
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}
