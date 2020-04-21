  
<template>
  <div class="page-container" style="width:100%;padding-left:1%;background-color:white;">
    <v-progress-circular
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'
import EventBus from '../../store/eventBus'

var spawn = require('child_process').spawn

export default {
  components: { MenuStatus },
  methods: {
    SetBoxList: function (list) {
      this.countries = list
    }
  },
  data () {
    return {
      BashCode: '',
      network: '',
      network_type: [
        {
          text: 'public_network', value: 'public_network'
        },
        {
          text: 'private_network', value: 'private_network'
        }
      ],
      countries: [],
      Vagrantfile: '',
      aaa: 'bbbb',
      location: '',
      boxname: ''
    }
  },
  created () {
    EventBus.$on('SetBoxList', (payload) => {
      this.countries = payload
    })
  }
}
</script>