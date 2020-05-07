  
<template>
  <div class="page-container" style="width:10%;height:100%;">
  <v-card
    class="mx-auto"
    max-width="300"
    style="height:100%;"
    tile
  >
    <v-list flat>
      <v-subheader>SUB MENU</v-subheader>
      <b-list-group 
        v-for="(item, i) in items"
        :key="i"
        color="primary">
        <b-list-group-item @click="inform(item.text)" button>{{item.text}}</b-list-group-item>
      </b-list-group>
    </v-list>
  </v-card>
  </div>
</template>

<script>
import EventBus from '../../store/eventBus'
import MenuStatus from '../assets/MachineStatus'

export default {
  components: { MenuStatus },
  methods: {
    inform (component) {
      EventBus.$emit('SetSystemInformationMain', component)
    }
  },
  data: () => ({
    item: 1,
    items: [
      { text: 'Snapshot', icon: 'mdi-clock' },
      { text: 'Audience', icon: 'mdi-account' },
      { text: 'Conversions', icon: 'mdi-flag' }
    ]
  }),
  created () {
    var vagrantHome = (!process.env.VAGRANT_HOME) ? '~/.vagrant.d' : process.env.VAGRANT_HOME

    EventBus.$on('removeVM', (payload) => {
      this.$forceUpdate()
      delete this.posts[payload]
    })

    EventBus.$on('setVM', (payload) => {
      this.posts = payload
    })

    EventBus.$on('refreshVM', () => {
      const exec = require('child_process').exec
      exec('cat ' + vagrantHome + '/data/machine-index/index', (stdout, stderr) => {
        var jsonParse = stderr.split('\n').join('<br />')
        this.posts = JSON.parse(jsonParse)['machines']
      })
    })
    console.log(JSON.stringify(this.$store.machine))
    this.posts = this.$store.machine
    console.log(`test ${JSON.stringify(this.posts)}`)

    // const exec = require('child_process').exec

    // exec('vagrant global-status --prune', (stdout, stderr) => {
    //   exec('cat ' + vagrantHome + '/data/machine-index/index', (stdout, stderr) => {
    //     var jsonParse = stderr.split('\n').join('<br />')
    //     this.posts = JSON.parse(jsonParse)['machines']
    //   })
    // })
  }
}
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }
  .items { margin-top: 8px; }
  .item {
    display: flex;
    margin-bottom: 6px;
  }
  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }
  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>