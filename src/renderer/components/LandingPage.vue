<template>
  <div id="wrapper2" :is="MainComponent">
   
  </div>
</template>

<script>
  // import SystemInformation from './LandingPage/SystemInformation'
  import EventBus from '../store/eventBus'
  import LoadingComponent from './LandingPage/LoadingComponent'
  import Main from './LandingPage/Main'

  export default {
    name: 'landing-page',
    components: { LoadingComponent },
    data () {
      return {
        MainComponent: 'LoadingComponent'
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    created () {
      EventBus.$on('completeLoading', () => {
        this.MainComponent = Main
      })
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

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper2 {
    float: left;
    width: 100%;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  #main {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
