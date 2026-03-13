# ShadowMapViewer

## preview

in this example, we will create a shadow map viewer using three.js.

<script setup>
  import ShadowMapViewer from './index.vue'
</script>
<ShadowMapViewer></ShadowMapViewer>

## prepare a scene

First prepare a scene, create objects such as a rotating torus knot etc.create light sources, and enable shadows. This step is not elaborated here.

## create a shadow map viewer

```ts
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js';

function initShadowMapViewer() {
  spotLightShadowMapViewer = new ShadowMapViewer(spotLight);
  dirLightShadowMapViewer = new ShadowMapViewer(directionalLight);
}

function render() {
  // other rendering code...

  spotLightShadowMapViewer.render(renderer);
  dirLightShadowMapViewer.render(renderer);
}
```

## Optimization

update size on container resizing

```ts
function resizeShadowMapViewer() {
  const size = width.value * 0.2;
  spotLightShadowMapViewer.position.x = 10;
  spotLightShadowMapViewer.position.y = 10;
  spotLightShadowMapViewer.size.width = size;
  spotLightShadowMapViewer.size.height = size;
  spotLightShadowMapViewer.update(); // 直接赋值需要调用update

  dirLightShadowMapViewer.position.set(20 + size, 10);
  dirLightShadowMapViewer.size.set(size, size); // 不需要调用update

  spotLightShadowMapViewer.updateForWindowResize();
  dirLightShadowMapViewer.updateForWindowResize();
}

```
