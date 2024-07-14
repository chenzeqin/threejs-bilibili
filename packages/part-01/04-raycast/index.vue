<script lang="ts" setup>
import { useContainer } from '@/hooks/useContainer';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, onUnmounted } from 'vue';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let orbitControls: OrbitControls;

const { el, width, height } = useContainer();

/* 基本套路： 创建4要素 */
function initScene() {
  scene = new THREE.Scene();
}
function initCamera() {
  // aspect:宽高比，和renderer大小对应上，否则会变形
  camera = new THREE.PerspectiveCamera(75, width.value / height.value, 0.1, 1000);
  camera.position.set(0, 50, 100);
  camera.lookAt(0, 0, 0); // 指向原点
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width.value, height.value); // canvas 宽高
  el.value!.appendChild(renderer.domElement); // canvas
}

function initControls() {
  // 视角移动控制
  orbitControls = new OrbitControls(camera, renderer.domElement);
  //controls.update() must be called after any manual changes to the camera's transform
  orbitControls.update();
  // orbitControls.addEventListener('change', render);
}

let animateId: number;
// 渲染
function render() {
  // 下一个空闲时间片执行
  animateId = requestAnimationFrame(render);

  // console.info('render')
  renderer.render(scene, camera);
  // cube.rotation.y += 0.01;

  // required if controls.enableDamping or controls.autoRotate are set to true
  orbitControls.update();
}

onMounted(() => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  render();
});

onUnmounted(() => {
  cancelAnimationFrame(animateId);
  renderer.dispose();
  orbitControls.dispose();
  renderer.domElement.remove();
});
</script>

<script lang="ts">
export default {
  name: 'RayCasy',
};
</script>

<template>
  <div
    ref="el"
    h-500px
    class="border-2 border-gray-300"
  ></div>
</template>
