<template>
  <div id="wrapper" >
    <main style="height:100%;width:100%;">
      <div class="row" style="height:100%;width:100%;">
        <div class="col-xs-6">
          <menu-test></menu-test>
        </div>
        <div  style="margin-top:2%;width:75%;">
          <div  v-bind:vagrant_id="vagrantId" 
                v-bind:vagrant_name="vagrantName" 
                class="md-scrollbar" 
                style="overflow:auto;height:70%;width:100%;" 
                :is="currentComponent" 
                :swap-component="swapComponent"></div>
          <div>
            <b-card-body
                ref="content"
                style="position:relative; height:300px; overflow-y:scroll;"
                id="logger"
            >
              <pre>
                {{Logger}}
              </pre>
            </b-card-body>
        </div>
        </div>
      </div>
    </main>
  </div>
        <!-- <menu-status v-bind:value="post" v-bind:vagrant_id="key"></menu-status> -->
</template>

<script>
  import Information from './LandingPage/Information'
  import SystemInformation from './LandingPage/SystemInformation'
  import MenuTest from './LandingPage/MenuTest'
  import MachineStatus from './assets/MachineStatus'
  import EventBus from '../store/eventBus'
  import NewMachine from './LandingPage/NewMachine'
  import EnvironmentConfigure from './LandingPage/EnvironmentConfigure'

  export default {
    name: 'landing-page',
    components: { MenuTest, SystemInformation, MachineStatus, NewMachine, Information, EnvironmentConfigure },
    data () {
      return {
        currentComponent: 'new-machine',
        Logger: '',
        vagrantId: false,
        vagrantName: ''
      }
    },
    created () {
      EventBus.$on('addLogger', (payload) => {
        this.Logger += payload
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
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
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

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 100%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100%;
    width: 100%;
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
