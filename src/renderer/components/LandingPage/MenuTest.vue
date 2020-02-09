  
<template>
  <div  class="page-container" style="width:350px;">
    <div class="title">Vagrant Machine List</div>
      <md-list v-for="post, key in posts">
        <menu-status v-bind:value="post" v-bind:vagrant_id="key"></menu-status>
      </md-list>
  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'

function replaceAll (str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr)
}

export default {
  name: 'app',
  components: { MenuStatus },
  data () {
    return {
      posts: []
    }
  },
  created () {
    const exec = require('child_process').exec
    exec('cat d:/.vagrant.d/data/machine-index/index', (stdout, stderr) => {
      var jsonParse = stderr.split('\n').join('<br />')
      jsonParse = replaceAll(jsonParse, 'running', 'background-color:green;color:white;')
      jsonParse = replaceAll(jsonParse, 'poweroff', 'background-color:white;color:black;')
      this.posts = JSON.parse(jsonParse)['machines']
      console.log(Object.keys(this.posts))
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