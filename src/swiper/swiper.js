import { throttle } from '../../utils'

class Swiper {

  constructor(config) {
    this.imgList = config.imgList || []
    this.duration = config.duration || 2000
    this.loop = config.loop
    this.autoplay = config.autoplay

    this.mainView = document.getElementsByClassName('swiper-main')[0]
    this.swiper = document.getElementsByClassName('swiper-normal')[0]
    this.step = this.swiper.offsetWidth
    this.items = null
    this.indicators = null

    this.activeIndex = 0
    this.timer = null
  }

  init() {
    this.createContainer()
    this.startTimer()
    this.setIndicator()
    this.bindEvent()
  }

  bindEvent() {
    document.getElementsByClassName('prev')[0].addEventListener('click', throttle(e => {
      e.stopPropagation()
      this.prev()
    }, 500), false)

    document.getElementsByClassName('next')[0].addEventListener('click', throttle(e => {
      e.stopPropagation()
      this.next()
    }, 500), false)

    this.swiper.addEventListener('mouseenter', () => {
      this.pauseTimer()
    })

    this.swiper.addEventListener('mouseleave', () => {
      this.startTimer()
    })
  }

  createContainer() {
    const { imgList, step } = this
    // 轮播图片
    let items = document.createDocumentFragment()
    let indicatorWrap = document.createElement('ul')
    indicatorWrap.className = 'indicator'
    for (let i = 0; i < imgList.length; i++) {
      let wrap = document.createElement('div')
      let img = document.createElement('img')
      wrap.className = 'swiper-item'
      wrap.style.transform = `translateX(${step * i}px)`
      img.setAttribute('src', `${imgList[i].path}`)
      wrap.appendChild(img)
      items.appendChild(wrap)

      let li = document.createElement('li')
      li.className = 'indicator-item'
      li.addEventListener('click', throttle(e => {
        e.stopPropagation()
        this.setActiveItem(i)
      }, 1000), false)
      indicatorWrap.appendChild(li)
    }
    this.mainView.appendChild(items)
    this.mainView.appendChild(indicatorWrap)

    this.items = document.getElementsByClassName('swiper-item')
    this.indicators = document.getElementsByClassName('indicator-item')
  }

  processIndex(index, activeIndex, length) {
    if (activeIndex === 0 && index === length - 1) {
      return -1; // 到第一张了， 最后一张放到第一张左边
    } else if (activeIndex === length - 1 && index === 0) {
      return length; //到最后一张了，第一张摆在最后一边右边
    } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
      return length + 1;
    } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
      return -2;
    }
    return index;
  }

  setActiveItem(index) {
    let length = this.items.length
    const oldIndex = this.activeIndex
    if (index < 0) {
      this.activeIndex = this.loop ? length - 1 : 0
    } else if (index >= length) {
      this.activeIndex = this.loop ? 0 : length - 1
    } else {
      this.activeIndex = index
    }
    this.resetItemPosition(oldIndex)
    this.setIndicator()
  }

  resetItemPosition(oldIndex) {
    const length = this.items.length
    for (let i = 0; i < this.items.length; i++) {
      let index = i
      this.items[i].className = i === this.activeIndex || i === oldIndex ? 'swiper-item is-animating' : 'swiper-item'
      if (i !== this.activeIndex && length > 2 && this.loop) {
        index = this.processIndex(i, this.activeIndex, length)
      }
      this.items[i].style.transform = `translateX(${this.calcTranslate(index, this.activeIndex)}px)`
    }
  }

  setIndicator() {
    const length = this.items.length
    for (let i = 0; i < length; i++) {
      if (i === this.activeIndex) {
        this.indicators[i].className = 'indicator-item active'
      } else {
        this.indicators[i].className = 'indicator-item'
      }
    }
  }

  prev() {
    this.setActiveItem(this.activeIndex - 1)
  }

  next() {
    this.setActiveItem(this.activeIndex + 1)
  }

  calcTranslate(index, activeIndex) {
    return this.step * (index - activeIndex)
  }

  startTimer() {
    if (this.timer || this.duration <= 0 || !this.autoplay) return
    this.timer = setInterval(this.next.bind(this), this.duration)
  }

  pauseTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

}

export { Swiper }