! function() {
	var modifyVue = new Vue({
		el: "#modifyvue",
		data: {
			name: '',
			title: '',
			introduce: '',
			headerurl: null,
			haederFile: null,
			introduce: '',
			professional: [],
			professionaltext: null,
			userinfo: null,
			province: null, //省
			citys: null, //市
			area: null, //区
			scope: null, //范围
			selectCode: null,
			showservice: null,
			p: null,
			c: null,
			a: null,
			s: null
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getBackstage();
				_this.getUserInfo();
				_this.getProfessional();
			},
			//获得回填信息
			getUserInfo: function() {
				app.post(kdcommon.URL.restful, '/artificer/getArtificerUpdateVo', app.requestHeadersByToken(), {}, function(data, textStatus) {
					console.log(data);
					if(data.code == 0) {
						_this.userinfo = data.data;
						_this.headerurl = data.data.head_url;
						_this.name = data.data.name;
						_this.title = data.data.title;
						_this.showservice = data.data.service_addr;
						_this.introduce = data.data.introduce;
					}
					app.loginhide();
				});
			},
			//选择职称
			selectPfi: function() {
				(function($, doc) {
					$.init();
					$.ready(function() {
						var userPicker = new $.PopPicker();
						userPicker.setData(_this.professional);
						userPicker.show(function(items) {
							_this.title = items[0].text;
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					});
				})(mui, document);
			},
			//显示服务地址
			showService: function(e) {
				$(e.currentTarget).parent().siblings(".selectarea_box").show();
			},
			//触发上传
			triggerFile: function(e) {
				$(e.currentTarget).parent().siblings("#file1").click();
			},
			//图片上传操作
			imargeFile: function() {
				var files = event.target.files,
					file;
				if(files && files.length > 0) {
					// 获取目前上传的文件
					file = files[0]; // 文件大小校验的动作
					if(file.size > 1024 * 1024 * 5) {
						app.toast('图片大小不能超过 2MB!');
						return false;
					}
					// 获取 window 的 URL 工具
					var URL = window.URL || window.webkitURL;
					// 通过 file 生成目标 url
					var imgURL = URL.createObjectURL(file);
					//用attr将img的src属性改成获得的url
					_this.haederFile = file;
					_this.headerurl = imgURL;
					console.log(_this.headerurl);
					// 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
					// URL.revokeObjectURL(imgURL);
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
					console.log(_this.selectCode);
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
									console.log("范围不存在");
									_this.selectCode = null
								}
								console.log(_this.selectCode);
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
					console.log(code);
					_this.selectCode = code;
					_this.s = text;
					$(e.currentTarget).parents(".selectarea_box").hide()
					_this.showservice = _this.p + _this.c + _this.a + _this.s
				}
			},
			//获得职称
			getProfessional: function() {
				app.post(kdcommon.URL.restful, '/artificertitle/getAllArtificerTitle', null, {}, function(data, textStatus) {
					console.log(data);
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
			errorBtn:function(){
				app.toast("当栏目不可更改");
			},
			updataInfo: function() {
				var postform = new FormData();
				postform.append("name", _this.name);//名字
				postform.append("title", _this.title);//职称
				postform.append("introduce", _this.introduce);//简介
				if(_this.userinfo.work_nature == 'PART_TIME') {
					postform.append("addrCode", _this.selectCode);//服务地址
				}
				postform.append("headerFile", _this.haederFile); //头像
				app.postForm(kdcommon.URL.restful, '/artificer/updateArtificer', app.requestHeadersByToken(), postform, function(data, textStatus) {
					console.log(data);
					if(data.code == 0){
						app.toast("修改成功");
						app.redirect("personal.html")
					} else {
						app.toast(data.message);
					}
					app.loginhide();
				});
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
	var _this = modifyVue;
	_this.init();
	var headerVue = new Vue({
		el: "#headervue",
		data: {

		},
		methods: {
			sumbit: function() {
				app.loginshow();
				console.log(1111);
				_this.updataInfo();
			}
		}
	});
}();