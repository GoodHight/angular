! function() {
	var authenticationVue = new Vue({
		el: "#authenticationvue",
		data: {
			attType: null,
			imgarry: [],
			name: "",
			professionaltext: '',
			scopers: [],
			scopersText: '',
			professional: [],
			introduce: '',
			sellerPhone: '',
			addrCode: '',
			value: null,
			showSer: false,
			servList: [],
			servicesign: [],
			dome: null,
			showservice: null,
			province: null, //省
			citys: null, //市
			area: null, //区
			scope: null, //范围
			selectCode: null,
			p: null,
			c: null,
			a: null,
			s: null,
			submitType: true
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getServiceArea();
				_this.getBackstage();
				_this.getProfessional();
				var type = kdcommon.getQueryString('type');
				if(type == "A") {
					_this.attType = true; //在职
				} else {
					_this.attType = false; //兼职
				}
			},
			//获得职称
			getProfessional: function() {
				app.post(kdcommon.URL.restful, '/artificertitle/getAllArtificerTitle', null, {}, function(data, textStatus) {
					if(data.code == 0) {
						var list = data.data;
						for(var i = 0; i < list.length; i++) {
							var data = {
								'text': list[i].title_name,
								'value': list[i].id
							}
							_this.professional.push(data);
						}
					}
				});
			},
			//创建弹出层
			openUpbox: function() {
				(function($, doc) {
					$.init();
					$.ready(function() {
						//普通示例
						var userPicker = new $.PopPicker();
						userPicker.setData(_this.professional);
						userPicker.show(function(items) {
							console.log((items[0]).text);
							_this.professionaltext = (items[0]).text;
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					});
				})(mui, document);
			},
			fileImg: function(e, value) {
				_this.value = value;
				_this.dome = $(e.currentTarget).children("img");
			},
			showService: function(e) {
				_this.showSer = true;
				$(e.currentTarget).parent().siblings(".service-conts").show();
			},
			//图片上传
			examination: function(event) {
				var files = event.target.files,
					file, filetype = true;
				if(files) {
					// 获取目前上传的文件
					file = files[0];

					if(_this.imgarry.length > 0) {
						for(var i = 0, len = _this.imgarry.length; i < len; i++) {
							if(_this.imgarry[i].index == _this.value) {
								_this.imgarry[i].files = file;
								filetype = false;
							}
						}
					}
					if(filetype) {
						var arrays = {
							"index": _this.value,
							"files": file
						}
						_this.imgarry.push(arrays)
					}
					// 获取 window 的 URL 工具
					var URL = window.URL || window.webkitURL;
					// 通过 file 生成目标 url
					var imgURL = URL.createObjectURL(file);
					//用attr将img的src属性改成获得的url
					$(_this.dome).attr("src", imgURL)
					// 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
					//URL.revokeObjectURL(imgURL);、
				}
			},
			//获得服务器地址
			getBackstage: function() {
				console.log(cities);
				_this.province = cities;
				_this.p = cities[0].name
				_this.citys = cities[0].children;
				_this.c = cities[0].children[0].name
				_this.area = cities[0].children[0].children;
				_this.a = cities[0].children[0].children[0].name;
				_this.scope = cities[0].children[0].children[0].children;
				var code = cities[0].children[0].children[0].children;
				if(code.length != 0) {
					_this.s = cities[0].children[0].children[0].children[0].name;
					_this.selectCode = cities[0].children[0].children[0].children[0].code;
				};
			},

			//选择地址
			selectArea: function(e, value, name) {
				var selects = $(e.currentTarget);
				var index = $(e.currentTarget).attr("selectedIndex");
				var text = selects[0][index].innerText;
				var code = $(e.currentTarget).val();
				if(value == 01) {
					for(var i = 0; i < cities.length; i++) {
						if(cities[i].code == code) {
							_this.p = cities[i].name
							_this.citys = cities[i].children;
							_this.area = cities[i].children[0].children;
							_this.scope = cities[i].children[0].children[0].children;
						}
					};
				} else if(value == 02) {
					for(var i = 0; i < cities.length; i++) {
						var children = cities[i].children
						for(var j = 0; j < children.length; j++) {
							if(children[j].code == code) {
								_this.c = children[j].name
								_this.a = children[j].children[0].name;
								_this.s = children[j].children[0].children[0].name;
								_this.area = children[j].children;
								_this.scope = children[j].children[0].children;
								if(children[j].children[0].children.length != 0) {
									_this.selectCode = children[j].children[0].children[0].code;
								} else {
									_this.selectCode = null
								}
							}
						}
					};
				} else if(value == 03) {
					for(var i = 0; i < cities.length; i++) {
						var children = cities[i].children;
						for(var j = 0; j < children.length; j++) {
							var childrens = children[j].children;
							for(var k = 0; k < childrens.length; k++) {
								if(childrens[k].code == code) {
									_this.a = childrens[k].name;
									_this.s = childrens[k].children[0].name;
									console.log(childrens[k]);
									_this.scope = childrens[k].children;
									if(childrens[k].children.length != 0) {
										_this.selectCode = childrens[k].children[0].code;
									} else {
										console.log("范围不存在");
										_this.selectCode = null
									}
									console.log(_this.selectCode);
								}
							}
						}
					};
				} else {
					_this.selectCode = code;
					_this.s = text;
					$(e.currentTarget).parents(".selectarea_box").hide()
					_this.showservice = _this.p + _this.c + _this.a + _this.s
				}
			},
			//获取服务范围
			getServiceArea: function() {
				app.post(kdcommon.URL.restful, '/SysCatalogSub/getAllServiceType', null, {}, function(data, textStatus) {
					console.log(data);
					if(data.code == 0) {
						app.loginhide();
						var service = data.data;
						for(var i = 0; i < service.length; i++) {
							var data = {
								"text": service[i].category_name,
								"value": service[i].sign
							}
							_this.servList.push(data);
						}
					}
				});
			},
			//选择服务
			selectService: function(e, sign) {
				if(_this.servList.length == 0) {
					app.toast("加载中请稍后....");
					return false;
				}
				$(e.currentTarget).parents("div").siblings(".checkbox-box").show();
			},
			selectCheck: function(e, text, sign) {
				//将拿到的服务sign和text保存进数组
				//先判断sign数组是否为空
				var signtype = true,
					texttype = true;
				if(_this.servicesign.length == 0) {
					_this.servicesign.push(sign);
				} else { //不为空循环判断
					for(var i = 0; i < _this.servicesign.length; i++) {
						if(_this.servicesign[i] == sign) {
							_this.servicesign.splice(i, 1);
							signtype = false;
						}
					}
					if(signtype) {
						_this.servicesign.push(sign);
					}
				};
				if(_this.scopers.length == 0) {
					_this.scopers.push(text);
				} else {
					for(var i = 0; i < _this.scopers.length; i++) {
						if(_this.scopers[i] == text) {
							_this.scopers.splice(i, 1);
							texttype = false;
						}
					}
					if(texttype) {
						_this.scopers.push(text);
					}
				}
			},
			//确定服务
			determine: function(e) {
				_this.scopersText = _this.scopers.toString()
				$(e.currentTarget).hide();
			},
			requestHeadersByToken: function() {
				if(_this.code && _this.codecode == 0) {
					var storage = new app.storage().get('USER_TOKEN');
					if(!storage) {
						app.toast('token丢失,请重新注册')
						return
					}
					return {
						"X-Auth-Token": new app.storage().get('USER_TOKEN')
					}
				} else {
					var storage = new app.storage('session').get('RSD_TOKEN');
					if(!storage) {
						app.toast('token丢失,请重新注册')
						return
					}
					return {
						"X-Auth-Token": new app.storage('session').get('RSD_TOKEN')
					}
				}
			},
			submitinfo: function() {
				app.loginshow();
				if(!_this.submitType) {
					return false;
				}
				if(_this.name == '' || _this.professionaltext == '' || _this.servicesign.length == 0 || _this.introduce == '') {
					app.toast("信息填写不完整")
					return false;
				}
				var postForm = new FormData;
				postForm.append("name", _this.name);
				postForm.append("title", _this.professionaltext);
				postForm.append("catalogSubSign", _this.servicesign.toString());
				postForm.append("introduce", _this.introduce);
				for(var i = 0, len = _this.imgarry.length; i < len; i++) {
					postForm.append("imgFile", _this.imgarry[i].files);
				}
				if(_this.attType) {
					if(!Regs.teleMobile.test(_this.sellerPhone)) {
						app.toast('号码格式有误');
						return false;
					}
					postForm.append("sellerPhone", _this.sellerPhone);
				} else {
					if(_this.selectCode == null) {
						app.toast('请选择地区');
						return false;
					}
					postForm.append("addrCode", _this.selectCode);
				}
				_this.submitType = false;
				if(_this.attType) {
					app.postForm(kdcommon.URL.restful, '/artificer/updateJobAuth', _this.requestHeadersByToken(), postForm, function(data, textStatus) {
						if(data.code == 0) {
							app.toast("已提交！跳转中...");
							//保存用户信息
							new app.storage().set("ARTIFICER_USER_NAME", data.data.name);
							new app.storage().set(app.ACCESS_TOKEN, data.token);
							new app.storage().set("ARTIFICER_USER_SIGN", data.data.sign);
							setTimeout(function() {
								window.location.href = "index.html";
							}, 1500);
							app.loginhide();
						} else {
							app.toast(data.message);
							app.loginhide();
						}
						app.loginhide();
						_this.submitType = true;
					});
				} else {
					app.postForm(kdcommon.URL.restful, '/artificer/updatePartTimeAuth', _this.requestHeadersByToken(), postForm, function(data, textStatus) {
						if(data.code == 0) {
							app.toast("已提交！跳转中...");
							//保存用户信息
							new app.storage().set("ARTIFICER_USER_NAME", data.data.name);
							new app.storage().set(app.ACCESS_TOKEN, data.token);
							new app.storage().set("ARTIFICER_USER_SIGN", data.data.sign);
							setTimeout(function() {
								window.location.href = "index.html"
							}, 1500);
						} else {
							app.toast(data.message);
						}
						app.loginhide();
						_this.submitType = true;
					});
				}

			}
		},
		updated: function() {
			$(".selectarea-btn").on("click", function() {
				$(".selectarea_box").hide();
				_this.showservice = _this.p + _this.c + _this.a + _this.s
			});
			$(".showService").on("click", function() {
				$(".selectarea_box").show();
			});
			$(".selectarea").on("click", function() {
				event.stopPropagation();
			});
			$(".selectarea_box").on("click", function() {
				$(this).hide();
				_this.showservice = _this.p + _this.c + _this.a + _this.s
			});
			$(".checkbox-service").on("click", function() {
				event.stopPropagation()
			});
		}
	});
	var _this = authenticationVue;
	_this.init();
}();