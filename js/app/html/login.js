! function() {
	var loginVue = new Vue({
		el: "#loginvue",
		data: {
			phone: null,
			countdown: 60,
			smscode: null
		},
		methods: {
			getCode: function(e) {
				if(_this.phone == null || _this.phone == '') {
					app.toast("请输入手机号");
					return false;
				}
				if(!Regs.mobile.test(_this.phone)) {
					app.toast("手机号码有误");
					return false;
				}
				if(_this.countdown >= 60) {
					var buttons = e.currentTarget;
					$(buttons).text(_this.countdown + "s");
					$(buttons).css("color", "#c3b8b8");
					var postData = {
						'phone': _this.phone,
						'sendSmsType': 'ARTIFICER_LOGIN'
					}
					app.post(kdcommon.URL.restful, '/global/sms', null, postData, function(data, textStatus) {
						if(data.code == 0) {
							app.toast("验证码已发送")
						}
					});
					var setint = setInterval(function() {
						_this.countdown--;
						if(_this.countdown <= 0) {
							$(buttons).text("发送验证码")
							clearInterval(setint);
							_this.countdown = 60;
							$(buttons).css("color", "#555")
						} else {
							$(buttons).text(_this.countdown + "s");
						}
					}, 1000);
				}
			},
			submitBtn: function() {
				if(_this.smscode == null || _this.smscode == '') {
					app.toast("请输入验证码");
					return false;
				}
				if(_this.phone == null || _this.phone == '') {
					app.toast("请输入手机号");
					return false;
				}
				if(!Regs.mobile.test(_this.phone)) {
					app.toast("手机号码有误");
					return false;
				}
				app.loginshow();
				var postData = {
					'phone': _this.phone,
					"smsCode": _this.smscode
				}
				app.post(kdcommon.URL.restful, '/artificer/login', null, postData, function(data, textStatus) {
					app.loginshow();
					console.log(data);
					if(data.code == 0) {
						app.loginhide();
						//保存用户信息
						new app.storage().set("ARTIFICER_USER_NAME",data.data.name);
						new app.storage().set(app.ACCESS_TOKEN,data.token);
						new app.storage().set("ARTIFICER_USER_SIGN",data.data.sign);
						window.location.href='index.html'
					} else {
						app.toast(data.message);
						app.loginhide();
					}
				});
			}
		}
	});
	var _this = loginVue
}();