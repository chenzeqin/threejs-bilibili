<script lang="ts" setup>
import { useContainer } from '@/hooks/useContainer';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js';
import { onMounted, onUnmounted } from 'vue';
import { useResizeObserver } from '@vueuse/core';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let orbitControls: OrbitControls;
let axesHelper: THREE.AxesHelper;

const { el, width, height } = useContainer();

const { stop } = useResizeObserver(el, () => {
  renderer.setSize(width.value, height.value);
  camera.aspect = width.value / height.value;
  camera.updateProjectionMatrix();

  renderer.setSize(width.value, height.value);
  resizeShadowMapViewer();
});

/* 基本套路： 创建4要素 */
function initScene() {
  scene = new THREE.Scene();
}

function initCamera() {
  // aspect:宽高比，和renderer大小对应上，否则会变形
  camera = new THREE.PerspectiveCamera(75, width.value / height.value, 0.1, 1000);
  camera.position.set(0, 8, 20);
  camera.lookAt(0, -1, 0); // 指向原点
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width.value, height.value); // canvas 宽高
  renderer.shadowMap.enabled = true; // 开启阴影
  renderer.shadowMap.type = THREE.BasicShadowMap; // 软阴影
  el.value!.appendChild(renderer.domElement); // canvas
}

function initControls() {
  // 视角移动控制
  orbitControls = new OrbitControls(camera, renderer.domElement);
  //controls.update() must be called after any manual changes to the camera's transform
  orbitControls.update();
  // orbitControls.addEventListener('change', render);
}

let directionalLight: THREE.DirectionalLight;
let spotLight: THREE.SpotLight;
function initLight() {
  // HemisphereLight提供了更加自然和真实的光照效果，特别是在模拟户外光照时。
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040);
  hemisphereLight.intensity = 0.3; // 强度
  hemisphereLight.position.set(0, 10, 0);
  scene.add(hemisphereLight);

  // AmbientLight则用于为场景提供一个基础的光照层，它不会产生明显的高光或者阴影，只是让场景中的暗部不那么黑暗。
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // 可以忽略光源距离, 类似太阳光
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.name = 'directionalLight';
  directionalLight.position.set(0, 10, 0);
  directionalLight.shadow.camera.zoom = 2;
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 12;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);

  // spotLight
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.name = 'spotLight';
  spotLight.position.set(10, 10, 5); // 位置
  spotLight.angle = Math.PI / 6; // 光照角度
  spotLight.penumbra = 0.2; // 过渡效果
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 8;
  spotLight.shadow.camera.far = 20;
  scene.add(spotLight);
}

let torusKnot: THREE.Mesh;
let box: THREE.Mesh;
function initMeshes() {
  // 创建环形结
  const geometry = new THREE.TorusKnotGeometry(25, 8, 90, 50); // 大小， 半径 顶点数， 顶点间距
  torusKnot = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 150, specular: 0xffffff })
  );
  torusKnot.castShadow = true;
  torusKnot.receiveShadow = true;
  scene.add(torusKnot);

  torusKnot.position.y = 2;
  torusKnot.scale.multiplyScalar(0.04);

  // box
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  box = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 150, specular: 0xffffff })
  );
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);

  box.position.set(3, 1, 2);

  // floor
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshPhongMaterial({
    opacity: 0.2,
    color: 0xcccccc,
    specular: 0xa0a0a0,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
}

function initHelper() {
  axesHelper = new THREE.AxesHelper(1); // 坐标轴
  scene.add(axesHelper);

  scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
}

let spotLightShadowMapViewer: ShadowMapViewer;
let dirLightShadowMapViewer: ShadowMapViewer;
function initShadowMapViewer() {
  spotLightShadowMapViewer = new ShadowMapViewer(spotLight);
  dirLightShadowMapViewer = new ShadowMapViewer(directionalLight);
  resizeShadowMapViewer();
}

function resizeShadowMapViewer() {
  const size = width.value * 0.2;
  spotLightShadowMapViewer.position.x = 10;
  spotLightShadowMapViewer.position.y = 10;
  spotLightShadowMapViewer.size.width = size;
  spotLightShadowMapViewer.size.height = size;
  spotLightShadowMapViewer.update();

  dirLightShadowMapViewer.position.set(20 + size, 10);
  dirLightShadowMapViewer.size.set(size, size);

  spotLightShadowMapViewer.updateForWindowResize();
  dirLightShadowMapViewer.updateForWindowResize();
}

let animateId: number;
const clock = new THREE.Clock();
// 渲染
function render() {
  animateId = requestAnimationFrame(render);
  renderer.render(scene, camera);

  const delta = clock.getDelta();
  // 转动起来
  torusKnot.rotation.y += 1 * delta;
  torusKnot.rotation.x += 1 * delta;

  box.rotateX(1 * delta);
  box.rotateY(1 * delta);

  // required if controls.enableDamping or controls.autoRotate are set to true
  orbitControls.update();

  spotLightShadowMapViewer.render(renderer);
  dirLightShadowMapViewer.render(renderer);
}

onMounted(async () => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  initLight();
  initMeshes();
  initHelper();
  initShadowMapViewer();
  render();
});

onUnmounted(() => {
  cancelAnimationFrame(animateId);
  renderer.dispose();
  orbitControls.dispose();
  renderer.domElement.remove();

  stop();
});
</script>

<script lang="ts">
export default {
  name: 'ShadowMapViewer',
};
</script>

<template>
  <div
    ref="el"
    h-500px
    class="border-2 border-gray-300"
  ></div>
</template>
