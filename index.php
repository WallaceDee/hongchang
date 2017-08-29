<?php
header("Content-type:text/html;charset=utf-8");
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用入口文件

// 检测PHP环境
if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');

define ( 'S_ROOT', dirname ( __FILE__ ) . DIRECTORY_SEPARATOR ); //站点路径
define ( 'S_URL', 'http://'.$_SERVER['HTTP_HOST'] );//当前域名

// 开启调试模式 建议开发阶段开启 部署阶段注释或者设为false
define('APP_DEBUG',true);
//define('HTML_CACHE_ON',false);
//define('DB_FIELD_CACHE',false);
function P($var){
    echo "<pre>";
    var_dump($var);
    echo "</pre>";
    exit();
}
require 'vendor/autoload.php';
// 定义应用目录
define('APP_PATH','./Application/');

// 引入ThinkPHP入口文件
require './ThinkPHP/ThinkPHP.php';

// 亲^_^ 后面不需要任何代码了 就是如此简单
