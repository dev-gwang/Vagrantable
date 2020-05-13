  
<template>
  <div  >
    <div class=".overline" v-on:click="history()">
      Process {{counter}}
    </div>
   
    <b-modal id="modal-1">
      <table>
      <tr><td>
        <b-card >
            <div v-for="post, key in items" >
              {{post.data}}
              <b-button md-raised v-on:click="killProcess(post)">Kill</b-button>
            </div>
        </b-card>
      </td>
      </tr>
    </table>
    </b-modal>
  </div>
</template>

<script>
import EventBus from '../store/eventBus'
import MenuStatus from './assets/MachineStatus'
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