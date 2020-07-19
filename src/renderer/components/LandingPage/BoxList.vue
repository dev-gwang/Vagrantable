  
<template>
  <div>
    <div style="display:none;height:100%;" id="main">
      <div style="width:100%;height:20%;float:flex;">
        <h1>
          Vagrant Box List
        </h1>
        <hr>
      </div>
      <v-card  class="overflow-y-auto">
        <div>
          <b-form-input style="border-color: black;width:90%;float:left;" v-model="boxurl" placeholder="Enter Vagrant Box Name"></b-form-input>
          &nbsp
          <b-button style="width:8%;" v-on:click="SaveBox(boxurl)">Box Add</b-button>
        </div>
        <b-table striped hover :items="items">
          <template v-slot:cell(action)="data">
            <b-button v-on:click="deleteBoxImage(data.value)">Delete</b-button>
          </template>
        </b-table>
      </v-card>
    </div>
    <div class="text-center" id="progressbar" style="margin-top:20%;">
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
      if (!url) {
        alert('Please Insert Vagrant Box Name')
        return
      }

      var self = this
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
        EventBus.$emit('removeHistory', {data: command, child: child.pid})
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
        EventBus.$emit('removeHistory', {data: command, child: child.pid})

        self.refreshBoxImage(self)
      })
      EventBus.$emit('addHistory', ({'child': child.pid, 'data': `${command.join(' ')} Start`}))
    },
    refreshBoxImage (self) {
      exec(`vagrant box list`, function (error, stdout, stderr) {
        if (error !== null) {
          alert(error)
          EventBus.$emit('addLogger', stderr)
        } else {
          self.items = []

          // if (stdout.indexOf('There are no installed boxes')) {
          var boxList = stdout.split('\n')
          boxList.forEach(element => {
            var content = element.replace('(', '').replace(',', '').replace(')', '').split(/\s+/)
            if (content[0] === '') {
              return true
            }
            self.items.push({
              name: content[0],
              provision: content[1],
              version: content[2],
              action: content[0]
            })
          })
          document.getElementById('main').style.display = 'block'
          document.getElementById('progressbar').style.visibility = 'hidden'
        }
      })
    }
  },
  data () {
    return {
      items: [],
      table_category: ['Box Name', 'Provision', 'Version', 'Actions']
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