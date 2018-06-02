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
    orderInfo:{}, //订单信息
    shopInfo:{} ,//门店信息
    urlLocation: appConfig.adminPath,
    codeLocation: appConfig[appConfig.reqType]
  },
  orderId:null,
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (opt) {
    this.orderId = opt.orderId ;
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
  redirtDemo:function(){
    wx.navigateTo({
      url: '/pages/demo/demo',
    })
  },
  onReady: function(){
    this.loadData()
  },
  loadData: function(){
    appUtil.requestLoading({
      url:'me/orderInfo.data',
      data:{
        orderId:this.orderId
      }
    }).then(res=>{
      this.setData({
        orderInfo:res.data
      }) ;
      appUtil.requestLoading({
        url: 'index/getShopInfo.data',
        data:{
          shopId: res.data.shopId
        }
      }).then(sres=>{
        this.setData({
          shopInfo:sres.data
        })
      })
    }) ;

    
  },
  /**
   * 拨打商家电话
   */
  handleClickCall: function(){
    let telephone = this.data.shopInfo.telephone ;
    if (telephone == null || telephone== ""){
      wx.showToast({
        title:'无联系方式',
        icon:'none'
      }) ;
      return ;
    }
    wx.makePhoneCall({
      phoneNumber: telephone
    })
  },
  /**
   * 取消订单操作
   */
  handleClickCenal: function(){

    wx.showModal({
      title:'提示',
      content:'是否确认取消订单?',
      cancelText:'再想想',
      success:res=>{
        console.log(res)
        if (res.confirm){
          appUtil.requestLoading({
            url: 'mine/cancelOrder',
            method: 'POST',
            data: {
              orderId: this.orderId
            }
          }).then(res=>{
            if (res.data.type=="1"){
              //刷新本页面
              appUtil.refreshThisPage();
            }
          })
        }
      },

    })
    return ;
    

    wx.showModal({
      title: '抱歉',
      content: '订单取消功能暂未开放',
      showCancel: false, //不显示取消按钮
      confirmText: '原谅你啦'
    })
  }
})
