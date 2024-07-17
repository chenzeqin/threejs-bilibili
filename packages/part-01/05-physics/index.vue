<script lang="ts" setup>
import { useContainer } from '@/hooks/useContainer';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, onUnmounted } from 'vue';
// 新版已经移除 oimoPhysics
// import { RapierPhysics } from 'three/examples/jsm/physics/RapierPhysics.js';
import { OimoPhysics as RapierPhysics } from 'three/examples/jsm/physics/OimoPhysics.js';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let orbitControls: OrbitControls;
let axesHelper: THREE.AxesHelper;
let physics: RapierPhysics;

const { el, width, height } = useContainer();

/* 基本套路： 创建4要素 */
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);
}

function initCamera() {
  // aspect:宽高比，和renderer大小对应上，否则会变形
  camera = new THREE.PerspectiveCamera(75, width.value / height.value, 0.1, 1000);
  camera.position.set(0, 3, 3);
  camera.lookAt(0, 0, 0); // 指向原点
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio); // 高清屏
  renderer.outputEncoding = THREE.sRGBEncoding;
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
  // const hemisphereLight = new THREE.HemisphereLight(0xdddddd, 0x404040);
  // hemisphereLight.intensity = 0.5; // 强度
  // hemisphereLight.position.set(0, 10, 0);
  // scene.add(hemisphereLight);

  // AmbientLight则用于为场景提供一个基础的光照层，它不会产生明显的高光或者阴影，只是让场景中的暗部不那么黑暗。
  const ambientLight = new THREE.AmbientLight(0xdddddd, 0.5);
  scene.add(ambientLight);

  // 可以忽略光源距离, 类似太阳光
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(3, 3, 3);
  scene.add(directionalLight);

  // 如果模拟路灯, 使用spotlight
}

let boxes: THREE.InstancedMesh;
let balls: THREE.InstancedMesh;
let floor: THREE.Mesh;
function initMeshes() {
  const box = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const material = new THREE.MeshLambertMaterial(); // 木头材质
  boxes = new THREE.InstancedMesh(box, material, 100);

  // set random position and random color
  const matrix4 = new THREE.Matrix4();
  const color = new THREE.Color();
  for (let i = 0; i < boxes.count; i++) {
    matrix4.setPosition(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5); // random position
    color.setHex(0xffffff * Math.random()); // random color
    boxes.setMatrixAt(i, matrix4);
    boxes.setColorAt(i, color);
  }

  // 优化性能（效果肉眼看不出）
  boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(boxes);

  const ball = new THREE.IcosahedronGeometry(0.1, 3);
  const material2 = new THREE.MeshLambertMaterial(); // 木头材质
  balls = new THREE.InstancedMesh(ball, material2, 100);

  // set random position and random color
  for (let i = 0; i < balls.count; i++) {
    matrix4.setPosition(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5); // random position
    color.setHex(0xffffff * Math.random()); // random color
    balls.setMatrixAt(i, matrix4);
    balls.setColorAt(i, color);
  }

  // 优化性能（效果肉眼看不出）
  balls.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(balls);

  // 添加地板
  floor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.4, 10),
    new THREE.ShadowMaterial({ color: 0x333333 }) // 专门用于接受影子的材料, 颜色可以随意
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

// 添加物理属性
async function enabledPhysics() {
  physics = await RapierPhysics();
  // 添加物理对象
  physics.addMesh(floor);
  physics.addMesh(balls, 1);
  physics.addMesh(boxes, 1);
}

let animateId: number;
var position: THREE.Vector3 = new THREE.Vector3();
// 渲染
function render() {
  animateId = requestAnimationFrame(render);
  renderer.render(scene, camera);

  // required if controls.enableDamping or controls.autoRotate are set to true
  orbitControls.update();

  // 重新设置位置
  const index = Math.floor(Math.random() * boxes.count);
  position.set(0, Math.random() * 2, 0); // random position
  physics.setMeshPosition(boxes, position, index);

  const index2 = Math.floor(Math.random() * boxes.count);
  position.set(0, Math.random() * 2, 0); // random position
  physics.setMeshPosition(balls, position, index2);
}

onMounted(async () => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  // initHelper();
  initLight();
  initMeshes();
  enabledShadow();
  await enabledPhysics();
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
