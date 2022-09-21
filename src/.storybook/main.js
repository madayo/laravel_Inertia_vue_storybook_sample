const path = require('path')
const defaultWebpackConfig = require('../webpack.config.js')

module.exports = {
  // コンポーネント js ファイルと同階層に xxxxxx.stories.js などの命名をしていく
  stories: ["../resources/js/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  staticDirs: ['../public'],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  webpackFinal: async (config) => {
    // Storybook 時に Laravel Mix を組み合わせることが難しかったので、Laravel Mix が自動で行っている設定を明示的に行う必要がある
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../')
    })
    // Laravel Mix 側で使用している webpack.config.js の内容をマージする
    config.resolve.alias = {
      ...config.resolve.alias,
      ...defaultWebpackConfig.resolve.alias
    }
    return config
  },
}
