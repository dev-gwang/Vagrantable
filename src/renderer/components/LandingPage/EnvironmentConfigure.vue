  
<template>
  <div class="page-container" style="width:100%;padding-left:1%;background-color:white;">
    <vnt-header>
      <span slot="subheader">
        SETTINGS
      </span>
    </vnt-header>
    <hr>
    <meta charset="UTF-8" />
    <span>
      <table style="width:100%;align-text:top;">
        <tr>
          <td style="width:60%;">
            <b-card style="padding:1%;">
              <div v-for="post, key in ENV">
                {{key}}
                {{post}}
                <b-form-input style="border-color: black;" v-model="ENV[key]" placeholder="Enter Vagrant Location">post</b-form-input>
              </div>
            </b-card>
          </td>
        </tr>
      </table>
    <md-button class="md-raised" v-on:click="Save()">Save And Start</md-button>
    </span>
  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'
const env = require('env-var')

export default {
  components: { MenuStatus },
  methods: {
    Save: function () {
      for (var key in this.ENV) {
        env.get(key).default(this.ENV[key].asString())
      }
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
      boxname: '',
      ENV: {
        'VAGRANT_HOME': '',
        'VAGRANT_BOX_UPDATE_CHECK_DISABLE': ''
      }
    }
  },
  created () {
    for (var key in this.ENV) {
      this.ENV[key] = env.get(key).asString()
    }
  },
  eval () {
  }
}
</script>