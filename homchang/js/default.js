var domain = document.domain;

var entrance_url = window.location.href; //记录入口url地址，解决ios pushState 地址栏不变的bug
var is_ios_and_initWx = false;

var userInfo = null;
var current_product = null;
var my_cart = [];
if (localStorage.cart != undefined) {
    my_cart = JSON.parse(localStorage.cart);
}
var orderInfo = {
    address_id: "",
    express_type: "",
    products: [],
    store: "",
    memo: ""
};
if (sessionStorage.orderInfo != undefined) {
    orderInfo = JSON.parse(sessionStorage.orderInfo);
}
//    sale_type:优惠类型('0.未优惠','1.每月优惠','2.老客户优惠','3.周未Party')
var discount_list = [{
    name: "每月优惠",
    value: 1
}, {
    name: "老客户优惠",
    value: 2
}, {
    name: "周末Party",
    value: 3
}];
//订单状态(可选)"0">未付款"1">已付款"2">已发货"3">已收货"4">已取消"5">已评价
var order_status_list = [{
    name: "待付款",
    value: 0
}, {
    name: "已付款",
    value: 1
}, {
    name: "已发货",
    value: 2
}, {
    name: "待评价",
    value: 3
}, {
    name: "已取消",
    value: 4
}, {
    name: "已完成",
    value: 5
}];

if (localStorage.userInfo != undefined) {
    userInfo = JSON.parse(localStorage.userInfo);
} else {
    var url_code = getParameter("code");
    console.log("已取得code-" + url_code);
    if (url_code == null) {
        var curr_url = location.href.split('#')[0];
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx027d7825030faa03&redirect_uri=" + curr_url + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
    } else {
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/sendAuth",
            data: {
                code: url_code
            },
            async: false,
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    userInfo = data.Common.info;
                    localStorage.userInfo = JSON.stringify(data.Common.info);
                    console.log("用户信息已缓存！");
                }
            }
        });
    }
}

console.log(userInfo);



//root font-size
(function(doc, win) {
    "use strict";
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            var htmlFontSize = 20;
            var designWidth = 375;
            if (!clientWidth) return;
            docEl.style.fontSize = htmlFontSize * (clientWidth / designWidth) + 'px';
            var reality = Number(docEl.style.fontSize.substr(0, docEl.style.fontSize.length - 2));
            var theory = htmlFontSize * (clientWidth / designWidth);
            if (reality != theory) {
                docEl.style.fontSize = htmlFontSize * theory / reality * (clientWidth / designWidth) + 'px';
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

;
(function($) {
    $.extend($.fn, {
            validate: function() {
                var pass = true;
                this.each(function(index, el) {
                    if ($(this).attr("required") != undefined) { //html的pattern要注意转义
                        if ($(this).val() == "") {
                            $.toast($(this).attr("emptyTips"));
                            pass = false;
                            return false;
                        } else {
                            if ($(this).attr("pattern") != undefined) { //html的pattern要注意转义
                                var reg = new RegExp($(this).attr("pattern"));
                                console.log(reg);
                                if (!reg.test($(this).val())) {
                                    $.toast($(this).attr("notMatchTips"));
                                    pass = false;
                                    return false;
                                }
                            }
                        }
                    }
                });
                return pass;
            }
        })
        // $.getScript = function(url, callback) {
        // }
})(Zepto);
/** 
 * 乘法 
 * @param arg1 
 * @param arg2 
 * @returns {Number} 
 */
function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {}
    try {
        m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
/** 
 * 加法 
 * @param arg1 
 * @param arg2 
 * @returns {Number} 
 */
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2))
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m
}
/** 
 * 减法 
 * @param arg1 
 * @param arg2 
 * @returns 
 */
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka  
    //动态控制精度长度  
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//getDiscountWord
function getNameByValue(val, arr) {
    var v = Number(val);
    var result = "";
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].value == v) {
            result = arr[i].name;
            break;
        }
    }
    return result;
}
//时间戳格式化
function func_format_data(timestamp) {

    var temp = timestamp;
    if (timestamp.toString().length == 10) {
        temp = timestamp * 1000;
    }

    var date = new Date(temp * 1);
    var year = date.getFullYear(),
        month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1),
        day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
        hour = (date.getHours() + 1) > 9 ? (date.getHours() + 1) : '0' + (date.getHours() + 1),
        minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();

    return {
        date: year + '-' + month + '-' + day,
        time: hour + ':' + minute,
        datetime: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    };
}
template.helper('date_format', function(date) {

    return func_format_data(date);
})
template.helper("discount_format", function(status) {
    return getNameByValue(status, discount_list);
});
template.helper("order_status_format", function(status) {
    return getNameByValue(status, order_status_list);
});

var time = 10; // time in seconds
var $progressBar,
    $bar,
    $elem,
    isPause,
    tick,
    percentTime;

function progressBar(elem) {
    $elem = elem;
    $progressBar = $("<div>", {
        class: "swiper-pagination-progress"
    });
    $bar = $("<span>", {
        class: "swiper-pagination-progressbar"
    });
    $elem.paginationContainer.after($progressBar.append($bar));
    start();
}

function start() {
    percentTime = 0;
    isPause = false;
    tick = setInterval(interval, 10);
};

function interval() {
    if (isPause === false) {
        percentTime += 1 / time;
        $bar.css({
            width: percentTime + "%"
        });
        if (percentTime >= 100) {
            $elem.slideNext();
        }
    }
}

function moved() {
    clearTimeout(tick);
    start();
}

function getParameter(key) {
    var url = window.location.search;
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = url.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}

function func_ajax(option) {
    var default_opt = {
        type: "post",
        url: "",
        data: null,
        dataType: "json",
        async: true,
        successCallback: function(data) {
            console.log(data)
        }
    }
    var opt = $.extend(default_opt, option);
    $.ajax({
        type: opt.type,
        url: opt.url,
        data: opt.data,
        dataType: opt.dataType,
        async: opt.async,
        beforeSend: function() {
            $.showIndicator();
        },
        success: function(data) {
            opt.successCallback(data);
            $.hideIndicator();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(XMLHttpRequest.status + "-" + XMLHttpRequest.readyState + "-" + textStatus);
        }
    });
}

function wxApi(fun_callback) {
    var wx_config_data = new Object();

    var curr_url = location.href.split('#')[0];
    console.info($.device.ios);
    var is_ios_wx = $.device.ios && ($.device.webView != null);
    if (is_ios_wx) {
        curr_url = entrance_url;
    }
    console.info("浏览器地址栏" + curr_url);

    //ios只需配置一次config
    if ((!is_ios_and_initWx && is_ios_wx) || !is_ios_wx) {
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getWxConfig",
            data: {
                curr_url: curr_url,
                open_id: userInfo.open_id
            },
            successCallback: function(data) {
                console.log(data);
                wx_config_data = data.Common.info;
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wx_config_data.appId, // 必填，公众号的唯一标识
                    timestamp: wx_config_data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: wx_config_data.nonceStr, // 必填，生成签名的随机串
                    signature: wx_config_data.signature, // 必填，签名，见附录1
                    jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onVoiceRecordEnd',
                            'playVoice',
                            'onVoicePlayEnd',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay',
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard'
                        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function() {
                    if (typeof(fun_callback) == "function") {
                        fun_callback();
                    }
                });
            }
        });
        is_ios_and_initWx = true;
    }
}



