# setup three.js

## preview

this simple example shows how to create a simple cube in three.js and add some animation effects using the OrbitControls and requestAnimationFrame APIs.

<script setup>
  import HelloWorld from './index.vue'
</script>

<HelloWorld></HelloWorld>

## install

```bash
# 安装
pnpm i three
# 安装ts类型文件
pnpm i --save-dev @types/three
```

## create a scene

Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras.

```typescript
import * as Three from 'three';

// create a scene
const scene = new Three.Scene();
```

## create a camera

Cameras define where the scene is viewed from. You can create different types of cameras such as PerspectiveCamera, OrthographicCamera, and CubeCamera.

```typescript
// create a camera
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
```

### camera parameters

- fov: field of view, the angle between the top and bottom of the view frustum
- aspect: the aspect ratio of the view, defined as the width divided by the height  
- near: the distance of the near clipping plane from the camera
- far: the distance of the far clipping plane from the camera

## create a renderer

A renderer is responsible for rendering the scene to the canvas. You can create different types of renderers such as WebGLRenderer, CanvasRenderer, and SVGRenderer.

```typescript
// create a renderer
const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

### renderer parameters

- canvas: the canvas element to which the renderer will render
- alpha: whether the canvas should have an alpha channel
- antialias: whether to perform antialiasing
- precision: the precision of the renderer, either 'highp', 'mediump', or 'lowp'
- preserveDrawingBuffer: whether to preserve the contents of the canvas between renders

## create a cube

A cube is a basic shape in three.js. You can create a cube by creating a new instance of the CubeGeometry class and a new instance of the MeshBasicMaterial class.

```typescript
// create a cube
const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Three.Mesh(geometry, material);
scene.add(cube);
```

### cube parameters

- width: the width of the cube
- height: the height of the cube
- depth: the depth of the cube
- widthSegments: the number of segments along the width of the cube
- heightSegments: the number of segments along the height of the cube
- depthSegments: the number of segments along the depth of the cube

## interaction

After completing the above steps, we have only created a simple cube. Next, we need to add some animation effects, such as rotation, scaling, and translation.

### OrbitControls

OrbitControls is a built-in three.js class that allows you to `control the camera` using the mouse or touch screen.

```typescript
 // 4.1 Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。
  orbitControls = new OrbitControls(camera, renderer.domElement);
  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(0, 20, 100);
  orbitControls.update();
```

### Animation

To add animation effects, we can use the requestAnimationFrame API. This method tells the browser to execute a specified function at the next repaint.

```typescript
// 4.2 Animation（动画）
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
```

## AxesHelper

AxesHelper is a built-in three.js class that can be used to visualize the axes of a coordinate system.

```typescript
  const axesHelper = new Three.AxesHelper(5); // 5 is the length of the axes
  scene.add(axesHelper);
```

::: tip
x: red, y: green, z: blue
x: vertical, y: horizontal, z: depth (vertical to screen)
:::
