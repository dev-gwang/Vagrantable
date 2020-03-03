  
<template>
  <div class="page-container" style="width:100%;padding-left:1%;background-color:white;">
    <div id="main" style="visibility:hidden">
      <vnt-header>
        <span slot="subheader">Vagrant Box List</span>
      </vnt-header>
      <hr>
      <meta charset="UTF-8" />
      <span>
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

var exec = require('child_process').exec

export default {
  components: { MenuStatus },
  methods: {
    deleteBoxImage (name) {
      var self = this
      exec(`vagrant box remove ${name} --force`, function (error, stdout, stderr) {
        if (error !== null) {
          EventBus.$emit('addLogger', stderr)
        } else {
          EventBus.$emit('addLogger', stdout)
          alert(stdout)
          self.refreshBoxImage(self)
        }
      })
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