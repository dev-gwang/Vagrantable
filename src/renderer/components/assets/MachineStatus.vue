  
<template>
  <div>
    <md-card class="md-primary" :style="value.state" :id="vagrant_id" style="width:100%;">
      <md-card-header>
        <md-card-header-text>
          <div>{{value.local_data_path}}</div>
          <div class="md-subhead">{{vagrant_id}}</div>
        </md-card-header-text>
      </md-card-header>
      <!-- <md-card-actions>
        <md-button v-on:click="configure(vagrant_id)">설정</md-button>
        <md-button v-on:click="start(vagrant_id)">켜기</md-button>
        <md-button v-on:click="stop(vagrant_id)">끄기</md-button>
        <md-button>재시작</md-button>
      </md-card-actions> -->
    </md-card>
  </div>
</template>

<script>
import EventBus from '../../store/eventBus'

var exec = require('child_process').exec
var child = ''

console.log(child)

export default {
  name: 'app',
  props: ['value', 'vagrant_id'],
  // 메소드는 `methods` 객체 안에 정의합니다
  methods: {
    start: function (id) {
      child = exec('vagrant up ' + id, function (error, stdout, stderr) {
        var getId = document.getElementById(id)

        EventBus.$emit('addLogger', stdout)
        console.log('stdout: ' + stdout)
        console.log('stderr: ' + stderr)

        getId.style.backgroundColor = 'green'
        getId.style.color = 'white'

        if (error !== null) {
          getId.style.backgroundColor = 'red'
          EventBus.$emit('addLogger', stderr)

          console.log('exec error: ' + error)
        }
      })
    },
    stop: function (id) {
      child = exec('vagrant halt ' + id, function (error, stdout, stderr) {
        var getId = document.getElementById(id)
        EventBus.$emit('addLogger', stdout)

        console.log('stdout: ' + stdout)
        console.log('stderr: ' + stderr)
        getId.style.backgroundColor = 'white'
        getId.style.color = 'black'
        if (error !== null) {
          getId.style.backgroundColor = 'red'
          console.log('exec error: ' + error)
        }
      })
    },
    configure: function (id) {
      child = exec('vagrant snapshot list ' + id, function (error, stdout, stderr) {
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