import 'normalize.css'
import './style.scss'

import { Swiper } from './swiper'

const imgList = [{
  url: '#',
  path: 'https://s1.ax1x.com/2020/09/18/wfLjcn.jpg'
}, {
  url: '#',
  path: 'https://s1.ax1x.com/2020/09/18/wfLOpj.jpg'
}, {
  url: '#',
  path: 'https://s1.ax1x.com/2020/09/18/wfLX1s.jpg'
}]

new Swiper({ imgList, autoplay: true, loop: true }).init()

