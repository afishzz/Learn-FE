class Swiper {

  constructor(config) {
    this.imgList = config.imgList
    this.retImgList = [this.imgList[this.imgList.length - 1], ...this.imgList, this.imgList[0]];

    this.swiper = document.getElementsByClassName('swiper-normal')[0]
    this.step = this.swiper.offsetWidth
  }

  init() {
    this.createContainer()
  }

  createContainer() {
    const { step, retImgList } = this
    // 轮播图片dom
    const mainView = document.createElement('ul')
    mainView.className = 'swiper-main'
    mainView.style.width = `${step * (length)}px`
    mainView.style.left = `${-step}px`

    // 轮播图片
    let li = '';
    for (let i = 0; i < retImgList.length; i++) {
      li += `<li style="left: ${i * step}px;width: ${step}px" class="swiper-item"><img src="${retImgList[i].path}" alt=""></li>`;
    }
    mainView.innerHTML = li

    // 上一张下一张
    const prev = document.createElement('img')
    const next = document.createElement('img')
    prev.className = 'prev'
    next.className = 'next'
    prev.src = 'https://s1.ax1x.com/2020/09/18/whk9MT.png'
    next.src = 'https://s1.ax1x.com/2020/09/18/whEMUH.png'
    if (retImgList.length === 3) {
      prev.style.display = 'none'
      next.style.display = 'none'
    }

    let fragment = document.createDocumentFragment()
    fragment.appendChild(prev)
    fragment.appendChild(next)
    fragment.appendChild(mainView)
    this.swiper.appendChild(fragment)
  }

  prev() {
    
  }

  next() {

  }

}

export { Swiper }