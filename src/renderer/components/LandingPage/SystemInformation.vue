<template>
  <v-row align="center">
    <v-col class="text-center" cols="12" sm="4">
      <div class="my-2">
        <v-btn depressed small>Normal</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed small color="primary">Primary</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed small color="error">Error</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed small disabled>Disabled</v-btn>
      </div>
    </v-col>

    <v-col class="text-center" cols="12" sm="4">
      <div class="my-2">
        <v-btn depressed>Normal</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed color="primary">Primary</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed color="error">Error</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed disabled>Disabled</v-btn>
      </div>
    </v-col>

    <v-col class="text-center" cols="12" sm="4">
      <div class="my-2">
        <v-btn depressed large>Normal</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed large color="primary">Primary</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed large color="error">Error</v-btn>
      </div>
      <div class="my-2">
        <v-btn depressed large disabled>Disabled</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version
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
