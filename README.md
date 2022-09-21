<!-- TOC -->

- [Laravel * Inertia.js * Vue 環境に Storybook を導入するサンプル](#laravel--inertiajs--vue-環境に-storybook-を導入するサンプル)
- [環境](#環境)
- [起動方法](#起動方法)
    - [webpack によるビルド, Storybook 起動](#webpack-によるビルド-storybook-起動)
- [ホスト OS のポート](#ホスト-os-のポート)
- [ソースコード、作業手順解説](#ソースコード作業手順解説)
    - [Laravel](#laravel)
        - [フロント全般](#フロント全般)
            - [Vite ではなく Webpack を使う](#vite-ではなく-webpack-を使う)
            - [Inertia.js, CSS フレームワーク](#inertiajs-css-フレームワーク)
                - [Inertia.js](#inertiajs)
                - [PrimeVue](#primevue)
    - [Storybook](#storybook)
        - [Storybook カスタマイズしていく](#storybook-カスタマイズしていく)
    - [小ネタ](#小ネタ)
        - [Laravel Mix でビルドした css, js などを Storybook の 6006 ポートアクセス時に読み込ませたい](#laravel-mix-でビルドした-css-js-などを-storybook-の-6006-ポートアクセス時に読み込ませたい)
        - [Storybook のエクスポート時に Laravel の `php artisan storage:link` が邪魔になる](#storybook-のエクスポート時に-laravel-の-php-artisan-storagelink-が邪魔になる)
    - [いい対策が見つかっていない問題など](#いい対策が見つかっていない問題など)
        - [Laravel 側は LaravelMix, Storybook 側は Webpack とビルド方法が微妙に違う](#laravel-側は-laravelmix-storybook-側は-webpack-とビルド方法が微妙に違う)
        - [Inertia.js 固有の機能、設定を Storybook でうまく動かせない](#inertiajs-固有の機能設定を-storybook-でうまく動かせない)
        - [Storybook ファイルごとに読み込む css を変えたい](#storybook-ファイルごとに読み込む-css-を変えたい)

<!-- /TOC -->

---

# Laravel * Inertia.js * Vue 環境に Storybook を導入するサンプル

# 環境

Docker Compose。

|項目|バージョン|補足|
|--|--|--|
|PHP|php:8.1.6-fpm-alpine||
|Laravel|9.3.8|作業時点での最新|
|composer|composer:2.3.5|PHP 8.1 を使うバージョンにしておく必要があるので、マイナーバージョンも指定している|
|node|18.2.0||
|nginx|nginx:1.21.6-alpine||

# 起動方法

起動するだけなら以下のコマンドを一通り実施すればOKです。

```sh
$ cp .env.example .env
$ docker-compose up -d
$ docker-compose run --rm node npm install
##### Laravel のセットアップ
$ docker-compose exec php ash -c 'composer install && cp .env.example .env && php artisan key:generate'
##### フロントのセットアップ
### Laravel Mix の実行
$ docker-compose run --rm node npm run dev
$
### Storybook 起動
$ docker-compose run --rm --service-ports node npm run storybook
### Laravel
### --> http://localhost/inertia
### Storybook
### --> http://localhost:6006
```

以降は細かい解説です。

## webpack によるビルド, Storybook 起動

ビルドのときだけ起動して、コマンドが終了したら削除しています。

```sh
$ docker-compose run --rm node npm install
# 開発用ビルド
$ docker-compose run --rm node npm run dev
# もしくは
# $ docker-compose run --rm node npm run watch
#
# storybook 起動
$ docker-compose run --rm --service-ports node npm run storybook
```

# ホスト OS のポート

.env でホスト OS のポートは自由に指定可能です。

# ソースコード、作業手順解説

実際に動くソースコードは GitHub にありますが、他のプロジェクトでも同様の設定を利用する用に、
どんな手順でインストールや修正を進めていったのか？を解説します。

## Laravel

インストール直後の状況に
/inertia
という Inertia.js と PrimeVue を利用しているだけのサンプル画面を追加しています。
それ以外は何も変更していません。

### フロント全般

#### Vite ではなく Webpack を使う

最新の Laravel ではフロントエンドのビルドに Vite を使うようになっていますが、まだ Vite には慣れていなかったので Webpack を使用しています。
[公式のマイグレーションガイド](https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md#migrating-from-laravel-mix-to-vite)があるのでそちらに従って作業しました。

#### Inertia.js, CSS フレームワーク

通常の開発では何らかの CSS フレームワークなどを使用するはずです。
今回は PrimeVue を使用しています。

##### Inertia.js

[公式](https://inertiajs.com/)の手順に従います。ほかに特別なことはしていません。
```sh
$ docker-compose exec php ash
$ composer require inertiajs/inertia-laravel
$ php artisan inertia:middleware
```
```sh
$ docker-compose run --rm node npm install -D @inertiajs/inertia @inertiajs/inertia-vue3
```

続いて以下のファイルの作成、修正を行います。

- 動作確認用の blade を用意
    - resources/views/app.blade.php
        ```html
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />
            <script src="{{ mix('/js/app.js') }}" defer></script>
            @inertiaHead
        </head>
        <body>
            @inertia
        </body>
        </html>
        ```
- Inertia.js 用の Middleware の適用
    - app/Http/Kernel.php
        ```diff
             \Illuminate\View\Middleware\ShareErrorsFromSession::class,
             \App\Http\Middleware\VerifyCsrfToken::class,
             \Illuminate\Routing\Middleware\SubstituteBindings::class,
        +    \App\Http\Middleware\HandleInertiaRequests::class,
        ```
- 動作確認用のルーティング
    - routes/web.php
        ```diff
        +    Route::get('inertia', function () {
        +        return \Inertia\Inertia::render('Sample');
        +    });
        ```
- inertia.js の初期化
    - resources/js/app.js
        ```diff
        -import './bootstrap';
        +import { createApp, h } from 'vue'
        +import { createInertiaApp } from '@inertiajs/inertia-vue3'
        +
        +createInertiaApp({
        +  resolve: name => require(`./Pages/${name}`),
        +  setup({ el, App, props, plugin }) {
        +    createApp({ render: () => h(App, props) })
        +      .use(plugin)
        +      .mount(el)
        +  },
        +})
        ```
- 動作確認用の Vue ファイル
    - resources/js/Pages/Sample.vue
        ```html
            <template>
                <div>
                    <p>これはサンプルページです。</p>
                </div>
            </template>

            <style scoped>
            div {
                margin: 3rem;
            }
            </style>
        ```
    - webpack.mix.js
        ```js
        const mix = require("laravel-mix");

        mix
            .js("resources/js/app.js", "public/js")
            .vue()
            .postCss("resources/css/app.css", "public/css", [
                //
            ])
            .webpackConfig(require("./webpack.config"))
        ```

最後にビルドして
```sh
$ docker-compose run --rm node npm run dev
```
/inertia の画面がエラーなく表示されることを確認します。

##### PrimeVue

[PrimeVue](https://www.primefaces.org/primevue/setup) の手順に従います。

```sh
$ docker-compose run --rm node npm install -D primevue@^3.17.0 primeicons
```

続いて以下のファイルの作成、修正を行います。

- PrimeVue の初期化
    - resources/css/app.css
        ```css
        /* free theme 一覧 https://www.primefaces.org/primevue/setup */
        @import "primevue/resources/themes/saga-green/theme.css";
        @import "primevue/resources/primevue.min.css";
        @import "primeicons/primeicons.css";
        ```
    - resources/js/app.js
        ```diff
        import { createApp, h } from 'vue'
        import { createInertiaApp } from '@inertiajs/inertia-vue3'
        +import PrimeVue from "primevue/config"

        createInertiaApp({
            resolve: name => require(`./Pages/${name}`),
            setup({ el, App, props, plugin }) {
                createApp({ render: () => h(App, props) })
                .use(plugin)
        +      .use(PrimeVue, {
        +        ripple: true, // ボタンなどのアニメーション
        +        inputStyle: "outlined", // input の枠線の見せ方。filled だと disabled との区別がわかりにくいので outlined を使用する
        +      })
                .mount(el)
            },
        })
        ```
- 動作確認用の Vue ファイルで PrimeVue 関連のコンポーネントを読み込ませる
    - resources/js/Pages/Sample.vue
        ```diff
        +<script setup>
        +import PVButton from 'primevue/button';
        +</script>
        +
        <template>
        -  <div>
        +  <div class="wrapper">
            <p>これはサンプルページです。</p>
        +   <h5>Severities</h5>
        +   <div class="row">
        +       <p-v-button label="Primary"></p-v-button>
        +       <p-v-button label="Secondary" class="p-button-secondary"></p-v-button>
        +       <p-v-button label="Success" class="p-button-success"></p-v-button>
        +       <p-v-button label="Info" class="p-button-info"></p-v-button>
        +       <p-v-button label="Warning" class="p-button-warning"></p-v-button>
        +       <p-v-button label="Help" class="p-button-help"></p-v-button>
        +       <p-v-button label="Danger" class="p-button-danger"></p-v-button>
        +   </div>
        +
        +   <h5>Rounded Buttons</h5>
        +   <div class="row">
        +       <p-v-button label="Primary" class="p-button-rounded"></p-v-button>
        +       <p-v-button label="Secondary" class="p-button-rounded p-button-secondary"></p-v-button>
        +       <p-v-button label="Success" class="p-button-rounded p-button-success"></p-v-button>
        +       <p-v-button label="Info" class="p-button-rounded p-button-info"></p-v-button>
        +       <p-v-button label="Warning" class="p-button-rounded p-button-warning"></p-v-button>
        +       <p-v-button label="Help" class="p-button-rounded p-button-help"></p-v-button>
        +       <p-v-button label="Danger" class="p-button-rounded p-button-danger"></p-v-button>
        +   </div>
        </div>
        </template>

        <style scoped>
        -div {
        +.wrapper {
            margin: 3rem;
        }
        +.row {
        +   display: flex;
        +   width: 100%;
        +   justify-content: space-around;
        +}
        +.row > * {
        +   margin-right: 0.5rem;
        +}
        </style>
        ```

最後にビルドして
```sh
$ docker-compose run --rm node npm run dev
```
/inertia の画面で [PrimeVue の Button コンポーネント](https://www.primefaces.org/primevue/button) がエラーなく表示されることを確認します。

## Storybook

[Storybook](https://storybook.js.org/) の手順に従います。

```sh
$ docker-compose run --rm node npx -p @storybook/cli sb init --type vue3
# npm7 にダウングレードするか？みたいに聞かれるので no で回答する
$ docker-compose run --rm --service-ports node npm run storybook
```

デフォルトで Storybook のサンプルファイルも一緒に作成されるので、
:6006/ にアクセスしてそれらが動作することを一旦確認します。

以下のフォルダが自動で作成されているはずです。
- .storybook
Storybook の設定ファイル関連。
- stories
デフォルトのサンプルファイル。

### Storybook カスタマイズしていく

「Laravel で Storybook を動かす」
ではなく
「Laravel と Storybook は別アプリケーション。設定ファイルなどを共有することで両者で使用される css, js に差異がないようにする」
という考え方です。

Vue の SFC を作成していくにあたって、SCSS を使用するのでそちらをインストールします。
```sh
$ docker-compose run --rm node npm install -D sass sass-loader style-loader css-loader
```

続いて以下のファイルの作成、修正を行います。

- Storybook 設定ファイルのカスタマイズ
    - webpack.config.js
        ```js
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
        ```
    - .storybook/main.js
        ```js
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
        ```
    - .storybook/preview.js
        ```js
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
        ```
    - .storybook/preview-head.html
        Storybook 実行時に共通で読み込まれる head タグの内容を記述した HTML ファイル
        ```html
        <!-- 背景色が白だとコンポーネントとの境界線がわかりにくいので少し色付けしておく -->
        <style>
        html {
            background-color: #faf7f2;
        }
        </style>
        <!-- Laravel Mix でビルドしたファイルを読み込む -->
        <link href="/css/main.css" rel="stylesheet" />
        <script src="/js/app.js" defer></script>
        ```
- コンポーネントファイルの作成
    - resources/js/Components/BaseButton.vue
        ```js
        <script setup>
        import { computed } from "vue"
        import PVButton from "primevue/button"

        const props = defineProps({
            type: {
                type: String,
                required: true,
            },
            label: {
                type: String,
                required: false,
                default: "",
            },
            icon: {
                type: String,
                required: false,
                default: "",
            },
            rounded: {
                type: Boolean,
                required: false,
                default: false,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            size: {
                type: String,
                required: false,
                default: "base",
            },
        })
        const colorClass = computed(() => ({
            "p-button-secondary": props.type === 'gray',
            "p-button-success": props.type === 'green',
            "p-button-help": props.type === 'purple',
            "p-button-warning": props.type === 'yellow',
            "p-button-danger": props.type === 'red',
        }))
        const sizeClass = computed(() => ({
            "sm-button": props.size === "sm",
            "base-button": props.size === "base",
        }))
        const roundedClass = computed(() => ({
            "p-button-rounded": props.rounded,
        }))
        </script>

        <template>
            <p-v-button
                :label="label"
                :icon="icon.length > 0 ? 'pi pi-' + icon : ''"
                :class="['button', colorClass, sizeClass, roundedClass]"
                :disabled="disabled"
            ></p-v-button>
        </template>

        <style lang="scss" scoped>
        .button {
            font-size: 0.8rem;

            &:disabled {
                opacity: 0.4;
            }

            &:enabled:hover,
            &:enabled:active,
            &:enabled:focus {
                box-shadow: none;
                opacity: 0.7;
            }
        }
        </style>
        ```
- Storybook で使用する helper 関数群
    - resources/js/utility/storybook.js
        ```js
        const path = require("path")

        /**
        * ディレクトリ、ファイル名から storytitle を生成
        */
        export const storyTitle = (filepath) => {
            return (
                path.dirname(filepath).replace("/resources/js/", "") +
                "/" +
                path.parse(filepath).name
            )
        }

        /**
        * args を配列形式で渡すことで、props のバリエーションを一気に story として確認できる template
        */
        export const defaultTemplate = (args, componentName) => {
            return (
                `
                <div style="display: flex;flex-direction: column;">` +
                (() => {
                    const templates = []
                    for (const i in Object.keys(args)) {
                        templates.push(
                            '<div style="margin: 1rem;"><' +
                                componentName +
                                ' v-bind="args[' +
                                i +
                                ']" /></div>'
                        )
                    }
                    return templates.join("")
                })() +
                `
                </div>
            `
            )
        }

        /**
        * form 系など、メインコンテンツエリアに margin をつけて見やすくする用 Decorator
        */
        export const marginDecorators = () => {
            return `
                <div style="margin: 2rem; border: solid 1px #ccc;">
                    <story/>
                </div>
            `
        }
        ```
- Storybook ファイルの作成
    - resources/js/Components/BaseButton.stories.js
        ```js
        import { action } from "@storybook/addon-actions";
        import base, { filename } from 'paths.macro';
        import { defaultTemplate, storyTitle } from "@js/utility/storybook"
        import BaseButton from "./BaseButton"

        export default {
            component: BaseButton,
            title: storyTitle(base + filename),
        }

        const Template = (args) => ({
            components: { BaseButton },
            setup() {
                return { args }
            },
            template: defaultTemplate(args, "base-button"),
        })

        export const Default = Template.bind({})
        Default.args = [
            {
                type: "plain",
                label: "ボタン",
                onClick: action('clicked plain button.'),
            },
            {
                type: "green",
                label: "ボタン",
                onClick: action('clicked green button.'),
            },
            {
                type: "brown",
                label: "ボタン",
                onClick: action('clicked brown button.'),
            },
            {
                type: "red",
                label: "ボタン",
                onClick: action('clicked red button.'),
            },
            {
                type: "text",
                label: "ボタン",
                onClick: action('clicked text button.'),
            },
        ]

        export const Rounded = Template.bind({})
        Rounded.args = [
            {
                type: "plain",
                label: "ボタン",
                rounded: true,
            },
            {
                type: "green",
                label: "ボタン",
                rounded: true,
            },
            {
                type: "brown",
                label: "ボタン",
                rounded: true,
            },
            {
                type: "red",
                label: "ボタン",
                rounded: true,
            },
            {
                type: "text",
                label: "ボタン",
                rounded: true,
            },
        ]

        export const WithIcon = Template.bind({})
        WithIcon.args = [
            {
                type: "plain",
                label: "ボタン",
                icon: "check",
            },
            {
                type: "green",
                label: "ボタン",
                icon: "check",
            },
            {
                type: "brown",
                label: "ボタン",
                icon: "check",
            },
            {
                type: "red",
                label: "ボタン",
                icon: "trash",
            },
            {
                type: "text",
                label: "ボタン",
                icon: "check",
            },
        ]

        export const RoundedWithIcon = Template.bind({})
        RoundedWithIcon.args = [
            {
                type: "plain",
                label: "ボタン",
                rounded: true,
                icon: "check",
            },
            {
                type: "green",
                label: "ボタン",
                rounded: true,
                icon: "check",
            },
            {
                type: "brown",
                label: "ボタン",
                rounded: true,
                icon: "check",
            },
            {
                type: "red",
                label: "ボタン",
                rounded: true,
                icon: "trash",
            },
            {
                type: "text",
                label: "ボタン",
                rounded: true,
                icon: "check",
            },
        ]

        export const Disabled = Template.bind({})
        Disabled.args = [
            {
                type: "plain",
                label: "ボタン",
                disabled: true,
            },
            {
                type: "green",
                label: "ボタン",
                disabled: true,
            },
            {
                type: "brown",
                label: "ボタン",
                disabled: true,
            },
            {
                type: "red",
                label: "ボタン",
                disabled: true,
            },
            {
                type: "text",
                label: "ボタン",
                disabled: true,
            },
        ]

        export const Small = Template.bind({})
        Small.args = [
            {
                type: "plain",
                label: "ボタン",
                size: "sm",
            },
            {
                type: "green",
                label: "ボタン",
                size: "sm",
            },
            {
                type: "brown",
                label: "ボタン",
                size: "sm",
            },
            {
                type: "red",
                label: "ボタン",
                size: "sm",
            },
            {
                type: "text",
                label: "ボタン",
                size: "sm",
            },
        ]
        ```

最後に Storybook 再起動
```sh
$ docker-compose run --rm --service-ports node npm run storybook
```

## 小ネタ

### Laravel Mix でビルドした css, js などを Storybook の 6006 ポートアクセス時に読み込ませたい

普通に動かすと 6006 ポート側には css, js ファイルがマウントされていないので、
`/css/app.css`
は読み込めても
`:6006/css/app.css`
は読み込めません。

Storybook 設定ファイルに以下を追加することで、public/ 配下のファイルが 6006/ 直下にマウントされます。

- .storybook/main.js
```js
module.exports = {
    staticDirs: ['../public'],
}
```

### Storybook のエクスポート時に Laravel の `php artisan storage:link` が邪魔になる

Storybook の内容をエクスポートして、ほかのひとに html ファイルとして共有することも出来ます。
また Laravel では `php artisan storage:link` を使用して、storage 配下のファイルを public 配下にシンボリックリンク貼ることはしょっちゅうあります。
このシンボリックリンクであるということが原因で、エクスポート時にエラーが発生します。

```sh
# Laravel の artisan コマンド storage:link で生成される public/storage シンボリックリンクであることが原因でうまく html を export できない
# 作業の瞬間だけシンボリックリンクを解除する
docker-compose exec php ash -c "unlink public/storage"
docker-compose run --rm node npm run build-storybook -o .storybook-static
docker-compose exec php ash -c "php artisan storage:link"
```

こんな sh ファイルを用意して、エクスポート時だけシンボリックリンクを解除するようにして回避しています。

## いい対策が見つかっていない問題など

### Laravel 側は LaravelMix, Storybook 側は Webpack とビルド方法が微妙に違う

Laravel 側を正として、Storybook 側で色々調整していますが、設定ファイルが2重管理になっている部分もありあまりよろしくありません。
Storybook 側でも LaravelMix でビルドして、設定ファイルを完全に共有したいところです。

### Inertia.js 固有の機能、設定を Storybook でうまく動かせない

Storybook の起動に問題ないところはコメントアウトだったり、ダミー処理に置き換えたりしています。


### Storybook ファイルごとに読み込む css を変えたい

管理画面と一般ユーザ向けでベースとなる css を分けている場合などには、
「このコンポーネントでは admin.css を、このコンポーネントでは front.css を読み込ませる」
としたいが、そのような設定は出来ません。

app.css など両画面で共通に読み込む css のみで実装を進めるか、

```html
<main class="admin-layout">
</main>
```

など、root となるタグにどの画面なのか？がわかるような class を指定して、admin.css, front.css 両方を読み込むが、
設定がぶつからないようにする。

などで対策可能ですが、Storybook の都合でアプリケーション側の構成を変えることになっています。

