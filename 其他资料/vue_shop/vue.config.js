module.exports={
  // 如果打包文件资源路径没有dist
  publicPath: '',
  chainWebpack:config =>{
    // 生产环境
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      // 打包时排除以下第三方依赖包
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'mavon-editor': 'MavonEditor',
      })
      // 生产模式下，html的isProd标记为true
      config.plugin('html').tap(args =>{
        args[0].isProd = true
        return args
      })
    })
    // 开发环境
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      // 开发模式下，html的isProd标记为false
      config.plugin('html').tap(args =>{
        args[0].isProd = false
        return args
      })
    })
  }
}
