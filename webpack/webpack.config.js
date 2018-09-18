const path = require(`path`)
const md5 = require(`md5`)
const webpack = require(`webpack`)
const merge = require(`webpack-merge`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)
const CopyWebpackPlugin = require(`copy-webpack-plugin`)

/**
 * Environment
 */

const isProduction = process.env.NODE_ENV === `production`
const isDev = process.env.NODE_ENV === `development`

/**
 * Browsers
 */

const modernBrowsers = [
  // The last two versions of each browser, excluding versions
  // that don't support <script type="module">.
  `last 2 Chrome versions`, `not Chrome < 60`,
  `last 2 Safari versions`, `not Safari < 10.1`,
  `last 2 iOS versions`, `not iOS < 10.3`,
  `last 2 Firefox versions`, `not Firefox < 54`,
  `last 2 Edge versions`, `not Edge < 15`
]
const legacyBrowsers = [
  `> 1%`,
  `last 2 versions`,
  `Firefox ESR`
]

/**
 * Configure plugins
 */

const configurePlugins = (prefix) => {
  // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31

  const plugins = [
    new MiniCssExtractPlugin({
      filename: `../css/[name].css`
    }),

    new CopyWebpackPlugin([{
      from: `static/`,
      to: `../`,
      ignore: `.gitkeep`
    }]),

    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name != null) {
        return chunk.name
      }

      return `${prefix}~` + md5(Array.from(chunk.modulesIterable, (m) => m.identifier()).join()).slice(0, 10)
    })
  ]

  if (isProduction) {
    plugins.push(
      new webpack.HashedModuleIdsPlugin()
    )
  } else {
    plugins.push(
      new webpack.NamedModulesPlugin()
    )
  }

  return plugins
}

/**
 * Babel loader
 */

const configureBabelLoader = (browsers) => {
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: `babel-loader`,
      options: {
        cacheDirectory: true,
        presets: [
          [`@babel/env`, {
            modules: false,
            useBuiltIns: `entry`,
            targets: {
              browsers
            }
          }]
        ],
        plugins: [
          `@babel/plugin-transform-runtime`,
          `@babel/plugin-syntax-dynamic-import`
        ]
      }
    }
  }
}

/**
 * Sass loader
 */

const configureCssLoader = (browsers) => {
  const plugins = []

  if (isProduction) {
    plugins.push(
      require(`autoprefixer`)({
        grid: true,
        browsers
      })
    )

    plugins.push(
      require(`cssnano`)({
        discardComments: {
          removeAll: true
        }
      })
    )
  }

  return {
    test: /\.scss$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: `css-loader`,
        options: {
          importLoaders: 2
        }
      },
      {
        loader: `postcss-loader`,
        options: {
          ident: `postcss`,
          plugins
        }
      },
      `sass-loader`
    ]
  }
}

/**
 * Configure rules
 */

const configureRules = (browsers) => {
  return [
    configureBabelLoader(browsers),
    configureCssLoader(browsers),
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        {
          loader: `file-loader`,
          options: {
            hash: isProduction ? `sha512` : null,
            digest: isProduction ? `hex` : null,
            name: isProduction ? `[hash].[ext]` : `[name].[ext]`
          }
        },
        `image-webpack-loader`
      ]
    },
    {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: `url-loader`,
        options: {
          limit: 10000,
          mimetype: `application/font-woff`
        }
      }
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: `url-loader`,
        options: {
          limit: 10000,
          mimetype: `application/octet-stream`
        }
      }
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      use: `file-loader`
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: `url-loader`,
        options: {
          limit: 10000,
          mimetype: `image/svg+xml`
        }
      }
    }
  ]
}

/**
 * Configuration
 */

const baseConfig = {
  context: __dirname,
  mode: isProduction ? `production` : `development`,
  devtool: isDev ? `cheap-module-eval-source-map` : false,

  resolve: {
    modules: [
      path.resolve(__dirname, `js`),
      path.resolve(__dirname, `node_modules`)
    ],
    extensions: [`.js`, `/index.js`]
  },

  output: {
    path: path.resolve(__dirname, `dist/js`),
    filename: `[name].js`,
    publicPath: `/js/`
  },

  optimization: {
    splitChunks: {
      chunks: `all`
    },
    runtimeChunk: `single`,
    concatenateModules: true
  },

  stats: isProduction || `errors-only`
}

const modernConfig = merge(baseConfig, {
  entry: {
    main: path.resolve(__dirname, `js/main.js`)
  },

  plugins: configurePlugins(`main`),

  module: {
    rules: configureRules(modernBrowsers)
  }
})

const legacyConfig = merge(baseConfig, {
  entry: {
    app: path.resolve(__dirname, `scss/app.scss`),
    'main-legacy': path.resolve(__dirname, `js/main-legacy.js`),
    'nomodule-shim': path.resolve(__dirname, `js/nomodule-shim.js`)
  },

  plugins: configurePlugins(`main-legacy`),

  module: {
    rules: configureRules(legacyBrowsers)
  }
})

/**
 * Compiler
 */

const compilers = [modernConfig, legacyConfig]

module.exports = compilers
