<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { onMounted } from 'vue';
import { useContainer } from '../../hooks/useContainer';

let scene: THREE.Scene,
  cube: THREE.Mesh,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  axesHelper: THREE.AxesHelper,
  orbitControls: OrbitControls;

const { el, width, height } = useContainer();

function init() {
  /* step1: 创建场景 scene */
  scene = new THREE.Scene();

  /* step2: 创建相机 camera */
  /*
  @remarks — Together these define the camera's viewing frustum.
  @param fov — Camera frustum vertical field of view. Default 50.
  @param aspect — Camera frustum aspect ratio. Default 1.
  @param near — Camera frustum near plane. Default 0.1.
  @param far — Camera frustum far plane. Default 2000.
  */
  camera = new THREE.PerspectiveCamera(75, width.value / height.value, 0.1, 1000);
  // 默认z轴垂直于屏幕，需要移动一下camera position
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 5;

  // 2.1 添加参考坐标轴
  axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  /* step3: 创建物体，并添加到场景中 */
  // 立方体，参数分别为 width、height、depth
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  // 材质
  const material = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
  });
  // 物体
  cube = new THREE.Mesh(geometry, material);
  // 添加到场景
  scene.add(cube);

  /* step4: 创建renderer */
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width.value, height.value);
  el.value!.appendChild(renderer.domElement); // canvas

  // 4.1 Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。
  orbitControls = new OrbitControls(camera, renderer.domElement);
  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(0, 20, 100);
  orbitControls.update();
}

// 渲染
function render() {
  // 下一个空闲时间片执行
  requestAnimationFrame(render);

  // console.info('render')
  renderer.render(scene, camera);
  // cube.rotation.y += 0.01;

  // required if controls.enableDamping or controls.autoRotate are set to true
  orbitControls.update();
}

onMounted(() => {
  init();
  render();
});
</script>

<script lang="ts">
export default {
  name: 'Helloword',
};
</script>

<template>
  <div
    ref="el"
    h-500px
    class="border-2 border-gray-300"
  ></div>
</template>
