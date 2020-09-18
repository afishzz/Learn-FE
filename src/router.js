// 引入页面文件
import dashboard from './views/dashboard'
import swiper from './views/swiper'

const routes = {
  '/dashboard': dashboard,
  '/swiper': swiper
}

// Router 类，用来控制页面根据当前 URL 切换
class Router {
  start() {
    // 点击浏览器后退 / 前进按钮时会触发 window.onpopstate 事件，我们在这时切换到相应页面
    // https://developer.mozilla.org/en-US/docs/Web/Events/popstate
    window.addEventListener('popstate', () => {
      this.load(location.pathname)
    })

    // window.onbeforeunload = function() {
    //   sessionStorage.setItem('lastPath', location.pathname)
    // }

    // const path = sessionStorage.getItem('lastPath') || location.pathname
    // sessionStorage.removeItem('lastPath')

    // 打开页面时加载当前页面
    this.load(localtion.pathname)
  }

  // 前往 path，变更地址栏 URL，并加载相应页面
  go(path) {
    // 变更地址栏 URL
    history.pushState({}, '', path)
    // 加载页面
    this.load(path)
  }

  // 加载 path 路径的页面
  load(path) {
    // 首页
    if (path === '/') path = '/dashboard'

    // 创建页面实例
    const view = new routes[path]()
    // 调用页面方法，把页面加载到 document.body 中
    view.mount(document.body)
  }
}

// 导出 router 实例
export default new Router()