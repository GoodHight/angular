! function() {
	var indexVue = new Vue({
		el: "#leaflets",
		data: {
			pageNum: 1,
			allOrder: [],
			sign: '',
			nature: null,
			orderSign:null,
			lengthShow:false
		},
		filters: {
			orderStatusFilter: function(orderStatus) {
				if(orderStatus == 'WAIT_ORDERS') {
					return '等待接单';
				} else if(orderStatus == 'REFUSE_ORDERS') {
					return '已接单';
				} else if(orderStatus == 'ALREAD_ORDERS'){
					return '已拒绝';
				}
			},
			serviceType: function(serviceType) {
				if(serviceType == 'DOOR') {
					return '上门';
				}
				return '到店';
			},
			InitializeTime: function(value) {
				var time = value;
				var time_c = Date.parse(time);
				var date = new Date(time_c);
				M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
				D = date.getDate() + ' ';
				h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
				m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
				return  M + D + h + m;
			}
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getLeaflets();
			},
			//派单列表
			getLeaflets: function() {
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": '20',
					"isFinish": _this.sign
				};
				app.post(kdcommon.URL.restful, '/artificerOrder/getArtificerAllOrder', app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.allOrder = data.data;
						_this.pagetotal = data.total;
						if(_this.allOrder.length == 0){
							_this.lengthShow = true;
						}
						
						//						for(var i = 0, len = _this.allOrder.length; i < len; i++) {
						//							var nature = _this.allOrder[i].work_nature;
						//							var commission = _this.allOrder[i].commission;
						//						};
					}
					app.loginhide()
				});
			},
			//获得订单信息
			getOrderinfo:function(e, sign){
				console.log(sign);
				_this.orderSign = sign;
				mui('#picture').popover('toggle');
			},
			//订单操作
			orderOperation:function(e, type) {
				app.loginshow();
				var postData = {
					"orderSign":_this.orderSign,
					"artificerOrderServiceType":type
				};
				app.post(kdcommon.URL.restful, '/order/artificerOrders', app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						mui('#picture').popover('toggle');
						app.toast("操作成功");
						setTimeout(function() {
							location.reload();
						}, 1000);
					} else {
						app.toast(data.message);
					}
					app.loginhide()
				});
			},
			//订单改变
			orderSeleType:function(e, type){
				_this.sign = type;
				_this.lengthShow = false;
				app.loginshow();
				_this.getLeaflets();
				
			},
			getMoreHeader: function() {
				_this.pageNum = _this.pageNum + 1;
				app.loginshow();
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": 2,
				};
				app.post(kdcommon.URL.restful, '/artificerOrder/getArtificerAllOrder', null, postData, function(data, textStaus) {
					console.log(data.total);
					if(data.code == 0) {
						_this.allOrder = data.data;
						_this.pagetotal = data.total;
					}
					app.loginhide()
				});
			},
			//详情页
			fullText: function(e, sign, type) {
				window.location.href = 'leaflets/leaflets-details.html?sign='+sign+"&type="+type;
			}

		}
	});
	var _this = indexVue;
	_this.init();
}();