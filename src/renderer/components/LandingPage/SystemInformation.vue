  
<template>
  <div>
    <div>
      <vnt-header>
        {{value}}
        <span slot="subheader">
          {{vagrant_id}}
        </span>
      </vnt-header>

      
      <br>
      
    </div>
    <div style="align-text:left;">
      <md-card-actions>
        <md-button v-on:click="configure(vagrant_id)">설정</md-button>
        <md-button v-on:click="start(vagrant_id)">켜기</md-button>
        <md-button v-on:click="stop(vagrant_id)">끄기</md-button>
        <md-button v-on:click="reload(vagrant_id)">재시작</md-button>
        <md-button v-on:click="remove(vagrant_id)">삭제</md-button>
      </md-card-actions>
    </div>
    <div>Snapshot Lists</div>
    <pre>
      <li v-for="key in SnapshotList.slice(1)">{{key}}</li>
    </pre>
  </div>
</template>

<script>
  import EventBus from '../../store/eventBus'
  var spawn = require('child_process').spawn
  var exec = require('child_process').exec

  export default {
    name: 'menu',
    props: ['value', 'vagrant_id'],
    data () {
      return {
        SnapshotList: []
      }
    },
    methods: {
      remove: function (id) {
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
        // exec('vagrant up ' + id, function (error, stdout, stderr) {
        //   var getId = document.getElementById(id)
        //   EventBus.$emit('addLogger', stdout)
        //   console.log('stdout: ' + stdout)
        //   console.log('stderr: ' + stderr)

        //   getId.style.backgroundColor = 'green'
        //   getId.style.color = 'white'

        //   if (error !== null) {
        //     getId.style.backgroundColor = 'red'
        //     EventBus.$emit('addLogger', stderr)

        //     console.log('exec error: ' + error)
        //   }
        // })
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
      }
    },
    created () {
      EventBus.$on('addSnapshot', (payload) => {
        this.SnapshotList = payload.split('\n')
      })
      EventBus.$on('setInform', (payload, id) => {
        this.value = payload
        this.vagrant_id = id
      })
    }
  }
</script>