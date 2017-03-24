/**
 * Created by Administrator on 2017/3/6.
 */
//拖拽功能
$().extend("drag", function() {
    var tags = arguments;
    for (var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], 'mousedown', function(e) {
            if (trim(this.innerHTML).length == 0) e.preventDefault();
            var _this = this;
            var diffX = e.clientX - _this.offsetLeft;
            var diffY = e.clientY - _this.offsetTop;
            //自定义拖拽区域
            var flag = false;
            for (var i = 0; i < tags.length; i++) {
                if (e.target == tags[i]) {
                    flag = true;
                    break;
                }
            }
            //判断是否开始拖拽
            if (flag) {
                addEvent(document, 'mousemove', move);
                addEvent(document, 'mouseup', up);
            } else {
                removeEvent(document, 'mousemove', move);
                removeEvent(document, 'mouseup', up);
            }
            //移动函数
            function move(e) {
                var left = e.clientX - diffX;
                var top = e.clientY - diffY;
                //限定移动范围
                if (left < 0) {
                    left = 0;
                } else if (left <= getScroll().left) {
                    left = getScroll().left;
                } else if (left > getInner().width + getScroll().left - _this.offsetWidth) {
                    left = getInner().width + getScroll().left - _this.offsetWidth;
                }
                if (top < 0) {
                    top = 0;
                } else if (top <= getScroll().top) {
                    top = getScroll().top;
                } else if (top > getInner().height + getScroll().top - _this.offsetHeight) {
                    top = getInner().height + getScroll().top - _this.offsetHeight;
                }
                //开始移动
                _this.style.left = left + 'px';
                _this.style.top = top + 'px';
                //指定窗口里设置鼠标捕获
                if (typeof _this.setCapture != 'undefined') {
                    _this.setCapture();
                }
                //取消移动时选择文字
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }
            //停止拖拽
            function up() {
                removeEvent(document, 'mousemove', move);
                removeEvent(document, 'mouseup', up);
                //解除鼠标捕获
                if (typeof _this.releaseCapture != 'undefined') {
                    _this.releaseCapture();
                }
            }
        });
    }
    return this;
});