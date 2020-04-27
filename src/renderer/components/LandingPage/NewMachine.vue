  
<template>
  <div class="page-container" style="width:100%;padding-left:1%;">
    <h1>
        NEW
    </h1>
    <hr>
    <meta charset="UTF-8"/>
    <span>
      <v-card>
        <div class="title">Basic</div>
        <div>
          Vagrant Location
          <b-form-input style="border-color: black;" v-model="location" placeholder="Enter Vagrant Location"></b-form-input>
        </div>
        <div>
          Vagrant Box Lists <b-spinner id="loading" label="Spinning"></b-spinner><strong>{{ boxname }}</strong>
          <b-form-select style="border-color: black;" v-model="boxname" :options="countries"></b-form-select>
        </div>
        <div style="display: flex;">
          <div style="width:24%;margin-right:1%;">
            CPUS
            <b-form-input style="border-color: black;" v-model="cpus" placeholder="Enter CPUs"></b-form-input>
          </div>
          <div style="width:24%;margin-right:1%;">
            Memory (MB)
            <b-form-input style="border-color: black;" v-model="memory" placeholder="Enter Memory"></b-form-input>
          </div>
          <div style="width:24%;margin-right:1%;">
            GUI
            <b-form-select style="border-color: black;" v-model="gui" :options="guis"></b-form-select>
          </div>
          <div style="width:25%;">
            VM Name
            <b-form-input style="border-color: black;" v-model="vmname" placeholder="Enter VM Name"></b-form-input>
          </div>
        </div>
        <div class="title">Network</div>
        <div>
          Network Type
          <b-form-select style="border-color: black;" v-model="network" :options="network_type">
            {{network}}
          </b-form-select>
          Network IP
          <b-form-input style="border-color: black;" v-model="network_ip" placeholder="Enter IP"></b-form-input>
          Network Bridge
          <b-form-input style="border-color: black;" v-model="network_bridge" placeholder="Enter Network Bridge"></b-form-input>
        </div>
        <div class="title">Shell Code (Bash)</div>
          <b-form-textarea md-counter="1000" v-model="BashCode"  rows="20"
  max-rows="6"></b-form-textarea>
      </v-card>
    <md-button class="md-raised" v-on:click="Save()">Save And Start</md-button>
    </span>
  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'
import EventBus from '../../store/eventBus'

var spawn = require('child_process').spawn
var exec = require('child_process').exec

export default {
  components: { MenuStatus },
  methods: {
    Save: function () {
      var self = this
      self.VagrantFileGenerator()
      EventBus.$emit('addToast', `${this.location} Vagrant 시작`)
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
      config.vm.provider "virtualbox" do |vb|
        vb.memory = ${this.memory}
        vb.cpus = ${this.cpus}
        vb.gui = ${this.gui}
        vb.name = "${this.vmname}"
      end
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
      guis: ['true', 'false'],
      gui: '',
      BashCode: '',
      network: '',
      network_type: [
        {
          text: 'public_network', value: 'public_network'
        },
        {
          text: 'private_network', value: 'private_network'
        }
      ],
      countries: [],
      Vagrantfile: '',
      aaa: 'bbbb',
      location: '',
      boxname: '',
      memory: 1024,
      cpus: 1
    }
  },
  created () {
    var self = this
    EventBus.$on('SetBoxList', (payload) => {
      this.countries = payload
    })

    exec('vagrant box list', function (error, stdout, stderr) {
      var result = []
      var arr = stdout.split('\n')
      for (var i = 0; i < arr.length - 1; i++) {
        result[i] = { text: arr[i].split(' ')[0], value: arr[i].split(' ')[0] }
      }
      if (error !== null) {
        console.log(error)
      }
      self.countries = result
      document.getElementById('loading').style.visibility = 'hidden'
    })
  }
}
</script>