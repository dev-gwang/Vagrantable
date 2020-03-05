  
<template>
  <div style="width:100%;background-color:#3498db; margin:0%; padding:0%;" v-on:click="history()" >
    <md-button style="border:0;width:100%;background-color:#3498db; margin:0%; padding:0%;font-size:0.5;" v-on:click="history()">
      Process: {{ counter }}
      </md-button>     <b-modal id="modal-1" title="BootstrapVue" @ok="handleOk">
        <table style="width:100%;align-text:top;">
        <tr><td style="width:100%;">
          <b-card style="padding:1%;">
            <md-table>
              <md-table-row>
                <md-table-head>Name</md-table-head>
                <md-table-head>Actions</md-table-head>
              </md-table-row>
              <md-table-row v-for="post, key in items" style="width:100%;">
                <md-table-cell>{{post.data}}</md-table-cell>
                <md-table-cell><md-button md-raised v-on:click="killProcess(post)">Kill</md-button></md-table-cell>
              </md-table-row>
            </md-table>
          </b-card>
        </td>
        </tr>
      </table>
      </b-modal>
  </div>
</template>

<script>
import EventBus from '../../store/eventBus'
import MenuStatus from '../assets/MachineStatus'
var kill = require('tree-kill')

export default {
  components: { MenuStatus },
  methods: {
    removeHistory (pid) {
      var self = this
      const idx = self.items.findIndex(function (item) {
        return item.child === pid
      })
      if (idx > -1) {
        self.items.splice(idx, 1)
      }
    },
    killProcess (url) {
      kill(url.child, function (error) {
        if (error || !error) {
          this.removeHistory(url.child)
        }
      })
    },
    history () {
      this.$root.$emit('bv::show::modal', 'modal-1', '#btnShow')
    }
  },
  data () {
    return {
      items: [],
      counter: 0
    }
  },
  created () {
    /**
     * 처음 시작할 때, Box 리스트를 가지고 와서 저장함
     */
    // var self = this
    EventBus.$on('addHistory', (payload) => {
      EventBus.$emit('addToast', `${payload.data}`)
      EventBus.$emit('addLogger', `${payload.data}`)
      this.items.push(payload)
      this.counter = this.counter + 1
    })
    EventBus.$on('removeHistory', (payload) => {
      EventBus.$emit('addToast', `${payload.data} Exit`)
      EventBus.$emit('addLogger', `${payload.data} Exit`)
      this.removeHistory(payload.child)
      this.counter = this.counter - 1
    })
  }
}
</script>