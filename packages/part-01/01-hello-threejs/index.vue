<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue';
import { useContainer } from '../../hooks/useContainer'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer

const {el, width, height } = useContainer()

function init(){
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, width.value / height.value, 0.1, 1000)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width.value, height.value)
  el.value?.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  render()
}

const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

onMounted(()=>{
  init()
})


</script>

<script lang="ts">
export default {
  name: 'Helloword'
}
</script>

<template>
  <div ref="el" clsss="h-200px w-200px bg-gray-300">hello</div>
</template>
