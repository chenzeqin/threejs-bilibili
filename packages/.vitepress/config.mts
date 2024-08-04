import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'threejs-bilibili',
  description: 'threejs-bilibili',
  // 其他配置...
  head: [
    ['link', { rel: 'icon', href: '/favicon_white.ico', media: '(prefers-color-scheme: dark)' }],
    ['link', { rel: 'icon', href: '/favicon.ico', media: '(prefers-color-scheme: light)' }],
  ],

  themeConfig: {
    outline: {
      level: [2, 3],
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'part-01',
        items: [
          { text: 'Hello Threejs', link: '/part-01/01-hello-threejs/README' },
          { text: 'spotlight and shadow', link: '/part-01/02-light/README' },
          { text: 'GUI and helper', link: '/part-01/03-GUI-and-helper/README' },
          { text: 'InstancedMesh and Raycaster', link: '/part-01/04-raycast/README' },
          { text: 'Physics', link: '/part-01/05-physics/README' },
          { text: 'ShadowMapViewer', link: '/part-01/06-shadowMapViewer/README' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
