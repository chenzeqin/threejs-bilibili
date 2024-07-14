# InstancedMesh and Raycaster

## preview

this sample shows how to use raycast in three.js

<script setup>
  import Raycast from './index.vue'
</script>
<Raycast></Raycast>

## create InstancedMesh

create `10 * 10 * 10` IcosahedronGeometry

```ts
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

  scene.add(meshes);
}

```

## update mouse vector

update mouse vector on mouse move

```ts
let mouse = new THREE.Vector2(1, 1); // 默认是0, 0
renderer.domElement.addEventListener('mousemove', (e) => {
// y轴向上 (0, 0) ~ (1, 1)
mouse.x = (e.offsetX / renderer.domElement.clientWidth) * 2 - 1;
mouse.y = -(e.offsetY / renderer.domElement.clientHeight) * 2 + 1; // y 坐标轴向上
});

```

## raycaster

get intersects from mouse vector, and get the first intersect object

```ts
let raycaster: THREE.Raycaster = new THREE.Raycaster();
let color = new THREE.Color();

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
}

```
