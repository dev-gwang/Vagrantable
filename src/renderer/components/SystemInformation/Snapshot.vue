  
<template>
  <div style="width:100%;padding-left:1%;">
    <meta charset="UTF-8"/>
    <span>
      <div>
        <div class="title">Snapshot List</div>
        <v-btn v-b-modal.modal-2 small color="primary" fab>+</v-btn>
          <b-button v-b-modal.modal-2>Capture Snapshot</b-button>
          <b-modal id="modal-2" title="BootstrapVue" @ok="handleOk">
            <p class="my-4">Capture Snapshot</p>
            <b-form-input v-model="snapshotName" placeholder="Enter your name"></b-form-input>
          </b-modal>
          <md-table>
            <md-table-row>
              <md-table-head>Snapshot Name</md-table-head>
            </md-table-row>
            <md-table-row v-for="post, key in snapshot_list" style="width:100%;">
              <md-table-cell>{{post}}</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
    </span>
  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'
import EventBus from '../../store/eventBus'
var childProcess = require('child_process')

var spawn = require('child_process').spawn
var exec = require('child_process').exec

export default {
  props: [ 'snapshot_list', 'vagrant_id' ],
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
      var child = spawn(`${this.$store.state.config.menu.vagrant_binary_location.content.value}`, ['up', '--provider', self.provider])

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
    },
    handleOk: function () {
      var self = this
      var dt = new Date()
      var dateString = dt.getYear() + 1900 + '-' + dt.getMonth() + '-' + dt.getDate()
      var name = `${this.snapshotName}-${dateString}`

      var child = spawn('vagrant', ['snapshot', 'save', this.vagrant_id, `'${name}'`], {shell: true})
      var pid = child.pid

      EventBus.$emit('addHistory', {'child': pid, 'data': `${name} Snapshot 추가`})

      child.stdout.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })

      child.stderr.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })

      child.on('close', function (code) {
        EventBus.$emit('removeHistory', {'child': pid, 'data': `${name} Snapshot 추가`})
        self.snapshotList()
      })
    },
    snapshotList: function () {
      this.value = 10
      const self = this
      childProcess.exec(`${this.$store.state.config.menu.vagrant_binary_location.content.value} snapshot list ${this.vagrant_id}`, function (error, stdout, stderr) {
        if (error !== null) {
          EventBus.$emit('addLogger', stderr)
        }
        var stdoutArray = stdout.split('\n')
        self.snapshot_list = []

        for (var i = 0; i < stdoutArray.length; i++) {
          var strTemp = stdoutArray[i]

          if (!(strTemp.indexOf('default') >= 0)) {
            if (strTemp.length > 0) {
              self.snapshot_list.push(strTemp)
            }
          }
        }
        self.value = 100

        document.getElementById('main').style.display = 'block'
        document.getElementById('progressbar').style.display = 'none'
      })
    },
    snapshotRemove: function (id, name) {
      const self = this
      var child = spawn('vagrant', ['snapshot', 'delete', '', id, '', `'${name}'`], {shell: true})
      var pid = child.pid

      EventBus.$emit('addHistory', {'child': pid, 'data': `${name} Snapshot 삭제`})
      child.stdout.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })

      child.stderr.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })

      child.on('close', function (code) {
        EventBus.$emit('removeHistory', {'child': pid, 'data': `${name} Snapshot 추가`})
        self.snapshotList()
      })
    },
    snapshotRestore: function (id, name) {
      const self = this
      var child = spawn('vagrant', ['snapshot', 'restore', '', id, '', `'${name}'`], {shell: true})
      var pid = child.pid

      EventBus.$emit('addHistory', {'child': pid, 'data': `${name} Snapshot 복원`})
      child.stdout.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })

      child.stderr.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })

      child.on('close', function (code) {
        EventBus.$emit('removeHistory', {'child': pid, 'data': `${name} Snapshot 복원`})
        self.snapshotList()
      })
    }
  },
  data () {
    return {
      snapshot_list: 0,
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
      cpus: 1,
      provider: ''
    }
  },
  created () {
    var self = this
    EventBus.$on('SetBoxList', (payload) => {
      this.countries = payload
    })

    exec(`${this.$store.state.config.menu.vagrant_binary_location.content.value} box list`, function (error, stdout, stderr) {
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