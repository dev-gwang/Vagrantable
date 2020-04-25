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
import Config from '../../../scripts/config'

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
    }
  },
  created () {
    this.checkConfig()
  }
}
</script>

<style>
  #progress {
    text-align: center;
  }
</style>