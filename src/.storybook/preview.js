// 使用しているライブラリの相性(とくに Inertia.js)などによっては resources/js/app.js を読み込んだらエラーが発生する可能性がある
// 2 重管理になってしまうが、Storybook 起動に必要な行だけコピペしてくる
import { app } from "@storybook/vue3"
import PrimeVue from "primevue/config"

app.use(PrimeVue, {
  ripple: true, // ボタンなどのアニメーション
  inputStyle: "outlined", // input の枠線の見せ方。filled だと disabled との区別がわかりにくいので outlined を使用する
})

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// js から Laravel のルーティングを参照するためのライブラリ tightenco/ziggy の helper をダミーで実装しておく
window.route = () => "dummy"
