
## 常用loader


- **bable-loader**：解析ES6，需要配置`.babelrc`文件
- **css-loader**：解释`@import` 和 `url()`，转换成CommonJS模块再resolve
- **style-loader**：将css以`<style>`标签插入到html中
- **MiniCssExtractPlugin.loader**：是`MiniCssExtractPlugin`这个插件的loader，该插件会将css提取成单独的css文件再引入，与style-loader是互斥的
- **file-loader/url-loader**：图片或是字体文件的loader。小图片一般使用后者，会被转成base64
- **less-loader/scss-loader**：less或是scss的loader，将less或scss编译成css
- **raw-loader**：实现静态资源的内联
- **postcss-loader**：自动补齐CSS3前缀
- **image-webpack-loader**：压缩图片



## 常用plugin


- **HtmlWebpackPlugin**：打包入口的html文件
- **HotModuleReplacementPlugin**：配置热更新的插件
- **MiniCssExtractPlugin**：将css提取成单独的文件，可以通过它给css文件 添加hash
- **PurgeCSSPlugin**：配合上面的插件使用，可以实现css的tree shaking
- **CleanWebpackPlugin**：每次打包都清空构建目录
- **FriendlyErrorsWebpackPlugin**：美化控制台输出
- **SpeedMeasureWebpackPlugin**：分析loader执行时间
- **BundleAnalyzerPlugin**：通过生成图来展示bundle的大小，便于分析



## 文件指纹
文件指纹的类型有如下三种：

- **hash：**和整个项目的构建相关，只要项目文件有修改，hash就会变化
- **chunkhash：**和webpack打包的chunk有关，不同的entry会生成不同的chunkhash
- **contenthash：**文件内容hash，文件内容不变，则cnotenthash不变



一般而言，JS文件使用chunkhash，css使用contenthash


JS的hash在output处设置：
```javascript
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js', 
  }
```
而css文件在使用了`MiniCssExtractPlugin`后，可以这样设置hash：
```javascript
new MiniCssExtractPlugin({
  filename: '[name]_[contenthash:8].css'
})
```
图片等资源的hash在loader的配置中设置：
```javascript
{
  test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name][hash:8].[ext]'
      }
    }
  ]
}
```


## 动态import
使用`@babel/plugin-syntax-dynamic-import`，通过npm或yarn安装到本地后，只需要配置`.babelrc`文件就可以在代码中实现动态引入：
```javascript
  "plugins":[
    "@babel/plugin-syntax-dynamic-import"
  ]
```
使用：
```javascript
// 文件A
export function() { return 'dynamicImport' }
// 文件B
import('./A.js').then(fn => fn())
```


## 构建速度和体积分析
### SpeedMeasureWebpackPlugin
该插件会统计每个loader的耗时，然后打在控制台中打印出时间，帮助分析
![uTools_1603767580303.png](https://cdn.nlark.com/yuque/0/2020/png/150492/1603767584036-dfced2f6-c32e-426f-8fcb-9eb8f2a2fe61.png#align=left&display=inline&height=347&margin=%5Bobject%20Object%5D&name=uTools_1603767580303.png&originHeight=720&originWidth=600&size=97812&status=done&style=none&width=289)
### BundleAnalyzerPlugin
启动一个服务，生成如下文件，可以帮助分析模块的大小，精准定位。比如如果没有通过splitChunks来提取公共包，则这里引入的normalize.css将会出现在每一个bundle中，增加了打包体积。
![uTools_1603767651048.png](https://cdn.nlark.com/yuque/0/2020/png/150492/1603767658124-78099899-301f-455c-8b1c-68c571c4583e.png#align=left&display=inline&height=551&margin=%5Bobject%20Object%5D&name=uTools_1603767651048.png&originHeight=1948&originWidth=1916&size=1455284&status=done&style=none&width=542)


## 构建速度优化
### 使用高版本webpack和node.js
### 多进程构建
可以使用`thread-loader`、`parallel-webpack`或`HappyPack`
### 利用缓存
充分利用缓存可以提升二次构建的速度
### 减少构建目标
## 构建体积优化
### Tree shaking
Tree shaking就是把将模块中没有用到的部分在uglify阶段擦除掉，webpack是默认支持的，在`production`下默认开启。因为Tree shaking是通过静态分析的方式来决定哪些应该被shaking，因此只有通过ES6的语法引入的模块会被支持，CommonJS方式不支持。


若要通过tree shaking将无用的css擦除掉，需要使用另一个插件`PurgeCSSPlugin`，这个插件需要配合上方提到过的`MiniCssExtractPlugin`使用:
```javascript
new MiniCssExtractPlugin({
  filename: '[name]_[contenthash:8].css'
}),
  new PurgeCSSPlugin({
  paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
})
```


### Scope Hoisting
被webpack转换后的模块会带上一层包裹，这就产生了大量的闭包函数，导致体积增大；同时在代码运行时创建的函数作用域变多，内存开销变大。


scope hoisting的原理是将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突。同样的在mode为`production`下自动开启，不支持CommonJS。


### 公共资源的提取
#### HtmlWebpackExternalsPlugin
使用该插件的思路是将一些基础包通过cdn引入，不打包仅bundle中，比如react开发中会用到的`react`、`react-dom`
```javascript
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'react',
      entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
      global: 'React',
    },
    {
      module: 'react-dom',
      entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
      global: 'ReactDOM',
    },
  ]
})
```
#### SplitWebpackChunks
使用该插件进行公共脚本分离，为webpack自带，在`optimization`中进行配置。该插件会根据条件将符合条件的公共脚本单独打包，从而避免了重复打包，减少了bundle的体积
```javascript
  optimization: {
    splitChunks: {
      minSize: 1000,
      cacheGroups: {
        commons: {
          name: 'common',
          chunks: 'all',
          minChunks: 3
        }
      }
    }
  }
```
### 图片压缩
如果图片没有挂在到CDN，则可以使用`image-webpack-loader`进行图片压缩，减少本地图片的大小，进一步减少bundle的大小：
```javascript
{
  loader: 'image-webpack-loader',
  options: {
    // 	...
  }
}
```
### 动态Polyfill
在解决**API**层面的ES6问题时，如Map、Set等，需要引入`babel-polyfill`，而完整的引入它会造成bundle体积的增大，如果能够根据浏览器的兼容性来动态引入，就能够减少bundle体积，社区有一些解决方案。


更加优雅的方案是使用`polyfill-service`，它会根据浏览器UA自动下发所需的polyfill：
```html
<script src="https://polyfill.io/v3/polyfill.min.js"></script>
```
还可以指定所需的**features：**
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es7"></script>
```


