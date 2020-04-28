var state = {
  version: 2,
  menu: [
    {
      'name': 'vagrant_binary_location',
      'content': {
        comments: 'Vagrant Execute File Location',
        value: ''
      }
    }
  ]
}

const mutations = {
  SET_DEFAULT_KEY (key, object) {
    state.menu = object.menu
    console.log(`SET_DEFAULT_KEY : ${JSON.stringify(object)} ${JSON.stringify(state)}`)
  },
  SET_DEFAULT_MACHINES (key, object) {
    state.machine = object
  }
}

const actions = {
  saveConfig (state, config2) {
    return new Promise((resolve, reject) => {
      console.log(`aaaaaaaaaaaaaazzzzzzzzzzzzzz ${JSON.stringify(state)} ${JSON.stringify(config2)}`)
      this.commit('SET_DEFAULT_KEY', config2)
      resolve()
    })
  },
  saveMachines (config) {
    return new Promise((resolve, reject) => {
      console.log(`zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz ${JSON.stringify(config)}`)
      this.$store.commit('SET_DEFAULT_MACHINES', config)
      resolve()
    })
  },
  getConfig () {
    return this.state
  }
}

const getters = {
  doneTodos () {
    return state
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
