  
<template>
  <div class="page-container" style="width:350px;padding-left:1%;">
    <meta charset="UTF-8" />
    <vnt-header>
      <span slot="subheader">
        추가하기
      </span>
    </vnt-header>
    <span>
      <vnt-input style="width:100%" v-model="location" label="가상머신 경로" placeholder="Type message here"></vnt-input>
      <div class="md-layout-item" style="background-color:white;">
        가상머신 Box
        <vnt-select v-model="boxname" :options="countries">
          {{boxname}}
        </vnt-select>
      </div>
    </span>
    네트워크 설정
    <li> 네트워크 종류
      <vnt-select v-model="network" :options="network_type">
        {{network}}
      </vnt-select>
      <vnt-input style="width:100%" v-model="network_ip" label="네트워크 IP" placeholder="Type message here"></vnt-input>
      <vnt-input style="width:100%" v-model="network_bridge" label="네트워크 Bridge" placeholder="Type message here"></vnt-input>
    </li>
    <md-button class="md-raised" v-on:click="VagrantFileGenerator()">Vagrantfile 생성</md-button>
    <md-field>
      <label>Shell Code (Bash)</label>
      <md-textarea md-counter="1000" v-model="BashCode"></md-textarea>
    </md-field>
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

var spawn = require('child_process').spawn

export default {
  components: { MenuStatus },
  methods: {
    Save: function () {
      const fs = require('fs')
      try {
        fs.statSync(this.location)
        console.log('file or directory exists')
        fs.unlink(this.location + '/Vagrantfile', (err) => {
          if (err) {
            console.error(err)
          }
        })
        fs.writeFile(this.location + '/Vagrantfile', this.Vagrantfile, 'utf8', function (error) {
          console.log(error)
        })
      } catch (err) {
        if (err.code === 'ENOENT') {
          fs.mkdir(this.location)
          console.log('file or directory does not exist')
        }
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
      config.vm.network "${this.network}", ip: "${this.network_ip}", bridge: "${this.network_bridge}"
      config.vm.provision "shell", inline: <<-SHELL
        ${this.BashCode}
      SHELL
    end`

      this.Vagrantfile = vagrantfile
    },
    SetBoxList: function (list) {
      this.countries = list
    }
  },
  data () {
    return {
      BashCode: '',
      network: '',
      network_type: [
        {
          label: 'public_network', value: 'public_network'
        },
        {
          label: 'private_network', value: 'private_network'
        }
      ],
      countries: [],
      Vagrantfile: '',
      aaa: 'bbbb',
      location: '',
      boxname: ''
    }
  },
  created () {
    EventBus.$on('SetBoxList', (payload) => {
      this.countries = payload
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