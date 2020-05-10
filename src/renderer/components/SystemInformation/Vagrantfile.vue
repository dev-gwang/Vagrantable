  
<template>
  <div style="width:100%;height:100%;padding-left:1%;">
    <b-form-textarea
      id="textarea"
      v-model="Vagrantfile"
      placeholder="Enter something..."
      rows="20"
    ></b-form-textarea>
    <!-- <md-field>
      <md-textarea style="height:100%;" md-counter="3000" rows="300" v-model="Vagrantfile"></md-textarea>
    </md-field> -->
          <md-button class="md-raised" v-on:click="Save()">Save And Start</md-button>

  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'
import EventBus from '../../store/eventBus'
var childProcess = require('child_process')

var spawn = require('child_process').spawn
// var exec = require('child_process').exec

export default {
  props: [ 'snapshot_list', 'vagrant_id', 'vagrant_name' ],
  components: { MenuStatus },
  methods: {
    Save: function () {
      var self = this
      const fs = require('fs')
      var location = self.vagrant_name

      fs.writeFile(`${location.replace('/.vagrant', '')}/Vagrantfile`, this.Vagrantfile, 'utf8', function (error) {
        console.log(error)
      })
    },
    readVagrantfile (location) {
      var self = this
      var fs = require('fs')
      fs.readFile(`${location.replace('/.vagrant', '')}/Vagrantfile`, 'utf8', function (err, data) {
        if (!err) {
          self.Vagrantfile = data
        } else {
          alert(err)
        }
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
    this.readVagrantfile(this.vagrant_name)
  }
}
</script>