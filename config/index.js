'use strict'
// Template version: 1.2.3
// see http://vuejs-templates.github.io/webpack for documentation.
var host=process.env.ZGIOT_SERVER || "192.168.5.33:30040";
const path = require('path')
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/v1': {
        target: "http://" + host+ "/appServer/api/v1",
        // target: "http://" + host+ "/appAlert",
        // target: "http://192.168.9.34:9090/app-server/api/v1",
        changeOrigin: true,
        pathRewrite: {
          '^/api/v1': ''
        },
        logLevel:"info",
        logProvider:function logProvider(provider) {
          // replace the default console log provider.
          var winston=require('winston');
          var logger = new winston.Logger({
            level: 'info',
            transports: [
              new (winston.transports.Console)(),               //console.log
              new (winston.transports.File)({ filename: 'somefile.log' })      //写日志文件
            ]
          });
          var myCustomProvider = {
            log: logger.log,
            debug: logger.debug,
            info: logger.info,
            warn: logger.warn,
            error: logger.error
          }
          return myCustomProvider;
        }
      },
      '/api/thing': {
        target: "http://" + host+ "/appThing",
        changeOrigin: true,
        pathRewrite: {
          '^/api/thing': ''
        }
      },
      '/api': {
        target: "http://" + (process.env.ZGIOT_SERVER != null ? host+ '/cloudServer' : host+"/cloudServer"),
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/monitor': {
        target: "http://" + (process.env.ZGIOT_SERVER != null ? host+ '/appMonitor':"/appMonitor"),
        changeOrigin: true,
        pathRewrite: {
          '^/monitor': ""
        }
      },
      '/task': {
        target: "http://" + (process.env.ZGIOT_SERVER != null ? host+ "/cloudServer" : host+"/cloudServer/v1") + "/sftask",
        changeOrigin: true,
        pathRewrite: {
          '^/task': ""
        }
      },
      '/startStop': {
        // target: "http://" + (process.env.ZGIOT_SERVER != null ? host+ '/startStopService' : host+"/startStopService"),
        target: "http://" + host+ "/startStopService",
        changeOrigin: true,
        pathRewrite: {
          '^/startStop': ""
        }
      },
      '/sfstop': {
        // target: "http://192.168.9.22:9090/app-server/api/v1/sfstopconfig",
        target: "http://" + host+ "/appServer/api/v1/sfstopconfig",
        changeOrigin: true,
        pathRewrite: {
          '^/sfstop': ""
        }
      },
      '/test': {
        // target: process.env.ZGIOT_SERVER + '/authService' || 'http://192.168.5.33:30040/authService/',
        target: "http://192.168.9.94:30050/cloudServer/v1/sftask",
        // target: "http://192.168.5.24:30040/startStopService",
        changeOrigin: true,
        pathRewrite: {
          '^/test': ""
        }
      },
      '/subscription': {
        target: "http://" + host+"/cloudServer/sfsubsc",
        changeOrigin: true,
        pathRewrite: {
          '^/subscription': ""
        }
      },
      '/keyControl': {
        // target: "http://192.168.9.34:9090/app-server/v1",
        target: "http://"+host+"/appServer/v1",
        changeOrigin: true,
        pathRewrite: {
          '^/keyControl': ""
        }
      },
      '/alarm': {
        target: "http://" + host+ "/appAlert",
        changeOrigin: true,
        pathRewrite: {
          '^/alarm': ''
        }
      },

    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8088, // can be overwritten by process.env.HOST, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/views/index.html'),
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist/views'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    /**
     * Source Maps
     */
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
