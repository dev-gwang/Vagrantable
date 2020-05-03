  
<template>
  <div>
    <md-card class="md-primary" :style="value.state" :id="vagrant_id">
      <md-card-header>
        <md-card-header-text>
          <div v-on:click="inform(value.local_data_path, vagrant_id)">
            <div>{{value.local_data_path}}</div>
            <div class="md-subhead">{{vagrant_id}}</div>
          </div>
        </md-card-header-text>
      </md-card-header>
    
    </md-card>
  </div>
</template>

<script>
import EventBus from '../../store/eventBus'

var exec = require('child_process').exec
var child = ''

console.log(child)

export default {
  props: ['value', 'vagrant_id'],
  // 메소드는 `methods` 객체 안에 정의합니다
  methods: {
    inform: function (name, id) {
      EventBus.$emit('setInform', name, id)
      // EventBus.$emit('SetSystemInformation', name, id)
    },
    configure: function (id) {
      child = exec(`${this.$store.state.config.menu.vagrant_binary_location.content.value} snapshot list ${id}`, function (error, stdout, stderr) {
        EventBus.$emit('addSnapshot', stdout)
        if (error !== null) {
          console.log('exec error: ' + error)
        }
      })
    }
  }
}
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }
  .items { margin-top: 8px; }
  .item {
    display: flex;
    margin-bottom: 6px;
  }
  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }
  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>