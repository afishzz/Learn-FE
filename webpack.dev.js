const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];

      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];

      entry[pageName] = entryFile;
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: [pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
          }
        })
      );
    });

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {

  mode: 'development',
  /*
  配置 source map
  开发模式下使用 cheap-module-eval-source-map, 生成的 source map 能和源码每行对应，方便打断点调试
  生产模式下使用 hidden-source-map, 生成独立的 source map 文件，并且不在 js 文件中插入 source map 路径，用于在 error report 工具中查看 （比如 Sentry)
  */
  devtool: 'cheap-module-eval-source-map',

  // 配置页面入口 js 文件
  entry: entry,
  // 配置打包输出相关
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包输出目录
    filename: '[name].[hash:8].js', // 入口 js 的打包输出文件名
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    index: 'dashboard.html'
  },

  module: {
    /*
    配置各种类型文件的加载器，称之为 loader
    webpack 当遇到 import ... 时，会调用这里配置的 loader 对引用的文件进行编译
    */
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        // 匹配 css 文件
        test: /\.css$/,
        /*
        先使用 css-loader 处理，返回的结果交给 style-loader 处理。
        css-loader 将 css 内容存为 js 字符串，并且会把 background, @font-face 等引用的图片，
        字体文件交给指定的 loader 打包，类似上面的 html-loader, 用什么 loader 同样在 loaders 对象中定义，等会下面就会看到。
        */
        use: ['style-loader', 'css-loader']
      },

      {
        /*
        匹配各种格式的图片和字体文件
        上面 html-loader 会把 html 中 <img> 标签的图片解析出来，文件名匹配到这里的 test 的正则表达式，
        css-loader 引用的图片和字体同样会匹配到这里的 test 条件
        */
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,

        /*
        使用 url-loader, 它接受一个 limit 参数，单位为字节(byte)

        当文件体积小于 limit 时，url-loader 把文件转为 Data URI 的格式内联到引用的地方
        当文件大于 limit 时，url-loader 会调用 file-loader, 把文件储存到输出目录，并把引用的文件路径改写成输出后的路径
        */
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader', // 将 JS 字符串生成为 style 节点
          'css-loader', // 将 CSS 转化成 CommonJS 模块
          'less-loader', // 将 Less 编译成 CSS
        ],
      }
    ],
  },

  /*
  配置 webpack 插件
  plugin 和 loader 的区别是，loader 是在 import 时根据不同的文件名，匹配不同的 loader 对这个文件做处理，
  而 plugin, 关注的不是文件的格式，而是在编译的各个阶段，会触发不同的事件，让你可以干预每个编译阶段。
  */
  plugins: [
    /*
    html-webpack-plugin 用来打包入口 html 文件
    entry 配置的入口是 js 文件，webpack 以 js 文件为入口，遇到 import, 用配置的 loader 加载引入文件
    但作为浏览器打开的入口 html, 是引用入口 js 的文件，它在整个编译过程的外面，
    所以，我们需要 html-webpack-plugin 来打包作为入口的 html 文件
    */
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ].concat(htmlWebpackPlugins)
}