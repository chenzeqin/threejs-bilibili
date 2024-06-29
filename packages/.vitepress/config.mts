import { defineConfig } from 'vitepress';
import UnoCSS from 'unocss/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // vite: {
  //   plugins: [
  //     UnoCSS(), // 这里引入 UnoCSS 插件
  //   ],
  // },

  title: 'threejs-bilibili',
  description: 'threejs-bilibili',


  themeConfig: {
    outline: {
      level: [2, 3],
      label: '目录',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '第一部分',
        items: [
          { text: 'hello threejs', link: '/part-01/01-hello-threejs/README' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
