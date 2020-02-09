<template>
  <div>
    <md-card class="md-primary" :style="value.state" :id="vagrant_id" style="width:100%;">
      <md-card-header>
        <md-card-header-text>
          <div>{{value.local_data_path}}</div>
          <div class="md-subhead">{{vagrant_id}}</div>
        </md-card-header-text>
      </md-card-header>
      <md-card-actions>
        <md-button v-on:click="configure(vagrant_id)">설정</md-button>
        <md-button v-on:click="start(vagrant_id)">켜기</md-button>
        <md-button v-on:click="stop(vagrant_id)">끄기</md-button>
        <md-button>재시작</md-button>
      </md-card-actions>
    </md-card>
    <md-content class="md-scrollbar">
    {{Logger}}
    </md-content>
  </div>
</template>

<script>
  export default {
    name: 'menu',
    data () {
      return {
        Logger: []
      }
    },
    methods: {
      addLogger: function (Logger) {
        this.Logger += Logger
      }
    }
  }
</script>