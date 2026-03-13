# Phisycs

## preview

This example demonstrates how to use a physics engine to simulate the effects of collisions between several objects.

<script setup>
  import Physics from './index.vue'
</script>
<Physics></Physics>

## create boxes

```ts
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
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );

  floor.position.set(0, -1, 0);
  scene.add(floor);
}

```

## enable shadow

```ts
boxes.castShadow = true;
floor.receiveShadow = true;
renderer.shadowMap.enabled = true;
directionalLight.shadow.camera.zoom = 2;
directionalLight.castShadow = true;
```

## enanble physics

```ts
// 新版已经移除 oimoPhysics
// import { RapierPhysics } from 'three/examples/jsm/physics/RapierPhysics.js';
import { OimoPhysics as RapierPhysics } from 'three/examples/jsm/physics/OimoPhysics.js';
// 添加物理属性
async function enabledPhysics() {
  physics = await RapierPhysics();
  physics.addMesh(floor);
  physics.addMesh(balls, 1);
  physics.addMesh(boxes, 1);
}
```

## update position

```ts
var position: THREE.Vector3 = new THREE.Vector3();
// 渲染
function render() {
  // ...

  // 重新设置位置
  const index = Math.floor(Math.random() * boxes.count);
  position.set(0, Math.random() * 2, 0); // random position
  physics.setMeshPosition(boxes, position, index);

  const index2 = Math.floor(Math.random() * boxes.count);
  position.set(0, Math.random() * 2, 0); // random position
  physics.setMeshPosition(balls, position, index2);
}

```

::: tip usefull links
<https://sbcode.net/threejs/physics-rapier/>
:::
