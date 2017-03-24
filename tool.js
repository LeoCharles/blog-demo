/**
 * Created by Administrator on 2017/3/5.
 */

//浏览器检测
(function() {
    window.sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1]:
        (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
        (s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
    if (/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();

//DOM加载
function addDomLoaded(fn) {
    var isReady = false;
    var timer = null;

    function doReady() {
        if (timer) clearInterval(timer);
        if (isReady) return;
        isReady = true;
        fn();
    }
    //判断非主流浏览器
    if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
        //无论采用哪种，基本上用不着了
        /*timer = setInterval(function () {
         if (/loaded|complete/.test(document.readyState)) { 	//loaded是部分加载，有可能只是DOM加载完毕，complete是完全加载，类似于onload
         doReady();
         }
         }, 1);*/
        timer = setInterval(function() {
            if (document && document.getElementById && document.getElementsByTagName && document.body) {
                doReady();
            }
        }, 1);
    } else if (document.addEventListener) { //W3C
        addEvent(document, 'DOMContentLoaded', function() {
            fn();
            removeEvent(document, 'DOMContentLoaded', arguments.callee);
        });
    } else if (sys.ie && sys.ie < 9) {
        var timer = null;
        timer = setInterval(function() {
            try {
                document.documentElement.doScroll('left');
                doReady();
            } catch (e) {};
        }, 1);
    }
}


////跨浏览器事件绑定
//function addEvent(obj,type,fn) {
//    if(typeof obj.addEventListener !== "undefined") {
//        obj.addEventListener(type,fn,false);
//    } else if(typeof obj.attachEvent !== "undefined") {
//        obj.attachEvent("on"+type,fn);
//    }
//}
//
////跨浏览器删除事件
//function removeEvent(obj,type,fn) {
//    if(typeof obj.addEventListener !== "undefined") {
//        obj.removeEventListener(type,fn,false);
//    } else if(typeof obj.attachEvent !== "undefined") {
//        obj.detachEvent("on"+type,fn);
//    }
//}

//跨浏览器添加事件绑定
function addEvent(obj, type, fn) {
    if (typeof obj.addEventListener != 'undefined') {
        obj.addEventListener(type, fn, false);
    } else {
        //创建一个存放事件的哈希表(散列表)
        if (!obj.events) obj.events = {};
        //第一次执行时执行
        if (!obj.events[type]) {
            //创建一个存放事件处理函数的数组
            obj.events[type] = [];
            //把第一次的事件处理函数先储存到第一个位置上
            if (obj['on' + type]) obj.events[type][0] = fn;
        } else {
            //同一个注册函数进行屏蔽，不添加到计数器中
            if (addEvent.equal(obj.events[type], fn)) return false;
        }
        //从第二次开始我们用事件计数器来存储
        obj.events[type][addEvent.ID++] = fn;
        //执行事件处理函数
        obj['on' + type] = addEvent.exec;
    }
}

//为每个事件分配一个计数器
addEvent.ID = 1;

//执行事件处理函数
addEvent.exec = function(event) {
    var e = event || addEvent.fixEvent(window.event);
    var es = this.events[e.type];
    for (var i in es) {
        es[i].call(this, e);
    }
};

//同一个注册函数进行屏蔽
addEvent.equal = function(es, fn) {
    for (var i in es) {
        if (es[i] == fn) return true;
    }
    return false;
}

//跨浏览器删除事件
function removeEvent(obj, type, fn) {
    if (typeof obj.removeEventListener != 'undefined') {
        obj.removeEventListener(type, fn, false);
    } else {
        if (obj.events) {
            for (var i in obj.events[type]) {
                if (obj.events[type][i] == fn) {
                    delete obj.events[type][i];
                }
            }
        }
    }
}

//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent = function(event) {
    event.preventDefault = addEvent.fixEvent.preventDefault;
    event.stopPropagation = addEvent.fixEvent.stopPropagation;
    event.target = event.srcElement;
    return event;
};

//IE阻止默认行为
addEvent.fixEvent.preventDefault = function() {
    this.returnValue = false;
};

//IE取消冒泡
addEvent.fixEvent.stopPropagation = function() {
    this.cancelBubble = true;
};

//获取event对象
function getEvent(event) {
    return event || window.event;
}

//阻止默认行为
function preDef(event) {
    var event = getEvent();
    if (typeof event.preventDefault !== "undefined") {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

//跨浏览器获取视口大小
function getInner() {
    if (typeof window.innerWidth != "undefined") {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
}

//IE获取某一元素到最外层定点的位置
function offsetTop(element) {
    var top = element.offsetTop;
    var parent = element.offsetParent;
    while (parent != null) {
        top += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return top;
}

//跨浏览器获取滚动条位置
function getScroll() {
    return {
        top: document.documentElement.scrollTop || document.body.scrollTop,
        left: document.documentElement.scrollLeft || document.body.scrollLeft
    };
}

//跨浏览器获取style
function getStyle(element, attr) {
    if (typeof window.getComputedStyle !== 'undefined') {
        return window.getComputedStyle(element, null)[attr];
    } else if (typeof element.currentStyle !== 'undefined') {
        return element.currentStyle[attr];
    }
}

//跨浏览器获取innerText
function getInnerText(element) {
    return (typeof element.textContent == "string") ? element.textContent : element.innerText;
}

//跨浏览器设置innerText
function setInnerText(element, text) {
    if (typeof element.textContent == "string") {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}

//判断某个值是否存在某个数组中
function inArray(array, value) {
    for (var i in array) {
        if (array[i] === value) return true;
    }
    return false;
}

//删除空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

//滚动条清零
function scrollTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

//创建cookie
function setCookie(name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
        cookieText += '; expires=' + expires;
    }
    if (path) {
        cookieText += '; expires=' + expires;
    }
    if (domain) {
        cookieText += '; domain=' + domain;
    }
    if (secure) {
        cookieText += '; secure';
    }
    document.cookie = cookieText;
}

//获取cookie
function getCookie(name) {
    var cookieName = encodeURIComponent(name) + '=';
    var cookieStart = document.cookie.indexOf(cookieName);
    var cookieValue = null;
    if (cookieStart > -1) {
        var cookieEnd = document.cookie.indexOf(';', cookieStart);
        if (cookieEnd == -1) {
            cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(
            document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
}

//删除cookie
function unsetCookie(name) {
    document.cookie = name + "= ; expires=" + new Date(0);
}
//失效天数，直接传一个天数即可
function setCookieDate(day) {
    if (typeof day == 'number' && day > 0) {
        var date = new Date();
        date.setDate(date.getDate() + day);
    } else {
        throw new Error('传递的day 必须是一个天数，必须比0 大');
    }
    return date;
}