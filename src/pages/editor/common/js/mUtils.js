/**
 * 公共方法
 * */
import plugins from '@/plugins'

/**
 * 存储localStorage
 */
export const setLocalStorage = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getLocalStorage = name => {
	if (!name) return;
	let data = window.localStorage.getItem(name)

	return data ? JSON.parse(data) : undefined;
}

/**
 * 删除localStorage
 */
export const removeLocalStorage = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}


export const Cookie = {
	/**
	 * getCookie
	 * @param name
	 * @returns {*}
	 */
	get(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split("; ");
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if (arr[0] == name) return arr[1];
		}
		return "";
	},

	/**
	 * 添加cookie
	 * @param name
	 * @param value
	 * @param expiresHours
	 * @param domain
	 */
	set(name, value, expiresDays, domain, path) {
		var cookieString = name + "=" + (value ? value : '');
		var date = new Date();

		if (domain != undefined)
			domain = ";domain=" + domain;
		else
			domain = '';

		date.setTime(date.getTime() + (expiresDays || 1) * 24 * 3600 * 1000);
		cookieString = cookieString + domain + "; path="+ (path || "/") +"; expires=" + date.toGMTString();

		document.cookie = cookieString;
	},

	/**
	 * 删除cookie
	 * @param name
	 */
	remove(name) {
		this.set(name, '', -1);
	}
};


export function dataURItoBlob (dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1])

	// separate out the mime components
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length)

	// create a view into the buffer
	var ia = new Uint8Array(ab)

	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}

	// write the ArrayBuffer to a blob, and you're done
	var blob = new Blob([ab], { type: mimeString })
	return blob
}

/*
* 获取组件的props
* @params elName
* */
export function getComponentProps (elName) {
  let elComponentData
  for (let key in plugins) {
    if (key.toLowerCase() === elName.toLowerCase()) {
      elComponentData = plugins[key];
      break;
    }
  }

  if (!elComponentData) return {}
  let props = {}
  for (let key in elComponentData.props) {
    const defaultValue = [Object, Array].includes(elComponentData.props[key].type) ? elComponentData.props[key].default() : elComponentData.props[key].default
    props[key] = elComponentData.props[key].label ? {
      value: defaultValue,
      label: elComponentData.props[key].label,
      tip: elComponentData.props[key].tip,
      group: elComponentData.props[key].group,
      options: elComponentData.props[key].options,
      urlParams: elComponentData.props[key].urlParams,
      placeholder: elComponentData.props[key].placeholder
    } : defaultValue
  }
  return props
}

/*
* 处理键盘事件
* */
export function formatKeyboardEvent (e) {
  const keyCode = e.keyCode || e.which || e.charCode
  const ctrlKey = e.ctrlKey || e.metaKey
	// 有ctrl
	if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
		return
	}

  if (ctrlKey) {
    switch (keyCode) {
      case 83:
        e.preventDefault()
        return 'COPY'
    }
  }
  switch (keyCode) {
    case 8:
      e.preventDefault()
      return 'DELETE'
  }
}
