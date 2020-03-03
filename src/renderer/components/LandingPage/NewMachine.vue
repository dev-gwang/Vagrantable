  
<template>
  <div class="page-container" style="width:100%;padding-left:1%;background-color:white;">
    <vnt-header>
      <span slot="subheader">
        NEW
      </span>
    </vnt-header>
    <hr>
    <meta charset="UTF-8" />
    <span>
      <table style="width:100%;align-text:top;">
        <tr>
          <td style="width:60%;">
            <b-card style="padding:1%;">
              <vnt-header>
                <h5>
                  Basic
                </h5>
              </vnt-header>
              <div>
                Vagrant Location
                <b-form-input style="border-color: black;" v-model="location" placeholder="Enter Vagrant Location"></b-form-input>
              </div>
              <div>
                Vagrant Box Lists  <strong>{{ boxname }}</strong>
                <b-form-select style="border-color: black;" v-model="boxname" :options="countries" size="sm" class="mt-3"></b-form-select>
              </div>
              <div>
                CPUS
                <b-form-input style="border-color: black;" v-model="cpus" placeholder="Enter CPUs"></b-form-input>
              </div>
              <div>
                Memory (MB)
                <b-form-input style="border-color: black;" v-model="memory" placeholder="Enter Memory"></b-form-input>
              </div>
              <vnt-header>
                <h5>
                  Network
                </h5>
              </vnt-header>
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
                <b-card style="border : 1px solid gray;height:100%;">
                <label>Shell Code (Bash)</label>
                <b-form-textarea md-counter="1000" v-model="BashCode"  rows="20"
      max-rows="6"></b-form-textarea>
                </b-card>
            </b-card>
          </td>
          <td style="width:40%;height:100%;vertical-align:top;">
             
            <b-card style="padding:1%;height:100%;" rows="30"
      max-rows="6">
              <vnt-header>
                <h5>
                  Vagrantfile
                </h5>
              </vnt-header>
                   <label>Textarea</label>
      <b-form-textarea  style="height:100%;" md-counter="80" v-model="Vagrantfile" rows="17"
      max-rows="6">{{Vagrantfile}}</b-form-textarea>
            <md-button class="md-raised" v-on:click="VagrantFileGenerator()">Vagrantfile Generate</md-button>
                </b-card>

          </td>
        </tr>
      </table>
    
  
    <md-button class="md-raised" v-on:click="Save()">Save And Start</md-button>
    </span>
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
    EventBus.$on('SetBoxList', (payload) => {
      this.countries = payload
    })
  }
}
</script>