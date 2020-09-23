export const throttle = (fn, wait) => {
  var timer, context, args
  var previous = 0

  var later = function () {
    previous = +new Date()
    timer = null
    fn.apply(context, args)
  }

  var throttled = function () {
    var now = +new Date()
    context = this
    args = arguments

    var remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      previous = now
      fn.apply(context, args)
    } else if (!timer) {
      timer = setTimeout(later, remaining)
    }
  }

  return throttled

}

export const debounce = (fn, wait, immediate) => {
  let context, args, timer

  return function () {
    if (timer) clearTimeout(timer)
    context = this
    args = arguments

    if (immediate) {
      var callNow = !timer
      timer = setTimeout(function () {
        timer = null
      }, wait)
      if (callNow) fn.apply(context, args)
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
      })
    }
  }
}