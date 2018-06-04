//index.js
//获取应用实例
import appUtil from './../../utils/util.js';
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    myCouponList:[], //我的优惠券列表
    openSet:false,  //是否打开设置页面
  },
  openId:'' ,
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.openId = wx.getStorageSync('openId') ;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // app.userInfoReadyCallback = res => {
      //   console.log(res) ;
      //   this.setData({
      //     userInfo: res.userInfo,
      //     hasUserInfo: true
      //   })
      // }
      wx.getUserInfo({
        success: res => {
          console.log(res);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          // console.log(res) ;
        }

      })
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
  },onReady:function(){
    console.info('ready') ;
  },
  /**
   * 点击查看订单列表
   */
  hanleOrder:function(e){
    let dataset = e.currentTarget.dataset ;
    
    let { type } = dataset ;

    wx.navigateTo({
      url: `../order/order?type=${type}`,
    })

  },
  onReady: function(){
    this.loadData() ;
  },
  onShow:function(e){
    this.loadCoupon();
    
    
    return ;
    //加载的时候重新获取数据
    if (app.globalData.pageMy.refreshCoupon){
      this.loadCoupon();
      app.globalData.pageMy.refreshCoupon = false ;
    }
  },
  loadData: function(){
    this.loadCoupon();
  },
  /**
   * 加载优惠券
   */
  loadCoupon:function(){
    appUtil.request({
      url: 'me/coupon.data',
      data: {
        'openId': this.openId,
        isUsed: 0
      }
    }).then(res => {
      this.setData({
        myCouponList: res.data
      })
    });
  },
  /**
   * 点击设置按钮
   */
  handleClickSet: function(){

    wx.navigateTo({
      url: '/pages/userInfoEdit/userInfoEdit',
    })
    return ; 
    this.setData({
      openSet:true
    })
  },
  handleClickUpUser:function(){
    // wx.showModal({
    //   title:'抱歉',
    //   content:'个人信息修改暂未开放!功能将在下一版本中开放',
    //   showCancel:false ,
    //   success:res=>{
    //     this.setData({
    //       openSet:false
    //     })
    //   }
    // })
    wx.navigateTo({
      url: '/pages/userInfoEdit/userInfoEdit',
    })
  },
  /**
   * 点击领券中心
   */
  handleClickCouponCenter:function(){
    wx.navigateTo({
      url: './../couponCenter/couponCenter',
    })
  }
})
