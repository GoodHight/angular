! function() {
	var registeredVue = new Vue({
		el: "#registeredvue",
		data: {
			phone: null,
			nickname: null,
			countdown: 60,
			smscode: null,
			typeC:true,
			pushInfo: null
		},
		methods: {
			init: function() {
				push.getPushInfo(function(info) {
					_this.pushInfo = info;
				});
			},
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
						'sendSmsType': 'ARTIFICER_REGISTER'
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
			
			typeBtn:function(e) {
				var type = e.currentTarget;
				if($(type).hasClass("agreed-c")){
					_this.typeC = false
				} else {
					_this.typeC = true
				}
			},
			
			submitBtn: function() {
				if(_this.nickname == null || _this.nickname == '') {
					app.toast("请输入昵称");
					return false;
				}
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
				if(!_this.typeC){
					app.toast("请先阅读注册协议")
				}
				app.loginshow();
				var postform = {
					'name': _this.nickname,
					'phone': _this.phone,
					'smsCode': _this.smscode,
					'clientId': _this.pushInfo.clientid,
					'clientToken': _this.pushInfo.token
				};
				app.post(kdcommon.URL.restful, '/artificer/register', null, postform, function(data, textStatus) {
					if(data.code == 0) {
						app.loginhide();
						app.toast("注册成功");
						//保存注册token
						new app.storage("session").set("RSD_TOKEN", data.token);
						window.location.href = "identity.html";
					} else {
						app.toast(data.message);
						app.loginhide();
					}
				});
			}
		}
	});
	var _this = registeredVue;
	_this.init();
}();