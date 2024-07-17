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

function initHelper() {
  axesHelper = new THREE.AxesHelper(30); // 坐标轴
  scene.add(axesHelper);
}

function initLight() {
  const ambientLight = new THREE.HemisphereLight(0xffffff, 0x404040);
  ambientLight.position.set(0, 10, 0);
  scene.add(ambientLight);
}

let amount = 10;
let count = Math.pow(amount, 3); // 10*10*10个小球
let meshes: THREE.InstancedMesh;
const defaultColor = new THREE.Color().setHex(0xffffff);
function initMeshes() {
  const geometry = new THREE.IcosahedronGeometry(0.5, 1); // 正20面体
  const meterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: false,
  });

  // 10*10*10个小球
  meshes = new THREE.InstancedMesh(geometry, meterial, count);
  let index = 0; // 小球标识
  const offset = (amount - 1) / 2; // 偏移量
  const matrix = new THREE.Matrix4();

  // 小球组成立方体 10 * 10 * 10, 需要3层循环
  for (let i = 0; i < amount; i++) {
    for (let j = 0; j < amount; j++) {
      for (let k = 0; k < amount; k++) {
        matrix.setPosition(i - offset, j - offset, k - offset);
        meshes.setMatrixAt(index, matrix);
        meshes.setColorAt(index, defaultColor);
        index++;
      }
    }
  }

  // 优化性能（效果肉眼看不出）
  meshes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  
  scene.add(meshes);
}

let animateId: number;
let raycaster: THREE.Raycaster = new THREE.Raycaster();
let color = new THREE.Color();
// 渲染
function render() {
  animateId = requestAnimationFrame(render);
  renderer.render(scene, camera);

  // Updates the ray with a new origin and direction.
  raycaster.setFromCamera(mouse, camera);

  const intersections = raycaster.intersectObject(meshes);
  if (intersections.length) {
    // 拿出第一个, 修改颜色
    const instanceId = intersections[0].instanceId;
     // 获取颜色, 用来判断是否是默认颜色
    meshes.getColorAt(instanceId!, color);
    // 当前颜色是默认颜色才修改颜色，防止重复修改，效果出现闪烁
    if (color.equals(defaultColor)) {
      meshes.setColorAt(instanceId!, color.setHex(Math.random() * 0xffffff));
      meshes.instanceColor!.needsUpdate = true;
    }
  }

  // required if controls.enableDamping or controls.autoRotate are set to true
  orbitControls.update();
}

let mouse = new THREE.Vector2(1, 1); // 默认是0, 0

onMounted(() => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  initHelper();
  initLight();
  initMeshes();
  render();

  renderer.domElement.addEventListener('mousemove', (e) => {
    // y轴向上 (0, 0) ~ (1, 1)
    mouse.x = (e.offsetX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.offsetY / renderer.domElement.clientHeight) * 2 + 1; // y 坐标轴向上
  });
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
