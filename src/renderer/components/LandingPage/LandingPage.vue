<template>
  <div id="wrapper">
    <main style="display: flex;height:100%;bottom:20px;">
      <menu-list style="height:100%;"></menu-list>
      <div style="margin-top:2%;width:90%; height:100%;z-index: 1;">
        <div v-bind:vagrant_id="vagrantId" v-bind:vagrant_name="vagrantName" class="overflow-y-auto" style="overflow:auto;height:70vh;width:100%;" :is="currentComponent"></div>
        <hr>
        <v-card ref="content" class="overflow-y-auto" style="height:20%; width:100%;overflow-y:scroll;bottom:20px;position: fixed;" id="logger">
          <pre>{{Logger}}</pre>
        </v-card>
      </div>
      <md-snackbar style="background-color:#263238;" :md-active.sync="showSnackbar" md-persistent>
        <span style="color:white;">{{ message }}</span>
      </md-snackbar>
    </main>
    
    <status-component style="width:100%;height:20px;bottom:0%;position: fixed;">
      a
    </status-component>
  </div>
</template>

<script>
  import Information from './Information'
  import SystemInformation from './SystemInformation'
  import MenuList from './Menu'
  import MachineStatus from '../assets/MachineStatus'
  import EventBus from '../../store/eventBus'
  import NewMachine from './NewMachine'
  import EnvironmentConfigure from './EnvironmentConfigure'
  import BoxList from './BoxList'
  import HistoryPage from './HistoryPage'
  import StatusComponent from '../Main/StatusComponent'

  export default {
    name: 'landing-page',
    components: { StatusComponent, BoxList, MenuList, SystemInformation, MachineStatus, NewMachine, Information, EnvironmentConfigure, HistoryPage },
    data () {
      return {
        currentComponent: 'new-machine',
        Logger: '',
        vagrantId: false,
        vagrantName: '',
        showSnackbar: false,
        message: '',
        showDialog: true
      }
    },
    created () {
      this.Logger = ''
      EventBus.$on('addToast', (payload) => {
        this.message = payload
        this.makeToast(payload)
        // this.showSnackbar = true
      })
      EventBus.$on('addLogger', (payload) => {
        if (payload.indexOf('\n') < 0) {
          this.Logger += payload + '\n'
        } else {
          this.Logger += payload
        }
        document.getElementById('logger').scrollTo(0, document.getElementById('logger').scrollHeight)
      })
      EventBus.$on('SetSystemInformation', (name, id) => {
        this.currentComponent = 'system-information'
        this.vagrantName = name
        this.vagrantId = id
        EventBus.$emit('refreshInform')
      })
      EventBus.$on('swapComponent', (name, id) => {
        this.currentComponent = name
      })
      EventBus.$on('alertHistory', (name, id) => {
        this.showDialog = true
      })
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      makeToast (variant = null) {
        this.$bvToast.toast(variant, {
          title: `Messages`,
          toaster: 'b-toaster-bottom-right',
          solid: true
        })
      }
    }
  }
</script>

<style>

  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
pre {
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 1em 0;
  
}
  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 100%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100%;
    width: 100%;
    float: left;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
