function clean() {
    localStorage.clear();
}
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
    coupon: "",
    store: "",
    memo: ""
};

if (sessionStorage.orderInfo != undefined) {
    orderInfo = JSON.parse(sessionStorage.orderInfo);
}

var repairInfo = {
    category: "",
    error_list: "",
    error_type: "",
    desc: "",
    imgs: [],
    telephone: "",
    code: "",
    datetime: "",
    address_id: ""
};

if (sessionStorage.repairInfo != undefined) {
    repairInfo = JSON.parse(sessionStorage.repairInfo);
}

var setupInfo = {
    product: "",
    desc: "",
    telephone: "",
    code: "",
    datetime: "",
    address_id: ""
};

if (sessionStorage.setupInfo != undefined) {
    setupInfo = JSON.parse(sessionStorage.setupInfo);
}

//    sale_type:优惠类型('0.未优惠','1.每月优惠','2.老客户优惠','3.周未Party')
var discount_type_list = [{
    name: "每月优惠",
    value: 1
}, {
    name: "老客户优惠",
    value: 2
}, {
    name: "周末Party",
    value: 3
}];
//订单状态(可选)""0">未付款1">已付款"2">已发货"3">已收货"4">已取消"5">已评价
var order_status_list = [{
    name: "待付款",
    value: 0
}, {
    name: "待发货",
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
}, {
    name: "已退款",
    value: 6
}, {
    name: "退款/退货中",
    value: 7
}];
//提货方式 "1">网点自提          "2">送货上门
var express_type_list = [{
    name: "网店自提",
    value: 1
}, {
    name: "送货上门",
    value: 2
}];
template.helper('sum_count', function(products) {
    var sum = 0;
    for (var i = 0; i < products.length; i++) {
        sum += Number(products[i].count);
    }
    return sum;
});
template.helper('combind_pid', function(products) {
    var str = [];
    for (var i = 0; i < products.length; i++) {
        str.push(products[i].id);
    }
    return str.join(",");
});
template.helper('date_format', function(date) {
    return func_timestamp2datetime(date);
});
template.helper("discount_format", function(status) {
    return getNameByValue(status, discount_type_list);
});
template.helper("order_status_format", function(status) {
    return getNameByValue(status, order_status_list);
});
template.helper("express_type_format", function(type) {
    return getNameByValue(type, express_type_list);
});
template.helper('acc_div', function(arg1, arg2) {
    return accDiv(arg1, arg2);
});
template.helper('acc_add', function(arg1, arg2) {
    return accAdd(arg1, arg2);
});
var up = {};
if (localStorage.userInfo != undefined) {
    userInfo = JSON.parse(localStorage.userInfo);
    up = {
        type: 2,
        value: userInfo.open_id
    };
} else {
    var code = getParameter("code");
    if (code == null) {
        var curr_url = location.href.split('#')[0];
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx027d7825030faa03&redirect_uri=" + curr_url + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    } else {
        up = {
            type: 1,
            value: code
        };
    }
}
func_ajax({
    url: "http://www.homchang.site/index.php/Api/index/sendAuth",
    data: up,
    async: false,
    successCallback: function(data) {
        if (data.Common.code == 200) {
            userInfo = data.Common.info;
            localStorage.userInfo = JSON.stringify(data.Common.info);
        }
    }
});
if (up.type == 1) {
    console.log("code登陆");
} else {
    console.log("openid登陆");
}

console.log(userInfo);

function getMsg() {
    $.ajax({
        url: "http://www.homchang.site/index.php/Api/index/getMessages?p=1",
        type: "post",
        dataType: "json",
        data: {
            open_id: userInfo.open_id,
            size: 1
        },
        success: function(data) {
            if (data.Common.code == 200) {
                var temp_data = data.Common.info;
                sessionStorage.new_msg_count = temp_data.new_count;
                var h = "";
                if (sessionStorage.new_msg_count != "0") {
                    if ($(".msg-point").length == 0) {
                        h = '<span class="badge msg-point"></span>';
                        $(".user-item").append(h);
                    }
                    if ($("#page-user-center header .msg-count").length == 0) {
                        h = '<span class="badge msg-count">' + sessionStorage.new_msg_count + '</span>';
                        $("#page-user-center header .pull-right").append(h);
                    } else {
                        $(".msg-count.badge").html(sessionStorage.new_msg_count);
                    }
                } else {
                    $(".msg-count,.msg-point").remove();
                }
            }
        }
    });
}
getMsg();
setInterval(function() {
    getMsg();
}, 30000);



//root font-size
(function(doc, win) {
    "use strict";
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            var htmlFontSize = 20;
            var designWidth = 375;
            if (!clientWidth) {
                return;
            }
            docEl.style.fontSize = htmlFontSize * (clientWidth / designWidth) + 'px';
            var reality = Number(docEl.style.fontSize.substr(0, docEl.style.fontSize.length - 2));
            var theory = htmlFontSize * (clientWidth / designWidth);
            if (reality != theory) {
                docEl.style.fontSize = htmlFontSize * theory / reality * (clientWidth / designWidth) + 'px';
            }
        };
    if (!doc.addEventListener) {
        return;
    }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


(function($) {
    $.extend($.fn, {
        validate: function() {
            var is_pass = true;
            this.each(function(index, el) {
                if ($(this).attr("required") != undefined) { //html的pattern要注意转义
                    if ($(this).val() == "") {
                        $.toast($(this).attr("emptyTips"));
                        is_pass = false;
                        return false;
                    } else {
                        if ($(this).attr("pattern") != undefined) { //html的pattern要注意转义
                            var reg = new RegExp($(this).attr("pattern"));
                            if (!reg.test($(this).val())) {
                                $.toast($(this).attr("notMatchTips"));
                                is_pass = false;
                                return false;
                            }
                        }
                    }
                }
            });
            return is_pass;
        }
    });
    $.getScript = function(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var js = document.createElement('script');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', url);
        head.appendChild(js);
        var callbackFn = function() {
                if (typeof callback === 'function') {
                    callback();
                }
            };
        if (document.all) { //IE
            js.onreadystatechange = function() {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
                    callbackFn();
                }
            };
        } else {
            js.onload = function() {
                callbackFn();
            };
        }
    };
})(Zepto);


function classifyArrayByField(field, array) {
    var map = {},
        result = [];
    for (var i = 0; i < array.length; i++) {
        var temp_list = array[i];
        if (!map[eval("temp_list." + field)]) {
            var temp = {};
            eval("temp." + field + "=temp_list." + field + ";");
            temp.data = [temp_list];
            result.push(temp);
            map[eval("temp_list." + field)] = temp_list;
        } else {
            for (var j = 0; j < result.length; j++) {
                var temp_list1 = result[j];
                if (eval("temp_list1." + field) == eval("temp_list." + field)) {
                    temp_list1.data.push(temp_list);
                    break;
                }
            }
        }
    }
    return result;
}
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
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
/**
 * 除法
 * @param arg1
 * @param arg2
 * @returns {Number}
 */

