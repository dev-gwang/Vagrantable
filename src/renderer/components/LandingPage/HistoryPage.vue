  
<template>
  <div class="page-container" style="width:100%;padding-left:1%;background-color:white;">
    <div id="main">
      <meta charset="UTF-8" />
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
    </div>
  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'
import EventBus from '../../store/eventBus'

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
    // var self = this
    EventBus.$on('addHistory', (payload) => {
      this.items.push(payload)
    })
    EventBus.$on('removeHistory', (payload) => {
      this.removeHistory(payload)
    })
  }
}
</script>