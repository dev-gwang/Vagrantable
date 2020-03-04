  
<template>
  <div class="page-container" style="width:100%;padding-left:1%;background-color:white;">
    <div id="main" style="visibility:hidden">
      <vnt-header>
        <span slot="subheader">Vagrant Box List</span>
      </vnt-header>
      <hr>
      <meta charset="UTF-8" />
      <span>
        <table style="width:100%;align-text:top;">
          <tr>
          <td style="width:100%;">
            <b-card style="padding:1%;">
              <span>
                <b-form-input style="border-color: black;width:70%;" v-model="boxurl" placeholder="Enter Vagrant Location"></b-form-input>
                <md-button class="md-raised" v-on:click="SaveBox(boxurl)">Box Add</md-button>
              </span>
              <md-table>
                <md-table-row>
                  <md-table-head>Box Name</md-table-head>
                  <md-table-head>Provision</md-table-head>
                  <md-table-head>Version</md-table-head>
                  <md-table-head>Actions</md-table-head>
                </md-table-row>
                <md-table-row v-for="post, key in items" style="width:100%;">
                  <md-table-cell>{{post.name}}</md-table-cell>
                  <md-table-cell>{{post.provision}}</md-table-cell>
                  <md-table-cell>{{post.version}}</md-table-cell>
                  <md-table-cell><md-button md-raised v-on:click="deleteBoxImage(post.name)">Delete</md-button></md-table-cell>
                </md-table-row>
              </md-table>
            </b-card>
          </td>
          </tr>
        </table>
      </span>
    </div>
    <div class="text-center" id="progressbar">
      <b-spinner type="grow" label="Spinning"></b-spinner>
      <br>
      Loading...
    </div>
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
    SaveBox (url) {
      var command = ['box', 'add', url, '--provider', 'virtualbox']
      var child = spawn('vagrant', command)

      child.stdout.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })
      child.stderr.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })
      child.on('exit', function (code, signal) {
        EventBus.$emit('addLogger', (`${command.join(' ')} End (Code ${code})`))
        EventBus.$emit('removeHistory', child.pid)
        self.refreshBoxImage(self)
      })
      EventBus.$emit('addHistory', ({'child': child.pid, 'data': `${command.join(' ')} Start`}))
    },
    deleteBoxImage (name) {
      var self = this
      var command = ['box', 'remove', name, '--force']
      var child = spawn('vagrant', command)

      child.stdout.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })
      child.stderr.on('data', (data) => {
        EventBus.$emit('addLogger', data)
      })
      child.on('exit', function (code, signal) {
        EventBus.$emit('addLogger', (`${command.join(' ')} End (Code ${code})`))
        EventBus.$emit('removeHistory', child.pid)
        self.refreshBoxImage(self)
      })
      EventBus.$emit('addHistory', ({'child': child.pid, 'data': `${command.join(' ')} Start`}))
    },
    refreshBoxImage (self) {
      exec(`vagrant box list`, function (error, stdout, stderr) {
        if (error !== null) {
          EventBus.$emit('addLogger', stderr)
        } else {
          self.items = []
          var boxList = stdout.split('\n')
          boxList.forEach(element => {
            var content = element.replace('(', '').replace(',', '').replace(')', '').split(/\s+/)
            if (content[0] === '') {
              return true
            }
            self.items.push({
              name: content[0],
              provision: content[1],
              version: content[2]
            })
            console.log(self.items)
          })
          document.getElementById('main').style.visibility = 'visible'
          document.getElementById('progressbar').style.visibility = 'hidden'
        }
      })
    }
  },
  data () {
    return {
      items: []
    }
  },
  created () {
    /**
     * 처음 시작할 때, Box 리스트를 가지고 와서 저장함
     */
    var self = this
    this.refreshBoxImage(self)
  }
}
</script>