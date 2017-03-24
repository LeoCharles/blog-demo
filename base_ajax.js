/**
 * [ajax description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function ajax(obj) {
	var xhr = null;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	};
	obj.data = (function(data) {
		var arr = [];
		for (var i in data) {
			arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
		}
		return arr.join('&');
	})(obj.data);
	obj.url += '?t=' + new Date().getTime();
	if (obj.method === 'get') {
		obj.url += obj.url.indexOf("?") == -1 ? "?" + obj.data : '&' + obj.data;
	}
	if (obj.asyn === true) {
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				callback();
			}
		}
	}
	xhr.open(obj.method, obj.url, obj.asyn);
	if (obj.method === 'post') {
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(obj.data);
	} else {
		xhr.send(null);
	}
	if (obj.asyn === false) {
		callback();
	}

	function callback() {
		if (xhr.status == 200) {
			obj.success(xhr.responseText);
		} else {
			alert('获取数据错误！错误代号：' + xhr.status + '；' + '错误信息：' + xhr.statusText);
		}
	}
};