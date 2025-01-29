<template>
  <q-page class="flex flex-center">
    <q-btn @click="openContentDir()" label="Open Izzup" no-caps size="xl"></q-btn>

    <q-btn @click="openFile()" label="Open Izzup" no-caps size="xl"></q-btn>
    File path: <strong id="filePath"></strong>

    Current value: <strong id="counter">0</strong>
  </q-page>
</template>

<script setup>
//import { ipcRenderer } from 'electron'
// window.izzupAPI.toggleMaximize()

import { ref } from 'vue'

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

const filePath = ref()
// const counter = ref()

const openContentDir = () => {
    console.log('Start page open root button clicked')
    window.izzupAPI.openContentDir()
}

const openFile = async () => {
  filePath.value = await window.izzupAPI.openFile()
  console.log(filePath.value) 
}

window.izzupAPI.onOpenContentDir((value) => {
 console.log('CONTERNT DIR', value)
})

// const onContentDirUpdated = (value) => {
//   console.log(`DIR AVLUE: ${value}`)
// }

// const onUpdateCounter = async () => {
//   filePath.value = await window.izzupAPI.openFile()
//   console.log(counter.value) 
// }


</script>
