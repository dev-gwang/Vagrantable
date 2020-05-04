  
<template>
  <div>
    <div style="display:none" id="main">
      <div>
        <h1>
          {{vagrant_name}}
        </h1>
        <md-card-actions>
          <md-button v-on:click="start(vagrant_id)">Up</md-button>
          <md-button v-on:click="stop(vagrant_id)">Halt</md-button>
          <md-button v-on:click="reload(vagrant_id)">Reload</md-button>
          <md-button v-on:click="provision(vagrant_id)">Provision</md-button>
          <md-button v-on:click="remove(vagrant_id)">Destroy</md-button>
          <md-button v-on:click="updateBoxImage(vagrant_id)">Update</md-button>
        </md-card-actions>
      </div>
      <span style="width:100%;">
        <div style="width:5%;height:100vh;background-color:gray;">
        </div>
        <div style="width:90%;">
          Snapshot List
          <v-btn v-b-modal.modal-2 small color="primary" fab>+</v-btn>
          <b-button v-b-modal.modal-2>Capture Snapshot</b-button>
          <b-modal id="modal-2" title="BootstrapVue" @ok="handleOk">
            <p class="my-4">Capture Snapshot</p>
            <b-form-input v-model="snapshotName" placeholder="Enter your name"></b-form-input>
          </b-modal>
          <div>
            <md-table>
              <md-table-row>
                <md-table-head>Snapshot Name</md-table-head>
              </md-table-row>
              <md-table-row v-for="post, key in SnapshotList" style="width:100%;">
                <md-table-cell>{{post}}</md-table-cell>
              </md-table-row>
            </md-table>
          </div>
          <md-field>
            <md-textarea style="height:100%;" md-counter="1000" rows="100" v-model="Vagrantfile"></md-textarea>
          </md-field>
          <md-button class="md-raised" v-on:click="Save()">Save And Start</md-button>
        </div>
      </span>
    </div>
    <div class="text-center" id="progressbar" style="margin-top:20%;">
      <b-spinner type="grow" label="Spinning"></b-spinner>
      <br>
      Loading...
    </div>
  </div>
</template>

<script>
  import EventBus from '../../store/eventBus'
  var childProcess = require('child_process')
  var spawn = require('child_process').spawn
  var exec = require('child_process').exec

  export default {
    props: ['vagrant_name', 'vagrant_id'],
    data () {
      return {
        SnapshotList: [],
        ports: [],
        name: '',
        value: 0,
        Vagrantfile: ''
      }
    },
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
      updateBoxImage (name) {
        var self = this
        exec(`vagrant box update ${name} --force`, function (error, stdout, stderr) {
          if (error !== null) {
            EventBus.$emit('addLogger', stderr)
          } else {
            EventBus.$emit('addLogger', stdout)
            self.refreshBoxImage(self)
          }
        })
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
      },
      provision: function (id) {
        const self = this
        var child = spawn('vagrant', ['up', id, '--provision'], {shell: true})
        var pid = child.pid

        EventBus.$emit('addHistory', {'child': pid, 'data': `${name} Reload`})
        child.stdout.on('data', (data) => {
          EventBus.$emit('addLogger', data)
        })

        child.stderr.on('data', (data) => {
          EventBus.$emit('addLogger', data)
        })

        child.on('close', function (code) {
          EventBus.$emit('removeHistory', {'child': pid, 'data': `${name} Reload`})
          self.snapshotList()
        })
      },
      remove: function (id) {
        var child = spawn('vagrant', ['destroy', '-f', id])

        child.stdout.on('data', (data) => {
          EventBus.$emit('addLogger', data)
          EventBus.$emit('removeVM', id)
        })
        child.stderr.on('data', (data) => {
          EventBus.$emit('addLogger', data)
        })
      },
      reload: function (id) {
        const self = this
        var child = spawn('vagrant', ['reload', id], {shell: true})
        var pid = child.pid

        EventBus.$emit('addHistory', {'child': pid, 'data': `${name} Reload`})
        child.stdout.on('data', (data) => {
          EventBus.$emit('addLogger', data)
        })

        child.stderr.on('data', (data) => {
          EventBus.$emit('addLogger', data)
        })

        child.on('close', function (code) {
          EventBus.$emit('removeHistory', {'child': pid, 'data': `${name} Reload`})
          self.snapshotList()
        })
      },
      start: function (id) {
        var child = spawn('vagrant', ['up', id])

        child.stdout.on('data', (data) => {
          EventBus.$emit('addLogger', data)
        })
        child.stderr.on('data', (data) => {
          EventBus.$emit('addLogger', data)
        })
        child.on('exit', function (code, signal) {
          EventBus.$emit('refreshVM')
        })
      },
      stop: function (id) {
        exec(`${this.$store.state.config.menu.vagrant_binary_location.content.value} halt ${id}`, function (error, stdout, stderr) {
          EventBus.$emit('addLogger', stdout)

          if (error !== null) {
            console.log('exec error: ' + error)
          }
          EventBus.$emit('refreshVM')
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
          self.SnapshotList = []

          for (var i = 0; i < stdoutArray.length; i++) {
            var strTemp = stdoutArray[i]

            if (!(strTemp.indexOf('default') >= 0)) {
              if (strTemp.length > 0) {
                self.SnapshotList.push(strTemp)
              }
            }
          }
          self.value = 100

          document.getElementById('main').style.display = 'block'
          document.getElementById('progressbar').style.display = 'none'
        })
      },
      doThis: function () {
        const self = this
        childProcess.exec(`${this.$store.state.config.menu.vagrant_binary_location.content.value} port ${this.vagrant_id} | grep -v 'default' | grep -v 'The' | grep -v 'Vagrantfile' | grep -v 'provider'`, function (error, stdout, stderr) {
          if (error !== null) {
            EventBus.$emit('addLogger', stderr)
          }
          var stringTemp = stdout.replace('(guest)', '').replace('(host)', '').replace('\r\n', '')
          self.ports.push(
            {'guest': stringTemp.split('=>')[0], 'host': stringTemp.split('=>')[1]}
          )
        })
        this.snapshotList()
      },
      doThis2: function () {
        const self = this
        childProcess.exec(`${this.$store.state.config.menu.vagrant_binary_location.content.value} port this.vagrant_id | grep -v 'default' | grep -v 'The' | grep -v 'Vagrantfile' | grep -v 'provider'`, function (error, stdout, stderr) {
          if (error !== null) {
            EventBus.$emit('addLogger', stderr)
          }
          var stringTemp = stdout.replace('(guest)', '').replace('(host)', '').replace('\r\n', '')
          self.ports.push(
            {'guest': stringTemp.split('=>')[0], 'host': stringTemp.split('=>')[1]}
          )
        })
        this.snapshotList()
      }
    },
    updated () {
    },
    created () {
      this.cpus = '111'
      this.doThis()
      this.readVagrantfile(this.vagrant_name)
      EventBus.$on('refreshInform', () => {
        document.getElementById('main').style.display = 'none'
        document.getElementById('progressbar').style.display = 'block'
        this.doThis2()
      })

      EventBus.$on('addInform', (id) => {
        alert(id)
      })
      EventBus.$on('addSnapshot', (payload) => {
        this.SnapshotList = payload.split('\n')
      })
    }
  }
</script>