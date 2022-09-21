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
