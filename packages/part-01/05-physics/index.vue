<script lang="ts" setup>
import { useContainer } from '@/hooks/useContainer';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, onUnmounted } from 'vue';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let orbitControls: OrbitControls;
let axesHelper: THREE.AxesHelper;

const { el, width, height } = useContainer();

/* 基本套路： 创建4要素 */
function initScene() {
  scene = new THREE.Scene();
}

function initCamera() {
  // aspect:宽高比，和renderer大小对应上，否则会变形
  camera = new THREE.PerspectiveCamera(75, width.value / height.value, 0.1, 1000);
  camera.position.set(0, 3, 3);
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

function initHelper() {
  axesHelper = new THREE.AxesHelper(1); // 坐标轴
  scene.add(axesHelper);
}
let directionalLight: THREE.DirectionalLight;
function initLight() {
  // HemisphereLight提供了更加自然和真实的光照效果，特别是在模拟户外光照时。
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040);
  hemisphereLight.intensity = 0.5; // 强度
  hemisphereLight.position.set(0, 10, 0);
  scene.add(hemisphereLight);

  // AmbientLight则用于为场景提供一个基础的光照层，它不会产生明显的高光或者阴影，只是让场景中的暗部不那么黑暗。
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  // 可以忽略光源距离, 类似太阳光
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(0, 3, 0);
  scene.add(directionalLight);

  // 如果模拟路灯, 使用spotlight
}

let count = 100;
let boxes: THREE.InstancedMesh;
let floor: THREE.Mesh;
const color = new THREE.Color();
function initMeshes() {
  const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const meterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: false,
  });

  boxes = new THREE.InstancedMesh(geometry, meterial, count);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    matrix.setPosition(Math.random() * 1, Math.random() * 1, Math.random() * 1);
    boxes.setMatrixAt(i, matrix);
    boxes.setColorAt(i, color.setHex(0xffffff * Math.random()));
  }

  scene.add(boxes);

  // 添加地板
  floor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.4, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );

  floor.position.set(0, -1, 0);
  scene.add(floor);
}

function enabledShadow() {
  boxes.castShadow = true;
  floor.receiveShadow = true;
  renderer.shadowMap.enabled = true;
  directionalLight.shadow.camera.zoom = 2;
  directionalLight.castShadow = true;
}

let animateId: number;
// 渲染
function render() {
  animateId = requestAnimationFrame(render);
  renderer.render(scene, camera);

  // required if controls.enableDamping or controls.autoRotate are set to true
  orbitControls.update();
}

onMounted(() => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  initHelper();
  initLight();
  initMeshes();
  enabledShadow();
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
  name: 'Physics',
};
</script>

<template>
  <div
    ref="el"
    h-500px
    class="border-2 border-gray-300"
  ></div>
</template>
