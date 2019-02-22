// Karma configuration
// Generated on Mon Jul 24 2017 22:03:54 GMT+0200 (CEST)

const webpack = require(`./webpack.config.js`)[1]

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: `.`,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [`detectBrowsers`, `mocha`, `chai`],

    // list of files / patterns to load in the browser
    files: [
      {
        pattern: `js/**/*.spec.js`,
        watched: false
      }
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'js/**/*.js': [`webpack`]
    },

    webpack: {
      mode: `development`,
      resolve: webpack.resolve,
      module: webpack.module
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [`progress`],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome'],
    detectBrowsers: {
      enabled: true,

      usePhantomJS: true,

      postDetection (availableBrowsers) {
        let result = availableBrowsers
        // Remove PhantomJS if another browser has been detected
        if (availableBrowsers.length > 1) {
          result = result.filter((browser) => browser !== `PhantomJS`)
        }

        return result
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
