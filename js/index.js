// ios点击事件不触发
$(function () {
    FastClick.attach(document.body);
})
// 主页展示，输入框的
var jump_alink = localStorage.getItem('jump_alink')
$(document).ready(function () {
    //是否关注公众号
    var attention = true;
    // 是否绑定手机号
    var binding = true;
    // 本网，异网判断（本网）
    var CM = true;
    // 链接
    var data_left = parseInt(Math.random() * 3);
    var data_li = parseInt(Math.random() * 3);
    // 用于按钮弹窗，还是点击礼盒（默认按钮）
    var isbtn = true
    //是否分享（没分享）
    var ishare = false
    //是否转增
    var increase;
    // 用于判断最最后一页是点击，还是自动播放
    var clickNext = true
    // 定时器变量（为了清除定时器）
    var nextPage;
    // 背景音乐和声音的处理start
    var music = document.getElementById('music')
    music.load();
    //bgMusic
    wx.config({
    });
    wx.ready(function () {
        function audioAutoPlay(id) {
            var audio = document.getElementById(id),
                play = function () {
                    audio.play();
                    audio.pause();
                    document.removeEventListener("touchstart", play, false);
                };
            audio.play();
            audio.pause();
            document.addEventListener("WeixinJSBridgeReady", function () {
                play();
                music.play();
            }, false);
            document.addEventListener('YixinJSBridgeReady', function () {
                play();
                music.play();
            }, false);
            document.addEventListener("touchstart", play, false);
        }
    });
    ~function () {
        var musicMenu = document.getElementById('musicMenu'),
            musicAudio = document.getElementById('music');

        musicMenu.addEventListener('click', function () {
            if (musicAudio.paused) {//->暂停
                musicAudio.play();
                musicMenu.className = 'music move';
                return;
            }
            musicAudio.pause();
            musicMenu.className = 'music';
        }, false);

        function controlMusic() {
            musicAudio.volume = 0.5;
            // musicAudio.pause();
            musicAudio.addEventListener('canplay', function () {
                musicMenu.style.display = 'block';
                musicMenu.className = 'music move';
            }, false);
        }
        window.setTimeout(controlMusic, 1000);
    }();
    // 背景音乐和声音的处理end

    // 翻页turn
    // 初始化turn容器
    function init_turn() {
        function loadApp() {
            var w = $(window).width();
            var h = $(window).height();
            // var h =300;
            //判断是否是移动端
            if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                //书本初始化
                $('.flipbook').turn({
                    width: w,
                    height: h,//书本的大小
                    direction: "ltr",//书本翻动方向
                    elevation: 50, //在转换期间设置页面的标高。
                    display: "single",//display("double"  "single")  展示一页或者两页，默认double
                    duration: 1000,// 设置翻页动画持续时间即翻页的快慢，默认600(毫秒)
                    gradients: true,//翻页阴影
                    acceleration: true,// 硬件加速，对于触摸设备，一定要设置true
                    autoCenter: false //是否居中 默认false
                });
            } else {
                //书本初始化
                $('.flipbook').turn({
                    width: w,
                    height: h,
                    direction: "ltr",
                    elevation: 50,
                    display: "double",
                    duration: 1000,
                    gradients: true
                });
                var $pages = $(".page");
                if ($pages.length > 0) {
                    for (var i = 0; i < $pages.length; i++) {
                        $pages.eq(i).css("width", w / 2);
                    }
                }
            }
        }
        yepnope({
            test: Modernizr.csstransforms,
            yep: ['js/turn.js'],
            nope: ['js/turn.html4.min.js'],
            both: ['css/basic.css'],
            complete: loadApp
        });
    }
    init_turn();
    //  start：页面启动时触发
    // 当翻动左角和右角时，禁止启动动画
    $(".flipbook").bind("start", function (event, pageobject, corner) {
        if (corner == "tl" || corner == "tr") {
            event.preventDefault();
        }
    })
    // 首次（定时器控制自动翻页）
    function time_auto() {
        nextPage = setInterval(function () {
            next_page();
        }, 3500);
    }
    // 第一页
    $('.flipbook').bind("first", function () {
        clearInterval(nextPage);
    })
    // 最后一页（当到达最后一页的时候，清楚定时器）
    $('.flipbook').bind("last", function () {
        clearInterval(nextPage);
    })
    // 下一页
    function next_page() {
        $('.flipbook').turn("next");
        if ($(".flipbook").turn("animating")) {
            currPage()
        } else {
            $('.list').hide()
            $('.last_page').show()
            setTimeout(function () {
                endClose()
            }, 1000)
        }
    };
    // 点击结束
    $('.finish').on('click', function () {
        $('.last_page').hide()
        $('.end').show()
    })
    // 当前页内容的效果
    function currPage() {
        $(".flipbook").bind("turned", function (event, page, view) {
            pageEffect(page)
        })
    }
    // 跳转到指定页面
    function jumpPage(index) {
        $(".flipbook").turn("page", index)
        pageEffect(index)
    }
    // 翻页end

    // 当前页效果
    function pageEffect(current_page) {
      if (current_page == 5) {
            if (!firstLoading) {
                setTimeout(function () {
                    $('.list').hide()
                    $('.last_page').show()
                    setTimeout(function () {
                        endClose()
                        setTimeout(function () {
                            $('.last_page').hide()
                            $('.end').show()
                        }, 7500)
                    }, 1000)
                }, 2000)
            }
        }
    }

    // 首页翻书
    count_number = 0
    function flipbook() {
        var bgCounter = 0,
            backgrounds = [
                "images/homex_02.png",
                "images/homex_03.png",
                "images/homex_04.png",
            ];
        function changeBackground() {
            bgCounter = bgCounter % backgrounds.length;
            $('#change').css('background', 'url(' + backgrounds[bgCounter] + ') no-repeat ');
            $('#change').css('background-size', 'cover');
            if (count_number == 0) {
                bgCounter++
                if (bgCounter == 3) {
                    count_number++
                    setTimeout(function () {
                        $('.home').hide();
                        if (firstLoading) {
                            blingBian()
                            $('#play_memories').removeClass('bScale');
                            $('#ph_title').addClass('second_title')
                            $('#tiaoguo').show()
                            againEnter()
                        } else {
                            $('#play_memories').addClass('bScale');
                            $('#ph_title').addClass('first_title')
                        }
                        $('.phdisplay').show();
                    }, 800)
                } else {
                    setTimeout(changeBackground, 400);
                }
            }
        }
        changeBackground();
    };
    // 开启回忆
    $('#start_memories').on('click', function () {
        resetStyle()
        flipbook();
    });
    //照片展示(播放回忆) 
    $('#play_memories').on('click', function () {
        $('.phdisplay').hide();
        if (!firstLoading) {
            time_auto();
        } else {
            $('#return').show();
        }
        playMusic();
        $('.list').show();
        currPage();
    })
    // 照片展示（点击所有的照片跳转到对应场景）
    function againEnter() {
        $('.ph_list li').each(function () {
            $(this).click(function () {
                var ph_index = $(this).index();
                $('.phdisplay').hide();
                $('#return').show();
                playMusic();
                $('.list').show();
                jumpPage(ph_index + 1);
            })
        });
    }
    // 回忆录中的上一页和下一页
    $('.prev').on('click', function () {
        $('.list').hide()
        $('.phdisplay').show()
    })
    $('.next').on('click', function () {
        var current_page = $(".flipbook").turn("page")
        if (current_page == 5) {
            // resetStyle()
        }
        next_page();
    })
    // 结束页
    // 送她520MB
    $('#givebtn').on('click', function () {
        isbtn = true
        if (jump_alink) {
            // 查看
            jiangli();
        } else {
            // 送她
            var input_val = $('#inputTel').val();
            if (istel(input_val)) {
                $('.phone_text').text(input_val);
                jiangli();
            } else {
                alert('请输入正确的北京移动号');
                $('#inputTel').val('')
            }
        }

    });
    // 点击再看相册
    $('#again_look').on('click', function () {
        firstLoading = localStorage.getItem('firstLoading')
        $('.end').hide();
        $('#change').css('background-image', 'url(./images/homex_01.png)');
        // 重置首页
        count_number = 0;
        // 重置第一个场景
        $(".flipbook").turn("page", 1);
        $('.home').show();
    });
    //点击礼盒
    $('#main_share').on('click', function () {
        isbtn = false
        ishare ? jiangli() : $('.share').show()
    })
    // 关闭分享(测试用)
    $('.share').on('click', function () {
        ishare = true;
        $('.share').hide()
        jiangli()
    })
    // 判断关注，绑定等（直接转增）
    function jiangli() {
        if (attention) {
            // 已关注
            if (binding) {
                showMask();
                if (isbtn) {
                    if (CM) {
                        // 链接
                        switch (data_left) {
                            case 0:
                                // 5元欢享券
                                $('.giveta_libg').css('background-image', 'url(images/ban_wuyuan.jpg)')
                                $('.giveta_link').attr('href', 'http://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7858699aca01b75f&redirect_uri=http%3A%2F%2Fserviceimg.bmcc.com.cn%2Fweixin%2Fredirect%2FdispenseRequest.action&response_type=code&scope=snsapi_base&state=hxyhq5Y#wechat_redirect')
                                break;
                            case 1:
                                // 自由话费 
                                $('.giveta_libg').css('background-image', 'url(images/ban_ziyou.jpg)')
                                $('.giveta_link').attr('href', 'http://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7858699aca01b75f&redirect_uri=http%3A%2F%2Fserviceimg.bmcc.com.cn%2Fweixin%2Fredirect%2FdispenseRequest.action&response_type=code&scope=snsapi_base&state=cydsfzyhf38#wechat_redirect')
                                break;
                            case 2:
                                // 倍享包
                                $('.giveta_libg').css('background-image', 'url(images/ban_beixiang.png)')  
                                $('.giveta_link').attr('href', ' https://mp.weixin.qq.com/s/6vXyrUx9Fy4Y-hqwXzf9cQ')
                                break;
                        }
                    } else {
                        // 异网（移动王卡）
                        $('.giveta_libg').css('background-image', 'url(images/ban_wangka.png)')
                        $('.giveta_link').attr('href', 'https://service.bj.10086.cn/m/num/num/commonNum/showFontPage.action?busiCode=YDWKWXYW')
                    }
                   jump_alink ? $('.tc_02').show() : $('.tc_01').show()
                } else {
                    // 本网
                    if (CM) {
                        switch (data_li) {
                            case 0:
                                // 本网
                                // 手厅活动 
                                $('.al_cmbg').css('background-image', 'url()')
                                $('.a_link_cm').attr('href', 'http://sc.bj.chinamobile.com/activity/loading/loading.html?actname=coupon')
                                break;
                            case 1:
                                // 10GB欢享券 
                                $('.al_cmbg').css('background-image', 'url(images/ban_shiyuan.jpg)')
                                $('.a_link_cm').attr('href', 'http://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7858699aca01b75f&redirect_uri=http%3A%2F%2Fserviceimg.bmcc.com.cn%2Fweixin%2Fredirect%2FdispenseRequest.action&response_type=code&scope=snsapi_base&state=hxyhq10Y#wechat_redirect')
                                break
                            case 2:
                                // 流量放心用 
                                $('.al_cmbg').css('background-image', 'url(images/ban_fangxin.png)')
                                $('.a_link_cm').attr('href', 'https://mp.weixin.qq.com/s/K6W3CaZajWdDb4WgBxJUXQ')
                                break;
                        }
                        $('.tc_03').show()
                    } else {
                        // 异网
                        if ($('#main_share').hasClass('allget')) {
                      
                            $('.tc_07').show()
                        } else {
                        // 异网用户分享：无限卡 
                            $('.al_yibg').css('background-image', 'url(images/ban_wuxianka.png)')
                            $('.a_link_yi').attr('href', 'https://service.bj.10086.cn/m/num/num/commonNum/showFontPage.action?busiCode=WXKWTYW')
                            $('.tc_04').show()
                        }

                    }
                }
            } else {
                // 未绑定手机号
                $('.end').hide();
                $('.bind').show();
            }
        } else {
            // 未关注
            window.location.href = "https://mp.weixin.qq.com/s/I5_SP5hTP5tmwZmWn8_i3Q";
        }
    };
    // (修改和确认)
    function Transfcancel() {
        if (increase) {
            //转增
            $('.tc_01').hide();
            $('.tc_02').show();
        } else {
            //  取消
            hideMask();
            $('.tc_01').hide();
        }
    };
    // 转增或取消
    function TransGive() {
        if (increase) {
            //转增
            $('.tc_04').hide();
            $('.tc_05').show();
        } else {
            //  取消
            hideMask();
            $('.tc_04').hide();
        }
    };
    // 信息确认（修改）
    $('#modify').on('click', function () {
        increase = false;
        Transfcancel();
    })
    // 信息确认（确认）
    $('#givebtn_01').on('click', function () {
        increase = true;
        Transfcancel();
        var jump_alink = localStorage.getItem('jump_alink')
        if (jump_alink == null) {
            localStorage.setItem('jump_alink', true)
        }
        
    })
    // 异网弹窗2
    $('#givebtn5').on('click', function () {
        var inputMobile = $('#inputMobile').val();
        if (istel(inputMobile)) {
            $('.tc_05').hide()
            $('.mobile_text').text(inputMobile)
            $('.tc_06').show();
        } else {
            alert('请输入正确的北京移动号');
            $('#inputMobile').val('')
        }
    })
    // 异网弹窗3(修改)
    $('#reset6').on('click', function () {
        $('.tc_06').hide();
        $('.tc_05').show();
    })
    // 异网弹窗3(确认)
    $('#givebtn6').on('click', function () {
        $('.tc_06').hide();
        $('.tc_07').show();
    })
    // 异网弹窗4
    $('#close7').on('click', function () {
        $('#main_share').addClass('allget')
        $(this).parent().hide();
        hideMask()
    })
    // 异网弹窗4（确认）
    $('#givebtn4').on('click', function () {
        increase = true;
        TransGive()
    })
    // 点击关闭
    $('.close').on('click', function () {
        hideMask();
        $(this).parent().hide();
    })
    //移动手机号码验证
    function istel(tel) {
        var rtn = false;
        //移动号段验证
        // var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
        var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(17[2|8])|(165)|(147)|198)[\d]{8}$/;
        if (regtel.test(tel)) {
            rtn = true;
        }
        return rtn;
    }
    // 动效
    // 合上相册
    function endClose() {
        $('#last_first').removeClass('rotateInDownRight')
        setTimeout(cludeChangeImg(), 3000)
    }
    function cludeChangeImg() {
        $('.last_img').animate({ width: "4.9rem", height: '5.58rem', opacity: '0', left: '0', right: '0', filter: 'alpha(opacity=0)' }, 1500, function () {
            $('#last_first').css('display', 'none')
            $('.last_01').stop().animate({ opacity: '1' }, 'slow', function () {
                $('.last_02').stop().animate({ opacity: '1' }, "slow", function () {
                    $('.last_03').stop().animate({ opacity: '1' }, "slow", function () {
                        if (firstLoading) {
                            $('.finish').show()
                        }
                    })
                })
            })
        })
    }
    // 重置合上相册的初始样式
    function resetStyle() {
        $('.reset_list').css('opacity', '0')
        $('.last_img').css({ 'opacity': '1', 'width': '9rem', 'height': '12rem', 'left': '-1.3rem' })
        $('#last_first').css('display', 'block')
        $('.finish').hide()
    }
    // 展示相册页的边框
    function blingBian() {
        $('.ph_list>li:eq(0)').addClass('bling')
        function nextling() {
            setTimeout(function () {
                var index = $('.bling').next('li').index()
                $('.ph_list li').attr('class', '')
                if (index > 0) {
                    $('.ph_list>li:eq(' + index + ')').addClass('bling')
                    return nextling()
                } else {
                    return blingBian()
                }
            }, 2000)
        }
        nextling()
    }
    // 活动规则
    $('.rule').on('click', function () {
        showMask();
        $('.tc_rule').show();
    })
    // 点击跳过
    $('#tiaoguo').on('click', function () {
        $('.phdisplay').hide();
        $('.end').show()
    })


    // 测试
    // 没有关注
    $('.test2').on('click', function () {
        $('.test2').css('color', 'red');
        attention = false;
    });
    // 没有绑定
    $('.test3').on('click', function () {
        $('.test3').css('color', 'red');
        binding = false;
    });
    // 恢复首次登录
    $('.test5').on('click', function () {
        $('.test5').css('color', 'red');
        localStorage.clear()
        window.location.href = "index.html?time=" + ((new Date()).getTime());
    });
    // 异网
    $('.test4').on('click', function () {
        $('.test4').css('color', 'red');
        CM = false;
    });
    $('.test6').on('click', function () {
        $('.test6').css('color', 'red');
        localStorage.removeItem('jump_alink')
        window.location.href = "index.html?time=" + ((new Date()).getTime());
    });
});
function playMusic() {
    // 播放
    $('#musicMenu').addClass('move');
    $('#musicMenu').show();
    music.play();
}
function pauseMusic() {
    // 暂停
    $('#musicMenu').hide();
    $('#musicMenu').removeClass('move');
    music.pause();
}
//显示遮罩层
function showMask() {
    $("#mask").css("height", $(document).height());
    $("#mask").css("width", $(document).width());
    $("#mask").show();
    $('body').css('position', 'fixed');
}
//隐藏遮罩层
function hideMask() {
    $("#mask").hide();
    $('body').css('position', 'unset');
}

