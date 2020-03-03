
      
<template>
  <div class="page-container" style="width:100%;padding-left:1%;background-color:white;">
    <div class="text-center">
      <b-spinner id="progressbar" type="grow" label="Spinning"></b-spinner>
    </div>
  </div>
</template>

<script>
import MenuStatus from '../assets/MachineStatus'
import EventBus from '../../store/eventBus'

var spawn = require('child_process').spawn

export default {
}
</script>