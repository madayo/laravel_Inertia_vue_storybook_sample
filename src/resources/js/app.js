import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/inertia-vue3'
import PrimeVue from "primevue/config"

createInertiaApp({
  resolve: name => require(`./Pages/${name}`),
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(PrimeVue, {
        ripple: true, // ボタンなどのアニメーション
        inputStyle: "outlined", // input の枠線の見せ方。filled だと disabled との区別がわかりにくいので outlined を使用する
      })
      .mount(el)
  },
})
