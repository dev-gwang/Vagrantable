  
<template>
  <div class="page-container" style="width:350px;padding:1%;">
    <meta charset="UTF-8" />
    <vnt-header>
      추가하기
    </vnt-header>
    <span>
      <vnt-input v-model="location" label="가상머신 경로" placeholder="Type message here"></vnt-input>
      <vnt-input v-model="boxname" label="Vagrant 가상머신 Box 이름" placeholder="Type message here"></vnt-input>
    </span>
    
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
  name: 'app',
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
    },
    VagrantFileGenerator: function () {
      // var fs = require('fs')
      var vagrantfile = `
    # -*- mode: ruby -*-
    # vi: set ft=ruby :

    Vagrant.configure("2") do |config|
      config.vm.box = "${this.boxname}"
    end'`

      this.Vagrantfile = vagrantfile
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
    exec('cat ~/.vagrant.d/data/machine-index/index', (stdout, stderr) => {
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