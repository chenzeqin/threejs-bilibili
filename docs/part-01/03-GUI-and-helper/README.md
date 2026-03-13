# GUI and helper

## preview

this sample shows how to use gui-helper in three.js
<script setup>
  import GUIAndHelper from './index.vue'
  </script>

  <GUIAndHelper></GUIAndHelper>

::: tip First step
 copy previous chapter code
:::

## SpotlightHelper

```ts
function initSpotLightHelper() {
  spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
}
```

## GUI

### install

```bash
npm install dat.gui --save-dev
npm install @types/dat.gui --save-dev
```

### usage

```ts
function buildGui() {
  gui = new GUI();
  const spotLightFolder = gui.addFolder('SpotLight');
  spotLightFolder.addColor(spotLight, 'color').onChange(function (val) {
    spotLight.color = val;
    // console.warn(typeof spotLight.color.set);
    // console.log(spotLight.color, val); // an Object like {r,g,b}
    render();
  });
  spotLightFolder.add(spotLight, 'angle', 0, Math.PI).onChange((angle) => {
    spotLight.angle = angle;
    spotLightHelper.update();
    render();
  });
  spotLightFolder.add(spotLight, 'penumbra', 0, 1).onChange((penumbra) => {
    spotLight.penumbra = penumbra;
    spotLightHelper.update();
    render();
  });
  spotLightFolder.open();

  const cameraFolder = gui.addFolder('Camera');
  cameraFolder
    .add(camera.position, 'y', 10, 1000)
    .step(1)
    .onChange((y) => {
      camera.position.y = y;
      spotLightHelper.update();
      render();
    });

  // update container style
  gui.domElement.parentElement!.style.zIndex = '1000';
  gui.domElement.parentElement!.style.top = '100px';
}
```

::: tip useful links

- <https://threejs.org/docs/#api/zh/helpers/SpotLightHelper>
- <https://sbcode.net/threejs/dat-gui/>
- <https://github.com/dataarts/dat.gui>
:::
