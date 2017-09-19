

	//通过config接口注入权限验证配置
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: 'wx367f468f7b3e5aa2', // 必填，公众号的唯一标识
		timestamp: '1505398653',  // 必填，生成签名的时间戳
		nonceStr: 'UIvRIJYsWRFOoc0i', // 必填，生成签名的随机串
		signature: '60e64c2e75709bd08a3c50600b22d6ff5826602f', // 必填，签名
		jsApiList: [
			'checkJsApi',
			'chooseImage',
			'previewImage',
			'downloadImage',
			'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	//通过ready接口处理成功验证
wx.ready(function(){

	$(document).on("click",".avatar-wrapper",function() {
		var allow_select_num=1;
		var buttons1 = [{
			text: '请选择',
			label: true
		}, {
			text: '照相',
			bold: true,
			color: 'danger',
			onClick: function(){fun_uploadType("camera",allow_select_num);}
		}, {
			text: '从手机相册选择',
			onClick:  function(){fun_uploadType("album",allow_select_num);}
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
	function fun_uploadType(type,num) {
		wx.chooseImage({
			count: num, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {	
				$.showIndicator();
				upload(res.localIds);
			}
		});	
	}

	/*
	*上传图片接口
	*@param {Object} url_list 要上传的localIds数组(微信返回的localIds)
	*/
	function upload(url_list) {
			wx.uploadImage({
				localId: url_list[0], // 需要上传的图片的本地ID，由chooseImage接口获得
				isShowProgressTips:0, // 默认为1，显示进度提示
				success: function(res) {
					//下载图片接口
					download(res.serverId);// 返回图片的服务器端
				},
				fail: function(res) {
					$.alert(JSON.stringify(res));
				}
			});
	}
	/*
	*微信图片下载
	*@param {Object} server_id 要下载的server_id数组(微信返回的server_id)
	*/
	function download(server_id) {
//			alert(server_id);
			$.ajax({
				type: 'post',
				url: "/Share/User/uploadImage",
				data: { serverId: server_id},
				success: function (json){			
					if(json.scucode == 0000)
					{
//						alert(json.file_path);
						$('.hd_img').val(json.file_path);
						cropper_url=json.file_path;
						$.popup(".popup-cutter");
					}
				},
				 error: function(XMLHttpRequest, textStatus, errorThrown) {
					 $.alert(XMLHttpRequest.status+XMLHttpRequest.readyState+textStatus);
   				}
			});
	}

});
	


	function delPic(element) {
		var src_index = $(".uploader-wrapper ul li").index($(element).parent());
		var src_array = $('.houses_img').val().split("||");
		//alert(src_array+"---------array");
		var url = src_array[src_index];
		//alert(url+"---------this");
		var id = $('#share_id').val();//提交
		//console.log(id);
		$.ajax({
			type: 'get',
			url: "/Share/User/DelShareImages",
			data: {image: url,share_id:id},
			success: function(data) {
				$.hideIndicator();
				if (data == 'true') {
					$.toast('删除成功！');
						//上传完成后改变按钮html——还能上传多少张图片
						$(element).parent().remove();
						src_array.splice(src_index, 1);
						$('.houses_img').val(src_array.join("||"));

				} else if (data == 'false') {
					$.toast('删除失败！');
					return false;
				} else if (data == 'unfind') {			
					$.alert('找不到照片！');
				}
			}
		});
	}


		//通过config接口注入权限验证配置
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: 'wx367f468f7b3e5aa2', // 必填，公众号的唯一标识
			timestamp: '1505398925', // 必填，生成签名的时间戳
			nonceStr: 'O2pSD3pbgmAhUi4h', // 必填，生成签名的随机串
			signature: '98649e9589e027de91ca746a78f9db12c4544151', // 必填，签名
			jsApiList: [
					'checkJsApi',
					'chooseImage',
					'previewImage',
					'downloadImage',
					'uploadImage'
				] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		//通过ready接口处理成功验证
		wx.ready(function() {
			$(document).on('click', '.uploader-btn', function() {
				var allow_select_num=10-$(".uploader-wrapper ul li").length;
				var buttons1 = [{
					text: '请选择',
					label: true
				}, {
					text: '照相',
					bold: true,
					color: 'danger',
					onClick: function(){fun_uploadType("camera",allow_select_num);}
				}, {
					text: '从手机相册选择',
					onClick:  function(){fun_uploadType("album",allow_select_num);}
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
			function fun_uploadType(type,num) {
				//拍照或从手机相册中选图接口
				var photo_index=0;
				wx.chooseImage({
					count: num, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						//遍历res.localIds，添加待上传的图片html
						var html="";
						var photo_length=res.localIds.length;
						$.showPreloader("正在上传图片<br><span id='uploading-index'>0</span>/<span id='uploading-count'>"+photo_length+"</span>");
						var photo_array=new Array();
						for(photo_index;photo_index<photo_length;photo_index++){
							photo_array.push(res.localIds[photo_index]);
							html+='<li><img src="'+res.localIds[photo_index]+'" alt="" /><span data-localIds="'+res.localIds[photo_index]+'" class="uploading" style="background-image:url('+res.localIds[photo_index]+');"></span><div class="uploading-content"><div class="preloader"></div></div></li>';
						}
						$(".uploader-wrapper ul li").first().before(html);
						//
						upload(photo_array.reverse());//调用上传函数，倒序
					}
				});
			}
			/*
			*上传图片接口
			*@param {Object} url_list 要上传的localIds数组(微信返回的localIds)
			*/
			function upload(url_list) {
				if(url_list.length>0){
				$("#uploading-index").text(Number($("#uploading-index").text())+1);//改变上传图片
				wx.uploadImage({
						localId: url_list[0], // 需要上传的图片的本地ID，由chooseImage接口获得
						isShowProgressTips: 0, // 默认为1，显示进度提示
						success: function(res) {
							var curr_ele=$(".uploader-wrapper").find("[data-localIds='"+url_list[0]+"']");//查找出当前上传的DOM对象
							download(res.serverId,curr_ele,url_list);// 返回图片的服务器端
						},
						fail: function(res) {
							$.alert(JSON.stringify(res));
						}
					});
				}else{
				$.hidePreloader();
				}
			}

			/*
			*微信图片下载
			*@param {Object} server_id 要下载的server_id数组(微信返回的server_id)
			*@param {Object} curr_ele 当前下载图片的Jq对象
			*@param {Object} url_list 要上传的localIds数组(微信返回的localIds)；用于upload(url_list)函数的
			*/
			function download(server_id,curr_ele,url_list) {
				$.ajax({
					type: 'post',
					url: "/Share/User/uploadShareImages",
					data: {
						serverId: server_id
					},
					success: function(json) {
						if (json.respCode == 0000) {
							//图片下载成功，从上传数组url_list中删除
							url_list.splice(0,1);
							//当前图片上传成功，移除图片的loading动画，添加删除按钮
							curr_ele.removeClass("uploading").next().remove();
							curr_ele.after("<i class='icon icon-close'></i>");

							//继续调用上传函数直到全部上传完毕
							upload(url_list);

							//隐藏域houses_img拼串
							var hidden_box_image = $('.houses_img').val();
							var temp_list=new Array();
							if(hidden_box_image!=""){
								temp_list=hidden_box_image.split("||");
							}
							temp_list.push(json.filePath);
							$('.houses_img').val(temp_list.join("||"));

						} else {
					$.alert('上传失败！');
							return false;
						}
					},
					 error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert(XMLHttpRequest.status+XMLHttpRequest.readyState+textStatus);
					}
				});
			}
		});

cropper = 1;
cropper_url = "";
//console.log(cropper);
$(document).on('open', '.popup-cutter', function() {

	if (cropper == 1) {
		var image = document.getElementById('crop-image');
		cropper = new Cropper(image, {
			aspectRatio: 1,
			viewMode: 1,
			preview: '.img-preview'
		});
	}
	cropper.reset().replace(cropper_url);
});
$(document).on('opened', '.popup-cutter', function() {
	$.hideIndicator();
});

$(".getData-btn").click(function() {
	var src_data = cropper.getCroppedCanvas({
		with: 200,
		height: 200
	}).toDataURL('image/jpeg');
	$(".avatar-wrapper span").css("background-image", "url(" + src_data + ")");
	$('.crop_hd_img').val(src_data.replace("data:image/jpeg;base64,", ""));
	$.closeModal('.popup-cutter');
	//alert($(".avatar-wrapper span").css("background-image"));	
});

$(document).on("click", ".my-tag-list li i.icon-close", function() {
	var $this = $(this).parent();
	var this_value = $this.attr("data-value");
	var tags_list = $(".my-tag-list-value");
	$this.remove();
	$(".all-tag-list").find("[data-value='" + this_value + "']").removeClass("selected");
	//	console.info("删除" + this_value);
	var tags_list_arry = tags_list.val().split(",");
	//	console.log(tags_list_arry);
	tags_list_arry.splice($.inArray(this_value, tags_list_arry), 1);
	tags_list.val(tags_list_arry.join(","));
	//	console.log(tags_list_arry);

});

$(document).on("click", ".all-tag-list li", function() {
	var $this = $(this);
	var $container = $(".my-tag-list");
	var this_value = $(this).attr("data-value");
	var this_name = $(this).text();
	var tags_list = $(".my-tag-list-value");
	if ($container.find("[data-value='" + this_value + "']").length != 0) return false;
	if ($container.find('li').length >= 16) return false;
	var item_html = '<li data-value="' + this_value + '">' + this_name + '<i class="icon icon-close"></i></li>';
	$container.append(item_html);
	if (tags_list.val() != "") {
		tags_list.val(tags_list.val() + "," + this_value);
	} else {
		tags_list.val(this_value);
	}
	$this.addClass("selected");
});

$(document).on("click", ".change-tag-btn", function() {
	var $container = $(".all-tag-list");
	var $my_container = $(".my-tag-list");
	var tag_type = Math.floor(Math.random() * 7 + 1);
	$.ajax({
		type: 'get',
		url: "/Share/User/ajaxGetTypeTags",
		data: {
			id: tag_type
		},
		beforeSend: function() {
			$.showIndicator();
		},
		success: function(json) {

			var item_html = '';
			if (json) {
				for (var i = 0; i < json.length; i++) {
					item_html += '<li data-value="' + json[i].id + '">' + json[i].name + '</li>';
				}
				$container.html(item_html);

			} else {
				$container.html('服务器繁忙');
			}
			$.hideIndicator();
			$my_container.find('li').each(function(element, index) {
				var this_value = $(this).attr("data-value");
				$container.find("[data-value='" + this_value + "']").addClass("selected");
			});
		},
		error: function(xhr) {
			$.alert('请求失败');
		}
	});
});

	