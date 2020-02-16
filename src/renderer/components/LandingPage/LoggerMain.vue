  
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
            <b-card style="height:30%;width:100%;overflow:auto"  id="logger">
              <pre style="height:30%;width:100%;overflow:auto" id="logger" >{{Logger}}
              
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              
            </pre>
                </b-card>

  
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