$(function() {
    'use strict';


    /*****page-index*****/


    $(document).on("click", ".counter .minus", function() {
        var $counter = $(this).next("input");
        if ($counter.val() != 1) {
            $counter.val(parseInt($counter.val()) - 1);
            $("#page-details .chose-count").html($counter.val());
            cartSum();
        }
    });

    $(document).on("click", ".counter .plus", function() {
        var $counter = $(this).prev("input");
        $counter.val(parseInt($counter.val()) + 1);
        $("#page-details .chose-count").html($counter.val());
        cartSum();
    });
    $(document).on("click", ".popup-overlay", function() {
        $.closeModal();
    });



    $(document).on("pageInit", "#page-index", function(e, pageId, $page) {

        setCartSupIcon();

        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getCarousels",
            data: {
                type: 0
            },
            successCallback: function(data) {
                var temp_data = {
                    list: data.Common.info
                };
                var temp_html = template("page-index-swiper", temp_data);
                $("#page-index .swiper-wrapper").html(temp_html);
                $("#page-index .swiper-container").swiper({
                    loop: true,
                    onInit: progressBar,
                    onTouchStart: function() {
                        isPause = true;
                    },
                    onTouchEnd: function() {
                        isPause = false;
                    },
                    onSlideChangeStart: moved
                });
            }
        });


        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getCategoriesByParentId",
            data: {
                parent_id: 0
            },
            successCallback: function(data) {
                var temp_data = {
                    list: data.Common.info
                };
                var temp_html = template("page-index-category", temp_data);
                $("#page-index .product-nav-list .flex").html(temp_html);

                var temp_html1 = template("page-category-nav", temp_data);
                $("#page-category .category-list").html(temp_html1);

                var temp_html2 = template("page-category-sub-nav", temp_data);
                $("#page-category .tabs").html(temp_html2);
            }
        });

        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getProducts?p=1",
            data: {
                size: 10
            },
            successCallback: function(data) {
                var temp_data = {
                    list: data.Common.info.list
                }
                var temp_html = template("page-index-product", temp_data);
                $("#page-index .product-list").html(temp_html);
            }
        });


    });

    $(document).on("click", "#page-index .product-nav-list a", function(event) {
        event.preventDefault();
        /* Act on the event */
        var category_tab_id = $(this).attr("data-href");
        sessionStorage.category_tab_id = category_tab_id;
        var current_tab = $("#page-category " + category_tab_id);
        var current_tab_link = $("#page-category a[href='" + category_tab_id + "']");
        $("#page-category .active").removeClass("active");
        current_tab.addClass("active");
        current_tab_link.addClass("active");
    });
    /*****page-category*****/
    $(document).on("pageInit", "#page-category", function(e, pageId, $page) {

        if ($("#page-category #tab0").length == 0) {
            func_ajax({
                url: "http://www.michellelee.top/index.php/Api/index/getCategoriesByParentId",
                data: {
                    parent_id: 0
                },
                successCallback: function(data) {
                    var temp_data = {
                        list: data.Common.info
                    };

                    var temp_html1 = template("page-category-nav", temp_data);
                    $("#page-category .category-list").html(temp_html1);

                    var temp_html2 = template("page-category-sub-nav", temp_data);
                    $("#page-category .tabs").html(temp_html2);

                    var current_tab = $("#tab0"); //默认
                    var current_tab_link = $("a[href='#tab0']"); //默认
                    if (sessionStorage.category_tab_id != undefined) {
                        var id = sessionStorage.category_tab_id;
                        current_tab = $(id);
                        current_tab_link = $("a[href='" + id + "']");
                    }
                    current_tab.addClass("active");
                    current_tab_link.addClass("active");
                }
            });
        }



    });
    $(document).on("click", "#page-category .tab-link", function(event) {
        event.preventDefault();
        sessionStorage.category_tab_id = $(this).attr("href");
    });


    /*****page-details*****/


    var comment_page = 1;
    // 加载flag
    var comment_loading = false;
    // 最多可加载的条目
    var comment_maxItems = 0;

    // 每次加载添加多少条目
    var comment_itemsPerLoad = 5;

    var comment_lastIndex = 0;

    function comment_addItems(number) {

        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getProductComment?p=" + comment_page,
            data: {
                size: number,
                product_id: getParameter("p_id")
            },
            successCallback: function(data) {
                var html = '';
                var surface_comment_html = '';
                if (data.Common.code == 200) {
                    comment_maxItems = data.Common.info.total;
                    var list = data.Common.info.list;
                    for (var i = 0; i < list.length; i++) {
                        html += '<li class="weui-comment-item">\
                                <div class="weui-comment-li"><i class="icon-' + list[i].score + '-stars"></i></div>\
                                <div class="userinfo"><strong class="nickname">' + list[i].user.user_name + '</strong><span class="avatar" style="background-image: url(' + list[i].user.head_img + ');"> </span>\
                                    <div class="weui-comment-msg">' + list[i].content + '</div>\
                                    <p class="time">' + list[i].create_time + '</p>\
                                </div>\
                             </li>'
                        if (i < 3) {
                            surface_comment_html = html
                        } else {
                            if ($("#page-details .show-all-comment").hasClass("hide")) {
                                $("#page-details .show-all-comment").removeClass("hide");
                            }
                        }
                    }
                } else {
                    html = '<li class="no-data"><div><span>暂无评论</span></div></li>';
                    surface_comment_html = html;
                }
                // 添加新条目
                $('#page-details #tab3 .infinite-scroll-bottom .list-container').append(html);
                $('#page-details .surface-comment ul').html(surface_comment_html);

                //页数+1
                comment_page++;
                // 更新最后加载的序号
                comment_lastIndex = $('#page-details .list-container li').length;

                // 重置加载flag
                comment_loading = false;

                if (comment_lastIndex >= comment_maxItems) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    $.detachInfiniteScroll($('#page-details #tab3 .infinite-scroll'));
                    // 删除加载提示符
                    $('#page-details #tab3 .infinite-scroll-preloader').remove();
                    return;
                }
                //容器发生改变,如果是js滚动，需要刷新滚动
                $.refreshScroller();
            }
        });
    }

    // 注册'infinite'事件处理函数
    $(document).on('infinite', '#page-details #tab3 .infinite-scroll-bottom', function() {

        // 如果正在加载，则退出
        if (comment_loading) return;

        // 设置flag
        comment_loading = true;

        // 添加新条目
        comment_addItems(comment_itemsPerLoad);
    });



    $(document).on("pageInit", "#page-details", function(e, pageId, $page) {
        setCartSupIcon();
        //预先加载
        comment_addItems(comment_itemsPerLoad);



        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getProductInfo",
            data: {
                product_id: getParameter("p_id")
            },
            successCallback: function(data) {
                var data = data.Common.info;
                var swiper_temp_data = {
                    list: data.imgs
                };
                console.log(data);
                current_product = data;
                var temp_html = template("page-details-swiper", swiper_temp_data);
                $("#page-details .swiper-wrapper").html(temp_html);
                $("#page-details .swiper-container").swiper({});
                $("#page-details .name .item-title").html(data.name);
                $("#page-details .desc .item-inner").html(data.summary);
                $("#page-details .data .item-title .price").html(data.current_price);
                $("#page-details .data .item-after .num").html(data.res_count);
                $("#page-details .data .item-after .comment").html(data.comment_num);
                $("#page-details .specification .item-title").html(data.specification);
                $("#page-details #tab2 .content-block").html(data.description);
                $(".popup-select .avatar").css("background-image", "url(" + data.feng_mian_image + ")");
                $(".popup-select h3").html(data.current_price);
                var d = "暂无优惠";
                if (getNameByValue(data.sale_type, discount_list) != "") {
                    d = '<span>' + getNameByValue(data.sale_type, discount_list) + '</span>';
                }
                $("#page-details .discount .tag-list").html(d);

                wxApi(function() {
                    console.log("http://" + domain + data.imgs[0]);
                    $(document).on("click", "#page-details .swiper-slide", function(event) {
                        event.preventDefault();
                        var preview_list = [];
                        var index = $(this).index();
                        for (var i = 0; i < data.imgs.length; i++) {
                            preview_list.push("http://" + domain + data.imgs[i]);
                        }
                        wx.previewImage({
                            current: preview_list[index],
                            urls: preview_list
                        });
                    });
                });
            }
        });

        $("#page-details .address input").cityPicker({});
    });


    $(document).on("click", "#page-details .address", function(event) {
        event.preventDefault();
        $("#page-details .address input").picker("open");
    });

    $(document).on("click", "#page-details .desc", function(event) {
        event.preventDefault();
        $(this).toggleClass("open");
    });

    $(document).on("click", "#page-details .show-all-comment", function(event) {
        event.preventDefault();
        $("#page-details .tab-link").removeClass("active");
        $("#page-details [href='#tab3']").addClass("active");
        $("#page-details .tab").removeClass("active");
        $("#page-details #tab3").addClass("active");
    });
    $(document).on("click", "#page-details .collect-btn", function(event) {
        event.preventDefault();
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/addCollection",
            data: {
                open_id: userInfo.open_id,
                product_id: getParameter("p_id")
            }
        });
    });

    function setCartSupIcon() {
        console.log("更新购物车数量")
        if (my_cart != "") {
            var sum = 0;
            for (var i = 0; i < my_cart.length; i++) {
                sum += Number(my_cart[i].count)
            }

            if ($(".cart-count").length == 0) {
                var h = '<span class="badge cart-count">' + sum + '</span>';
                $(".cart-item").append(h);
            } else {
                $(".cart-count.badge").html(sum);
            }

        }
    }
    $(document).on("click", "#page-details .add-to-cart,.popup-select .add-to-cart", function(event) {
        event.preventDefault();
        var count = Number($("#page-details .chose-count").text());
        //检测购物车里是否有该物品
        var curr_p_id = getParameter("p_id");
        var t = -1;
        for (var i = 0; i < my_cart.length; i++) {
            if (my_cart[i].p_id == curr_p_id) {
                t = i;
                break;
            }
        }
        //购物车已有，不添加只更新数量
        if (t == -1) {
            my_cart.push({
                p_id: curr_p_id,
                info: current_product,
                count: count,
                select: false
            });
        } else {
            my_cart[t].count = Number(my_cart[t].count) + count;
        }
        localStorage.cart = JSON.stringify(my_cart);
        console.log(my_cart);
        setCartSupIcon();
    });


    /*****page-search*****/
    $(document).on("pageInit", "#page-search", function(e, pageId, $page) {

        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getProducts?p=1",
            data: {
                size: 10,
                hot: 1
            },
            successCallback: function(data) {
                var temp_data = {
                    list: data.Common.info.list
                }
                var temp_html = template("page-search-item", temp_data);
                $("#page-search .product-list").html(temp_html);
            }
        });



    });


    //无限加载
    var search_page = 1;
    // 加载flag
    var search_loading = false;
    // 最多可加载的条目
    var search_maxItems = 0;

    // 每次加载添加多少条目
    var search_itemsPerLoad = 10;

    var search_lastIndex = 0;

    //搜索条件
    var search_option = new Object();


    $(document).on("pageInit", "#page-search-result", function(e, pageId, $page) {
        search_option.search_content = getParameter("kw");
        search_option.category_id = getParameter("c_id");
        $("#page-search-result #search").val(search_option.search_content);

        var temp_discount_list = "";
        for (var i = 0; i < discount_list.length; i++) {
            temp_discount_list += '<li data-discount="' + discount_list[i].value + '">' + discount_list[i].name + '</li>'
        }
        $("#panel-filter .discount-list").html(temp_discount_list);
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getCategoriesByParentId",
            data: {
                parent_id: 0
            },
            successCallback: function(data) {
                var temp_data = {
                    list: data.Common.info
                };
                var temp_html = template("page-search-result-category", temp_data);
                $("#panel-filter .category-list").html(temp_html);

                var temp_html1 = template("page-search-result-sub-category", temp_data);
                $("#panel-filter .tabs").html(temp_html1);

                var $curr_category = $("#panel-filter [data-category='" + search_option.category_id + "']");

                var title = $curr_category.text();
                $("#page-search-result header .title").html(title);

                var is_sub = $curr_category.parents("ul").hasClass("sub-category-list");
                var is_main = $curr_category.parents("ul").hasClass("category-list");
                if (is_sub) {

                    $("#panel-filter [data-href='#" + $curr_category.parents(".tab").attr("id") + "']").parents("li").addClass("active");
                    $("#panel-filter .sub-title").removeClass("hide");
                    $curr_category.parents(".tab").addClass("active");
                    $curr_category.addClass("active");
                } else if (is_main) {
                    $curr_category.addClass("active");
                    $("#panel-filter .sub-title").removeClass("hide");
                    $("#panel-filter " + $curr_category.find("a").attr("data-href")).addClass("active");
                }

            }
        });



        $('#page-search-result .infinite-scroll-bottom .list-block ul').html("");
        search_page = 1;
        // 加载flag
        search_loading = false;
        // 最多可加载的条目
        search_maxItems = 0;

        // 每次加载添加多少条目
        search_itemsPerLoad = 10;

        search_lastIndex = 0;

        //预先加载
        search_addItems(search_itemsPerLoad, search_option);
    });


    $(document).on("keydown", "#page-search #search,#page-search-result #search", function(event) {
        if (event.keyCode == 13) {
            var q = "";
            var kw = $(this).val();
            if (kw != "") {
                q = "?kw=" + kw;
            }
            $.router.load("search_result.html" + q);
        }
    });
    $(document).on("keydown", "#page-search-result #search", function(event) {
        if (event.keyCode == 13) {
            search_option.search_content = $(this).val();
            console.info(search_option);
            search_infinite_reset(search_option);
        }
    });


    function search_addItems(number, option) {

        var default_opt = {
            size: number,
            category_id: "",
            search_content: "",
            sale_type: "",
            price_order: "",
            sales_order: ""
        };

        var opt = $.extend(default_opt, option);
        console.log(opt.search_content);
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getProducts?p=" + search_page,
            data: opt,
            successCallback: function(data) {
                var html = '';
                if (data.Common.code == 200) {
                    search_maxItems = data.Common.info.total;
                    var list = data.Common.info.list;

                    for (var i = 0; i < list.length; i++) {
                        var tag = "";
                        var tag_word = getNameByValue(data.sale_type, discount_list);
                        if (tag_word != "") {
                            tag = "<span>" + tag_word + "</span>"
                        }
                        html += '<li>\
                            <a href="details.html?p_id=' + list[i].id + '" class="item-content item-link">\
                                <div class="item-media"><span class="product-img" style="background-image: url(' + list[i].feng_mian_image + ');"></span></div>\
                                <div class="item-inner">\
                                    <div class="item-title-row">\
                                        <div class="item-title">' + list[i].name + '</div>\
                                    </div>\
                                    <div class="item-subtitle">' + list[i].summary + '</div>\
                                    <div class="item-title-row">\
                                        <div class="item-title tag-row">' + tag + '</div>\
                                    </div>\
                                    <div class="item-title-row">\
                                        <div class="item-title price-row"><span>' + list[i].current_price + '</span></div>\
                                    </div>\
                                    <div class="item-subtitle">\
                                        <i class="icon icon-eye"></i><span>' + list[i].browse_num + '</span><i class="icon icon-comment"></i><span>' + list[i].comment_num + '</span><i class="icon icon-star-empty"></i><span>' + list[i].collection_num + '</span></div>\
                                </div>\
                            </a>\
                        </li>';
                    }
                } else {
                    html = '<li class="no-data"><div><span>暂无数据</span></div></li>'
                }
                // 添加新条目
                $('#page-search-result .infinite-scroll-bottom .list-block ul').append(html);
                //页数+1
                search_page++;
                // 更新最后加载的序号
                search_lastIndex = $('#page-search-result .list-block ul li').length;

                // 重置加载flag
                search_loading = false;

                if (search_lastIndex >= search_maxItems) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    $.detachInfiniteScroll($('#page-search-result .infinite-scroll'));
                    // 删除加载提示符
                    $('#page-search-result .infinite-scroll-preloader').remove();
                    return;
                }
                //容器发生改变,如果是js滚动，需要刷新滚动
                $.refreshScroller();
            }
        });
    }

    function search_infinite_reset(option) {

        var opt = option;


        search_page = 1;
        // 加载flag
        search_loading = false;
        // 最多可加载的条目
        search_maxItems = 0;

        // 每次加载添加多少条目
        search_itemsPerLoad = 10;

        search_lastIndex = 0;

        if ($("#page-search-result .infinite-scroll-preloader").length == 0) {

            var preloader_html = '<div class="infinite-scroll-preloader"><div class="preloader"></div></div>';
            $("#page-search-result .infinite-scroll").append(preloader_html);
            $.attachInfiniteScroll($('#page-search-result .infinite-scroll'));
        }
        $('#page-search-result .infinite-scroll-bottom .list-block ul').html("");
        // 添加新条目
        search_addItems(search_itemsPerLoad, opt);
    }

    // 注册'infinite'事件处理函数
    $(document).on('infinite', '#page-search-result .infinite-scroll-bottom', function() {

        // 如果正在加载，则退出
        if (search_loading) return;

        // 设置flag
        search_loading = true;


        // 添加新条目
        search_addItems(search_itemsPerLoad, search_option);

    });

    function reset_list_by_category() {
        var curr_title = $("#panel-filter .sub-category-list").find(".active").text() || $("#panel-filter .category-list").find(".active").text() || "";
        $("#page-search-result header .title").html(curr_title);
        var curr_category_id = $("#panel-filter .sub-category-list").find(".active").attr("data-category") || $("#panel-filter .category-list").find(".active").attr("data-category") || "";
        search_option.category_id = curr_category_id;
        console.info(search_option);
        search_infinite_reset(search_option);
    }

    function reset_list_by_discount() {
        var curr_discount_value = $("#panel-filter .discount-list").find(".active").attr("data-discount") || "";
        search_option.sale_type = curr_discount_value;
        console.info(search_option);
        search_infinite_reset(search_option);
    }
    $(document).on("click", "#panel-filter .category-list li", function(event) {
        event.preventDefault();
        /* Act on the event */
        $("#panel-filter .sub-title.hide").removeClass("hide");
        var is_select = $(this).hasClass("active");
        if (is_select) {
            $(this).removeClass("active");
            $("#panel-filter .sub-title").addClass("hide");
            $("#panel-filter .tabs .active").removeClass("active");
        } else {
            $("#panel-filter .category-list li.active").removeClass("active");
            $(this).addClass("active");
            var target = $(this).find("a").attr("data-href");
            $("#panel-filter .tabs .active").removeClass("active");
            $("#panel-filter .tabs").find(target).addClass("active");
        }
        reset_list_by_category();
    });

    $(document).on("click", "#panel-filter .sub-category-list li", function(event) {
        event.preventDefault();
        /* Act on the event */

        var is_select = $(this).hasClass("active");
        if (is_select) {
            $(this).removeClass("active");

        } else {
            $("#panel-filter .sub-category-list .active").removeClass("active");
            $(this).addClass("active");

        }
        reset_list_by_category();
    });

    $(document).on("click", "#panel-filter .discount-list li", function(event) {
        event.preventDefault();
        /* Act on the event */

        var is_select = $(this).hasClass("active");
        if (is_select) {
            $(this).removeClass("active");

        } else {
            $("#panel-filter .discount-list .active").removeClass("active");
            $(this).addClass("active");

        }
        reset_list_by_discount();

    });
    $(document).on("click", "#panel-filter .discount-list li", function(event) {
        var is_filt = $("#panel-filter .discount-list li.active").length != 0;
        if (is_filt) {
            $("#page-search-result .item-filter").addClass("on");
        } else {
            $("#page-search-result .item-filter").removeClass("on");
        }
    });
    $(document).on("click", "#panel-filter .reset-btn", function(event) {
        $("#panel-filter .discount-list .active").removeClass("active");
        $("#page-search-result .item-filter").removeClass("on");

        search_option.sale_type = null;
        console.info(search_option);
        search_infinite_reset(search_option);
    });
    $(document).on("click", "#page-search-result .item-default,#page-search-result .item-price,#page-search-result .item-sales", function(event) {
        var $this = $(this);
        var is_price = $this.hasClass("item-price");
        var is_curr = $this.hasClass("on");


        if ((!is_price && is_curr)) {
            return false;
        } else if (!is_curr && !is_price) {
            $("#page-search-result .item-default,#page-search-result .item-price,#page-search-result .item-sales").removeClass("on");
            $this.addClass("on");
        } else if (!is_curr && is_price) {
            $("#page-search-result .item-default,#page-search-result .item-price,#page-search-result .item-sales").removeClass("on");
            $this.addClass("on");
        } else if (is_curr && is_price) {
            var is_up = $this.find("i").hasClass("icon-up");
            if (is_up) {
                $this.find("i").removeClass("icon-up").addClass("icon-down");
            } else {
                $this.find("i").removeClass("icon-down").addClass("icon-up");
            }
        }
        var is_default = $this.hasClass("item-default");
        var is_sales = $this.hasClass("item-sales");
        var is_price_asc = is_price && $this.find("i").hasClass("icon-up");
        var is_price_desc = is_price && $this.find("i").hasClass("icon-down");
        var temp = {};
        temp.is_default = is_default;
        temp.is_sales = is_sales;
        temp.is_price_asc = is_price_asc;
        temp.is_price_desc = is_price_desc;
        console.log(temp);
        //  search_infinite_reset()
        //            price_order: null,
        //    sales_order: null
        if (is_sales) {
            search_option.price_order = null;
            search_option.sales_order = 1;
        } else if (is_price_asc) {
            search_option.price_order = 0;
            search_option.sales_order = null;
        } else if (is_price_desc) {
            search_option.price_order = 1;
            search_option.sales_order = null;
        } else {
            search_option.price_order = 0;
            search_option.sales_order = 1;

        }
        console.info(search_option);
        search_infinite_reset(search_option);
    });



    /*****page-cart*****/
    $(document).on("pageInit", "#page-cart", function(e, pageId, $page) {
        setCartSupIcon();
        console.log(my_cart);
        if (my_cart != "") {
            var temp_data = {
                list: my_cart
            }
            var temp_html = template("page-cart-item", temp_data);
            $("#page-cart .list-block ul").html(temp_html);
            $("#page-cart .bar-nav-secondary").removeClass("hide");
            $("#page-cart .cart-title").removeClass("hide");
        } else {
            $("#page-cart .list-block ul").html('<li class="no-goods">购物车空空如也<br>去挑几件好货吧</li>');
            $("#page-cart .bar-nav-secondary").addClass("hide");
            $("#page-cart .cart-title").addClass("hide");
        }
        var is_all = true;
        for (var i = 0; i < my_cart.length; i++) {
            if (!my_cart[i].select) {
                is_all = false;
                break;
            }
        }
        console.log("isall" + is_all);
        if (is_all) {
            $("#page-cart .select-all input").prop("checked", true);
        }
        cartSum();
    });

    $(document).on("click", "#page-cart .select-all", function(event) {
        if ($(event.target).is('input')) {
            return;
        }
        var isAll = $(this).find("input").is(':checked');
        if (isAll) {
            $("#page-cart .product-item  input[type='checkbox']").prop("checked", false);
            $(".select-all").not(this).find("input").prop("checked", false);

        } else {
            $("#page-cart .product-item  input[type='checkbox']").prop("checked", true);
            $(".select-all").not(this).find("input").prop("checked", true);
        }
        for (var i = 0; i < my_cart.length; i++) {
            my_cart[i].select = !isAll;
        }
        localStorage.cart = JSON.stringify(my_cart);
        cartSum();
    });

    $(document).on("click", "#page-cart .product-item label", function(event) {
        if ($(event.target).is('input')) {
            return;
        }
        var isAll = true;
        var isNotAll = true;
        $("#page-cart .product-item label").not(this).find("input[type='checkbox']").each(function() {
            if (!$(this).is(':checked')) {
                isAll = false;
            }
        });
        $("#page-cart .product-item label").find("input[type='checkbox']").each(function() {
            if (!$(this).is(':checked')) {
                isNotAll = false;
            }
        });
        if (isAll) {
            $("#page-cart .select-all input").prop("checked", true);
        }
        if (isNotAll) {
            $("#page-cart .select-all input").prop("checked", false);
        }

        /****************************/
        var flag = !$(this).find("input[type='checkbox']").is(':checked');
        if (flag) {
            var item_list = $("#page-cart .product-item label").find("input[type='checkbox']:checked");
            item_list.push($(this).find("input[type='checkbox']")[0]);
            item_list = item_list.parents(".product-item");
            console.log(item_list);
            //更新缓存购物车物品的选择状态//选择
            my_cart[$(this).parents("li").index()].select = true;
            localStorage.cart = JSON.stringify(my_cart);
        } else {
            var item_list = $("#page-cart .product-item label").not(this).find("input[type='checkbox']:checked").parents(".product-item");
            //更新缓存购物车物品的选择状态//反选
            my_cart[$(this).parents("li").index()].select = false;
            localStorage.cart = JSON.stringify(my_cart);
        }
        /****************************/
        cartSum();

    });

    $(document).on("click", "#page-cart .cart-title .edit-btn", function(event) {
        event.preventDefault();
        /* Act on the event */
        var $this = $(this);
        if ($this.hasClass("editing")) {
            //复原
            $("#page-cart .product-item .delete-btn").remove();
            $("#page-cart .product-item .counter").each(function() {
                var $this = $(this);
                var c = parseInt($this.find("input").val());
                $this.after('<span class="count">' + c + '</span>');
                $this.remove();
            });
            $this.removeClass("editing");



            //完成编辑 ，更新cart
            var temp_cart = [];
            $("#page-cart .list-block ul li").each(function() {
                temp_cart.push({
                    p_id: $(this).find("input[name='p_id']").attr("data-value"),
                    count: Number($(this).find(".count").text())
                });
            });


            if (my_cart.length = temp_cart.length) {
                for (var i = 0; i < my_cart.length; i++) {
                    my_cart[i].count = temp_cart[i].count;
                }
            } else {
                console.log("有删除");
                var edited_cart = []
                for (var i = 0; i < my_cart.length; i++) {
                    for (var j = 0; j < temp_cart.length; j++) {
                        if (my_cart[i].p_id == temp_cart[j].p_id) {
                            edited_cart.push({
                                p_id: my_cart[i].p_id,
                                info: my_cart[i].info,
                                count: temp_cart[j].count
                            });
                        }
                    }
                }
                my_cart = edited_cart;
            }
            //删除最后一个商品
            if ($("#page-cart .product-item").length == 0) {
                $("#page-cart .list-block ul").html('<li class="no-goods">购物车空空如也<br>去挑几件好货吧</li>');
                $("#page-cart .bar-nav-secondary").addClass("hide");
                $("#page-cart .cart-title").addClass("hide");
            }
            cartSum();
            setCartSupIcon();
            localStorage.cart = JSON.stringify(my_cart);

        } else {
            //开启编辑
            $("#page-cart .product-item").append('<div class="item-media delete-btn">删除</div>');
            $("#page-cart .product-item .count").each(function() {
                //获取原有count
                var $this = $(this);
                var c = parseInt($this.text());
                $this.after('<div class="counter"><a class="minus">-</a><input type="number" value="' + c + '" readonly><a class="plus">+</a></div>');
                $this.remove();
            });
            $this.addClass("editing");
        }
    });

    $(document).on("click", "#page-cart .delete-btn", function(event) {
        event.preventDefault();
        /* Act on the event */
        var $this = $(this);
        $.confirm("确定要删除这个商品吗？", function() {
            $this.parents(".product-item").remove();
            var isAll = true;
            var isNotAll = true;
            $("#page-cart .product-item input[type='checkbox']").each(function() {
                if (!$(this).is(':checked')) {
                    isAll = false;
                }
            });
            if (isAll) {
                $("#page-cart .select-all input").prop("checked", true);
            }

            cartSum();
        });
    });

    $(document).on("click", "#page-cart .go-to-order", function(event) {
        var is_empty = true;
        for (var i = 0; i < my_cart.length; i++) {
            if (my_cart[i].select) {
                is_empty = false;
                break;
            }
        }
        if (is_empty) {
            $.toast("您还没选择宝贝哦");
        } else {
            $.router.load("order.html");
        }
    });


    function cartSum() {
        var total_count = 0;
        var total_price = 0;
        for (var i = 0; i < my_cart.length; i++) {
            if (my_cart[i].select) {
                total_count += my_cart[i].count;
                total_price = accAdd(total_price, accMul(parseFloat(my_cart[i].info.current_price), parseFloat(my_cart[i].count))).toFixed(2);
            }
        }

        console.log("count--" + total_count);
        console.log("price--" + total_price);
        $(".total-price").html(total_price);
        $(".total-count").html(total_count);
    }


    /*****page-order*****/
    $(document).on("pageInit", "#page-order", function(e, pageId, $page) {

        console.log(orderInfo);
        var temp_data = {
            list: []
        };
        var temp_data1 = [];
        for (var i = 0; i < my_cart.length; i++) {
            if (my_cart[i].select) {
                temp_data.list.push(my_cart[i]);
                temp_data1.push({
                    product_id: my_cart[i].p_id,
                    count: my_cart[i].count
                });
            }
        }
        if (temp_data1 == "") {
            $.router.load("cart.html");
            return false;
        }
        orderInfo.products = temp_data1;
        sessionStorage.orderInfo = JSON.stringify(orderInfo);
        var temp_html = template("page-order-item", temp_data);
        $("#page-order .order-block ul").html(temp_html);

        cartSum();

        //订单默认地址
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getLocations",
            data: {
                open_id: userInfo.open_id,
                is_main: 1
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var default_data = data.Common.info[0];

                    orderInfo.address_id = default_data.id;
                    sessionStorage.orderInfo = JSON.stringify(orderInfo);

                    $("#page-order .address-block .item-title").html(default_data.contact);
                    $("#page-order .address-block .item-after").html(default_data.tel);
                    $("#page-order .address-block .item-text").html(default_data.address);
                }
            }
        });
        //卡券
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getCardList",
            data: {
                open_id: userInfo.open_id,
            }
        });



        //快递
        var default_express = "送货上门";

        if (!(orderInfo.express_type == "" || orderInfo.express_type == undefined)) {
            if (orderInfo.express_type == "1") {
                $("#page-order .inset-map-wrapper").removeClass("hide");
                default_express = "到店自提";
            } else {
                $("#page-order .inset-map-wrapper").addClass("hide");
            }
        } else {
            orderInfo.express_type = 2;
            sessionStorage.orderInfo = JSON.stringify(orderInfo);
        }
        $("#page-order .express-type").val(default_express);
        $("#page-order .express-type").picker({
            cssClass: "express-type-picker",
            cols: [{
                textAlign: 'center',
                values: ["送货上门", "到店自提"]
            }]
        });
        //附近门店
        if (!(orderInfo.store == "" || orderInfo.store == undefined)) {
            $("#page-order .inset-map-wrapper .item-after").html(orderInfo.store.name);
        }
        //留言
        $("#page-order textarea").val(orderInfo.memo);

    });
    $(document).on("click", ".express-type-picker .close-picker", function(event) {
        event.preventDefault();
        /* Act on the event */
        var value = $(".express-type").val();
        console.log(value);
        if (value == "到店自提") {
            $("#page-order .inset-map-wrapper").removeClass("hide");
            orderInfo.express_type = 1;
            sessionStorage.orderInfo = JSON.stringify(orderInfo);
        } else {
            $("#page-order .inset-map-wrapper").addClass("hide");
            orderInfo.express_type = 2;
            sessionStorage.orderInfo = JSON.stringify(orderInfo);
        }
    });
    $(document).on("click", "#page-order .express-type-wrapper", function(event) {
        event.preventDefault();
        /* Act on the event */
        $(".express-type").picker("open");
    });
    $(document).on("change", "#page-order textarea", function(event) {
        event.preventDefault();
        /* Act on the event */
        orderInfo.memo = $(this).val();
        sessionStorage.orderInfo = JSON.stringify(orderInfo);
    });


    $(document).on("click", "#page-order .submit-order-btn", function(event) {
        event.preventDefault();
        /* Act on the event */
        //todo
        console.log(orderInfo);
        var temp_data = {
            open_id: userInfo.open_id,
            cart: JSON.stringify(orderInfo.products),
            total_price: $("nav .total-price").text(),
            location_id: orderInfo.address_id,
            pick_type: orderInfo.express_type,
            buyer_message: orderInfo.memo
        }
        if (orderInfo.express_type == 2 && (orderInfo.address_id == "" || orderInfo.address_id == undefined)) {
            $.toast("请添加收货地址");
            return false;
        }
        if (orderInfo.express_type == 1 && (orderInfo.store == "" || orderInfo.store == undefined)) {
            $.toast("请选择自提门店");
            return false;
        }
        if (orderInfo.express_type == 1) {
            temp_data.branch_id = orderInfo.store.id;
        }


        //提交订单
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/orderCommit",
            data: temp_data,
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var order_num = data.Common.info;
                    window.location.href = "pay.html?order_num=" + order_num;
                } else {
                    $.toast("提交订单失败，请刷新页面重试！")
                }
            }
        });


    });

    /*****page-pay*****/
    $(document).on("pageInit", "#page-pay", function(e, pageId, $page) {
        wxApi();
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getOrderInfo",
            data: {
                open_id: userInfo.open_id,
                order_no: getParameter("order_num")
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var temp_data = {
                        list: data.Common.info
                    };
                    var temp_html = template("page-pay-info", temp_data);
                    $("#page-pay .content").html(temp_html);
                } else {
                    $.toast("未知错误");
                }
            }
        });
    });

    $(document).on("click", "#page-pay .pay", function(event) {
        event.preventDefault();
        /* Act on the event */
        var name = "鸿畅环保设备有限公司";
        var order_num = $("#page-pay .order-num").text();
        $.ajax({
            type: 'POST',
            url: "http://www.michellelee.top/index.php/Api/index/wxPay",
            data: {
                open_id:userInfo.open_id,
                name: name,
                order_no: order_num
            },
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.Common.code == 200) {
                   var c = data.Common.info;
                    wx.chooseWXPay({
                        timestamp: c.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: c.nonceStr, // 支付签名随机串，不长于 32 位
                        package: c.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: c.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: c.paySign, // 支付签名
                        success: function(res) {
                            // 支付成功后的回调函数
                            //                        location.href = '';
                        },
                    });
                }

            }
        })
    });

    /*****page-my-order*****/
    $(document).on("pageInit", "#page-my-order", function(e, pageId, $page) {
        var current_tab = $("#tab0"); //默认
        var current_tab_link = $("a[href='#tab0']"); //默认
        if (sessionStorage.order_tab_id != undefined) {
            var id = sessionStorage.order_tab_id;
            current_tab = $(id);
            current_tab_link = $("a[href='" + id + "']");
        }
        current_tab.addClass("active");
        current_tab_link.addClass("active");
    });
    $(document).on("click", "#page-my-order .tab-link", function(event) {
        event.preventDefault();
        sessionStorage.order_tab_id = $(this).attr("href");
    });
    /*****page-user-center*****/
    $(document).on("pageInit", "#page-user-center", function(e, pageId, $page) {

        $("#page-user-center .avatar-wrapper span").css("background-image", "url(" + userInfo.head_img + ")");
        $("#page-user-center .user-header-wrapper .username").html(userInfo.user_name);
        var gender_icon = ""
        if (userInfo.sex == "1") {
            gender_icon = "icon-male";
        } else if (userInfo.sex == "2") {
            gender_icon = "icon-female";
        } else {
            gender_icon = "icon-unknow";
        }
        $("#page-user-center .user-header-wrapper .icon-gender").addClass(gender_icon);
        setCartSupIcon();
    });



    $(document).on("click", "#page-user-center .order-block [data-href]", function(event) {
        event.preventDefault();
        /* Act on the event */
        var order_tab_id = $(this).attr("data-href");
        sessionStorage.order_tab_id = order_tab_id;
        var current_tab = $("#page-my-order " + order_tab_id);
        var current_tab_link = $("#page-my-order a[href='" + order_tab_id + "']");
        $("#page-my-order .active").removeClass("active");
        current_tab.addClass("active");
        current_tab_link.addClass("active");
    });



    /*****page-user-info*****/
    $(document).on("pageInit", "#page-user-info", function(e, pageId, $page) {
        $(".gander").picker({
            cssClass: "gander-picker",
            cols: [{
                textAlign: "center",
                values: ["男", "女", "保密"]
            }]
        });
        $(".birthday-picker").calendar({
            onChange: function(p, values, displayValues) {
                console.log(displayValues)
            }
        });
    });
    $(document).on("click", ".gander-picker .close-picker", function(event) {
        event.preventDefault();
        /* Act on the event */
        console.log($("#page-user-info .gander").val());
    });
    $(document).on("click", "#page-user-info .username", function(event) {
        event.preventDefault();
        /* Act on the event */
        $.prompt("修改昵称", function(value) {
            console.log('Your name is "' + value + '".');
        });
    });
    /*****page-address*****/
    $(document).on("pageInit", "#page-address", function(e, pageId, $page) {
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/getLocations",
            data: {
                open_id: userInfo.open_id
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var temp_data = {
                        list: data.Common.info
                    };
                    var temp_html = template("page-address-item", temp_data);
                    $("#page-address .list-block.cards-list ul").html(temp_html);
                }
            }
        });
    });
    $(document).on("click", "#page-address label", function(event) {
        event.preventDefault();
        /* Act on the event */

        var update_id = $(this).parents("li").attr("data-id");
        var $radio = $(this).find("input");
        func_ajax({
            url: "http://www.michellelee.top/index.php/Api/index/addLocation",
            data: {
                open_id: userInfo.open_id,
                location_id: update_id,
                is_main: 1
            },
            successCallback: function(data) {
                $radio.prop("checked", true);
            }
        });

    });


    $(document).on("click", "#page-address .delete-btn", function(event) {
        event.preventDefault();
        /* Act on the event */
        var $delete_ele = $(this).parents("li");
        var delete_id = $delete_ele.attr("data-id");

        $.confirm("确定要删除这个地址吗？", function() {
            func_ajax({
                url: "http://www.michellelee.top/index.php/Api/index/deleteLocation",
                data: {
                    open_id: userInfo.open_id,
                    location_id: delete_id
                },
                successCallback: function(data) {
                    console.log(data);
                    if (data.Common.code == 200) {
                        $delete_ele.remove();
                        if ($("#page-address .list-block.cards-list li").length == 0) {
                            $("#page-address .list-block.cards-list ul").html('<li class="no-data"><div><span>暂无地址</span></div></li>');
                        } else {
                            $("#page-address .list-block.cards-list li").eq(0).find("input[type='radio']").prop("checked", true);
                        }
                    } else {
                        $.toast("删除收货地址失败");
                    }
                }
            });
        });
    });

    $(document).on("click", "#page-address .edit-btn,#page-address .edit-btn", function(event) {
        event.preventDefault();
        /* Act on the event */

        var $li = $(this).parents("li");
        var edit_address = {
            id: $li.attr("data-id"),
            name: $li.find(".name").text(),
            phone: $li.find(".phone").text(),
            address: $li.find(".address-info").text(),

        }
        sessionStorage.edit_address = JSON.stringify(edit_address);
        $.router.load("edit_address.html");
    });

    $(document).on("pageInit", "#page-edit-address", function(e, pageId, $page) {
        if (sessionStorage.edit_address != undefined) {
            var edit_address = JSON.parse(sessionStorage.edit_address);
            $("#page-edit-address [name='name']").val(edit_address.name);
            $("#page-edit-address [name='phone']").val(edit_address.phone);
            var address_list = edit_address.address.split(" ");
            var last_address = address_list.pop();
            address_list.join(" ");
            var first_address = address_list;
            console.log(first_address);
            $("#page-edit-address [name='last-address']").val(last_address);
            $("#page-edit-address .city-picker").cityPicker({
                value: first_address
            });
        } else {
            $.router.load("address.html");
        }
    });


    $(document).on("click", "#page-edit-address .edit.button", function(event) {
        var flag = $("#page-edit-address [name='name'],#page-edit-address [name='phone'],#page-edit-address [name='first-address'],#page-edit-address [name='last-address']").validate();
        if (flag) {
            func_ajax({
                url: "http://www.michellelee.top/index.php/Api/index/addLocation",
                data: {
                    location_id: edit_address.id,
                    open_id: userInfo.open_id,
                    address: $("#page-edit-address [name='first-address']").val() + " " + $("#page-edit-address [name='last-address']").val().trim(),
                    contact: $("#page-edit-address [name='name']").val(),
                    tel: $("#page-edit-address [name='phone']").val()
                },
                successCallback: function(data) {
                    if (data.Common.code == 200) {
                        $.router.back();
                    } else {
                        $.toast("修改收货地址失败");
                    }
                }
            });
        }
    });

    $(document).on("pageInit", "#page-add-address", function(e, pageId, $page) {
        $("#page-add-address .city-picker").cityPicker({
            value: ""
        });



    });

    $(document).on("click", "#page-add-address .add.button", function(event) {
        var flag = $("#page-add-address [name='name'],#page-add-address [name='phone'],#page-add-address [name='first-address'],#page-add-address [name='last-address']").validate();
        if (flag) {
            func_ajax({
                url: "http://www.michellelee.top/index.php/Api/index/addLocation",
                data: {
                    open_id: userInfo.open_id,
                    address: $("#page-add-address [name='first-address']").val() + $("#page-add-address [name='last-address']").val(),
                    contact: $("#page-add-address [name='name']").val(),
                    tel: $("#page-add-address [name='phone']").val()
                },
                successCallback: function(data) {
                    if (data.Common.code == 200) {
                        $.router.back();
                    } else {
                        $.toast("添加收货地址失败");
                    }
                }
            });
        }
    });



    /*****page-bespeak*****/

    $(document).on("pageInit", "#page-bespeak", function(e, pageId, $page) {
        $("#page-bespeak .product-picker").productPicker({});


        $(".fault-picker").picker({
            cols: [{
                textAlign: 'center',
                values: ["不制冷", "不通电"]
            }]
        });
        $("#date").calendar({
            value: ['2015-12-05']
        });
    });



    /*****page-map*****/

    $(document).on("pageInit", "#page-map,#page-inset-map", function(e, pageId, $page) {
        if (pageId == "page-map") {
            wxApi();
        }
        var $this = $(this);
        var map = new qq.maps.Map(document.getElementById("map-container"), {
            zoom: 13,
            mapTypeControl: false
        });

        var infoWin = new qq.maps.InfoWindow({
            map: map
        });

        var user_location = null;


        //判断是否支持 获取本地位置
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            //23.003963 113.355499
            var position = new Object();
            position.coords.latitude = 23.003963;
            position.coords.longitude = 113.355499;
            showPosition(position);
        }

        function showPosition(position) {
            console.log(position);
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            //调用地图命名空间中的转换接口   type的可选值为 1:GPS经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
            qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 1, function(res) {
                console.log(res);
                //取出经纬度并且赋值
                var latlng = res[0];
                var anchor1 = new qq.maps.Point(12, 34),
                    size1 = new qq.maps.Size(24, 34),
                    origin1 = new qq.maps.Point(0, 0),
                    user_icon = new qq.maps.MarkerImage('images/user_marker.png', size1, origin1, anchor1);
                //     user_location
                var user_point = new qq.maps.LatLng(latlng.lat, latlng.lng);
                user_location = {
                    xpoint: latlng.lng,
                    ypoint: latlng.lat
                }
                var user_maker = new qq.maps.Marker({
                    position: user_point,
                    map: map,
                    icon: user_icon
                });

                var label = new qq.maps.Label({
                    position: user_point,
                    map: map,
                    content: '我的位置',
                    offset: new qq.maps.Size(-27, 0)
                });
                console.log(user_location);
                func_ajax({
                    url: "http://www.michellelee.top/index.php/Api/index/getBranches",
                    data: user_location,
                    successCallback(data) {
                        var point_data = data.Common.info;
                        var temp_html = template("page-map-list-link", {
                            list: point_data
                        });
                        $this.find("ul").html(temp_html);
                        var point_list = [];
                        for (var i = 0; i < point_data.length; i++) {
                            point_list.push(new qq.maps.LatLng(point_data[i].ypoint, point_data[i].xpoint));

                        }
                        var anchor = new qq.maps.Point(12, 34),
                            size = new qq.maps.Size(24, 34),
                            origin = new qq.maps.Point(0, 0),
                            icon = new qq.maps.MarkerImage('images/marker.png', size, origin, anchor);

                        var latlngs = point_list;

                        for (var i = 0; i < latlngs.length; i++) {
                            (function(n) {
                                var temp_data = {
                                    list: point_data[n]
                                };
                                var temp_html = template("page-map-link", temp_data);
                                var marker = new qq.maps.Marker({
                                    position: latlngs[i],
                                    map: map,
                                    icon: icon
                                });

                                qq.maps.event.addListener(marker, 'click', function() {
                                    infoWin.open();
                                    infoWin.setContent(temp_html);
                                    infoWin.setPosition(latlngs[n]);
                                });
                            })(i);
                        }


                        var nearest = new qq.maps.LatLng(point_data[0].ypoint, point_data[0].xpoint);

                        var bounds = new qq.maps.LatLngBounds();
                        bounds.extend(user_point);
                        bounds.extend(nearest);
                        map.fitBounds(bounds);
                    }
                });
            });
        }
    });
    $(document).on("click", "#page-inset-map #tab1 a.item-link,#page-inset-map #tab2 a.item-link", function(event) {
        var temp_data = {
            id: $(this).attr("data-id"),
            name: $(this).find(".item-title").text()
        }
        orderInfo.store = temp_data;
        sessionStorage.orderInfo = JSON.stringify(orderInfo);
        $.router.load("#page-order");
    });
    $(document).on("click", "#page-map #tab1 a.item-link,#page-map #tab2 a.item-link", function(event) {
        var $this = $(this);
        var location = $this.attr("data-location").split(",");
        console.log(location);
        var name = $this.find(".item-title").text();
        var address = $this.find(".item-text").text();
        wx.openLocation({
            latitude: parseFloat(location[0]), // 纬度，浮点数，范围为90 ~ -90
            longitude: parseFloat(location[1]), // 经度，浮点数，范围为180 ~ -180。
            name: name, // 位置名
            address: address, // 地址详情说明
            scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    });
    /*****init*****/
    $.init();
});