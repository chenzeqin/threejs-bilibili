# Phisycs

## preview

This example demonstrates how to use a physics engine to simulate the effects of collisions between several objects.

<script setup>
  import Physics from './index.vue'
</script>
<Physics></Physics>

## create boxes

```ts

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
