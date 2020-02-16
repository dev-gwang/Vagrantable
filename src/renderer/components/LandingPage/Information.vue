  
<template>
  <div class="page-container">
    <meta charset="UTF-8" />
    <md-field md-inline>
      <md-input v-model="location" id="location"></md-input>
    </md-field>
    <md-field md-inline>
      <label>Vagrant Box Lists</label>
      <md-input v-model="boxname" id="boxname"></md-input>
    </md-field>
    <md-button class="md-raised" v-on:click="VagrantFileGenerator()">Vagrantfile 생성</md-button>
    <md-field>
      <label>Textarea</label>
      <md-textarea md-counter="80" v-model="Vagrantfile">{{Vagrantfile}}</md-textarea>
    </md-field>
    <md-button class="md-raised" v-on:click="Save()">저장</md-button>
  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'
import EventBus from '../../store/eventBus'
// var exec = require('child_process').exec
var spawn = require('child_process').spawn

function replaceAll (str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr)
}

export default {
  components: { MenuStatus },
  methods: {
    Save: function () {
      const fs = require('fs')
      try {
        fs.statSync(this.location)
        console.log('file or directory exists')
      } catch (err) {
        if (err.code === 'ENOENT') {
          fs.mkdir(this.location)
          console.log('file or directory does not exist')
        }
        fs.writeFile(this.location + '/Vagrantfile', this.Vagrantfile, 'utf8', function (error) {
          console.log(error)
        })
      }
      process.chdir(this.location)
      var child = spawn('vagrant', ['up'])

      child.stdout.on('data', (data) => {
        EventBus.$emit('refreshVM')
        EventBus.$emit('addLogger', data)
      })
      child.stderr.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })
    }
  },
  data () {
    return {
      posts: [],
      Vagrantfile: '',
      aaa: 'bbbb',
      location: ''
    }
  },
  created () {
    const exec = require('child_process').exec
    exec('cat ' + process.env.VAGRANT_HOME + '/data/machine-index/index', (stdout, stderr) => {
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