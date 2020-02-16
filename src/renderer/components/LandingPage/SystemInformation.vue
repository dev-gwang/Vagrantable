  
<template>
  <div>
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
    <div>Snapshot Lists</div>
    <pre>
      <li v-for="key in SnapshotList.slice(1)">{{key}}</li>
    </pre>
    {{ports}}
  </div>
</template>

<script>
  import EventBus from '../../store/eventBus'
  var childProcess = require('child_process')
  var spawn = require('child_process').spawn
  var exec = require('child_process').exec

  // const ExecCommand = async (command) => {
  //   await exec(command, function (error, stdout, stderr) {
  //     if (error !== null) {
  //       alert(error)
  //     }
  //     alert('a')
  //     alert(stdout)
  //     return stdout
  //   })
  // }

  export default {
    props: ['vagrant_name', 'vagrant_id'],
    data () {
      return {
        SnapshotList: [],
        ports: [
          { 'guest': 0, 'port': 1 }
        ]
      }
    },
    methods: {
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
      init: function () {
        var ret = childProcess.execSync('vagrant port ' + this.vagrant_id)
        // var test = await goWork('vagrant port ' + this.vagrant_id)
        this.ports = ret
        alert(ret)
        // exec('vagrant port ' + this.vagrant_id, function (error, stdout, stderr) {
        //   if (error !== null) {
        //     alert(error)
        //   }
        //   alert('a')
        //   alert(this.vagrant_id)
        //   this.ports = stdout
        //   alert(this.ports)
        // })
      }
    },
    // mounted () {
    //   this.init()
    // },
    created () {
      this.init()
      EventBus.$on('addInform', (id) => {
        alert(id)
      })
      EventBus.$on('addSnapshot', (payload) => {
        this.SnapshotList = payload.split('\n')
      })
    }
  }
</script>