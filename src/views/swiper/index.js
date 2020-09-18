import template from './index.html'
import './style.scss'
import { Swiper } from './swiper'

const imgList = [{
  url: '#',
  path: '../../src/images/pic1.png'
},{
  url: '#',
  path: '../../src/images/pic2.png'
},{
  url: '#',
  path: '../../src/images/pic3.png'
}]

// 导出类
export default class {
  mount(container) {
    document.title = 'swiper normal'
    container.innerHTML = template

    new Swiper(imgList).init()
  }
}