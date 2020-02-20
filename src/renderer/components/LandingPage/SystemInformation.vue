  
<template>
  <div>
    <div style="visibility:hidden" id="main">
      <div>
        <vnt-header>
          <span slot="subheader">
          {{vagrant_name}} ({{vagrant_id}})
          </span>
        </vnt-header>
        <hr>
        <br>
      </div>
      <div style="align-text:left;">
        <md-card-actions>
          <md-button v-on:click="configure(vagrant_id)">Config</md-button>
          <md-button v-on:click="start(vagrant_id)">Up</md-button>
          <md-button v-on:click="stop(vagrant_id)">Halt</md-button>
          <md-button v-on:click="reload(vagrant_id)">Reload</md-button>
          <md-button v-on:click="provision(vagrant_id)">Provision</md-button>
          <md-button v-on:click="remove(vagrant_id)">Destroy</md-button>
        </md-card-actions>
      </div>
      <table style="width:100%;align-text:top;">
        <tr>
            <td style="width:60%;">
              <b-card style="padding:1%;">
              <vnt-header>
                <h5>
                  Snapshot List <b-button v-b-modal.modal-1>Capture Snapshot</b-button>
                </h5>
                <b-modal id="modal-1" title="BootstrapVue" @ok="handleOk">
                  <p class="my-4">Capture Snapshot</p>
                  <b-form-input v-model="snapshotName" placeholder="Enter your name"></b-form-input>
                </b-modal>
              </vnt-header>
              <table style="width:100%;">
                <tr>
                  <td style="width:50%;">
                    Snapshot Name
                  </td>
                  <td style="width:50%;">
                    Actions
                  </td>
                </tr>
                <md-list  v-for="post, key in SnapshotList">
                  <tr style="width:100%;">
                    <td style="width:50%;">
                      {{post}}
                    </td>
                    <td style="width:50%;">
                      <b-button v-on:click="snapshotRestore(vagrant_id, post)">Snapshot Restore</b-button><br>
                      <b-button v-on:click="snapshotRemove(vagrant_id, post)">Snapshot Remove</b-button><br>
                    </td>
                  </tr>
                </md-list>
              </table>
              </b-card>
            </td>
          </tr>
        </table>
    </div>
    <div class="text-center" id="progressbar">
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
        value: 0
      }
    },
    methods: {
      handleOk: function () {
        var dt = new Date()
        var dateString = dt.getYear() + 1900 + '-' + dt.getMonth() + '-' + dt.getDate()

        exec(`vagrant snapshot save ${this.vagrant_id} ${this.snapshotName}-${dateString}`, function (error, stdout, stderr) {
          EventBus.$emit('addLogger', stdout)
          console.log('stdout: ' + stdout)
          console.log('stderr: ' + stderr)

          if (error !== null) {
            EventBus.$emit('addLogger', stderr)

            console.log('exec error: ' + error)
          }
        })
      },
      snapshotRemove: function (id, name) {
        exec(`vagrant snapshot delete ${id} ${name}`, function (error, stdout, stderr) {
          EventBus.$emit('addLogger', stdout)
          console.log('stdout: ' + stdout)
          console.log('stderr: ' + stderr)

          if (error !== null) {
            EventBus.$emit('addLogger', stderr)

            console.log('exec error: ' + error)
          }
          this.snapshotList()
        })
      },
      snapshotRestore: function (id, name) {
        exec(`vagrant snapshot restore ${id} ${name}`, function (error, stdout, stderr) {
          EventBus.$emit('addLogger', stdout)
          alert(stdout)
          console.log('stdout: ' + stdout)
          console.log('stderr: ' + stderr)

          if (error !== null) {
            EventBus.$emit('addLogger', stderr)

            console.log('exec error: ' + error)
          }
        })
      },
      provision: function (id) {
        var child = spawn('vagrant', ['up', '', id, '--provision'])

        child.stdout.on('data', (data) => {
          var getId = document.getElementById(id)
          getId.style.backgroundColor = 'green'
          getId.style.color = 'white'
          EventBus.$emit('addLogger', data)
        })
        child.stderr.on('data', (data) => {
          var getId = document.getElementById(id)
          getId.style.backgroundColor = 'red'
          getId.style.color = 'white'
          EventBus.$emit('addLogger', data)
        })
      },
      remove: function (id) {
        alert(id)
        var child = spawn('vagrant', ['destroy', '-f', id])

        child.stdout.on('data', (data) => {
          var getId = document.getElementById(id)
          getId.style.backgroundColor = 'green'
          getId.style.color = 'white'
          EventBus.$emit('addLogger', data)
          EventBus.$emit('removeVM', id)
        })
        child.stderr.on('data', (data) => {
          var getId = document.getElementById(id)
          getId.style.backgroundColor = 'red'
          getId.style.color = 'white'
          EventBus.$emit('addLogger', data)
        })
      },
      reload: function (id) {
        exec('vagrant reload ' + id, function (error, stdout, stderr) {
          var getId = document.getElementById(id)
          EventBus.$emit('addLogger', stdout)
          console.log('stdout: ' + stdout)
          console.log('stderr: ' + stderr)

          getId.style.backgroundColor = 'green'
          getId.style.color = 'white'

          if (error !== null) {
            getId.style.backgroundColor = 'red'
            EventBus.$emit('addLogger', stderr)

            console.log('exec error: ' + error)
          }
        })
      },
      start: function (id) {
        var child = spawn('vagrant', ['up', id])

        child.stdout.on('data', (data) => {
          var getId = document.getElementById(id)
          getId.style.backgroundColor = 'green'
          getId.style.color = 'white'
          EventBus.$emit('addLogger', data)
        })
        child.stderr.on('data', (data) => {
          var getId = document.getElementById(id)
          getId.style.backgroundColor = 'red'
          getId.style.color = 'white'
          EventBus.$emit('addLogger', data)
        })
      },
      stop: function (id) {
        exec('vagrant halt ' + id, function (error, stdout, stderr) {
          var getId = document.getElementById(id)
          EventBus.$emit('addLogger', stdout)

          console.log('stdout: ' + stdout)
          console.log('stderr: ' + stderr)
          getId.style.backgroundColor = 'white'
          getId.style.color = 'black'
          if (error !== null) {
            getId.style.backgroundColor = 'red'
            console.log('exec error: ' + error)
          }
        })
      },
      snapshotList: function () {
        this.value = 10
        const self = this
        self.SnapshotList = []
        childProcess.exec('vagrant snapshot list ' + this.vagrant_id + " | grep -v 'default'", function (error, stdout, stderr) {
          if (error !== null) {
            alert(error)
          }
          var stdoutArray = stdout.split('\n')
          for (var i = 0; i < stdoutArray.length; i++) {
            self.SnapshotList.push(stdoutArray[i])
          }
          self.value = 100

          document.getElementById('main').style.visibility = 'visible'
          document.getElementById('progressbar').style.visibility = 'hidden'
        })
      },
      doThis: function () {
        const self = this
        childProcess.exec('vagrant port ' + this.vagrant_id + " | grep -v 'default' | grep -v 'The' | grep -v 'Vagrantfile' | grep -v 'provider'", function (error, stdout, stderr) {
          if (error !== null) {
            alert(error)
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
        childProcess.exec('vagrant port ' + this.vagrant_id + " | grep -v 'default' | grep -v 'The' | grep -v 'Vagrantfile' | grep -v 'provider'", function (error, stdout, stderr) {
          if (error !== null) {
            alert(error)
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
      EventBus.$on('refreshInform', () => {
        document.getElementById('main').style.visibility = 'hidden'
        document.getElementById('progressbar').style.visibility = 'visible'
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