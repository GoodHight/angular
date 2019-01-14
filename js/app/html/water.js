! function() {
	var WaterVue = new Vue({
		el: "#Water",
		data: {
			pageNum: 1,
			startTimeStr: '',
			endTimeStr: '',
			timeStr: null,
			water_list: [],
			HdList: null,
			sign: '',
			type: null
		},
		filters: {
			moneyType: function(income_expend_type) {
				if(income_expend_type == 'INCOME_TYPE') {
					return '收入';
				} else if(income_expend_type == 'EXPEND_TYPE') {
					return '提现';
				} else {
					return '退款';
				}
			},
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getHdList();
				_this.getWater();
			},

			//获得类型
			getHdList: function() {
				app.post(kdcommon.URL.restful, "/SysCatalogSub/getAllServiceType", null, {}, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.HdList = data.data;
					}
				});
			},

			//默认查询和时间查询
			getWater: function(e, sign, type) {
				_this.type = type;
				_this.sign = sign;
				//				_this.startTimeStr = '';
				//				_this.endTimeStr = '';
				app.loginshow();
				var postData = {
					"typeSign": _this.sign,
					"startTimeStr": '',
					"endTimeStr": '',
					"pageNum": _this.pageNum,
					"pageSize": '20',
				};
				console.log(_this.type);
				if(_this.type == false) {
					var btn = e.currentTarget;
					$(btn).siblings().removeClass('info-type-c');
					$(btn).addClass('info-type-c');
					var postData = {
						"typeSign": _this.sign,
						"startTimeStr": _this.startTimeStr,
						"endTimeStr": _this.endTimeStr,
						"pageNum": _this.pageNum,
						"pageSize": '20',
					};
					app.post(kdcommon.URL.restful, '/artificerIncome/getIncomeItemByTypeSign', app.requestHeadersByToken(), postData, function(data, textStaus) {
						console.log(data);
						if(data.code == 0) {
							_this.timeStr = data.data;
							_this.water_list = data.data.income_item_query_list;
						}
						app.loginhide()
					});
				} else {
					var postData = {
						"typeSign": _this.sign,
						"startTimeStr": _this.startTimeStr,
						"endTimeStr": _this.endTimeStr,
						"pageNum": _this.pageNum,
						"pageSize": '20',
					};
					app.post(kdcommon.URL.restful, '/artificerIncome/getAllIncomeItem', app.requestHeadersByToken(), postData, function(data, textStaus) {
						console.log(data);
						if(data.code == 0) {
							_this.timeStr = data.data;
							_this.water_list = data.data.income_item_query_list;
						}
						app.loginhide();
					});
				}

			},
			getWaterOnly: function(e, sign, type) {
				_this.type = type;
				_this.sign = sign;
				var btn = e.currentTarget;
				$(btn).siblings().removeClass('info-type-c');
				$(btn).addClass('info-type-c');
				var postData = {
					"typeSign": _this.sign,
					"startTimeStr": _this.startTimeStr,
					"endTimeStr": _this.endTimeStr,
					"pageNum": _this.pageNum,
					"pageSize": '20',
				};
				app.post(kdcommon.URL.restful, '/artificerIncome/getAllIncomeItem', app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.timeStr = data.data;
						_this.water_list = data.data.income_item_query_list;
					}
					app.loginhide();
				});
			},

			getStartTimeStr: function() {
				(function($) {
					var year = new Date().getFullYear();
					var month = new Date().getMonth();
					var day = new Date().getDate();
					var dtpicker = new mui.DtPicker({
						type: "date", //设置日历初始视图模式 
						beginDate: new Date(2012, 12, 31), //设置开始日期 
						endDate: new Date(year, month, day), //设置结束日期 
						labels: ['年', '月', '日'], //设置默认标签区域提示语 
					})
					dtpicker.show(function(e) {
						result.innerText = e.text;
						_this.startTimeStr = e.text;
						console.log(_this.startTimeStr);
					})
				})(mui);
			},
			getEndTimeStr: function() {
				(function($) {
					var year = new Date().getFullYear();
					var month = new Date().getMonth();
					var day = new Date().getDate() + 1;
					var dtpicker = new mui.DtPicker({
						type: "date", //设置日历初始视图模式 
						beginDate: new Date(2012, 12, 31), //设置开始日期 
						endDate: new Date(year, month, day), //设置结束日期 
						labels: ['年', '月', '日'], //设置默认标签区域提示语 
					})
					dtpicker.show(function(e) {
						result2.innerText = e.text;
						_this.endTimeStr = e.text;
						console.log(_this.endTimeStr);
					})
				})(mui);
			},
			getTimeBtn: function() {
				$(".time-top").toggle();
			}
		},
		updated: function() {
			mui.init();
			$(".water-tx").click(function() {
				location.href = "withdr.html"
			});
		}

	});
	var _this = WaterVue;
	_this.init();
}();