function accDiv(arg1, arg2) {
    var t1 = 0,
        t2 = 0,
        r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {}
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {}
    with(Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
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
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
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
    return (arg1 + arg2) / m;
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
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
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
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//时间戳格式化

function func_timestamp2datetime(timestamp) {
    if (timestamp == "" || timestamp == null || timestamp == undefined) {
        return "未知时间";
    }
    var temp = timestamp;
    if (timestamp.toString().length == 10 || timestamp.toString().length == 9) {
        temp = timestamp * 1000;
    }

    var date = new Date(temp * 1);
    var year = date.getFullYear(),
        month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1),
        day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
        hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
        minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();

    return {
        date: year + '-' + month + '-' + day,
        time: hour + ':' + minute,
        datetime: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    };
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
    var is_ios_wx = $.device.ios && ($.device.webView != null);
    if (is_ios_wx) {
        curr_url = entrance_url;
    }
    // console.info("浏览器地址栏" + curr_url);

    //ios只需配置一次config
    if ((!is_ios_and_initWx && is_ios_wx) || !is_ios_wx) {
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getWxConfig",
            data: {
                curr_url: curr_url,
                open_id: userInfo.open_id
            },
            successCallback: function(data) {

                wx_config_data = data.Common.info;
                wx.config({
                    debug: false,
                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wx_config_data.appId,
                    // 必填，公众号的唯一标识
                    timestamp: wx_config_data.timestamp,
                    // 必填，生成签名的时间戳
                    nonceStr: wx_config_data.nonceStr,
                    // 必填，生成签名的随机串
                    signature: wx_config_data.signature,
                    // 必填，签名，见附录1
                    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
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

    $(document).on("click", ".counter .minus", function(event) {
        var $counter = $(this).next("input");
        if ($counter.val() != 1) {
            $counter.val(parseInt($counter.val()) - 1);
            $("#page-details .chose-count").html($counter.val());
            var curr_p_id = $counter.parents(".product-item[data-id]").attr("data-id");
            for (var i = 0; i < my_cart.length; i++) {
                if (curr_p_id == my_cart[i].p_id) {
                    my_cart[i].count = Number($counter.val());
                }
            }
            localStorage.cart = JSON.stringify(my_cart);
            cartSum();
            setSupIcon();
        }
    });

    $(document).on("click", ".counter .plus", function(event) {
        var $counter = $(this).prev("input");
        $counter.val(parseInt($counter.val()) + 1);
        $("#page-details .chose-count").html($counter.val());
        var curr_p_id = $counter.parents(".product-item[data-id]").attr("data-id");
        for (var i = 0; i < my_cart.length; i++) {
            if (curr_p_id == my_cart[i].p_id) {
                my_cart[i].count = Number($counter.val());
            }
        }
        localStorage.cart = JSON.stringify(my_cart);
        cartSum();
        setSupIcon();
    });
    $(document).on("click", ".popup-overlay", function() {
        $.closeModal();
    }); /*****page-index*****/
    //无限加载
    var index_hot_page = 1;
    // 加载flag
    var index_hot_loading = false;
    // 最多可加载的条目
    var index_hot_maxItems = 0;
    // 每次加载添加多少条目
    var index_hot_itemsPerLoad = 5;
    var index_hot_lastIndex = 0;


    function index_hot_addItems(number) {
        if (index_hot_page != 0) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/getProducts?p=" + index_hot_page,
                data: {
                    size: index_hot_itemsPerLoad,
                    hot: 1
                },
                successCallback: function(data) {
                    var temp_html = '';
                    if (data.Common.code == 200) {
                        index_hot_maxItems = data.Common.info.total;
                        var temp_data = data.Common.info;
                        temp_html = template('page-index-product', temp_data);
                    } else {
                        temp_html = '<li class="no-data"><div><span>暂无数据</span></div></li>'
                    }

                    $('#page-index .infinite-scroll-bottom .list-block.product-list>ul').append(temp_html);
                    index_hot_page++;
                    index_hot_lastIndex = $('#page-index .list-block.product-list>ul>li').length;
                    index_hot_loading = false;
                    if (index_hot_lastIndex >= index_hot_maxItems) {
                        $.detachInfiniteScroll($('#page-index .infinite-scroll'));
                        $('#page-index .infinite-scroll-preloader').remove();
                        index_hot_page = 0;
                        return;
                    }
                    $.refreshScroller();
                }
            });
        }
    }
    $(document).on('infinite', '#page-index .infinite-scroll-bottom', function() {
        if (index_hot_loading) return;
        index_hot_loading = true;
        index_hot_addItems(index_hot_itemsPerLoad);
    });


    $(document).on("pageInit", "#page-index", function(e, pageId, $page) {

        setSupIcon();
        // //清除html
        // $('#page-index .infinite-scroll-bottom .list-block>ul').html("");
        // //重置无限加载参数
        // index_hot_page = 1;
        // // 加载flag
        // index_hot_loading = false;
        // // 最多可加载的条目
        // index_hot_maxItems = 0;
        // // 每次加载添加多少条目
        // index_hot_itemsPerLoad = 5;
        // index_hot_lastIndex = 0;
        //预先加载
        if ($("#page-index .cards-list.product-list li").length == 0) { //加载过的标志，不再请求，不知道有没有bug，试下
            index_hot_addItems(comment_itemsPerLoad);

            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/getCategoriesByParentId",
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
        }

        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getCarousels",
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
                    autoplay: 5000,
                    autoplayDisableOnInteraction: false
                });
            }

        });

    });
    $(document).on("click", "#page-index .product-nav-list a", function(event) {
       
        var category_tab_id = $(this).attr("data-href");
        sessionStorage.category_tab_id = category_tab_id;
        var current_tab = $("#page-category " + category_tab_id);
        var current_tab_link = $("#page-category a[href='" + category_tab_id + "']");
        $("#page-category .active").removeClass("active");
        current_tab.addClass("active");
        current_tab_link.addClass("active");
    }); /*****page-category*****/
    $(document).on("pageInit", "#page-category", function(e, pageId, $page) {

        if ($("#page-category #tab0").length == 0) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/getCategoriesByParentId",
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
    var comment_loading = false;
    var comment_maxItems = 0;
    var comment_itemsPerLoad = 5;
    var comment_lastIndex = 0;

    function comment_addItems(number) {
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getProductComment?p=" + comment_page,
            data: {
                size: number,
                product_id: getParameter("p_id")
            },
            successCallback: function(data) {
                var temp_html = "";
                if (data.Common.code == 200) {
                    comment_maxItems = data.Common.info.total;
                    var temp_data = {
                        list: data.Common.info.list
                    };
                    temp_html = template("page-details-comment", temp_data);
                    if (comment_page == 1) {
                        var temp_data1 = [];
                        if (temp_data.list.length > 3) {
                            temp_data1 = {
                                list: temp_data.list.slice(0, 3)
                            };
                            $("#page-details .show-all-comment").removeClass("hide");
                        } else {
                            temp_data1 = temp_data;
                        }
                        var temp_html1 = template("page-details-comment", temp_data1);
                        $('#page-details .surface-comment ul').html(temp_html1);
                    }
                } else {
                    temp_html = '<li class="no-data"><div><span>暂无评论</span></div></li>';
                }
                $('#page-details #tab3 .infinite-scroll-bottom .list-container').append(temp_html);
                comment_page++;
                comment_lastIndex = $('#page-details .list-container li').length;
                comment_loading = false;
                if (comment_lastIndex >= comment_maxItems) {
                    $.detachInfiniteScroll($('#page-details #tab3 .infinite-scroll'));
                    $('#page-details #tab3 .infinite-scroll-preloader').remove();
                    return;
                }
                $.refreshScroller();
            }
        });
    }
    $(document).on('infinite', '#page-details #tab3 .infinite-scroll-bottom', function() {
        if (comment_loading) return;
        comment_loading = true;
        comment_addItems(comment_itemsPerLoad);
    });
    $(document).on("pageInit", "#page-details", function(e, pageId, $page) {
        setSupIcon();

        //清除html
        $('#page-details .infinite-scroll-bottom .list-container').html("");
        //重置无限加载参数
        comment_page = 1;
        comment_loading = false;
        comment_maxItems = 0;
        comment_itemsPerLoad = 5;
        comment_lastIndex = 0;
        //预先加载
        comment_addItems(comment_itemsPerLoad);
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getProductInfo",
            data: {
                product_id: getParameter("p_id"),
                open_id: userInfo.open_id
            },
            successCallback: function(data) {
                var data = data.Common.info;
                var swiper_temp_data = {
                    list: data.imgs
                };
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
                $("#page-details .model .item-title").html(data.model);
                $("#page-details #tab2 .content-block").html(data.description);
                $(".popup-select .avatar").css("background-image", "url(" + data.feng_mian_image + ")");
                $(".popup-select h3").html(data.current_price);
                if (data.collection_status) {
                    $("#page-details .collect-btn").addClass("collected");
                }
                var d = "暂无优惠";
                if (getNameByValue(data.sale_type, discount_type_list) != "") {
                    d = '<span>' + getNameByValue(data.sale_type, discount_type_list) + '</span>';
                }
                $("#page-details .discount .tag-list").html(d);

                wxApi(function(imgs) {
                    $(document).off("click", "#page-details .swiper-slide");

                    $(document).on("click", "#page-details .swiper-slide", function(event) {
                        event.preventDefault();
                        var preview_list = [];
                        var index = $(this).index();
                        for (var i = 0; i < imgs.length; i++) {
                            preview_list.push("http://" + domain + imgs[i]);
                        }
                        console.log(JSON.stringify(preview_list));
                        wx.previewImage({
                            current: preview_list[index],
                            urls: preview_list
                        });
                    });
                }(data.imgs));
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
        $("#page-details #tab3").addClass("active")
    });

    $(document).on("click", "#page-details .service-btn,#page-user-center .service-btn", function(event) {
        var img_path = "";
        event.preventDefault();
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getCarousels",
            data: {
                type: 4
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    img_path = data.Common.info[0].img
                    $.alert('<img src="' + img_path + '" alt="客服二维码"  style="width:100%;"/>', '长按二维码添加客服');
                } else {
                    $.toast("未知错误，获取客服二维码失败");
                }
            }
        });
    });
    $(document).on("click", "#page-details .collect-btn", function(event) {
        event.preventDefault();
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/optCollection",
            data: {
                open_id: userInfo.open_id,
                product_id: getParameter("p_id"),
            },
            successCallback: function(data) {
                $("#page-details .collect-btn").toggleClass("collected");
            }
        });
    });

    function setSupIcon() {
        //console.log("更新购物车数量");
        if (my_cart != "") {
            var sum = 0;
            for (var i = 0; i < my_cart.length; i++) {
                sum += Number(my_cart[i].count);
            }
            if ($(".cart-count").length == 0) {
                var h = '<span class="badge cart-count">' + sum + '</span>';
                $(".cart-item").append(h);
            } else {
                $(".cart-count.badge").html(sum);
            }
        }
        //更新我的消息红点
        if (sessionStorage.new_msg_count != "0") {
            if ($(".msg-point").length == 0) {
                var h = '<span class="badge msg-point"></span>';
                $(".user-item").append(h);
            }
            if ($("#page-user-center header .msg-count").length == 0) {
                var h = '<span class="badge msg-count">' + sessionStorage.new_msg_count + '</span>';
                $("#page-user-center header .pull-right").append(h);
            } else {
                $(".msg-count.badge").html(sessionStorage.new_msg_count);
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
        setSupIcon();
    });


    /*****page-search*****/
    //无限加载
    var hot_page = 1;
    // 加载flag
    var hot_loading = false;
    // 最多可加载的条目
    var hot_maxItems = 0;
    // 每次加载添加多少条目
    var hot_itemsPerLoad = 5;
    var hot_lastIndex = 0;


    function hot_addItems(number) {
        if (hot_page != 0) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/getProducts?p=" + hot_page,
                data: {
                    size: hot_itemsPerLoad,
                    hot: 1
                },
                successCallback: function(data) {
                    var temp_html = '';
                    if (data.Common.code == 200) {
                        hot_maxItems = data.Common.info.total;
                        var temp_data = data.Common.info;
                        temp_html = template('page-search-hot', temp_data);
                    } else {
                        temp_html = '<li class="no-data"><div><span>暂无数据</span></div></li>'
                    }
                    $('#page-search .infinite-scroll-bottom .list-block ul').append(temp_html);
                    hot_page++;
                    hot_lastIndex = $('#page-search .list-block ul li').length;
                    hot_loading = false;
                    if (hot_lastIndex >= hot_maxItems) {
                        $.detachInfiniteScroll($('#page-search .infinite-scroll'));
                        $('#page-search .infinite-scroll-preloader').remove();
                        hot_page = 0;
                        return;
                    }
                    $.refreshScroller();
                }
            });
        }
    }
    $(document).on('infinite', '#page-search .infinite-scroll-bottom', function() {
        if (hot_loading) return;
        hot_loading = true;
        hot_addItems(hot_itemsPerLoad);
    });



    $(document).on("pageInit", "#page-search", function(e, pageId, $page) {

        // //清除html
        // $('#page-search .infinite-scroll-bottom .list-block ul').html("");
        // //重置参数
        // hot_page = 1;
        // // 加载flag
        // hot_loading = false;
        // // 最多可加载的条目
        // hot_maxItems = 0;
        // // 每次加载添加多少条目
        // hot_itemsPerLoad = 5;
        // hot_lastIndex = 0;
        // //预先加载
        var kw = "";
        if (sessionStorage.keyword != undefined) {
            kw = sessionStorage.keyword;
        }
        $("#page-search #search").val(kw);
        if ($("#page-search .product-list li").length == 0) {
            hot_addItems(hot_itemsPerLoad);
        } else {
            console.log("已加载第一页");
        }
    });


    //无限加载
    var search_page = 1;
    // 加载flag
    var search_loading = false;
    // 最多可加载的条目
    var search_maxItems = 0;
    // 每次加载添加多少条目
    var search_itemsPerLoad = 5;
    var search_lastIndex = 0;
    //搜索条件
    var search_option = new Object();

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
        if (search_page != 0) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/getProducts?p=" + search_page,
                data: opt,
                successCallback: function(data) {
                    var temp_html = '';
                    if (data.Common.code == 200) {
                        search_maxItems = data.Common.info.total;
                        var temp_data = data.Common.info;
                        temp_html = template('page-search-item', temp_data);
                    } else {
                        temp_html = '<li class="no-data"><div><span>暂无数据</span></div></li>'
                    }
                    $('#page-search-result .infinite-scroll-bottom .list-block ul').append(temp_html);
                    search_page++;
                    search_lastIndex = $('#page-search-result .list-block ul li').length;
                    search_loading = false;
                    if (search_lastIndex >= search_maxItems) {
                        $.detachInfiniteScroll($('#page-search-result .infinite-scroll'));
                        $('#page-search-result .infinite-scroll-preloader').remove();
                        search_page = 0;
                        return;
                    }
                    $.refreshScroller();
                }
            });
        }
    }
    $(document).on('infinite', '#page-search-result .infinite-scroll-bottom', function() {
        if (search_loading) return;
        search_loading = true;
        search_addItems(search_itemsPerLoad, search_option);
    });

    $(document).on("pageInit", "#page-search-result", function(e, pageId, $page) {


        // //清除html
        // $('#page-search-result .infinite-scroll-bottom .list-block ul').html("");
        // //重置参数
        // search_page = 1;
        // search_loading = false;
        // search_maxItems = 0;
        // search_itemsPerLoad = 5;
        // search_lastIndex = 0;
        //预先加载
        var kw = "";
        if (sessionStorage.keyword != undefined) {
            kw = sessionStorage.keyword;
        }
        search_option.search_content = kw;
        search_option.category_id = getParameter("c_id");
        $("#page-search-result #search").val(kw);
        if ($("#page-search-result .product-list li").length == 0) {
            search_addItems(search_itemsPerLoad, search_option);
        }
        var temp_discount_type_list = "";
        for (var i = 0; i < discount_type_list.length; i++) {
            temp_discount_type_list += '<li data-discount="' + discount_type_list[i].value + '">' + discount_type_list[i].name + '</li>'
        }
        $("#panel-filter .discount-list").html(temp_discount_type_list);
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getCategoriesByParentId",
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

    });


    $(document).on("keydown", "#page-search #search", function(event) {
        if (event.keyCode == 13) {
            var kw = $(this).val();
            sessionStorage.keyword = kw;

            $.router.load("search_result.html");
        }
    });
    $(document).on("keydown", "#page-search-result #search", function(event) {
        if (event.keyCode == 13) {
            var kw = $(this).val();
            sessionStorage.keyword = kw;
            search_option.search_content = kw;
            search_infinite_reset(search_option);
        }
    });



    function search_infinite_reset(option) {
        var opt = option;
        search_page = 1;
        search_loading = false;
        search_maxItems = 0;
        search_itemsPerLoad = 10;
        search_lastIndex = 0;
        if ($("#page-search-result .infinite-scroll-preloader").length == 0) {
            var preloader_html = '<div class="infinite-scroll-preloader"><div class="preloader"></div></div>';
            $("#page-search-result .infinite-scroll").append(preloader_html);
            $.attachInfiniteScroll($('#page-search-result .infinite-scroll'));
        }
        $('#page-search-result .infinite-scroll-bottom .list-block ul').html("");
        search_addItems(search_itemsPerLoad, opt);
    }

    function reset_list_by_category() {
        var curr_title = $("#panel-filter .sub-category-list").find(".active").text() || $("#panel-filter .category-list").find(".active").text() || "";
        $("#page-search-result header .title").html(curr_title);
        var curr_category_id = $("#panel-filter .sub-category-list").find(".active").attr("data-category") || $("#panel-filter .category-list").find(".active").attr("data-category") || "";
        search_option.category_id = curr_category_id;
        search_infinite_reset(search_option);
    }

    function reset_list_by_discount() {
        var curr_discount_value = $("#panel-filter .discount-list").find(".active").attr("data-discount") || "";
        search_option.sale_type = curr_discount_value;
        search_infinite_reset(search_option);
    }

    $(document).on("click", "#panel-filter .category-list li", function(event) {
       
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
        setSupIcon();
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
            //更新缓存购物车物品的选择状态//选择
            my_cart[$(this).parents("li").index()].select = true;
            localStorage.cart = JSON.stringify(my_cart);
        } else {
            var item_list = $("#page-cart .product-item label").not(this).find("input[type='checkbox']:checked").parents(".product-item");
            //更新缓存购物车物品的选择状态//反选
            my_cart[$(this).parents("li").index()].select = false;
            localStorage.cart = JSON.stringify(my_cart);
        } /****************************/
        cartSum();

    });

    $(document).on("click", "#page-cart .cart-title .edit-btn", function(event) {
       
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
            setSupIcon();
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

    $(document).on("click", "#page-cart .details-link", function(event) {

        var is_editing = $("#page-cart .editing").length != 0;
        if (!is_editing) {
            var p_id = $(this).parents(".product-item").attr("data-id");
            $.router.load("details.html?p_id=" + p_id);
        }
    });


    /*****page-fallow*****/

    $(document).on("pageInit", "#page-fallow", function(e, pageId, $page) {

        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getMyCollections",
            data: {
                open_id: userInfo.open_id,
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var temp_data = data.Common.info;
                    var temp_html = template("page-fallow-item", {
                        list: temp_data
                    });
                    console.info(temp_html);
                    $("#page-fallow .list-block ul").html(temp_html);
                }
            }
        });

    });

    /*****page-order*****/
    $(document).on("pageInit", "#page-order", function(e, pageId, $page) {
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
            url: "http://www.homchang.site/index.php/Api/index/getLocations",
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
        $(".popup-coupon .list-block ul").html('<li class="item-content "><div class="item-title">您暂无可以使用的优惠卷</div></li>');
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getCardList",
            data: {
                open_id: userInfo.open_id,
                cart: JSON.stringify(orderInfo.products)
            },
            successCallback: function(data) {
                console.log("参数---open_id" + userInfo.open_id);
                console.log("参数---cart" + JSON.stringify(orderInfo.products));
                console.log("--------请求结果----");
                console.log(data);
                console.log("-----end of---请求结果----");
                if (data.Common.code == 200) {
                    var temp_data = data.Common.info;
                    var temp_html = template('page-order-coupon-item', {
                        list: temp_data
                    });
                    $(".popup-coupon .list-block ul").html("");
                    $(".popup-coupon .list-block ul").append('<li>\
                        <label class="label-checkbox item-content">\
                            <input type="radio" name="coupon" data-id="0"  value="">\
                            <div class="item-media"><i class="icon icon-form-checkbox"></i></div>\
                            <div class="item-media"><i class="icon icon-coupon"></i></div>\
                            <div class="item-inner">\
                                <div class="item-title-row">\
                                    <div class="item-title">不使用优惠劵</div>\
                                </div>\
                            </div>\
                        </label>\
                    </li>');

                    $(".popup-coupon .list-block ul").append(temp_html);

                    $("#page-order .coupon-wrapper .item-after").html("请选择");
                    //选择的卡券
                    if (!(orderInfo.coupon.info == "" || orderInfo.coupon.info == undefined)) {
                        $("#page-order .coupon-wrapper .item-after").html(orderInfo.coupon.name);
                        $(".popup-coupon").find("input[data-id='" + orderInfo.coupon.id + "']").eq(0).prop("checked", true);
                        $("#page-order .coupon-discount").removeClass("hide");
                        $("#page-order .coupon-discount .item-after span").html(orderInfo.coupon.value.toFixed(2));
                        var actual_price = accSub(parseFloat($("#page-order .sum-row .total-price").text()), parseFloat($("#page-order .coupon-discount .discount").text()));
                        $("#page-order  nav .total-price").html(Number(actual_price).toFixed(2));
                    }
                }
            }
        });

        $(document).on("click", ".popup-coupon li", function(event) {
            var name = $(this).find(".item-title").text();
            var value = parseFloat($(this).find(".item-subtitle span").text()) || 0;
            var id = $(this).find("input").attr("data-id") || 0;
            var info = $(this).find("input").val() || "";

            var temp_data = {
                name: name,
                value: value,
                id: id,
                info: info
            }
            orderInfo.coupon = temp_data;
            sessionStorage.orderInfo = JSON.stringify(orderInfo);
            $("#page-order .open-popup .item-after").html(name);
            if (temp_data.value != 0) {
                $("#page-order .coupon-discount").removeClass("hide");
                $("#page-order .coupon-discount .item-after span").html(value.toFixed(2));
            } else {
                $("#page-order .coupon-discount").addClass("hide");
                $("#page-order .coupon-discount .item-after span").html(0);
            }
            var actual_price = accSub(parseFloat($("#page-order .sum-row .total-price").text()), parseFloat($("#page-order .coupon-discount .discount").text()));
            $("#page-order  nav .total-price").html(Number(actual_price).toFixed(2));
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
       
        var value = $(".express-type").val();
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
       
        $(".express-type").picker("open");
    });
    $(document).on("change", "#page-order textarea", function(event) {
       
        orderInfo.memo = $(this).val();
        sessionStorage.orderInfo = JSON.stringify(orderInfo);
    });



    $(document).on("click", "#page-order .submit-order-btn", function(event) {
       
        //todo
        console.log(orderInfo);
        var temp_data = {
            open_id: userInfo.open_id,
            cart: JSON.stringify(orderInfo.products),
            total_price: $("nav .total-price").text(),
            location_id: orderInfo.address_id,
            pick_type: orderInfo.express_type,
            buyer_message: orderInfo.memo,
            coupon: orderInfo.coupon.info
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
            url: "http://www.homchang.site/index.php/Api/index/orderCommit",
            data: temp_data,
            successCallback: function(data) {
                console.log(data);
                if (data.Common.code == 200) {
                    var order_num = data.Common.info;
                    //todo 删除loacalStorage的购物车//保留在购物车，但未购买的物品
                    var temp_cart = [];
                    for (var i = 0; i < my_cart.length; i++) {
                        if (!my_cart[i].select) {
                            temp_cart.push(my_cart[i]);
                        }
                    }
                    my_cart = temp_cart;
                    localStorage.cart = JSON.stringify(my_cart);


                    orderInfo = {
                        address_id: "",
                        express_type: "",
                        products: [],
                        coupon: "",
                        store: "",
                        memo: ""
                    };
                    sessionStorage.orderInfo = JSON.stringify(orderInfo);
                    $.router.load("order_detail.html?order_num=" + order_num);
                } else {
                    $.toast("提交订单失败，请刷新页面重试！")
                }
            }
        });


    });

    /*****page-order-detail*****/
    $(document).on("pageInit", "#page-order-detail", function(e, pageId, $page) {
        wxApi();
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getOrderInfo",
            data: {
                open_id: userInfo.open_id,
                order_no: getParameter("order_num")
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var temp_data = {
                        list: data.Common.info
                    };
                    var temp_html = template("page-order-detail-info", temp_data);
                    $("#page-order-detail").html(temp_html);
                } else {
                    $.toast("未知错误");
                }
            }
        });
    });

    $(document).on("click", "#page-order-detail .pay,#page-order-detail .pay", function(event) {
       
        var order_num = $("#page-order-detail .order-num").text();
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/wxPay",
            data: {
                open_id: userInfo.open_id,
                order_no: order_num
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var c = data.Common.info;
                    wx.chooseWXPay({
                        timestamp: c.timestamp,
                        // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: c.nonceStr,
                        // 支付签名随机串，不长于 32 位
                        package: c.package,
                        // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: c.signType,
                        // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: c.paySign,
                        // 支付签名
                        success: function(res) {
                            // 支付成功后的回调函数
                            window.location.href = "user_center.html#page-my-order";
                        }
                    });
                } else {
                    $.toast("未知错误，请刷新页面重试！")
                }
            },
        });

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
        getOrderList();
    });

    function getOrderList() {
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getOrderList",
            data: {
                open_id: userInfo.open_id
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    $("#page-my-order .tab[data-type='all'] ul").html(template("page-my-order-item", {
                        list: data.Common.info
                    }));
                    var temp_list = classifyArrayByField("pay_status", data.Common.info);

                    var combind_html = ""; //pay_status 1和2合并
                    var combind_html1 = ""; //pay_status 6和7合并
                    for (var i = 0; i < temp_list.length; i++) {
                        var $container = $("#page-my-order [data-type='" + temp_list[i].pay_status + "']>.list-block>ul");
                        var temp_data = {
                            list: temp_list[i].data
                        };
                        var temp_html = template("page-my-order-item", temp_data);
                        if (temp_list[i].pay_status == "1" || temp_list[i].pay_status == "2") {
                            combind_html += temp_html;
                        } else if (temp_list[i].pay_status == "6" || temp_list[i].pay_status == "7") {
                            combind_html1 += temp_html;
                        } else {
                            $container.html(temp_html);
                        }
                    }
                    $("#page-my-order [data-type='1']>.list-block>ul").html(combind_html);
                    $("#page-my-order [data-type='4']>.list-block>ul").html(combind_html1);
                    //为没有内容的tab增加提示
                    var container_list = $("#page-my-order .tab>.list-block>ul");
                    for (var i = 0; i < container_list.length; i++) {
                        if (container_list.eq(i).find("li").length == 0) {
                            container_list.eq(i).html('<li class="no-order"><p><i class="icon icon-order"></i></p><p class="tips">您还没有相关的订单</p><p class="sub-tips">可以去看看有哪些想买的</p></li>');
                        }
                    }
                }
            }
        });
    }
    $(document).on("click", "#page-my-order .tab-link", function(event) {
        event.preventDefault();
        sessionStorage.order_tab_id = $(this).attr("href");
    });
    $(document).on("click", "#page-my-order .card-header,#page-my-order .card-content", function(event) {
        event.preventDefault();
        var order_num = $(this).parent("li.card").attr("data-order-num");
        $.router.load("order_detail.html?order_num=" + order_num);
    });
    // $(document).on("click", "#page-my-order .go-to-pay", function(event) {
    //     event.preventDefault();
    //     var order_num = $(this).parents("li.card").attr("data-order-num");
    //     window.location.href = "order_detail.html?order_num=" + order_num;
    // });

    $(document).on("click", "#page-my-order .refund-btn,#page-order-detail .refund-btn", function(event) {
        event.preventDefault();
        var text = $(this).text();
        var order_num = $(this).parents("li.card").attr("data-order-num") || getParameter("order_num");

        $.confirm("确定要" + text + "吗？", function() {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/applyRefund",
                data: {
                    open_id: userInfo.open_id,
                    order_no: order_num
                },
                successCallback: function(data) {
                    if (data.Common.code == 200) {
                        text = text[2] + text[3] + text[0] + text[1];
                        $.alert("您的" + text + "已经收悉，我们的客服人员会在24小时内与您取得联系，请您耐心等待。如有修改订单或其他需求，请及时联系客户服务热线电话：400-110-8004或020-81401016 ，给您造成的不便，敬请谅解。")
                        getOrderList();
                    }
                }
            });
        });
    });
    $(document).on("click", "#page-my-order .cancel-btn,#page-order-detail .cancel-btn", function(event) {
        event.preventDefault();
        var $this_order_ele = $(this).parents("li.card");
        var order_num = $this_order_ele.attr("data-order-num") || getParameter("order_num");

        $.confirm("确定要取消订单吗？", function() {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/orderCancel",
                data: {
                    open_id: userInfo.open_id,
                    order_no: order_num
                },
                successCallback: function(data) {
                    if (data.Common.code == 200) {
                        $.toast("订单已取消");
                        getOrderList();

                    }
                }
            });
        });
    });
    $(document).on("click", "#page-my-order .receipt-btn,#page-order-detail .receipt-btn", function(event) {
        event.preventDefault();
        var $this_order_ele = $(this).parents("li.card");
        var order_num = $this_order_ele.attr("data-order-num") || getParameter("order_num");

        $.confirm("确认收货吗？", function() {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/orderConfirmReceipt",
                data: {
                    open_id: userInfo.open_id,
                    order_no: order_num
                },
                successCallback: function(data) {
                    if (data.Common.code == 200) {
                        $.toast("已确认收货");
                        getOrderList();
                    }
                }
            });
        });
    }); /*****page-comment*****/
    $(document).on("pageInit", "#page-comment", function(e, pageId, $page) {



    });
    $(document).on("click", "#page-comment .rater a", function(event) {
        var num = -1;
        var index = $(this).index();
        $(this).siblings(".checked").removeClass("checked");
        for (var i = 0; i <= index; i++) {
            $(this).parents(".rater").find("a").eq(i).addClass('checked');
        }
        num = index + 1;
        $(this).parents(".rater").next().val(num);
    });

    $(document).on("click", "#page-comment .button-success", function(event) {
        var score_list = [];
        var content = $("#page-comment textarea").val();
        $("#page-comment input[type='hidden']").each(function(index, el) {
            score_list.push($(this).val());
        });
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/addOrderComment",
            data: {
                open_id: userInfo.open_id,
                order_id: getParameter("order_num"),
                product_id: ["s", "sad"],
                describe_score: score_list[0],
                server_score: score_list[1],
                logistics_score: score_list[2],
                content: content
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    $.toast("评论成功");
                    setTimeout(function() {
                        $.router.load("user_center.html#page-my-order");
                    }, 2000);
                } else {
                    $.toast("未知错误，评论失败！");
                }
            }
        });
    }); /*****page-user-center*****/
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
        $("#page-user-center .user-header-wrapper .icon-gender").removeClass("icon-male icon-female icon-unknow").addClass(gender_icon);
        setSupIcon();
    });



    $(document).on("click", "#page-user-center .order-block [data-href]", function(event) {
       
        var order_tab_id = $(this).attr("data-href");
        sessionStorage.order_tab_id = order_tab_id;
        var current_tab = $("#page-my-order " + order_tab_id);
        var current_tab_link = $("#page-my-order a[href='" + order_tab_id + "']");
        $("#page-my-order .active").removeClass("active");
        current_tab.addClass("active");
        current_tab_link.addClass("active");
    }); /*****page-my-message*****/

    //无限加载
    var msg_page = 1;
    // 加载flag
    var msg_loading = false;
    // 最多可加载的条目
    var msg_maxItems = 0;
    // 每次加载添加多少条目
    var msg_itemsPerLoad = 10;
    var msg_lastIndex = 0;


    function msg_addItems(number) {
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getMessages?p=" + msg_page,
            data: {
                size: msg_itemsPerLoad,
                open_id: userInfo.open_id
            },
            successCallback: function(data) {
                var temp_html = '';
                if (data.Common.code == 200) {
                    msg_maxItems = data.Common.info.total;
                    var temp_data = data.Common.info;
                    temp_html = template('page-my-message-item', temp_data);
                } else {
                    temp_html = '<li class="no-data"><div><span>暂无数据</span></div></li>'
                }
                $('#page-my-message .infinite-scroll-bottom .list-block ul').append(temp_html);
                msg_page++;
                msg_lastIndex = $('#page-my-message .list-block>ul>li').length;
                msg_loading = false;
                if (msg_lastIndex >= msg_maxItems) {
                    $.detachInfiniteScroll($('#page-my-message .infinite-scroll'));
                    $('#page-my-message .infinite-scroll-preloader').remove();
                    return;
                }
                $.refreshScroller();
            }
        });
    }
    $(document).on('infinite', '#page-my-message .infinite-scroll-bottom', function() {
        if (msg_loading) return;
        msg_loading = true;
        msg_addItems(msg_itemsPerLoad);
    });

    $(document).on("pageInit", "#page-my-message", function(e, pageId, $page) {

        //清除html
        $('#page-my-message .infinite-scroll-bottom .list-block ul').html("");
        //重置参数
        msg_page = 1;
        // 加载flag
        msg_loading = false;
        // 最多可加载的条目
        msg_maxItems = 0;
        // 每次加载添加多少条目
        msg_itemsPerLoad = 10;
        msg_lastIndex = 0;
        //预先加载
        msg_addItems(msg_itemsPerLoad);


    });
    $(document).on("click", "#page-my-message .list-block li>a", function(event) {
        var m_id = $(this).attr("data-id");
        var unread = $(this).hasClass("unread");
        $("#page-message-detail .content-block-title").html($(this).find(".item-after").html()).attr("data-id", m_id);
        if (unread) {
            $("#page-message-detail .content-block-title").addClass("unread");
        }
        $("#page-message-detail .text").html($(this).find(".item-text").html());
        $.router.load("#page-message-detail");
    });
    $(document).on("pageInit", "#page-message-detail", function(e, pageId, $page) {
        if ($("#page-message-detail .content-block-title").hasClass("unread")) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/readMessage",
                data: {
                    msg_id: $("#page-message-detail [data-id]").attr("data-id"),
                    open_id: userInfo.open_id
                },
                successCallback: function(data) {
                    if (data.Common.code = 200) {
                        sessionStorage.new_msg_count = Number(sessionStorage.new_msg_count) - 1;
                    }
                }
            });
            $("#page-message-detail .content-block-title .unread").removeClass("unread");
        }
    }); /*****page-coupon*****/
    $(document).on("pageInit", "#page-coupon", function(e, pageId, $page) {
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getCardList",
            data: {
                open_id: userInfo.open_id
            },
            successCallback: function(data) {
                 $.hidePreloader("正在拉取微信卡券，请稍等");
                if (data.Common.code == 200) {
                    var temp_list = classifyArrayByField("deadline_type", data.Common.info);
                    console.log(temp_list);
                    for (var i = 0; i < temp_list.length; i++) {
                        var $container = $("#page-coupon [data-type='" + temp_list[i].deadline_type + "']");
                        var temp_data = {
                            list: temp_list[i].data
                        };
                        var temp_html = template("page-coupon-item", temp_data);
                        $container.find("ul").html(temp_html);
                    }
                    //为没有内容的tab增加提示
                    var container_list = $("#page-coupon .tab>.list-block>ul");
                    for (var i = 0; i < container_list.length; i++) {
                        if (container_list.eq(i).find("li").length == 0) {
                            container_list.eq(i).addClass("no-coupon-wrapper");
                            container_list.eq(i).html('<li class="no-coupon"><p><i class="icon icon-coupon"></i></p><p class="tips">您还没有相关的优惠劵</p><p class="sub-tips">可以去看看有商家哪些活动</p></li>');
                        }
                    }
                }
            }
        });
            $.showPreloader("正在拉取微信卡券，请稍等");
    });



    /*****page-user-info*****/
    var gander_list = ["保密", "男", "女"];
    $(document).on("pageInit", "#page-user-info", function(e, pageId, $page) {
        wxApi();
        $("#page-user-info .avatar-wrapper span").css("background-image", "url(" + userInfo.head_img + ")");
        $("#page-user-info .username").val(userInfo.user_name);

        var curr_gander = gander_list[Number(userInfo.sex)];

        $("#page-user-info .gander").val(curr_gander);
        $("#page-user-info .gander").picker({
            cssClass: "gander-picker",
            cols: [{
                textAlign: "center",
                values: gander_list
            }],

        });
        var maxDate = func_timestamp2datetime(new Date()).date;
        $("#page-user-info .birthday-picker").val(func_timestamp2datetime(userInfo.birthday).date);
        $("#page-user-info .birthday-picker").calendar({
            maxDate: [maxDate],
            onChange: function(p, values, displayValues) {
                var select_date = displayValues[0];
                console.log(select_date);
                func_ajax({
                    url: "http://www.homchang.site/index.php/Api/index/updateUserInfo",
                    data: {
                        open_id: userInfo.open_id,
                        birthday: select_date
                    },
                    successCallback: function(data) {
                        var d = select_date.split("-");
                        userInfo.birthday = new Date(d[0] * 1, d[1] * 1 - 1, d[2] * 1).getTime();
                        console.log(new Date(d[0] * 1, d[1] * 1 - 1, d[2] * 1));
                    }
                });

            }
        });
        if (!(userInfo.mobile_phone == null || userInfo.mobile_phone == "" || userInfo.mobile_phone == undefined)) {
            $("#page-user-info .phone").val(userInfo.mobile_phone);
        }
    });

    $(document).on("click", "#page-user-info .username", function(event) {
       
        $.prompt("修改昵称", function(value) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/updateUserInfo",
                data: {
                    open_id: userInfo.open_id,
                    user_name: value
                },
                successCallback: function(data) {
                    userInfo.user_name = value;
                    $("#page-user-info .username").val(value);
                }
            });
        });
    });

    $(document).on("click", ".gander-picker .close-picker", function(event) {
       
        var select_gander = $("#page-user-info .gander").val();
        for (var i = 0; i < gander_list.length; i++) {
            if (select_gander == gander_list[i]) {
                select_gander = i;
                break;
            }
        }
        console.log(select_gander);
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/updateUserInfo",
            data: {
                open_id: userInfo.open_id,
                sex: select_gander
            },
            successCallback: function(data) {
                userInfo.sex = select_gander;
            }
        });
    });


    $(document).on("click", "#page-user-info .avatar", function() {
        var allow_select_num = 1;
        var buttons1 = [{
            text: '请选择',
            label: true
        }, {
            text: '照相',
            bold: true,
            color: 'danger',
            onClick: function() {
                func_uploadType_avatar("camera", allow_select_num);
            }
        }, {
            text: '从手机相册选择',
            onClick: function() {
                func_uploadType_avatar("album", allow_select_num);
            }
        }];
        var buttons2 = [{
            text: '取消',
            bg: 'danger'
        }];
        var groups = [buttons1, buttons2];
        $.actions(groups);
    });

    var cropper = null;
    var cropper_url = "";
    $(document).on('open', '.popup-cutter', function() {
        if (cropper == null) {
            var image = document.getElementById('crop-image');
            cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1
            });
        }
        cropper.reset().replace(cropper_url);
    });
    $(document).on('opened', '.popup-cutter', function() {
        $.hideIndicator();
    });
    $(document).on("click", ".popup-cutter .cut-btn", function() {
        var src_data = cropper.getCroppedCanvas({
            with: 200,
            height: 200
        }).toDataURL('image/jpeg');
        $("#page-user-info .avatar-wrapper span").css("background-image", "url(" + src_data + ")");
        userInfo.head_img = src_data;
        localStorage.userInfo = JSON.stringify(userInfo);
        src_data = src_data.replace("data:image/jpeg;base64,", "");
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/updateUserInfo",
            data: {
                open_id: userInfo.open_id,
                head_img: src_data
            },
            successCallback: function(data) {
                $.closeModal('.popup-cutter');
            }
        });
    });

    /*
     *选择上传类型
     * @param {String} type 上传类型
     * @param {Number} num 允许选择数量
     */

    function func_uploadType_avatar(type, num) {
        $.showIndicator();
        wx.chooseImage({
            count: num,
            // 默认9
            sizeType: ['original', 'compressed'],
            // 可以指定是原图还是压缩图，默认二者都有
            sourceType: [type],
            // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // $.showIndicator();
                upload_avatar(res.localIds);
            }
        });
    }

    /*
     *上传图片接口
     *@param {Object} url_list 要上传的localIds数组(微信返回的localIds)
     */

    function upload_avatar(url_list) {
        wx.uploadImage({
            localId: url_list[0],
            // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 0,
            // 默认为1，显示进度提示
            success: function(res) {
                //下载图片接口
                download_avatar(res.serverId); // 返回图片的服务器端
            }
        });
    }
    /*
     *微信图片下载
     *@param {Object} server_id 要下载的server_id数组(微信返回的server_id)
     */

    function download_avatar(server_id) {
        //          alert(server_id);
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/uploadImages",
            data: {
                serverId: server_id,
                open_id: userInfo.open_id
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    cropper_url = data.Common.info;
                    $.popup(".popup-cutter");
                }
            }
        });
    }



    /*****page-bind*****/

    $(document).on("click", "#page-bind .button-success", function(event) {
        var flag = $("#page-bind [name='telephone'],#page-bind [name='code']").validate();
        if (flag) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/associatePhone",
                data: {
                    open_id: userInfo.open_id,
                    phone: $("#page-bind [name='telephone']").val(),
                    code: $("#page-bind [name='code']").val()
                },
                successCallback: function(data) {
                    if (data.Common.code == 200) {
                        $.toast("绑定成功");
                        userInfo.mobile_phone = $("#page-bind [name='telephone']").val();
                        setTimeout(function() {
                            $.router.back();
                        }, 2000);
                    }
                }
            });
        }
    });


    $(document).on("click", "#page-bind .get-verifyCode-btn", function(event) {
        var flag = $("#page-bind [name='telephone']").validate();
        if (flag) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/getVerifyCode",
                data: {
                    open_id: userInfo.open_id,
                    phone: $("#page-bind [name='telephone']").val()
                },
                successCallback: function(data) {
                    if (data.Common.code = 200) {
                        $.alert("验证码已发送，请注意查收！");
                    }
                }
            });
        }
    }); /*****page-address*****/
    $(document).on("pageInit", "#page-address", function(e, pageId, $page) {
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getLocations",
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
       

        var update_id = $(this).parents("li").attr("data-id");
        var $radio = $(this).find("input");
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/addLocation",
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
       
        var $delete_ele = $(this).parents("li");
        var delete_id = $delete_ele.attr("data-id");

        $.confirm("确定要删除这个地址吗？", function() {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/deleteLocation",
                data: {
                    open_id: userInfo.open_id,
                    location_id: delete_id
                },
                successCallback: function(data) {
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
                url: "http://www.homchang.site/index.php/Api/index/addLocation",
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
                url: "http://www.homchang.site/index.php/Api/index/addLocation",
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
    var public_error_list = [];
    $(document).on("pageInit", "#page-bespeak", function(e, pageId, $page) {
        wxApi();
        var today = new Date().format("yyyy-MM-dd");
        //回显
        if (!(repairInfo.category == "" || repairInfo.category == undefined)) {
            $("#page-bespeak .product-picker").val(repairInfo.category.first + " " + repairInfo.category.second);
        }

        var error_list = [];
        var curr_name = "";
        if (!(repairInfo.error_list == "" || repairInfo.error_list == undefined)) {
            for (var i = 0; i < repairInfo.error_list.length; i++) {
                error_list.push(repairInfo.error_list[i].name);
                if (repairInfo.error_type == repairInfo.error_list[i].id) {
                    curr_name = repairInfo.error_list[i].name;
                }
            }
        }
        $(".error-picker").val(curr_name);

        $(".error-picker").picker({
            value: curr_name,
            cols: [{
                textAlign: 'center',
                values: error_list
            }]

        });
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getCategoriesByParentId",
            data: {
                parent_id: 0
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var temp_product_list = data.Common.info;
                    for (var i = 0; i < temp_product_list.length; i++) {
                        for (var j = 0; j < temp_product_list[i].children.length; j++) {
                            delete temp_product_list[i].children[j].parent_id;
                            delete temp_product_list[i].children[j].preview;
                        }
                        delete temp_product_list[i].parent_id;
                        delete temp_product_list[i].preview;
                        temp_product_list[i].sub = temp_product_list[i].children;
                        delete temp_product_list[i].children;
                    }

                    productPickerInit(temp_product_list); //加工后的商品类型联动数据
                    $("#page-bespeak .product-picker").productPicker({
                        onClose: function() {
                            var temp_name_list = $("#page-bespeak .product-picker").val().split(" ");
                            var category_name = temp_name_list[0];
                            var sub_category_name = temp_name_list[1];


                            repairInfo.category = {
                                first: category_name,
                                second: sub_category_name
                            };
                            sessionStorage.repairInfo = JSON.stringify(repairInfo);
                            var c = temp_product_list;
                            var c_id = 0;
                            for (var i = 0; i < c.length; i++) {
                                for (var j = 0; j < c[i].sub.length; j++) {
                                    if (c[i].sub[j].name == sub_category_name) {
                                        c_id = c[i].sub[j].id; //根据选取的二级分类的名取对应得id值
                                    }
                                }
                            }
                            func_ajax({
                                url: "http://www.homchang.site/index.php/Api/index/getMalfunctions",
                                data: {
                                    category_id: c_id,
                                    open_id: userInfo.open_id
                                },
                                successCallback: function(data) {

                                    //重置errorpicker
                                    var displayValues = [];
                                    $("#page-bespeak .error-picker").val("");
                                    repairInfo.error_type = "";
                                    sessionStorage.repairInfo = JSON.stringify(repairInfo);
                                    var back_up = $("#page-bespeak .error-picker").clone();
                                    $("#page-bespeak .error-picker").after(back_up).remove();
                                    if (data.Common.code == 200) {
                                        public_error_list = data.Common.info;
                                        console.log(public_error_list);
                                        repairInfo.error_list = public_error_list;
                                        sessionStorage.repairInfo = JSON.stringify(repairInfo);
                                        for (var i = 0; i < public_error_list.length; i++) {
                                            displayValues.push(public_error_list[i].name);
                                        }
                                        $("#page-bespeak .error-picker").picker({
                                            cols: [{
                                                textAlign: 'center',
                                                values: displayValues
                                            }]
                                        });
                                    } else {
                                        $("#page-bespeak .error-picker").picker({
                                            cols: [{
                                                textAlign: 'center',
                                                values: [""],
                                                displayValues: ["该类型暂无故障类型"]
                                            }]
                                        })
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });



        if (!(repairInfo.telephone == "" || repairInfo.telephone == undefined)) {
            $("#page-bespeak #tab1 [name='telephone']").val(repairInfo.telephone);
        } else if (!(userInfo.mobile_phone == null || userInfo.mobile_phone == "" || userInfo.mobile_phone == undefined)) {
            $("#page-bespeak #tab1 [name='telephone']").val(userInfo.mobile_phone);
        }

        if (!(setupInfo.telephone == "" || setupInfo.telephone == undefined)) {
            $("#page-bespeak #tab2 [name='telephone']").val(setupInfo.telephone);
        } else if (!(userInfo.mobile_phone == null || userInfo.mobile_phone == "" || userInfo.mobile_phone == undefined)) {
            $("#page-bespeak #tab2 [name='telephone']").val(userInfo.mobile_phone);
        }

        $("#page-bespeak #tab1 [name='desc']").html(repairInfo.desc);


        $("#page-bespeak #tab1 [name='code']").val(repairInfo.code);
        $("#page-bespeak #tab1 [name='datetime']").val(repairInfo.datetime);

        $("#page-bespeak #tab2 [name='desc']").html(setupInfo.desc);

        $("#page-bespeak #tab2 [name='code']").val(setupInfo.code);
        $("#page-bespeak #tab2 [name='datetime']").val(setupInfo.datetime);

        if (!(repairInfo.imgs == [] || repairInfo.imgs == undefined)) {
            $("#page-bespeak #tab1 .uploader-wrapper li").not($(".uploader-btn").parent()).remove();
            var temp_html = "";
            for (var i = 0; i < repairInfo.imgs.length; i++) {
                temp_html += '<li><span><img src="' + repairInfo.imgs[i] + '"></span><i class="icon icon-close"></i></li>'
            }
            $("#page-bespeak #tab1 .uploader-wrapper ul li").before(temp_html);
        }


        if ($(".picker-modal-inline").length == 0) {
            $("#date").calendar({
                minDate: [today],
                onChange: function(p, values, displayValues) {
                    $(".popup-datetime  [name='date']").val(displayValues[0]);
                    $(".popup-datetime  [name='time']").prop("checked", false);
                }
            });
        }

        //订单默认地址
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getLocations",
            data: {
                open_id: userInfo.open_id,
                is_main: 1
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var default_data = data.Common.info[0];

                    repairInfo.address_id = default_data.id;
                    sessionStorage.repairInfo = JSON.stringify(repairInfo);

                    setupInfo.address_id = default_data.id;
                    sessionStorage.setupInfo = JSON.stringify(setupInfo);

                    $("#page-bespeak [name='address']").val(default_data.id);
                    $("#page-bespeak .address-block .item-title-row .item-title").html(default_data.contact + " " + default_data.tel);
                    $("#page-bespeak .address-block .item-text").html(default_data.address);
                }
            }
        });
        if (!(setupInfo.product == [] || setupInfo.product == undefined)) {
            $("#page-bespeak #tab2 [name='product-name']").val(setupInfo.product.name);
            $("#page-bespeak #tab2 [name='product-id']").val(setupInfo.product.id);
        }



    });

    $(document).on("change", "#page-bespeak .error-picker", function() {
        console.log("1111");
        var error_name = $(this).val();
        var error_id = 1;
        for (var i = 0; i < public_error_list.length; i++) {
            if (public_error_list[i].name == error_name) {
                error_id = public_error_list[i].id;
            }
        }
        repairInfo.error_type = error_id;
        sessionStorage.repairInfo = JSON.stringify(repairInfo);
    });

    $(document).on('click', '#page-bespeak #tab1 .button-success', function() {
        var flag = $("#page-bespeak #tab1 [name='category'],#page-bespeak #tab1 [name='error'],#page-bespeak #tab1 [name='telephone'],#page-bespeak #tab1 [name='code'],#page-bespeak #tab1 [name='datetime'],#page-bespeak #tab1 [name='address']").validate();
        if (flag) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/addSchedule",
                data: {
                    open_id: userInfo.open_id,
                    type: 2,
                    malf_id: repairInfo.error_type,
                    comment: repairInfo.desc,
                    images: repairInfo.imgs.join("||"),
                    tel: repairInfo.telephone,
                    code: repairInfo.code,
                    appointment_time: repairInfo.datetime,
                    location_id: repairInfo.address_id
                },
                successCallback: function(data) {
                    if (data.Common.code == 200) {
                        repairInfo = {
                            category: "",
                            error_list: "",
                            error_type: "",
                            desc: "",
                            imgs: [],
                            telephone: "",
                            code: "",
                            datetime: "",
                            address_id: ""
                        };
                        $.alert("预约成功！您已成功预约，稍后客服专员会与您取得联系，敬请留意。客服热线：400-110-8004/020-81401016/0757-83031318【鸿畅环保】");
                    } else {
                        $.toast("未知错误，预约失败");
                    }
                }
            });
        }
    });
    $(document).on('click', '#page-bespeak #tab2 .button-success', function() {
        var flag = $("#page-bespeak #tab2 [name='product-id'],#page-bespeak #tab2 [name='desc'],#page-bespeak #tab2 [name='telephone'],#page-bespeak #tab2 [name='code'],#page-bespeak #tab2 [name='datetime'],#page-bespeak #tab2 [name='address']").validate();
        if (flag) {
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/addSchedule",
                data: {
                    open_id: userInfo.open_id,
                    type: 1,
                    order_id: setupInfo.product.id,
                    comment: setupInfo.desc,
                    tel: setupInfo.telephone,
                    code: setupInfo.code,
                    appointment_time: setupInfo.datetime,
                    location_id: setupInfo.address_id
                },
                successCallback: function(data) {
                    if (data.Common.code == 200) {
                        setupInfo = {
                            product: "",
                            desc: "",
                            telephone: "",
                            code: "",
                            datetime: "",
                            address_id: ""
                        };
                        $.alert("预约成功！您已成功预约，稍后客服专员会与您取得联系，敬请留意。客服热线：400-110-8004/020-81401016/0757-83031318【鸿畅环保】");
                    } else {
                        $.toast("未知错误，预约失败");
                    }
                }
            });
        }
    });

    $(document).on('click', '#page-bespeak .uploader-btn', function() {
        var allow_select_num = 4 - $(".uploader-wrapper ul li").length;
        var buttons1 = [{
            text: '请选择',
            label: true
        }, {
            text: '照相',
            bold: true,
            color: 'danger',
            onClick: function() {
                fun_uploadType("camera", allow_select_num);
            }
        }, {
            text: '从手机相册选择',
            onClick: function() {
                fun_uploadType("album", allow_select_num);
            }
        }];
        var buttons2 = [{
            text: '取消',
            bg: 'danger'
        }];
        var groups = [buttons1, buttons2];
        $.actions(groups);
    });


    /*
     *选择上传类型
     * @param {String} type 上传类型
     * @param {Number} num 允许选择数量
     */

    function fun_uploadType(type, num) {
        //拍照或从手机相册中选图接口
        var photo_index = 0;
        wx.chooseImage({
            count: num,
            // 默认9
            sizeType: ['original', 'compressed'],
            // 可以指定是原图还是压缩图，默认二者都有
            sourceType: [type],
            // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                //遍历res.localIds，添加待上传的图片html
                var html = "";
                var photo_length = res.localIds.length;
                $.showPreloader("正在上传图片<br><span id='uploading-index'>0</span>/<span id='uploading-count'>" + photo_length + "</span>");
                var photo_array = new Array();
                for (photo_index; photo_index < photo_length; photo_index++) {
                    photo_array.push(res.localIds[photo_index]);
                    html += '<li><span data-localIds="' + res.localIds[photo_index] + '" class="uploading" ><img src="' + res.localIds[photo_index] + '" alt="" /></span><div class="uploading-content"><div class="preloader"></div></div></li>';
                }
                $(".uploader-wrapper ul li").first().before(html);
                //
                upload(photo_array.reverse()); //调用上传函数，倒序
            }
        });
    }
    /*
     *上传图片接口
     *@param {Object} url_list 要上传的localIds数组(微信返回的localIds)
     */

    function upload(url_list) {
        if (url_list.length > 0) {
            $("#uploading-index").text(Number($("#uploading-index").text()) + 1); //改变上传图片
            wx.uploadImage({
                localId: url_list[0],
                // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0,
                // 默认为1，显示进度提示
                success: function(res) {
                    var curr_ele = $(".uploader-wrapper").find("[data-localIds='" + url_list[0] + "']"); //查找出当前上传的DOM对象
                    download(res.serverId, curr_ele, url_list); // 返回图片的服务器端
                }
            });
        } else {
            $.hidePreloader();
        }
    }

    /*
     *微信图片下载
     *@param {Object} server_id 要下载的server_id数组(微信返回的server_id)
     *@param {Object} curr_ele 当前下载图片的Jq对象
     *@param {Object} url_list 要上传的localIds数组(微信返回的localIds)；用于upload(url_list)函数的
     */

    function download(server_id, curr_ele, url_list) {

        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/uploadImages",
            data: {
                serverId: server_id,
                open_id: userInfo.open_id
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var this_path = data.Common.info;

                    curr_ele.find("img").attr("src", this_path);

                    var path_list = [];
                    $("#page-bespeak .uploader-wrapper img").each(function(index, ele) {
                        path_list.push($(ele).attr("src"));
                    });
                    repairInfo.imgs = path_list;
                    sessionStorage.repairInfo = JSON.stringify(repairInfo);
                    //记录图片

                    //图片下载成功，从上传数组url_list中删除
                    url_list.splice(0, 1);
                    //当前图片上传成功，移除图片的loading动画，添加删除按钮
                    curr_ele.removeClass("uploading").next().remove();
                    curr_ele.after("<i class='icon icon-close'></i>");
                    //继续调用上传函数直到全部上传完毕
                    upload(url_list);
                }
            }
        });
    }
    $(document).on("click", "#page-bespeak .open-popup-datetime", function(event) {
        var target_classname = $(this).find("input").attr("class");
        $(".popup-datetime [name='date']").attr("data-target", "." + target_classname);
        $.popup(".popup-datetime");
    });

    $(document).on("click", ".popup-datetime .pick", function(event) {
        var date = $(".popup-datetime [name='date']").val();
        if (date != "") {
            var time = $(".popup-datetime [name='time']:checked").val() || "";

            var datetime = date;
            if (time != "") {
                datetime = date + " " + time
            }

            var $get_datetime_ele = $($(".popup-datetime [name='date']").attr("data-target"));
            $get_datetime_ele.val(datetime);
            $.closeModal(".popup-datetime");
            if ($get_datetime_ele.hasClass("repair-datetime")) {
                //记录预约时间
                repairInfo.datetime = datetime;
                sessionStorage.repairInfo = JSON.stringify(repairInfo);
            } else {
                //记录预约时间
                setupInfo.datetime = datetime;
                sessionStorage.setupInfo = JSON.stringify(setupInfo);
            }
        } else {
            $.toast("请先选择日期");
        }
    });

    //妈的这个验证码，自己写完我都看不懂

    function createCounter(iName, sessionStorageName, count, $btn) {
        return 'var ' + iName + ' = setInterval(function() {\
                ' + count + '--;\
                if (' + count + ' > 0) {\
                    ' + $btn + '.html("重新获取(" + ' + count + ' + "s)");\
                    sessionStorage.' + sessionStorageName + ' = ' + count + ';\
                } else {\
                    clearInterval(' + iName + ');\
                       ' + $btn + '.html("获取验证码").removeAttr("disabled");\
                    sessionStorage.clear("' + sessionStorageName + '");\
                }\
            }, 1000);';
    }
    if (sessionStorage.r_count != undefined) {
        var r_count = sessionStorage.r_count;
        var i_name = "r_i";
        var s_name = "r_count";
        eval(createCounter(i_name, s_name, "r_count", '$("#page-bespeak .get-verifyCode-btn.repair-code")'));
    }

    if (sessionStorage.s_count != undefined) {
        var s_count = sessionStorage.s_count;
        var i_name = "s_i";
        var s_name = "s_count";
        eval(createCounter(i_name, s_name, "s_count", '$("#page-bespeak .get-verifyCode-btn.setup-code")'));

    }
    $(document).on("click", "#page-bespeak .get-verifyCode-btn", function(event) {
        var $curr_phone = $(this).parents("li").prev("li").find("input[name='telephone']");
        var flag = $curr_phone.validate();
        if (flag) {
            var temp_phone = $curr_phone.val();
            func_ajax({
                url: "http://www.homchang.site/index.php/Api/index/getVerifyCode",
                data: {
                    open_id: userInfo.open_id,
                    phone: temp_phone
                },
                successCallback: function(data) {
                    if (data.Common.code = 200) {
                        $.alert("验证码已发送，请注意查收！");
                    }
                }
            });
            var count = 120;
            var $btn = $(this);
            var $btn_str = '$("#page-bespeak .get-verifyCode-btn.repair-code")';
            var i_name = "r_i";
            var s_name = "r_count";
            if ($btn.hasClass("setup-code")) {
                i_name = "s_i";
                s_name = "s_count";
                $btn_str = '$("#page-bespeak .get-verifyCode-btn.setup-code")';
            }
            var js_str = createCounter(i_name, s_name, "count", $btn_str);
            eval(js_str);
            $btn.prop("disabled", true);
        }
    });



    $(document).on("change", "#page-bespeak #tab1 [name='code']", function(event) {
        //记录填写的验证码
        repairInfo.code = $(this).val();
        sessionStorage.repairInfo = JSON.stringify(repairInfo);
    });
    $(document).on("change", "#page-bespeak #tab1 [name='telephone']", function(event) {
        //记录填写的电话号码
        repairInfo.telephone = $(this).val();
        sessionStorage.repairInfo = JSON.stringify(repairInfo);
    });
    $(document).on("change", "#page-bespeak #tab1 [name='desc']", function(event) {
        //记录填写的故障
        repairInfo.desc = $(this).val();
        sessionStorage.repairInfo = JSON.stringify(repairInfo);
    });
    $(document).on("click", "#page-bespeak .uploader-wrapper .icon-close", function(event) {
        //记录填写的故障
        $(this).parent("li").remove();
        var path_list = [];
        $("#page-bespeak .uploader-wrapper img").each(function(index, ele) {
            path_list.push($(ele).attr("src"));
        });
        repairInfo.imgs = path_list;
        sessionStorage.repairInfo = JSON.stringify(repairInfo);
    }); /*****page-select-product*****/
    $(document).on("pageInit", "#page-select-product", function(e, pageId, $page) {
        func_ajax({
            url: "http://www.homchang.site/index.php/Api/index/getOrderList",
            data: {
                open_id: userInfo.open_id,
                overlay: 1
            },
            successCallback: function(data) {
                if (data.Common.code == 200) {
                    var temp_data = data.Common.info;
                    var temp_html = template('page-select-product-item', {
                        list: temp_data
                    });
                    $("#page-select-product .list-block ul").html(temp_html);
                    if (!(setupInfo.product == [] || setupInfo.product == undefined)) {
                        $("#page-select-product [name='product-radio'][value='" + setupInfo.product.id + "']").prop("checked", true);
                    }
                }
            }
        })
    });
    $(document).on("change", "#page-select-product [name='product-radio']", function(event) {
        var curr_id = $("#page-select-product [name='product-radio']:checked").val();
        var curr_name = $("#page-select-product [name='product-radio']:checked").nextAll(".item-inner").text().trim();
        setupInfo.product = {
            id: curr_id,
            name: curr_name
        };
        sessionStorage.setupInfo = JSON.stringify(setupInfo);
    });
    $(document).on("change", "#page-bespeak #tab2 [name='desc']", function(event) {
        //记录填写的备注信息
        setupInfo.desc = $(this).val();
        sessionStorage.setupInfo = JSON.stringify(setupInfo);
    });
    $(document).on("change", "#page-bespeak #tab2 [name='code']", function(event) {
        //记录填写的验证码
        setupInfo.code = $(this).val();
        sessionStorage.setupInfo = JSON.stringify(setupInfo);
    });
    $(document).on("change", "#page-bespeak #tab2 [name='telephone']", function(event) {
        //记录填写的电话号码
        setupInfo.telephone = $(this).val();
        sessionStorage.setupInfo = JSON.stringify(setupInfo);
    }); /*****page-map*****/

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
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            //调用地图命名空间中的转换接口   type的可选值为 1:GPS经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
            qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 1, function(res) {
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

                func_ajax({
                    url: "http://www.homchang.site/index.php/Api/index/getBranches",
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
        var name = $this.find(".item-title").text();
        var address = $this.find(".item-text").text();
        wx.openLocation({
            latitude: parseFloat(location[0]),
            // 纬度，浮点数，范围为90 ~ -90
            longitude: parseFloat(location[1]),
            // 经度，浮点数，范围为180 ~ -180。
            name: name,
            // 位置名
            address: address,
            // 地址详情说明
            scale: 28,
            // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }); /*****init*****/
    $.init();
});