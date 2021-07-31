module.exports = {
  // 在这里我们配置别名
  // configureWebpack: {
  //     resolve: {
  //         // resolve用于配置和路径相关的
  //         extensions:['.js','.vue','.json'],
  //         // 这个可以省略.vue,.js等配置文件，我们这里不用配置，公共配置文件就已经配置好了
  //         alias: {
  //             // alias配置别名的
  //             // '@':'src'
  //             // 它的内部已经配置了@等于src这个别名了
  //             // 'assets': '@/assets',
  //             // 'components': '@/components',
  //             // 'network': '@/network',
  //             // 'views':'@/views',
  //         }
  //     }
  // }
  chainWebpack: config => {
    //   发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

        // 只有在发布模式的时候我们才有必要去配置代码
        config.set('externals', {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            axios: 'axios',
            lodash: '_',
            echarts: 'echarts',
            nprogress: 'NProgress',
            'vue-quill-editor': 'VueQuillEditor'
            })

        config.plugin('html').tap(args=>{
          args[0].isProd = true
          return args
        })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

        config.plugin('html').tap(args=>{
          args[0].isProd = false
          return args
    })
  })
}}
