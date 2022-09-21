// Laravel Mix 側で色々設定する場合に、Storybook 側で設定を引き継げるように別ファイルに切り出しておく
const path = require("path")

module.exports = {
  resolve: {
    alias: {
      "@css": path.resolve("resources/css"),
      "@js": path.resolve("resources/js"),
    },
  },
}
