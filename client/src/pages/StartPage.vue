<template>
  <q-page class="flex flex-center">
    <q-btn @click="openAppRootDir()" label="Open Izzup" no-caps size="xl"></q-btn>
  </q-page>
</template>

<script setup>
//import { ipcRenderer } from 'electron'
// window.izzupAPI.toggleMaximize()

// import { ref } from 'vue'

// const title = ref()

// const openDialog = async () => {
//   window.izzupAPI.openFileDialog ('tester', '/home/brian/izzup')

//   // ipcRenderer.invoke('openDirDialog', 'bester').then((result) => {
//   //   console.log(result)
//   // })
// }


// const setTitle = () => {
//   window.izzupAPI.setTitle (title.value)
// }

const openAppRootDir = () => {
    console.log('Start page open root button clicked')
    window.izzupAPI.openAppRootDir()
}


</script>
