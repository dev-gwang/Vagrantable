<template>
  <div>
    <div class="title">Information</div>
    <table border="1" style="border-collapse:collapse;width=100%">
        <tr v-for="post in posts">
            <td v-html="post.state">{{post.state}}</td>
            <td>{{post.local_data_path}}</td>
            <td>{{post.extra_data.box.name}}</td>
            <td>{{post.extra_data.box.provider}}</td>
            <td>{{post.extra_data.box.version}}</td>
            <td>{{post.extra_data.box.version}}</td>
        </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      posts: []
    }
  },
  created () {
    const exec = require('child_process').exec
    exec('cat d:/.vagrant/data/machine-index/index', (stdout, stderr) => {
      var jsonParse = stderr.split('\n').join('<br />')
        .split('running').join('<font color=blue>running</font>')
        .split('poweroff').join('<font color=red>poweroff</font>')
      this.posts = JSON.parse(jsonParse)['machines']
      console.log(jsonParse)
    })
    // const exec = require('child_process').exec
    // exec('vagrant global-status', (stdout, stderr) => {
    //   this.posts = stderr.split('\n').join('<br />')
    //     .split('running').join('<font color=blue>running</font>')
    //     .split('poweroff').join('<font color=red>poweroff</font>')
    // })
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
