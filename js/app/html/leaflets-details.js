! function() {
	var leafletsVue = new Vue({
		el: "#leafletsDetails",
		data: {
			sign: kdcommon.getQueryString('sign'),
			type: kdcommon.getQueryString('type'),
			OrderDetail: null,
			detailImg: null,

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
			}
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getOrderDetails();
			},
			//派单列表
			getOrderDetails: function() {
				var postData = {
					"orderSign": _this.sign,
					"serviceType":_this.type
				};
				app.post(kdcommon.URL.restful, '/artificerOrder/getArtificerOrderDetail', null, postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.OrderDetail = data.data;
						_this.detailImg = _this.OrderDetail.order_service_ad_detail_vos;
						_this.evaluate = _this.OrderDetail.order_evaluate_detail_vos;
					}
					app.loginhide()
				});
			},
		},
		updated: function() {
			mui.init();
			var gallery = mui('.mui-slider');
			gallery.slider({
				interval: 4000 //自动轮播周期，若为0则不自动播放，默认为0；
			});
			var noding = $(".starsA");
			score(4.5, noding);
			function score(value, node) {
				if(value % 1 == 0) {
					for(var i = 0; i < value; i++) {
						$(node).before("<img src='../../imgs/yh1.png' /> ");
					}
					for(var i = 0; i < 5 - value; i++) {
						$(node).before("<img src='../../imgs/yh2.png' /> ");
					}
				} else {
					for(var i = 0; i < parseInt(value); i++) {
						$(node).before("<img src='../../imgs/yh1.png' /> ");
					}
					$(node).before("<img src='../../imgs/yh3.png' /> ");
					for(var i = 0; i < 5 - parseInt(value) - 1; i++) {
						$(node).before("<img src='../../imgs/yh2.png' /> ");
					}
				}
			};
		}
	});
	var _this = leafletsVue;
	_this.init();
}();