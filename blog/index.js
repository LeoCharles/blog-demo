$(function() {
    /*个人中心-下拉菜单*/
    $("#header .member").hover(function() {
        $(this).css("background", "url(images/arrow2.png) no-repeat 55px center");
        $("#header .member_ul").show().animate({
            t: 20,
            mul: {
                opacity: 100,
                height: 120
            }
        });
    }, function() {
        $(this).css("background", "url(images/arrow.png) no-repeat 55px center");
        $("#header .member_ul").animate({
            mul: {
                opacity: 0,
                height: 0
            },
            fn: function() {
                $("#header .member_ul").hide();
            }
        });
    });

    /*遮罩*/
    var screen = $("#screen");
    /*登录框*/
    var login = $("#login");
    login.center(350, 250).resize(function() {
        if (login.css('display') == 'block') {
            screen.lock();
        }
    });
    $("#header .login").click(function() {
        login.center(350, 250).show();
        screen.lock().animate({
            attr: "opacity",
            target: 40,
            t: 50
        });
    });
    $("#login .close").click(function() {
        login.hide();
        screen.animate({
            attr: "opacity",
            target: 0,
            t: 50,
            fn: function() {
                screen.unlock();
            }
        });
    });
    //登录验证
    $("#form_login").form("sub").click(function() {
        if (/^[\w]{2,20}$/.test(trim($("#form_login").form("user").value())) && $("#form_login").form("pass").value().length >= 6) {
            var _this = this;
            $('#loading').show().center(200, 40);
            $('#loading p').html('正在登录...');
            _this.disabled = true;
            $(this).css('backgroundPosition', 'right');
            ajax({
                method: 'post',
                url: 'is_login.php',
                data: $("#form_login").eq(0).serialize(),
                success: function(text) {
                    $('#loading').hide();
                    if (text == 1) { //登录失败
                        $("#login .info").html('登录失败：用户名或密码不正确!');
                    } else { //登录成功
                        $("#login .info").html('');
                        $("#success").show().center(200, 40);
                        $("#success p").html('登录成功，请稍后...');
                        setCookie('user', trim($("#form_login").form("user").value()));
                        setTimeout(function() {
                            $('#success').hide();
                            login.hide();
                            $("#form_login").first().reset();
                            screen.animate({
                                attr: "opacity",
                                target: 0,
                                t: 50,
                                fn: function() {
                                    screen.unlock();
                                }
                            });
                            $('#header .register').hide();
                            $('#header .login').hide();
                            $('#header .info').show().html(getCookie('user') + ',您好！');
                        }, 1500);
                    }
                    _this.disabled = false;
                    $(_this).css('backgroundPosition', 'left');

                },
                asyn: true
            });
        } else {
            $("#login .info").html('登录失败：用户名或密码不合法!');
        }
    });



    /*拖拽登录框*/
    login.drag($("#login h2").first());

    /*注册框*/
    var register = $("#register");
    register.center(600, 550).resize(function() {
        if (login.css('display') == 'block') {
            screen.lock();
        }
    });
    $("#header .register").click(function() {
        register.center(600, 550).show();
        screen.lock().animate({
            attr: "opacity",
            target: 40,
            t: 50
        });
    });
    $("#register .close").click(function() {
        register.hide();
        screen.animate({
            attr: "opacity",
            target: 0,
            t: 50,
            fn: function() {
                screen.unlock();
            }
        });

    });
    register.drag($("#register h2").first());


    /*注册表单验证*/
    $("#form_reg").first().reset(); //初始化表单操作
    /*用户名验证*/
    $("#form_reg").form("user").bind("focus", function() {
        $("#register .info_user").show();
        $("#register .error_user").hide();
        $("#register .succ_user").hide();
    }).bind("blur", function() {
        if (trim($(this).value()) == "") {
            $("#register .info_user").hide();
            $("#register .error_user").hide();
            $("#register .succ_user").hide();
        } else if (!check_user()) {
            $("#register .info_user").hide();
            $("#register .error_user").show();
            $("#register .succ_user").hide();
        } else {
            $("#register .info_user").hide();
            $("#register .error_user").hide();
            $("#register .succ_user").show();
        }
    });

    function check_user() {
        var flag = true;
        if (!/^[\w]{2,20}$/.test(trim($("#form_reg").form("user").value()))) {
            $("#register .error_user").html("输入不合法，请重新输入！");
            return false;
        } else {
            $("#register .info_user").hide();
            $("#register .loading").show();
            ajax({
                method: 'post',
                url: 'is_user.php',
                data: $("#form_reg").eq(0).serialize(),
                success: function(text) {
                    if (text == 1) {
                        $("#register .error_user").html("抱歉，该用户名已注册！");
                        flag = false;
                    } else {
                        flag = true;
                    }
                    $("#register .loading").hide();
                },
                asyn: false
            });
        }
        return flag;
    }

    /*密码验证*/
    $("#form_reg").form("pass").bind("focus", function() {
            $("#register .info_pass").show();
            $("#register .error_pass").hide();
            $("#register .succ_pass").hide();
        }).bind("blur", function() {
            if (trim($(this).value()) == "") {
                $("#register .info_pass").hide();
            } else {
                if (check_pass()) {
                    $("#register .info_pass").hide();
                    $("#register .error_pass").hide();
                    $("#register .succ_pass").show();
                } else {
                    $("#register .info_pass").hide();
                    $("#register .error_pass").show();
                    $("#register .succ_pass").hide();
                }
            };

        })
        //验证密码强度
    $("#form_reg").form("pass").bind("keyup", function() {
            check_pass();
        })
        //密码验证函数
    function check_pass() {
        var value = trim($("#form_reg").form("pass").value());
        var value_length = value.length;
        var code_length = 0; //记录字符种类
        // 第一个必须条件6-20位的验证
        if (value_length >= 6 && value_length <= 20) {
            $("#register .info_pass .q1").html("●").css("color", "green");
        } else {
            $("#register .info_pass .q1").html("○").css("color", "#666")
        }
        //第二个必须条件 字母、数字或非空字符，任意一个
        if (value_length >= 0 && !/\s/.test(value)) {
            $("#register .info_pass .q2").html("●").css("color", "green");
        } else {
            $("#register .info_pass .q2").html("○").css("color", "#666")
        }
        //第三个必须条件 大写字母、小写字母、数字任意两种混合即可
        if (/[\d]/.test(value)) {
            code_length++;
        }
        if (/[a-z]/.test(value)) {
            code_length++;
        }
        if (/[A-Z]/.test(value)) {
            code_length++;
        }
        if (/[^\w]/.test(value)) {
            code_length++;
        }
        if (code_length >= 2) {
            $("#register .info_pass .q3").html("●").css("color", "green");
        } else {
            $("#register .info_pass .q3").html("○").css("color", "#666")
        }
        //安全级别
        //高：大于等于10个字符，三种不同字符混合
        //中：大于等于8个字符，两种不同字符混合
        //低：大于等于1个字符
        //无：没有字符
        //判断时从高到低判断
        if (value_length >= 10 && code_length >= 3) {
            $("#register .info_pass .s1").css("color", "green");
            $("#register .info_pass .s2").css("color", "green");
            $("#register .info_pass .s3").css("color", "green");
            $("#register .info_pass .s4").html("高").css("color", "green");
        } else if (value_length >= 8 && code_length >= 2) {
            $("#register .info_pass .s1").css("color", "#F60");
            $("#register .info_pass .s2").css("color", "#F60");
            $("#register .info_pass .s3").css("color", "#ccc");
            $("#register .info_pass .s4").html("中").css("color", "#F60");
        } else if (value_length >= 1) {
            $("#register .info_pass .s1").css("color", "red");
            $("#register .info_pass .s2").css("color", "#ccc");
            $("#register .info_pass .s3").css("color", "#ccc");
            $("#register .info_pass .s4").html("低").css("color", "red");
        } else {
            $("#register .info_pass .s1").css("color", "#ccc");
            $("#register .info_pass .s2").css("color", "#ccc");
            $("#register .info_pass .s3").css("color", "#ccc");
            $("#register .info_pass .s4").html("");
        }
        if (value_length >= 6 && value_length <= 20 && !/\s/.test(value) && code_length >= 2) {
            return true;
        } else {
            return false;
        }
    }

    /*密码确认*/
    $("#form_reg").form("notpass").bind("focus", function() {
        $("#register .info_notpass").show();
        $("#register .error_notpass").hide();
        $("#register .succ_notpass").hide();
    }).bind("blur", function() {
        if (trim($(this).value()) == "") {
            $("#register .info_notpass").hide();
        } else if (check_notpass()) {
            $("#register .info_notpass").hide();
            $("#register .error_notpass").hide();
            $("#register .succ_notpass").show();
        } else {
            $("#register .info_notpass").hide();
            $("#register .error_notpass").show();
            $("#register .succ_notpass").hide();
        }
    });

    function check_notpass() {
        if ($("#form_reg").form("notpass").value() == trim($("#form_reg").form("pass").value())) return true;
    }

    /*提问*/
    $("#form_reg").form("ques").bind("change", function() {
        if (check_ques()) {
            $("#register .error_ques").hide();
        }
    });

    function check_ques() {
        if ($("#form_reg").form("ques").value() != 0) return true;
    }

    /*回答验证*/
    $("#form_reg").form("ans").bind("focus", function() {
        $("#register .info_ans").show();
        $("#register .error_ans").hide();
        $("#register .succ_ans").hide();
    }).bind("blur", function() {
        if (trim($(this).value()) == "") {
            $("#register .info_ans").hide();
        } else if (check_ans()) {
            $("#register .info_ans").hide();
            $("#register .error_ans").hide();
            $("#register .succ_ans").show();
        } else {
            $("#register .info_ans").hide();
            $("#register .error_ans").show();
            $("#register .succ_ans").hide();
        }
    })

    function check_ans() {
        if ($("#form_reg").form("ans").value().length >= 2 && $("#form_reg").form("ans").value().length <= 32) return true;
    }

    /*电子邮箱验证*/
    //电子邮箱 常见域名:.com .cn .net .asia .mobi .com.cn
    //  常见邮箱正则表达式/^(\w)+(\.\w)*@(\w)+((\.\w{2,3}){1,3})$/
    //  点号和减号要转义 \w表示a-zA-Z0-9_
    $("#form_reg").form("email").bind("focus", function() {
        if ($(this).value().indexOf("@") == -1) {
            $("#register .all_email").show();
        }
        $("#register .info_email").show();
        $("#register .error_email").hide();
        $("#register .succ_email").hide();
    }).bind("blur", function() {
        $("#register .all_email").hide();
        if (trim($(this).value()) == "") {
            $("#register .info_email").hide();
        } else if (check_email()) {
            $("#register .info_email").hide();
            $("#register .error_email").hide();
            $("#register .succ_email").show();
        } else {
            $("#register .info_email").hide();
            $("#register .error_email").show();
            $("#register .succ_email").hide();
        }
    });

    function check_email() {
        if (/^(\w)+[\w\-\.]*@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test($("#form_reg").form("email").value())) return true;
    }
    // 电子邮件补全
    //鼠标移入移出效果
    $("#register .all_email li").hover(function() {
        $(this).css("background", "#e5edf2");
        $(this).css("color", "#369");
    }, function() {
        $(this).css("background", "none");
        $(this).css("color", "#666");
    });
    //键盘键入
    $("#form_reg").form("email").bind("keyup", function(event) {
        if ($(this).value().indexOf("@") == -1) {
            $("#register .all_email").show();
            $("#register .all_email li span").html($(this).value());
        } else {
            $("#register .all_email").hide();
        }
        $("#register .all_email li").css("background", "none");
        $("#register .all_email li").css("color", "#666");
        //方向键向下选取
        if (event.keyCode == 40) {
            if (this.index == undefined || this.index >= $("#register .all_email li").length() - 1) {
                this.index = 0;
            } else {
                this.index++;
            }
            $("#register .all_email li").eq(this.index).css("background", "#e5edf2");
            $("#register .all_email li").eq(this.index).css("color", "#369");
        }
        //方向键向上选取
        if (event.keyCode == 38) {
            if (this.index == undefined || this.index <= 0) {
                this.index = $("#register .all_email li").length() - 1;
            } else {
                this.index--;
            }
            $("#register .all_email li").eq(this.index).css("background", "#e5edf2");
            $("#register .all_email li").eq(this.index).css("color", "#369");
        }
        //回车键选中
        if (event.keyCode == 13) {
            $(this).value($("#register .all_email li").eq(this.index).text());
            $("#register .all_email").hide();
            this.index = undefined;
        }
    });
    //点击获取,click是点击后弹起触发，而blur在弹起时也会触发，元素会被隐藏，导致无法触发
    $("#register .all_email li").bind("mousedown", function() {
        $("#form_reg").form("email").value($(this).text());
    });

    /*生日系统*/
    var year = $("#form_reg").form("year");
    var month = $("#form_reg").form("month");
    var day = $("#form_reg").form("day");
    var day30 = [4, 6, 9, 11];
    var day31 = [1, 3, 5, 7, 8, 10, 12];
    var date = new Date();
    var y = date.getFullYear();
    //注入年
    for (var i = 1950; i <= y; i++) {
        year.first().add(new Option(i, i), undefined);
    }
    //注入月
    for (var i = 1; i <= 12; i++) {
        month.first().add(new Option(i, i), undefined);
    }
    //注入日
    year.bind("change", select_day);
    month.bind("change", select_day);
    day.bind("change", function() {
        if (check_birthday()) {
            $("#register .error_birthday").hide();
        }
    });

    function check_birthday() {
        if (year.value() != 0 && month.value() != 0 && day.value() != 0) return true;
    }
    //根据选择的年份和月份注入天数天数
    function select_day() {
        if (year.value() != 0 && month.value() != 0) {
            day.first().options.length = 1; //清理之前的注入
            var cur_day = 0;
            if (inArray(day31, parseInt(month.value()))) {
                cur_day = 31;
            } else if (inArray(day30, parseInt(month.value()))) {
                cur_day = 30;
            } else {
                if ((parseInt(year.value()) % 4 == 0 && parseInt(year.value()) % 100 != 0) || parseInt(year.value()) % 400 == 0) {
                    cur_day = 29;
                } else {
                    cur_day = 28;
                }
            }
            for (var i = 1; i <= cur_day; i++) {
                day.first().add(new Option(i, i), undefined);
            }
        } else {
            //清理之前的注入
            day.first().options.length = 1;
        }
    }

    /*文本框验证*/
    $("#form_reg").form("ps").bind("keyup", check_ps).bind("paste", function() {
        setTimeout(check_ps, 50);
    }); //粘贴事件在文本进入文本框之前触发,所有加个定时器
    //超出字数清尾
    $("#register .ps .clear").click(function() {
        $("#form_reg").form("ps").value($("#form_reg").form("ps").value().substring(0, 140));
        check_ps();
    });

    function check_ps() {
        var num = 140 - $("#form_reg").form("ps").value().length;
        if (num >= 0) {
            $("#register .ps").eq(0).show();
            $("#register .ps").eq(1).hide();
            $("#register .ps .num").eq(0).html(num);
            return true;
        } else {
            $("#register .ps").eq(0).hide();
            $("#register .ps").eq(1).show();
            $("#register .ps .num").eq(1).html(Math.abs(num)).css("color", "red");
            return false;
        }
    }

    /*提交验证*/
    $("#form_reg").form("sub").click(function() {
        var flag = true;
        if (!check_user()) {
            $("#register .error_user").show();
            flag = false;
        }
        if (!check_pass()) {
            $("#register .error_pass").show();
            flag = false;
        }
        if (!check_notpass()) {
            $("#register .error_notpass").show();
            flag = false;
        }
        if (!check_ques()) {
            $("#register .error_ques").show();
            flag = false;
        }
        if (!check_ans()) {
            $("#register .error_ans").show();
            flag = false;
        }
        if (!check_email()) {
            $("#register .error_email").show();
            flag = false;
        }
        if (!check_birthday()) {
            $("#register .error_birthday").show();
            flag = false;
        }
        if (!check_ps()) {
            flag = false;
        }
        if (flag) {
            var _this = this;
            $('#loading').show().center(200, 40);
            $('#loading p').html('正在提交，注册中...');
            this.disabled = true;
            $(this).css('backgroundPosition', 'right');
            ajax({
                method: 'post',
                url: 'add.php',
                data: $("#form_reg").eq(0).serialize(),
                success: function(text) {
                    if (text == 1) {
                        $('#loading').hide()
                        $('#success').show().center(200, 40);
                        $('#success p').html('注册成功，请登录！');
                        setTimeout(function() {
                            $('#success').hide();
                            register.hide();
                            $('#register .succ').hide();
                            $("#form_reg").first().reset();
                            _this.disabled = false;
                            $(_this).css('backgroundPosition', 'left');
                            screen.animate({
                                attr: "opacity",
                                target: 0,
                                t: 50,
                                fn: function() {
                                    screen.unlock();
                                }
                            });
                        }, 1500);
                    };
                },
                asyn: true
            });
        }
    });

    /*发表博文弹窗*/
    var blog = $("#blog");
    blog.center(580, 320).resize(function() {
        if (blog.css('display') == 'block') {
            screen.lock();
        }
    });
    $("#header .member .publish_blog").click(function() {
        blog.center(580, 320).show();
        screen.lock().animate({
            attr: "opacity",
            target: 40,
            t: 50
        });
    });
    $("#blog .close").click(function() {
        blog.hide();
        screen.animate({
            attr: "opacity",
            target: 0,
            t: 50,
            fn: function() {
                screen.unlock();
            }
        });

    });
    blog.drag($("#blog h2").first());

    /*发表博文验证*/
    $("#form_blog").form("sub").click(function() {
        if (trim($("#form_blog").form("title").value()).length <= 0 || trim($("#form_blog").form("content").value()).length <= 0) {
            $("#form .info").html("发表博文失败：标题和内容不得为空！");
        } else {
            var _this = this;
            $('#loading').show().center(200, 40);
            $('#loading p').html('正在发表博文...');
            _this.disabled = true;
            $(this).css('backgroundPosition', 'right');
            ajax({
                method: 'post',
                url: 'add_blog.php',
                data: $("#form_blog").eq(0).serialize(),
                success: function(text) {
                    $('#loading').hide();
                    if (text == 1) {
                        $("#blog .info").html('');
                        $("#success").show().center(200, 40);
                        $("#success p").html('发表成功，请稍后');
                        setTimeout(function() {
                            $('#success').hide();
                            $('#blog').hide();
                            $("#form_blog").first().reset();
                            screen.animate({
                                attr: "opacity",
                                target: 0,
                                t: 50,
                                fn: function() {
                                    screen.unlock();
                                    /*获取博文列表*/
                                    $('#index .loading').show();
                                    ajax({
                                        method: 'post',
                                        url: 'get_blog.php',
                                        data: {},
                                        success: function(text) {
                                            $('#index .loading').hide();
                                            var json = JSON.parse(text);
                                            var html = '';
                                            for (var i = 0; i < json.length; i++) {
                                                html += '<div class="content"><h2><em>' + json[i].date + '</em>' + json[i].title + '</h2><p>' + json[i].content + '</p></div>'
                                            }
                                            $('#index').html(html);
                                            for (var i = 0; i < json.length; i++) {
                                                $('#index .content').eq(i).animate({
                                                    attr: 'opacity',
                                                    target: 100,
                                                    t: 30,
                                                });
                                            }

                                        },
                                        asyn: true
                                    });
                                }
                            });
                            _this.disabled = false;
                            $(_this).css('backgroundPosition', 'left');
                        }, 1500);
                    }
                },
                asyn: true
            });
        }
    });

    /*获取博文列表*/
    $('#index .loading').show();
    ajax({
        method: 'post',
        url: 'get_blog.php',
        data: {},
        success: function(text) {
            $('#index .loading').hide();
            var json = JSON.parse(text);
            var html = '';
            for (var i = 0; i < json.length; i++) {
                html += '<div class="content"><h2><em>' + json[i].date + '</em>' + json[i].title + '</h2><p>' + json[i].content + '</p></div>'
            }
            $('#index').html(html);
            for (var i = 0; i < json.length; i++) {
                $('#index .content').eq(i).animate({
                    attr: 'opacity',
                    target: 100,
                    t: 30,
                });
            }

        },
        asyn: true
    });

    /*换肤弹窗*/
    var skin = $("#skin");
    skin.center(650, 360).resize(function() {
        if (skin.css('display') == 'block') {
            screen.lock();
        }
    });
    $("#header .member .change_skin").click(function() {
        skin.center(650, 360).show();
        screen.lock().animate({
            attr: "opacity",
            target: 40,
            t: 50
        });
        ajax({
            method: 'post',
            url: 'get_skin.php',
            data: {
                'type': 'all'
            },
            success: function(text) {
                var json = JSON.parse(text);
                var html = '';
                for (var i = 0; i < json.length; i++) {
                    html += '<dl><dt><img src="images/' + json[i].small_bg + '" big_bg="' + json[i].big_bg + '" bg_color="' + json[i].bg_color + '" alt="" /></dt><dd>' + json[i].bg_text + '</dd></dl>';
                }
                $('#skin .skin_bg').html(html);
                $('#skin dl dt img').click(function() {
                    $('body').css('background', $(this).attr('bg_color') + ' ' + 'url(images/' + $(this).attr('big_bg') + ') repeat-x');
                    ajax({
                        method: 'post',
                        url: 'get_skin.php',
                        data: {
                            'type': 'set',
                            'big_bg': $(this).attr('big_bg')
                        },
                        success: function(text) {
                            $('#success').show().center(200, 40);
                            $('#success p').html('背景更换成功...');
                            setTimeout(function() {
                                $('#success').hide();
                            }, 1000);
                        },
                        asyn: true
                    });
                });
            },
            asyn: true
        });
    });
    $("#skin .close").click(function() {
        skin.hide();
        screen.animate({
            attr: "opacity",
            target: 0,
            t: 50,
            fn: function() {
                screen.unlock();
            }
        });
    });
    skin.drag($("#skin h2").first());
    //默认显示背景
    ajax({
        method: 'post',
        url: 'get_skin.php',
        data: {
            'type': 'main'
        },
        success: function(text) {
            var json = JSON.parse(text);
            $('body').css('background', json.bg_color + ' ' + 'url(images/' + json.big_bg + ') repeat-x');
        },
        asyn: true
    });

    /*导航条*/
    $('#nav .about li').hover(function() {
        var target = $(this).first().offsetLeft;
        $('#nav .nav_bg').animate({
            attr: 'left',
            target: target + 20,
            fn: function() {
                $('#nav .white').animate({
                    attr: 'left',
                    target: -target
                });
            }
        });
    }, function() {
        $('#nav .nav_bg').animate({
            attr: 'left',
            target: 20,
            fn: function() {
                $('#nav .white').animate({
                    attr: 'left',
                    target: 0
                });
            }
        });
    });

    /*左侧菜单*/
    $("#sidebar h2").toggle(function() {
        $(this).next().animate({
            mul: {
                height: 0,
                opacity: 0
            },
            t: 30
        });
    }, function() {
        $(this).next().animate({
            mul: {
                height: 150,
                opacity: 100
            }
        });
    });

    /*百度分享*/
    //初始化位置
    $("#share").css("top", getScroll().top + (getInner().height - parseInt(getStyle($("#share").first(), "height"))) / 2 + "px");
    $(window).bind("scroll", function() {
            setTimeout(function() {
                $("#share").animate({
                    attr: "top",
                    target: getScroll().top + (getInner().height - parseInt(getStyle($("#share").first(), "height"))) / 2
                })
            }, 300); //加定时器延迟执行，防止立即执行发生抖动
        })
        //展开收缩效果
    $("#share").hover(function() {
        $(this).animate({
            attr: "left",
            target: 0,
            t: 20
        });
    }, function() {
        $(this).animate({
            attr: "left",
            target: -211,
            t: 5
        });
    });

    /*轮播器*/
    //初始化
    //$("#banner img").hide();
    //$("#banner img").eq(0).show();
    $("#banner img").opacity(0);
    $("#banner img").eq(0).opacity(100);
    $("#banner ul li").eq(0).css("color", "#333");
    $("#banner strong").html($("#banner img").eq(0).attr("alt"));
    var banner_index = 1; //轮播器计数器
    var banner_type = 1; //1透明度轮播器;2上下滚动轮播器
    //自动轮播
    var banner_timer = setInterval(banner_fn, 3000);
    //手动轮播器
    $("#banner ul li").hover(function() {
        clearInterval(banner_timer);
        if ($(this).css('color') != 'rgb(51, 51, 51)' && $(this).css('color') != '#333') {
            banner(this, banner_index == 0 ? $('#banner ul li').length() - 1 : banner_index - 1);
        }
    }, function() {
        banner_index = $(this).index() + 1;
        banner_timer = setInterval(banner_fn, 3000);
    });

    function banner(obj, prev) {
        $("#banner ul li").css("color", "#999");
        $(obj).css("color", "#333");
        $("#banner strong").html($("#banner img").eq($(obj).index()).attr("alt"));
        if (banner_type == 1) {
            $("#banner img").eq(prev).animate({
                attr: "opacity",
                target: 0,
                t: 100
            }).css("zIndex", 1);
            $("#banner img").eq($(obj).index()).animate({
                attr: "opacity",
                target: 100,
                t: 100
            }).css("zIndex", 2);
        } else if (banner_type == 2) {
            $("#banner img").eq(prev).animate({
                attr: "top",
                target: 150,
                t: 30
            }).css("zIndex", 1).opacity(100);
            $("#banner img").eq($(obj).index()).animate({
                attr: "top",
                target: 0,
                t: 30
            }).css("top", "-150px").css("zIndex", 2).opacity(100);
        }

    };

    function banner_fn() {
        if (banner_index >= $("#banner ul li").length()) banner_index = 0;
        banner($("#banner ul li").eq(banner_index).first(), banner_index == 0 ? $("#banner ul li").length() - 1 : banner_index - 1);
        banner_index++;
    }

    //图片延时加载
    //1.当图片进入可见区域的时候，将xsrc地址替换到src
    //2.获取图片元素到最外层顶点元素的距离//offsetTop($(".wait_load").first());
    //3.获取页面可视区的最低点的位置//getInner().height + getScroll().top;
    $(".wait_load").opacity(0)
    $(window).bind("scroll", waitLoad);
    $(window).bind("resize", waitLoad);

    function waitLoad() {
        setTimeout(function() {
            for (var i = 0; i < $(".wait_load").length(); i++) {
                var _this = $(".wait_load").ge(i);
                if ((getInner().height + getScroll().top) >= offsetTop(_this)) {
                    $(_this).attr("src", $(_this).attr("xsrc")).animate({
                        attr: "opacity",
                        target: 100,
                        t: 50,
                    });
                }
            }
        }, 300);
    }
    //图片弹窗
    var photo_big = $("#photo_big");
    photo_big.center(620, 511).resize(function() {
        if (login.css('display') == 'block') {
            screen.lock();
        }
    });
    $("#photo dt img").click(function() {
        photo_big.center(620, 511).show();
        screen.lock().animate({
            attr: "opacity",
            target: 40,
            t: 30
        });
        var temp_img = new Image();
        $(temp_img).bind("load", function() {
            $("#photo_big .big img").attr("src", temp_img.src).animate({
                attr: "opacity",
                target: 100,
                t: 70
            }).opacity(0).css("top", 0);
        });
        temp_img.src = $(this).attr("bigsrc");
        var children = this.parentNode.parentNode;
        prev_next_img(children);
    });
    $("#photo_big .close").click(function() {
        photo_big.hide();
        screen.animate({
            attr: "opacity",
            target: 0,
            fn: function() {
                screen.unlock();
            }
        });
        $("#photo_big .big img").attr("src", "images/loading.gif");
    });
    photo_big.drag($("#photo_big h2").first());
    //鼠标滑过显示上一张下一张按钮
    $("#photo_big .big .left").hover(function() {
        $("#photo_big .big .sl").animate({
            attr: "opacity",
            target: 30,
            t: 50
        })
    }, function() {
        $("#photo_big .big .sl").animate({
            attr: "opacity",
            target: 0,
        })
    });
    $("#photo_big .big .right").hover(function() {
        $("#photo_big .big .sr").animate({
            attr: "opacity",
            target: 30,
            t: 50
        })
    }, function() {
        $("#photo_big .big .sr").animate({
            attr: "opacity",
            target: 0,
        })
    });
    //鼠标点击显示上一张
    $("#photo_big .big .left").click(function() {
        $("#photo_big .big img").attr("src", "images/loading.gif").css("width", "32px").css("height", "32px").css("top", "190px");
        var current_img = new Image();
        $(current_img).bind("load", function() {
            $("#photo_big .big img").attr("src", current_img.src).animate({
                attr: "opacity",
                target: 100,
                t: 30
            }).opacity(0).css("width", "600px").css("height", "450px").css("top", 0);
        });
        current_img.src = $(this).attr("src");
        var children = $("#photo dt img").ge(prevIndex($("#photo_big .big img").attr("index"), $("#photo").first())).parentNode.parentNode;
        prev_next_img(children);
    });
    $("#photo_big .big .right").click(function() {
        $("#photo_big .big img").attr("src", "images/loading.gif").css("width", "32px").css("height", "32px").css("top", "190px");
        var current_img = new Image();
        $(current_img).bind("load", function() {
            $("#photo_big .big img").attr("src", current_img.src).animate({
                attr: "opacity",
                target: 100,
                t: 30
            }).opacity(0).css("width", "600px").css("height", "450px").css("top", 0);
        });
        current_img.src = $(this).attr("src");
        var children = $("#photo dt img").ge(nextIndex($("#photo_big .big img").attr("index"), $("#photo").first())).parentNode.parentNode;
        prev_next_img(children);
    });


    function prev_next_img(children) {
        var prev = prevIndex($(children).index(), children.parentNode);
        var next = nextIndex($(children).index(), children.parentNode);
        var prev_img = new Image();
        var next_img = new Image();
        prev_img.src = $("#photo dt img").eq(prev).attr("bigsrc");
        next_img.src = $("#photo dt img").eq(next).attr("bigsrc");
        $("#photo_big .big .left").attr("src", prev_img.src);
        $("#photo_big .big .right").attr("src", next_img.src);
        $("#photo_big .big img").attr("index", $(children).index());
        $("#photo_big .big .index").html(parseInt($(children).index()) + 1 + "/" + $("#photo dt img").length());
    }



});