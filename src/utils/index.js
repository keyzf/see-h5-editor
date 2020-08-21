const userAgent = navigator.userAgent
const toString = Object.prototype.toString
const location = window.location
const pathKey = 'app' // storage 命名空间

const $common = {
  // isIos: userAgent.match(/iPhone/i) || userAgent.match(/iPad/i) || userAgent.match(/iPod/i),

  // isAndroid: !$common.isIos,

  // isWx: userAgent.match(/MicroMessenger/i),

  // isFirefox: userAgent.match(/Firefox/i),

  // isPc: !['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'].some((model) => userAgent.indexOf(model) > -1),

  ua: (function () {
    const regs = {
      // 系统
      // 'ios': /iphone|ipad|ipod/,
      android: /android/i,

      // 机型
      iphone: /iphone/i,
      ipad: /ipad/i,
      ipod: /ipod/i,

      // 环境
      weixin: /micromessenger/i,
      mqq: /QQ\//i,
      alipay: /aliapp/i,
      weibo: /weibo/i,

      // 浏览器
      chrome: /chrome\//i
    }

    const ret = {}
    Object.keys(regs).forEach((key) => {
      var reg = regs[key]
      ret[key] = reg.test(userAgent)
    })

    ret.ios = ret.iphone || ret.ipad || ret.ipod
    ret.mobile = ret.ios || ret.android
    ret.pc = !ret.mobile

    ret.chrome = !!window.chrome

    ret.iphoneX = false

    if (typeof window !== 'undefined' && window) {
        ret.iphoneX = /iphone/gi.test(userAgent) && window.screen.height >= 812;
    }
    return ret
  })(),

  regs: {
    telephone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    http: /http(|s):\/\//
  },

  /**
   * 参数格式化, 符合url方式
   * @params {Object} {a: '123', age: '18'}
   * @return {String} 'a=123&age=18'
   */
  stringifyParams(params, cb) {
    let name
    let value
    let str = ''

    for (name in params) {
      value = params[name]
      str += name + '=' + (typeof cb === 'function' ? cb(value, name) : value) + '&'
    }

    return str.slice(0, -1)
  },

  /**
   * 将url中? 后面的参数, 变成一个json
   * @return {Object}
   * @example 'a=1&b=3' => {a: 1, b: 3}
   */
  getUrlParams(sourceStr) {
    // 防止hash值, 影响参数名称
    let search
    if (sourceStr) {
      search = sourceStr.indexOf('?') > -1 ? sourceStr.split('?').slice(-1).toString() : sourceStr
    } else {
      // 链接中的最后一个
      search = window.location.href.indexOf('?') > -1 && $common.getSearch()
    }
    // 如果没有, 则返回空对象
    if (!search) return {}

    const searchArr = search.split('&').filter(Boolean)
    const urlParams = {}

    searchArr.forEach((str) => {
      const paramArr = str.split('=')
      // 如果已经有该参数就不添加进去了
      if (urlParams[paramArr[0]]) return false
      urlParams[decodeURIComponent(paramArr[0])] = unescape(decodeURIComponent(paramArr[1]))
    })
    return urlParams
  },

  /**
   * 根据日期获取星座
   * @param {String} date
   */
  getStarSigns(date) {
    const getAstro = (m, d) => {
      return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(m * 2 - (d < '102223444433'.charAt(m - 1) - -19) * 2, 2)
    }
    const d = new Date(date.replace(/-/g, '/'))
    return getAstro(d.getMonth() + 1, d.getDate()) + '座'
  },

  /**
   * 得到url中某个参数
   */
  getUrlQuery(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    if (location.href.indexOf('?') < 0) return false
    const search = $common.getSearch()
    if (!search) return false
    const r = search.replace(/(#|\/)+/ig, '').match(reg)
    if (r != null) {
      // 对编码的字符串进行解码
      const unescapeStr = unescape(decodeURIComponent(r[2]))
      switch (unescapeStr) {
        case 'true':
          return true
        case 'null':
          return null
        case 'false':
          return false
        case 'undefined':
          return undefined
        default:
          return unescapeStr
      }
    } else {
      return null
    }
  },
  /**
   * 压缩图片文件
   * @param file
   * @return
   */
  compressImg(file, minSize = 1024 * 1024 * 1) {
    return new Promise((resolve, reject) => {
      let base64
      const reader = new FileReader()
      if (file.size < minSize) {
        return resolve(file)
      }
      reader.onload = async e => {
        console.log('compressImg.onload', file)
        base64 = e.target.result
        const base64String = await $common.canvasDataURL(base64).catch(e => reject(e)) // 利用canvas压缩图片得到压缩后的base64
        const resFile = await $common.dataURLtoFile(base64String, file.name).catch(e => reject(e)) // base64转File
        console.log(base64String)
        resolve(resFile)
      }
      // reader.error = e => reject(e);
      reader.readAsDataURL(file)
    })
  },
  // 利用canvas压缩图片，根据画布大小和图像质量压缩
  canvasDataURL(url, outputFormat = 'image/png', quality = 0.92) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      let base64String
      img.onload = function () {
        var canvas = document.createElement('CANVAS')
        var ctx = canvas.getContext('2d')
        // const scale = img.width / img.height
        // const canvasWidth = 600
        // const canvasHeight = canvasWidth / scale
        // canvas.height = img.height;
        // canvas.width = img.width;
        canvas.width = img.width / 2
        canvas.height = img.height / 2
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        base64String = canvas.toDataURL(outputFormat, quality)
        canvas = null
        resolve(base64String)
      }
      img.onerror = e => reject(e)
      img.src = url
    })
  },
  // 将base64转换为文件
  dataURLtoFile(dataurl, filename = 'abc.png') {
    return new Promise((resolve, reject) => {
      try {
        const arr = dataurl.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        resolve(new File([u8arr], filename, { type: mime }))
      } catch (e) {
        console.log(e, 'dataURLtoFile')
        reject(e)
      }
    })
  },
  // 将base64转换为blob
  dataURLtoBlob(dataurl) {
    return new Promise((resolve, reject) => {
      try {
        const arr = dataurl.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        resolve(new Blob([u8arr], { type: mime }))
      } catch (e) {
        console.log(e, 'dataURLtoBlob')
        reject(e)
      }
    })
  },
  // 将blob转换为file
  blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date()
    theBlob.name = fileName
    return theBlob
  },

  /**
   * 判断对象是否为空
   * @return {Boolean} 是否是空对象
   */
  isEmptyObject(obj) {
    let key
    for (key in obj) {
      return false
    }
    return true
  },

  isObject(obj) {
    return toString.call(obj) === '[object Object]'
  },
  /**
   * 把数据保存到本地
   */
  saveLocalData(key, item, isSession) {
    try {
      (isSession ? sessionStorage : localStorage).setItem(`_${pathKey}_${key}`, JSON.stringify(item))
    } catch (error) {
      console.error(error)
    }
  },
  /**
   * 读取本地数据, key若不传，得到本命名空间下存的所有本地数据
   */
  getLocalData(key, isSession) {
    let res = null
    try {
      if (key === undefined) {
        const allName = Object.keys(isSession ? sessionStorage : localStorage).filter(name => name.match(new RegExp(`^_${pathKey}_`)))
        if (allName.length > 0) {
          res = {}
          allName.forEach(item => {
            const keyName = item.match(new RegExp(`^_${pathKey}_(.*)$`))[1]
            res[keyName] = $common.getLocalData(keyName)
          })
        }
      } else {
        res = JSON.parse((isSession ? sessionStorage : localStorage).getItem(`_${pathKey}_${key}`))
      }
    } catch (error) {
      console.error(error)
    }
    return res
  },
  /**
   * 去掉链接中的https和http
   */
  getHttpUrl(url = '') {
    typeof url !== 'string' && (url = '')
    // return url.replace(/^https?:\/\//, '//')
    return url.replace(/^http(s?):\/\//, '//')
  },

  /**
   * 拷贝, 支持深拷贝, 支持多个参数
   * 第一个参数如果为 boolean类型且为true, 做深拷贝
   * @example
   * 浅拷贝 common.copy({name: 'libaoxu'}, {age: 18}) => { name: 'libaoxu', age: 18 }
   * 深拷贝 common.copy(true, {name: 'libaoxu', age: 18, obj: {sex: '1', love: 'bei'}}, {name: 'deep', obj: {sex: '2'}}) => { name: 'deep', age: 18, obj: { sex: 2, love: 'bei' } }
   */
  copy() {
    let target = arguments[0] || {}
    let i = 1
    const length = arguments.length
    let deep = false

    if (typeof target === 'boolean') {
      deep = target
      target = arguments[1] || {}
      i++
    }

    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {}
    }

    for (; i < length; i++) {
      let options
      if ((options = arguments[i]) != null) {
        for (const prop in options) {
          const src = target[prop]
          const copy = options[prop]

          if (target === copy) continue

          let copyIsArray

          if ((deep && copy) ? $common.isObject(copy) : (copyIsArray = Array.isArray(copy))) {
            let clone
            if (copyIsArray) {
              copyIsArray = false
              clone = src && Array.isArray(src) ? src : []
            } else {
              clone = src && $common.isObject(copy) ? src : {}
            }

            target[prop] = $common.copy(deep, clone, copy)
          } else if (copy != null) {
            target[prop] = copy
          }
        }
      }
    }

    return target
  },

  /**
   * 节流函数
   * @param {Function} func 回调函数
   * @param {Number} wait 等待时间
   * @param {Object} options 配置参数
   * @property options.leading false: 如果你想禁用第一次首先执行的
   * @property options.trailing false: 你想禁用最后一次执行的话
   */
  throttle(func, wait, options = {}) {
    let timeout
    let context
    let args
    let result
    let previous = 0
    if (!options) options = {}

    const later = function () {
      previous = options.leading === false ? 0 : Date.now()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }

    const throttled = function () {
      const now = Date.now()
      if (!previous && options.leading === false) previous = now
      const remaining = wait - (now - previous)
      // console.log('remaining: ', remaining, 'now: ', now, 'previous: ', previous, remaining > wait)
      context = this
      args = arguments
      // remaining > wait 防止用户修改系统时间
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          // console.log('clear timeout')
          clearTimeout(timeout)
          timeout = null
        }
        // console.log('remaining <=0 || remaining > wait')
        // 进来之后 previous 才被赋值, 保证第一次执行成功
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout && options.trailing !== false) { // !timeout, 保证上一次later执行完的 标识
        // console.log('!timeout: ', timeout)
        timeout = setTimeout(later, remaining)
      }
      return result
    }

    throttled.cancel = function () {
      clearTimeout(timeout)
      previous = 0
      timeout = context = args = null
    }

    return throttled
  },
  isDef: v => (v !== undefined),

  createPromise() {
    let _resolve
    let _reject
    const promise = new Promise((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })

    return {
      promise,
      resolve: _resolve,
      reject: _reject
    }
  },

  formatTime: function (seconds, guide = seconds) {
    seconds = seconds < 0 ? 0 : seconds
    let s = Math.floor(seconds % 60)
    let m = Math.floor(seconds / 60 % 60)
    let h = Math.floor(seconds / 3600)
    const gm = Math.floor(guide / 60 % 60)
    const gh = Math.floor(guide / 3600)

    // handle invalid times
    if (isNaN(seconds) || seconds === Infinity) {
      // '-' is false for all relational operators (e.g. <, >=) so this setting
      // will add the minimum number of fields specified by the guide
      h = m = s = '-'
    }

    // Check if we need to show hours
    h = (h > 0 || gh > 0) ? h + ':' : ''

    // If hours are showing, we may need to add a leading zero.
    // Always show at least one digit of minutes.
    m = (((h || gm >= 10) && m < 10) ? '0' + m : m) + ':'

    // Check if leading zero is need for seconds
    s = (s < 10) ? '0' + s : s

    return h + m + s
  },

  completImgUrlWithHost(url, imgHost) {
    // http开头的, 变为https
    if (url && typeof url === 'string') {
      if (url.indexOf('http://') > -1) {
        return url.replace('http://', 'https://')
      } else {
        // 路径结尾的,
        return `${imgHost}${url}`
      }
    } else {
      // return require('src/assets/images/common/default-portrait.png')
      return 'https://'
    }
  },
  /**
   * 保留小数
   * @param fractionDigits
   */
  toFixed(number, fractionDigits = 0) {
    if (Number.isNaN(parseFloat(number))) {
      return 0
    }
    return Number(parseFloat(number).toFixed(fractionDigits))
  },

  copyText(text) {
    const textArea = document.createElement('textArea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.readOnly = true
    // textArea.setAttribute('readonly', 'readonly');
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      var range = document.createRange()
      range.selectNodeContents(textArea)
      var selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textArea.setSelectionRange(0, 999999)
    } else {
      textArea.select()
    }

    var result = document.execCommand('copy')
    document.body.removeChild(textArea)
    return result
  },
  /**
   * 将url中? 后面的参数
   */
  getSearch() {
    return window.location.href.indexOf('?') > -1 ? window.location.href.replace(/[^?]+\?/, '').replace(/#\/[^?]*\??/, '&') : ''
  },
  getSingleton(fn) {
    let result
    let flag
    return function singletonProxy() {
      if (!flag) {
        flag = true
        return (result = fn.apply(this, arguments))
      } else {
        return result
      }
    }
  },

  // 时间戳转时间日期
  dateFormat(timestamp, formats) {
    // formats格式包括
    // 1. Y-m-d
    // 2. Y-m-d H:i:s
    // 3. Y年m月d日
    // 4. Y年m月d日 H时i分
    // 5. m月d日
    formats = formats || 'Y-m-d'

    const zero = function (value) {
      if (value < 10) {
        return '0' + value
      }
      return value
    }

    const myDate = timestamp ? new Date(timestamp) : new Date()

    const year = myDate.getFullYear()
    const month = zero(myDate.getMonth() + 1)
    const day = zero(myDate.getDate())

    const hour = zero(myDate.getHours())
    const minite = zero(myDate.getMinutes())
    const second = zero(myDate.getSeconds())

    return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
      return ({
        Y: year,
        m: month,
        d: day,
        H: hour,
        i: minite,
        s: second
      })[matches]
    })
  },
  /**
   * 去除图片base64前缀  /data:image\/\w+;base64/
   */
  filterImgBase64Prefix(imgBase64 = '') {
    return imgBase64.replace(/^data:image\/\w+;base64,/, '')
  }
}

