  
<template>
  <div class="page-container" style="width:350px;padding:1%;">
    <md-button class="md-raised">추가하기</md-button>
    <md-field md-inline>
      <label>Vagrant 가상머신 추가 경로</label>
      <md-input v-model="location" id="location"></md-input>
    </md-field>
    <md-field md-inline>
      <label>Vagrant 가상머신 Box 이름</label>
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
var exec = require('child_process').exec

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

        exec('cd ' + this.location + '; vagrant up ', function (error, stdout, stderr) {
          EventBus.$emit('addLogger', stdout)
          console.log('stdout: ' + stdout)
          console.log('stderr: ' + stderr)

          if (error !== null) {
            EventBus.$emit('addLogger', stderr)

            console.log('exec error: ' + error)
          }
        })
      }
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