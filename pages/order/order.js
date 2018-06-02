//index.js
//获取应用实例
import appUtil from './../../utils/util.js';
import appConfig from './../../utils/appConfig.js';
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageType:'0' , //页面类型  所有 已完成 ...
    orderList: [],
    /**
     * {
      "id": "1212", //订单id
      "orderNo": 2221, //订单号
      "type": 1 ,//1--已完成；2--待支付；3--待到店；4--已取消
			"imageUrl": "xxxx",  //商品图片url
      "commodityName": "商品名称",
      "shopName": "商店名称",
      "shopId": "商店id",
      "shopPhone": "商店电话",
      "orderTime": "2018.05.04",  //下单时间
      "orderMoney": 50.5 //订单金额
    }
     */
    urlLocation: appConfig.adminPath,
  },
  pageType:null,
  loadOpt:null,
  openId:wx.getStorageSync('openId'),
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (opt) {
    this.loadOpt = opt ;
    this.setData({
      pageType: opt.type
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onReady: function(opt){
    this.loadData() ;
  },
  redirtDemo:function(){
    wx.navigateTo({
      url: '/pages/demo/demo',
    })
  },
  loadData: function(){
    this.loadList(this.loadOpt.type) ;
  },
  loadList: function (type, pageFrom, pageSize){
    pageFrom = pageFrom||0;
    pageSize = pageSize||10 ;
    
    appUtil.requestLoading({
      'url':'me/orderList.data',
      data:{
        openId: this.openId,
        pageFrom,
        pageSize,
        type
      }
    }).then(res=>{
      
      this.setData({
        orderList:res.data
      })
    })
  },
  /**
   * 点击切换标签事件
   */
  handleClickTap: function(e){

    /**
     * 相同的tap不触发加载数据
     */
    if (this.data.pageType === e.target.dataset.type) return ;
    this.setData({
      pageType: e.target.dataset.type
    })
    this.loadList(e.target.dataset.type)
  },
  /**
   * 点击列表
   */
  handleClickList: function(e){
    console.log(e) ;
    let {item} = e.currentTarget.dataset ;
    wx.navigateTo({
      url: `./../orderdetail/orderdetail?orderId=${item.id}`,
    })
  }
})