/**
 * 生成uuid方法
 * @returns {string}
 */
export const createUUID = function () {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

/**
 * 深拷贝
 * @param {*} obj 拷贝对象(object or array)
 * @param {*} cache 缓存数组
 */
export const deepClone = function (obj, cache = []) {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
   */
  const hit = cache.filter(c => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepClone(obj[key], cache)
  })

  console.log(copy)

  return copy
}

// export function copyText(text) {
//   const input = document.createElement('input');
//   input.style.position = 'fixed'
//   input.style.top = '-100%'
//   input.setAttribute('readonly', 'readonly');
//   input.setAttribute('value', text);
//   document.body.appendChild(input);
//   if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
//     window.getSelection().removeAllRanges()
//     const range = document.createRange()
//     range.selectNode(input)
//     window.getSelection().addRange(range)
//   } else {
//     input.focus()
//     input.setSelectionRange(0, 9999);
//     input.select()
//   }

//   if (document.execCommand('copy')) {
//     document.execCommand('copy');
//     console.log('复制成功');
//     document.body.removeChild(input);
//     window.getSelection().removeAllRanges()
//     return true
//   }
//   window.getSelection().removeAllRanges()
//   document.body.removeChild(input);
//   return false
// }

export const copyText = (text) => {
  // 数字没有 .length 不能执行selectText 需要转化成字符串
  const textString = text.toString();
  let input = document.querySelector('#copy-input');
  if (!input) {
    input = document.createElement('input');
    input.id = "copy-input";
    input.readOnly = "readOnly";        // 防止ios聚焦触发键盘事件
    input.style.position = "fixed";
    input.style.left = "-1000px";
    input.style.zIndex = "-1000";
    document.body.prepend(input)
  }
  // 这里设置一个top值为屏幕中心值 ios上不设置会滚动到顶部或底部
  input.style.top = (document.documentElement.clientHeight / 2) - 9 + 'px'


  input.value = textString;
  // ios必须先选中文字且不支持 input.select();
  selectText(input, 0, textString.length);
  console.log(document.execCommand('copy'), 'execCommand');
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    // alert('已复制到粘贴板');
    return true
  }
  input.blur();

  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  function selectText(textbox, startIndex, stopIndex) {
    if (textbox.createTextRange) {//ie
      const range = textbox.createTextRange();
      range.collapse(true);
      range.moveStart('character', startIndex);//起始光标
      range.moveEnd('character', stopIndex - startIndex);//结束光标
      range.select();//不兼容苹果
    } else {//firefox/chrome
      textbox.setSelectionRange(startIndex, stopIndex);
      textbox.focus();
    }
  }
};

export const getActiveElement = (element, uuid) => {
  if (!element) return null
  if (element.uuid === uuid) return element
  if (element.elements && element.elements.length > 0) {
    for (const el of element.elements) {
      const activeElement = getActiveElement(el, uuid)
      if (activeElement) return activeElement
    }
  }
  return null
}

export const getElementPath = (element, uuid) => {
    for (const key in element) {
        if (element[key] == uuid) return [key];
        if (typeof(element[key]) == "object") {
            const temp = getElementPath(element[key], uuid);
            if (temp) return [key, temp].flat();
        }
    }
}

export default $common
