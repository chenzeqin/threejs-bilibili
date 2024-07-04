# spotlight and shadow

## preview

this sample shows how to use spotlight and shadow in three.js

<script setup>
  import Light from './index.vue'
</script>

<Light></Light>

::: tip Summary

- `MeshPhongMaterial` or `MeshStandardMaterial` instead of `MeshBasicMaterial` to support light and reflection.
- `SpotLight` to create a spotlight.
- `castShadow` to enable shadow for the object.
- `receiveShadow` to enable receiving shadow for the object.
- `shadowMap.enabled` to enable shadows.

:::

## create Mesh

::: warning
 using `MeshPhongMaterial` or `MeshStandardMaterial` instead of `MeshBasicMaterial` to support light and reflection.
:::

```typescript
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
  const geometry = new THREE.CylinderGeometry(5, 5, 3, 32);// 上下半径, 高度, 圆柱面数
  const material = new THREE.MeshPhongMaterial({ color: 0x808080 });
  cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(0, 10, 0);
  scene.add(cylinder);
}

```

## create SpotLight

```typescript
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

```

## enable Shadow

```typescript
function initShadows() {
  cylinder.castShadow = true; // 开启物体的阴影
  plane.receiveShadow = true; // 开启接收阴影的物体
  spotLight.castShadow = true; // 开启聚光灯的阴影
  renderer.shadowMap.enabled = true; // 开启阴影
}
```
