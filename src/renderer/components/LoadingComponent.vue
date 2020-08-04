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
const log = require('electron-log')

export default {
  data () {
    return {
      data2: ''
    }
  },
  methods: {
    async checkConfig () {
      process.env.PATH = process.env.PATH + ':/usr/local/bin'
      if (!Config.isConfigFileExists()) {
        log.info('File not found')
        Config.writeConfigFile(this.$store.state.config)
      } else {
        Config.readConfigFile()
        console.log(`${JSON.stringify(this.$store.state.config)}`)
        await Config.versionCheck(this.$store.state.config)
      }

      var config = await Config.getData()
      await this.$store.dispatch('saveConfig', config)
    },
    async getDefaultMachine () {
      var vagrantHome = (!process.env.VAGRANT_HOME) ? '~/.vagrant.d' : process.env.VAGRANT_HOME
      const exec = require('child_process').exec
      require('child_process').execSync(`vagrant global-status --prune`)
      let myFirstPromise = new Promise((resolve, reject) => {
        exec('cat ' + vagrantHome + '/data/machine-index/index', (stdout, stderr) => {
          var jsonParse = stderr.split('\n').join('<br />')
          this.posts = JSON.parse(jsonParse)['machines']
          EventBus.$emit('setVM', this.posts)
          resolve()
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
    EventBus.$emit('completeLoading')
  }
}
</script>

<style>
  #progress {
    text-align: center;
  }
</style>