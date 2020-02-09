  
<template>
  <div>
    <div>Snapshot Lists</div>
    <pre>
      <li v-for="key in SnapshotList.slice(1)">{{key}}</li>
    </pre>
  </div>
</template>

<script>
  import EventBus from '../../store/eventBus'

  export default {
    name: 'menu',
    data () {
      return {
        SnapshotList: []
      }
    },
    created () {
      EventBus.$on('addSnapshot', (payload) => {
        this.SnapshotList = payload.split('\n')
      })
    }
  }
</script>