function sizeOf(url) {
    return new Promise((resolve, reject) => {
        // 创建对象
        const img = new Image()
        // 改变图片的src
        img.src = url
        // 定时执行获取宽高
        const check = function () {
            // 只要任何一方大于0
            // 表示已经服务器已经返回宽高
            if (img.width > 0 || img.height > 0) {
                resolve({ height: img.height, width: img.width })
                clearInterval(set)
            }
        }
        const set = setInterval(check, 40)

        img.onerror = () => {
            reject()
        }
        // // 加载完成获取宽高
        // img.onload = function () {
        //     const diff = new Date().getTime() - start_time;
        //     document.body.innerHTML += 'from:onload : width:' + img.width + ',height:' + img.height + ', time:' + diff + 'ms';
        // };
    })
}

export default sizeOf