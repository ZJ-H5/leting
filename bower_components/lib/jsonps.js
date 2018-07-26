/*
 * url: string 请求地址
 * callback: string 回调的方法名 默认 callback
 * success: function 请求成功的回调
 * error: function 请求失败的回调
 * data: string 附加参数
 * time: number 超时时间
 */
var O = {
    hOwnProperty: function (item, attr) {
        return Object.prototype.hasOwnProperty.call(item, attr);
    },
    //格式化参数
    formatParams: function (data, callbackName) {
        const arr = [];
        Object.keys(data).forEach(function (dataKey) {
            arr.push(encodeURIComponent(dataKey) + '=' + encodeURIComponent(data[dataKey]));
        });
        // 添加一个随机数，防止缓存
        if (!this.hOwnProperty(data, 'callback')) {
            arr.push('callback=' + callbackName);
        }
        arr.push('v=' + this.random());
        return arr.join('&');
    },
    random: function () {
        return Math.floor((Math.random() * 10000) + 500);
    },
}


function jsonp(params) {
    //创建script标签并加入到页面中
    var callbackName = params.callback || 'callback';
    var head = document.getElementsByTagName('head')[0];
    // 设置传递给后台的回调参数名
    var data = O.formatParams(params.data || {}, callbackName);
    var script = document.createElement('script');
    head.appendChild(script);
    //创建jsonp回调函数
    window[callbackName] = function (json) {
        head.removeChild(script);
        clearTimeout(script.timer);
        window[callbackName] = null;
        if (params.success) {
            params.success(json);
        }
    };
    //发送请求
    script.src = params.url + '?' + data;
    //为了得知此次请求是否成功，设置超时处理
    if (params.time) {
        script.timer = setTimeout(function () {
            window[callbackName] = null;
            head.removeChild(script);
            if (params.error) {
                params.error({
                    message: '超时',
                });
            }
        }, params.time);
    }
}


if (typeof window !== 'undefined' && !window.$jsonp) {
    window.$jsonp = jsonp;
}