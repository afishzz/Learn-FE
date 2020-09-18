class Swiper {

  constructor(imgList) {
    this.imgList = imgList
    this.retImgList = [imgList[imgList.length-1], ...imgList, imgList[0]];

    this.swiper = document.getElementsByClassName('swiper-normal')[0]
    this.step = this.swiper.offsetWidth
  }

  init() {
    this.createContainer()
  }

  createContainer() {
    const { step, retImgList } = this
    const length = retImgList.length
    // 轮播图片dom
    const mainView = document.createElement('ul')
    mainView.className = 'swiper-main'
    mainView.style.width = `${step * (length)}px`
    mainView.style.left = `${-this.step}px`

    let li = '';
    for (let i = 0; i < length; i++) {
      li += `<li style="left: ${i * step}px;width: ${step}px" class="swiper-item"><a href="${retImgList[i].url}"><img src="${retImgList[i].path}" alt=""></a></li>`;
    }
    mainView.innerHTML = li

    this.swiper.appendChild(mainView)
  }

}

export { Swiper }