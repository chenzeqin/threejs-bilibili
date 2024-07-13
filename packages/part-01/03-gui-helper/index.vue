/* 创建一个有影子的物体 */
<script lang="ts" setup>
import * as THREE from 'three';
import { onMounted, onUnmounted } from 'vue';
import { useContainer } from '../../hooks/useContainer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene: THREE.Scene,
  spotLight: THREE.SpotLight,
  cylinder: THREE.Mesh,
  plane: THREE.Mesh,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  axesHelper: THREE.AxesHelper,
  orbitControls: OrbitControls;

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

// 环境光会均匀的照亮场景中的所有物体。
// 环境光不能用来投射阴影，因为它没有方向。
function initAmbientLight() {
  const light = new THREE.AmbientLight(0x404040); // 柔和的白光
  scene.add(light);
}

// 聚光灯
// 默认照向原点，也可以设置target, 照射具体Mesh
function initSpotLight() {
  spotLight = new THREE.SpotLight(0xffffff, 0.2);
  spotLight.position.set(-50, 80, 0); // 位置
  spotLight.angle = Math.PI / 6; // 光照角度
  spotLight.penumbra = 0.2; // 过渡效果
  spotLight.castShadow = true;

  scene.add(spotLight);
}

/* 创建物体 */
// 注意：反光材料需要设置灯光才能看到效果
function initMeshes() {
  // 一个平面
  const planeGeometry = new THREE.PlaneGeometry(1000, 800);
  // fix: 使用MeshPhongMaterial或MeshStandardMaterial而不是基本的MeshBasicMaterial
  // 这些材质类型支持光照和反射。
  const material1 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  plane = new THREE.Mesh(planeGeometry, material1);
  plane.rotateX(-Math.PI / 2); // 绕x轴旋转90度
  plane.position.set(0, -10, 0);
  scene.add(plane);

  // 一个柱子
  const geometry = new THREE.CylinderGeometry(5, 5, 3, 32); // 上下半径, 高度, 圆柱面数
  const material = new THREE.MeshPhongMaterial({ color: 0x808080 });
  cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(0, 10, 0);
  scene.add(cylinder);
}

// 默认是关闭的, 因为需要消耗性能
function initShadows() {
  cylinder.castShadow = true; // 开启物体的阴影
  plane.receiveShadow = true; // 开启接收阴影的物体
  spotLight.castShadow = true; // 开启聚光灯的阴影
  renderer.shadowMap.enabled = true; // 开启阴影
}

/* 其他配套 */
function initHelpers() {
  axesHelper = new THREE.AxesHelper(30); // 坐标轴
  scene.add(axesHelper);
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
  initAmbientLight();
  initSpotLight();
  initMeshes();
  initShadows();
  initHelpers();
  initControls();
  render();
});

onUnmounted(() => {
  cancelAnimationFrame(animateId);
  renderer.dispose();
  orbitControls.dispose();
  cylinder.geometry.dispose();
  plane.geometry.dispose();
  spotLight.dispose();
  axesHelper.dispose();
  renderer.domElement.remove();
});
</script>

<script lang="ts">
export default {
  name: 'Light',
};
</script>

<template>
  <div
    ref="el"
    h-500px
    class="border-2 border-gray-300"
  ></div>
</template>
