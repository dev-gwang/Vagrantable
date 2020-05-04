  
<template>
  <div class="page-container" style="width:350px;background-color:#252526;height:100%;">
    <div style="height:200px;padding-top:10%;text-align:center;">
      <br><br>
      <md-button style="background-color:white;width:80%;margin-left:5%;vertical-align: middle;" v-on:click="start(1)">NEW</md-button>
    </div>
    <md-content class="md-scrollbar" style="height:65%;min-height:65%;overflow:auto;">
      <md-list  v-for="post, key in posts">
        <md-card class="md-primary" style="background-color:#607d8b;color:white;" :id="key">
          <md-card-header>
            <md-card-header-text style="display: flex;">
              <div v-if="post.state == 'running'"> 
               <b-spinner variant="success" label="Spinning"></b-spinner>
              </div>
              <div v-else> 
                <b-spinner style="visibility: hidden;" label="Loading..." variant="dark"></b-spinner>
              </div>
              <div v-on:click="inform(post.local_data_path, key)">
                <div>{{post.local_data_path}}</div>
                <div class="md-subhead">{{key}}</div>
              </div>
            </md-card-header-text>
          </md-card-header>
        </md-card>
        <!-- <menu-status v-bind:value="post" v-bind:vagrant_id="key" ></menu-status> -->
      </md-list>
      <div style="position:fixed;bottom:0;margin:2%;">
        <b-button size="sm" class="mb-2" v-on:click="boxLists()">
          <b-icon icon="gear-fill"></b-icon> BoxList
        </b-button>
        <b-button size="sm" class="mb-2" v-on:click="changeConfigure()">
          <b-icon icon="gear-fill"></b-icon> Config
        </b-button>
      </div>
    </md-content>
      
  </div>
</template>

<script>
import EventBus from '../../store/eventBus'
import MenuStatus from '../assets/MachineStatus'

export default {
  components: { MenuStatus },
  methods: {
    inform: function (name, id) {
      EventBus.$emit('SetSystemInformation', name, id)
    },
    boxLists: function () {
      EventBus.$emit('swapComponent', 'box-list', 1)
    },
    changeConfigure: function () {
      EventBus.$emit('swapComponent', 'environment-configure', 1)
    },
    GetBoxLists: function () {
      var exec = require('child_process').exec
      var arr = []

      exec(`${this.$store.state.config.menu.vagrant_binary_location.content.value} box list`, function (error, stdout, stderr) {
        arr = stdout.split('\n')
        for (var i = 0; i < arr.length - 1; i++) {
          arr[i] = { text: arr[i].split(' ')[0], value: arr[i].split(' ')[0] }
        }
        if (error !== null) {
          console.log(error)
        }
        EventBus.$emit('SetBoxList', arr)
      })
    },
    start: function (id) {
      this.GetBoxLists()
      EventBus.$emit('swapComponent', 'new-machine', id)
    },
    stop: function (id) {
      alert(id)
    }
  },
  data () {
    return {
      posts: [],
      isSystem: false
    }
  },
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