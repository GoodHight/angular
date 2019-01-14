! function() {
	var indexVue = new Vue({
		el: "#indexvue",
		data: {
			bannerlist: [],
			headerList: [],
			pagetotal: null,
			HdList: [],
			pageNum: 1,
			refreshBtn: null,
			sign: '',
			type:true
		},

		methods: {
			init: function() {
				app.loginshow()
				_this.getBanner();
				_this.getHeader();
				_this.getHdList();
			},
			getBanner: function() {
				var getData = {
					"type": "ARTIFICER"
				}
				app.get(kdcommon.URL.restful, '/global/banners', null, getData, function(data, textStatus) {
					app.loginshow()
					console.log(data);
					if(data.code == 0) {
						_this.bannerlist = data.data;
					}
					setTimeout(function() {
						//获得slider插件对象
						var gallery = mui('.mui-slider');
						gallery.slider({
							interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
						});
					}, 200)
				});
			},
			//获得头条
			getHeader: function() {
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": 3,
					"headLineTypeSign": _this.sign
				};
				app.post(kdcommon.URL.restful, '/headline/getAllHeadlines', null, postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.headerList = data.data_list;
						_this.pagetotal = data.total;
//						if(_this.refreshBtn) {
//							$(_this.refreshBtn).removeClass("rotation");
//						}
						app.loginhide()
					}
				});
			},
			//加载更多
			getMoreHeader: function() {
				_this.pageNum = _this.pageNum + 1;
				app.loginshow();
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": 3,
					"headLineTypeSign": _this.sign
				};
				app.post(kdcommon.URL.restful, '/headline/getAllHeadlines', null, postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						var list = data.data_list;
						_this.pagetotal = data.total;
						for(var i = 0, len = list.length; i < len; i++) {
							_this.headerList.push(list[i])
						}
					}
					app.loginhide();
				});
			},
			//获得类型
			getHdList: function() {
				app.post(kdcommon.URL.restful, "/headlineType/getAllHeadlineType", null, {}, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.HdList = data.data_list;
					}
				});
			},
			//类型切换
			typeSelect: function(e, sign) {
				var btn = e.currentTarget;
				$(btn).siblings().removeClass('info-type-c');
				$(btn).addClass('info-type-c');
				_this.sign = sign;
				_this.getHeader();
				app.loginshow();
			},
			//查看全文
			fullText: function(e, sign) {
				app.redirect('../html/details.html?sign=' + sign)
			},
		}
	});
	var _this = indexVue;
	_this.init();
	
	var headerVue = new Vue({
		el: "#header",
		data: {
			searchText: ''
		},
		methods: {
			searchBtn: function() {
				//头部搜索
				if(!_this.searchText == '') {
					app.toast("请输入要搜索的内容")
				} else {
					app.loginshow();
					var postData = {
						'pageNum': 1,
						'pageSize': 20,
						'content': _thing.searchText
					}
					app.post(kdcommon.URL.restful, "/headline/queryByContent", null, postData, function(data, textStaus) {
						console.log(data);
						if(data.code == 0) {
							_this.headerList = data.data_list;
							_this.pagetotal = data.total;
							if(_this.refreshBtn) {
								$(_this.refreshBtn).removeClass("rotation");
							}
							app.loginhide();
						}
					});
				}
			}
		}
	});
	var _thing = headerVue;
}();