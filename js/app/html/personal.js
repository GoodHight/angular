! function() {
	var personalVue = new Vue({
		el: "#personalvue",
		data: {
			artificer: null,
			phone: null,
			audit:''
		},
		filters: {
			auditStatusFilter: function(audit) {
				if(audit == 'SELLER_AUDIT') {
					return '商家审核中';
				} else if(audit == 'PLATFORM_AUDIT') {
					return '平台审核中';
				} else if(audit == 'PASS_THROUGH'){
					return '审核通过';
				} if(audit == 'SELLER_NOT'){
					return '商家拒绝';
				} if(audit == 'PLATFORM_NOT'){
					return '平台拒绝';
				} 
			},
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getArtificer();
				_this.auditStatus()
			},
			getState: function(e) {
				e.currentTarget;
				var div = e.currentTarget;
				app.loginshow();
				$(div).toggleClass('mui-active');
				if($(div).hasClass('mui-active')) {
					_this.isOnline = true
				} else {
					_this.isOnline = false
				};
				var postData = {
					"isOnline": _this.isOnline
				};
				app.post(kdcommon.URL.restful, '/artificer/updateArtificerOnline', app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {

					}
					app.loginhide()
				});
			},
			getArtificer: function() {
				app.post(kdcommon.URL.restful, '/artificer/getArtificer', app.requestHeadersByToken(), {}, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.artificer = data.data
					}
					app.loginhide()
				});
			},

			//退出登录
			SignOut: function() {
				var btnArray = ['确定', '取消'];
				mui.confirm('确定退出登录？', '提示', btnArray, function(e) {
					if(e.index == 0) {
						window.location.href = '../login.html';
						localStorage.clear();
						sessionStorage.clear();
					}
				}, 'div')
			},
			againBtn: function(e) {
				//				e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
				var btnArray = ['确定', '取消'];
				mui.prompt('请输入店铺号码：', '', '重新提交审核', btnArray, function(e) {
					if(e.index == 0) {
						_this.phone = e.value;
						if(_this.phone == null || _this.phone == '') {
							app.toast("请输入手机号");
							return false;
						}
						if(!Regs.mobile.test(_this.phone)) {
							app.toast("手机号码有误");
							return false;
						}
						var postData = {
							'phone': _this.phone,
						}
						app.post(kdcommon.URL.restful, '/artificer/updateSellerAndCheck', app.requestHeadersByToken(), postData, function(data, textStatus) {
							if(data.code == 0) {
								app.toast("提交成功")
							}
						});
					}
				}, 'div')
			},
			auditStatus: function() {
				app.post(kdcommon.URL.restful, '/artificer/checkArtificerAudit', app.requestHeadersByToken(), {}, function(data, textStatus) {
					console.log(data);
					_this.audit = data.data;
					if(data.code == 0) {}
				});
			}
		},
		updated: function() {
			mui('body').on('tap', 'a', function() {
				window.top.location.href = this.href;
			});
		}

	});
	var _this = personalVue;
	_this.init();
}();