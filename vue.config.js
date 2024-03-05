const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭语法检查
  lintOnSave: false,

  pages: {
    index: {
      // page的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html",
    },
  },

  // 配置代理
  devServer: {
    host: '0.0.0.0',
  // https:true,
    port: 6103,
    client: {
      webSocketURL: 'ws://0.0.0.0:6103/ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:6103/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        }
      }
    },
  },
});
