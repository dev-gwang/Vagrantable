  
<template>
  <div class="page-container" style="width:350px;background-color:#1E88E5
;height:100%;">
    <div style="height:100px;">
      <vnt-header style="color:white;">
        <span slot="subheader">
          Vagrant Tools
        </span>
      </vnt-header>
      <md-button class="md-raised" v-on:click="start(1)">추가하기</md-button>
    </div>
    <div style="overflow:scroll;height:90%;min-height:80%;">
      <md-list  v-for="post, key in posts">
        <menu-status v-bind:value="post" v-bind:vagrant_id="key"></menu-status>
      </md-list>
    </div>
      
  </div>
</template>

<script>
import EventBus from '../../store/eventBus'
import MenuStatus from '../assets/MachineStatus'

function replaceAll (str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr)
}

export default {
  components: { MenuStatus },
  methods: {
    GetBoxLists: function () {
      var exec = require('child_process').exec
      var arr = []

      exec('vagrant box list', function (error, stdout, stderr) {
        arr = stdout.split('\n')
        for (var i = 0; i < arr.length; i++) {
          arr[i] = { label: arr[i].split(' ')[0], value: arr[i].split(' ')[0] }
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
      posts: []
    }
  },
  created () {
    EventBus.$on('removeVM', (payload) => {
      this.$forceUpdate()
      delete this.posts[payload]
    })

    EventBus.$on('refreshVM', () => {
      const exec = require('child_process').exec
      exec('cat d:/.vagrant.d/data/machine-index/index', (stdout, stderr) => {
        var jsonParse = stderr.split('\n').join('<br />')
        jsonParse = replaceAll(jsonParse, 'running', 'background-color:green;color:white;')
        jsonParse = replaceAll(jsonParse, 'poweroff', 'background-color:white;color:black;')
        this.posts = JSON.parse(jsonParse)['machines']
        console.log('TEST : ' + Object.keys(this.posts))
      })
    })

    const exec = require('child_process').exec
    exec('cat d:/.vagrant.d/data/machine-index/index', (stdout, stderr) => {
      var jsonParse = stderr.split('\n').join('<br />')
      jsonParse = replaceAll(jsonParse, 'running', 'background-color:green;color:white;')
      jsonParse = replaceAll(jsonParse, 'poweroff', 'background-color:white;color:black;')
      this.posts = JSON.parse(jsonParse)['machines']
      console.log('TEST : ' + Object.keys(this.posts))
    })
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