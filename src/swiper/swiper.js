class Swiper {

  constructor(config) {
    this.imgList = config.imgList
    this.retImgList = [this.imgList[this.imgList.length - 1], ...this.imgList, this.imgList[0]];

    this.swiper = document.getElementsByClassName('swiper-normal')[0]
    this.step = this.swiper.offsetWidth

    this.mainView = null

    this.currIndex = 0
  }

  init() {
    this._createContainer()
  }

  _createContainer() {
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
    prev.addEventListener('click', e => {
      e.stopPropagation()
      this._prev()
    })
    next.addEventListener('click', e => {
      e.stopPropagation()
      this._next()
    })

    let fragment = document.createDocumentFragment()
    fragment.appendChild(prev)
    fragment.appendChild(next)
    fragment.appendChild(mainView)
    this.swiper.appendChild(fragment)

    this.mainView = mainView
  }

  _prev() {
    if (this.imgList.length === 1) return
    this.mainView.style.left = `${parseInt(this.mainView.style.left) + this.step}px`
    if (this.currIndex === 0) {
      this.currIndex = this.imgList.length - 1
      setTimeout(() => {
        this.mainView.style.left = `${-this.imgList.length * this.step}px`
      }, 1000)
    } else {
      this.currIndex--
    }
  }

  _next() {
    if (this.imgList.length === 1) return;
    this.currIndex++;
    this.mainView.style.left = `${parseInt(this.mainView.style.left) - this.step}px`;
    if (this.currIndex === this.imgList.length) {
      this.currIndex = 0;
      setTimeout(() => {
        this.mainView.style.left = `${-this.step}px`;
      }, 1000)
    } else {
      // this.setActiveSpot();
    }
  }

}

export { Swiper }