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
        await Config.versionCheck(this.$store.state.config)
      }
      this.$store.dispatch('saveConfig', Config.getData())
      EventBus.$emit('completeLoading')
    },
    getDefaultMachine () {
      var vagrantHome = (!process.env.VAGRANT_HOME) ? '~/.vagrant.d' : process.env.VAGRANT_HOME

      const exec = require('child_process').exec

      let myFirstPromise = new Promise((resolve, reject) => {
        exec('vagrant global-status --prune', (stdout, stderr) => {
        })
      })
      myFirstPromise.then(successMessage => {
        console.log(successMessage)
      })

      myFirstPromise = new Promise((resolve, reject) => {
        exec('cat ' + vagrantHome + '/data/machine-index/index', (stdout, stderr) => {
          console.log(`ssssssssssssssssssssss : ${stdout} ${stderr}`)
          var jsonParse = stderr.split('\n').join('<br />')
          this.posts = JSON.parse(jsonParse)['machines']
          EventBus.$emit('setVM', this.posts)
          // console.log(this.$store)
          // this.$store.dispatch('saveMachines', this.$store)
        })
      })
      myFirstPromise.then(successMessage => {
        console.log(successMessage)
      })
    }
  },
  created () {
    this.getDefaultMachine()
    this.checkConfig()
  }
}
</script>

<style>
  #progress {
    text-align: center;
  }
</style>