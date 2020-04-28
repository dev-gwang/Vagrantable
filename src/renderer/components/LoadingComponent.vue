<template>
  <div style='text-align: center;margin-top:20%;'>
    <v-progress-circular
      indeterminate
      color='red'
    ></v-progress-circular>

    Loading... {{data2}}

  </div>
</template>

<script>
import Config from '../../scripts/config'
import EventBus from '../store/eventBus'

export default {
  data () {
    return {
      data2: ''
    }
  },
  methods: {
    async checkConfig () {
      if (!Config.isConfigFileExists()) {
        Config.writeConfigFile(this.$store.state.config)
      } else {
        Config.readConfigFile()
        console.log(`${JSON.stringify(this.$store.state.config)}`)
        await Config.versionCheck(this.$store.state.config)
      }

      var config = await Config.getData()
      await this.$store.dispatch('saveConfig', config)

      EventBus.$emit('completeLoading')
    },
    async getDefaultMachine () {
      var vagrantHome = (!process.env.VAGRANT_HOME) ? '~/.vagrant.d' : process.env.VAGRANT_HOME

      const exec = require('child_process').exec

      let myFirstPromise = new Promise((resolve, reject) => {
        exec(`${this.$store.state.config.menu.vagrant_binary_location.content.value} global-status --prune`, (stdout, stderr) => {
        })
      })
      myFirstPromise.then(successMessage => {
        console.log(successMessage)
      })

      myFirstPromise = new Promise((resolve, reject) => {
        exec('cat ' + vagrantHome + '/data/machine-index/index', (stdout, stderr) => {
          var jsonParse = stderr.split('\n').join('<br />')
          this.posts = JSON.parse(jsonParse)['machines']
          EventBus.$emit('setVM', this.posts)
          resolve()
          // console.log(this.$store)
          // this.$store.dispatch('saveMachines', this.$store)
        })
      })
      myFirstPromise.then(successMessage => {
        console.log(successMessage)
      })
    }
  },
  async created () {
    this.checkConfig()
    await this.getDefaultMachine()
  }
}
</script>

<style>
  #progress {
    text-align: center;
  }
</style>