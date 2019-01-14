! function() {
	var WithdrVue = new Vue({
		el: "#Withdr",
		data: {
			phone: null,
			account: null,
			account_num: null,
			user_name: null,
			amount_money: null,
			smscode: null
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getPhone();
				_this.getAccount()
			},
			//获取账户信息
			getAccount: function() {
				app.loginshow();
				app.post(kdcommon.URL.restful, '/artificerIncome/getAccount', app.requestHeadersByToken(), {}, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.account = data.data;
						_this.account_num = data.data.account_num;
						_this.user_name = data.data.user_name
					}
					app.loginhide();
				});
			},
			//获取电话
			getPhone: function() {
				app.loginshow();
				app.post(kdcommon.URL.restful, '/artificer/getArtificer', app.requestHeadersByToken(), {}, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.phone = data.data.phone;
					}
					app.loginhide();
				});
			},
			//获取验证码
			getVerification: function() {
				app.loginshow();
				window.onload = function() {
					var send = document.getElementById('send'),
						times = 60;

					function DownToZero() {
						if(times > 0) {
							send.value = times + "s后重试";
							times--;
							setTimeout(DownToZero, 1000);
						} else {
							send.value = "发送验证码";
							send.disabled = false;
							times = 60;
						}
					}
					send.onclick = function() {
						send.disabled = true;
						DownToZero();
					}
				}
				var postData = {
					"phone": _this.phone,
					"sendSmsType": 'ARTIFICER_CASH',
				};
				app.post(kdcommon.URL.restful, '/global/sms', app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						app.toast("验证码已发送")
					}
					app.loginhide();
				});
			},
			//提交
			submitBtn: function() {
				if(_this.user_name == null || _this.user_name == '') {
					app.toast("请输入姓名");
					return false;
				}
				if(_this.account_num == null || _this.account_num == '') {
					app.toast("请输入支付宝账号");
					return false;
				} else {
					var p = Regs.mobile.test(_this.account_num);
					var m = Regs.email.test(_this.account_num);
					if(p == false && m == false) {
						app.toast("支付宝账号有误");
						return false;
					}
				};
				if(_this.amount_money == null || _this.amount_money == '') {
					app.toast("请输入提现金额");
					return false;
				} else if(!Regs.posiFloat.test(_this.amount_money)) {
					app.toast("金额有误")
					return false;
				};
				if(_this.smscode == null || _this.smscode == '') {
					app.toast("请输入验证码");
					return false;
				}
				var postData = {
					"phone": _this.phone,
					"smsCode": _this.smscode,
					"userName":_this.user_name,
					"accountNum":_this.account_num,
					"money":_this.amount_money,
				};
				app.post(kdcommon.URL.restful, '/artificerIncome/insertApplyCash', app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						app.toast("已完成");
						app.redirect("personal.html");
					}else{
						app.toast("不能重复提交")
					}
					app.loginhide();
				});
			}
		},
		updated: function() {
			mui.init();
			$(".water-tx").click(function() {
				location.href = "withdr.html"
			});
		}

	});
	var _this = WithdrVue;
	_this.init();
}();