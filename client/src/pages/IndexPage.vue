<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
    <q-btn @click="openDialog()" label="Open"></q-btn>

    <q-btn @click="setTitle()" label="Set Title"></q-btn>
    <q-input label="Title" v-model="title"></q-input>
  </q-page>
</template>

<script setup>
//import { ipcRenderer } from 'electron'
// window.izzupAPI.toggleMaximize()

import { ref } from 'vue'

const title = ref()

const openDialog = async () => {
  window.izzupAPI.openFileDialog ('tester', '/home/brian/izzup')

  // ipcRenderer.invoke('openDirDialog', 'bester').then((result) => {
  //   console.log(result)
  // })
}


const setTitle = () => {
  window.izzupAPI.setTitle (title.value)
}


</script>
