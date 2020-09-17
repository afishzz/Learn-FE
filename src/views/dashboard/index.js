// 引入 router
import router from '../../router'

// 引入 html 模板，会被作为字符串引入
import template from './index.html'

// 引入 css, 会生成 <style> 块插入到 <head> 头中
import './style.scss'

// 导出类
export default class {
  mount(container) {
    document.title = 'dashboard'
    container.innerHTML = template
    container.querySelector('#navigator').addEventListener('click', e => {
      const url = e.target.getAttribute('data-url')
      router.go(url)
    })
  }
}