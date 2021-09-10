// 项目发布节点用到的babel插件
const prodPlugins = []
// 如果处于发布模式，开启transform-remove-console
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {'modules': false}]
  ],
  plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 产品发布时使用的配置（移除所有的console.log）
    ...prodPlugins,
    // 开启路由懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
}
