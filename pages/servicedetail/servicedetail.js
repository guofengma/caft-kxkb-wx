//index.js
//获取应用实例

import appUtil from './../../utils/util.js';
import appConfig from './../../utils/appConfig.js';
import WxParse  from './../../wxParse/wxParse.js' ;

const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    couponList:[] , //优惠券列表
    selectedCoupon:null , //
    baseData:{},
    urlLocation: appConfig.adminPath,
  },
  itemId:'',
  openId:'',
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (opt) {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    this.openId = wx.getStorageSync('openId') ;
    this.itemId = opt.itemId ; 

    console.log(this.openId,this.itemId) ;
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
    this.loadData() ;
  },
  loadData: function(){
    this.loadCoupon() ;
    this.loadBaseData() ;
  },
  /**
   * 加载基础信息
   */
  loadBaseData: function(){
    appUtil.requestLoading({
      url:'meal/getMealDetails',
      data:{
        mealId:this.itemId
      }
    }).then(res=>{
      console.log('加载基础数据',res) ;
      this.setData({
        baseData:res.data
      })
      WxParse.wxParse('article', 'html', res.data.serviceDetails,this,5) ;
    })
  },
  /**
   * 加载优惠券列表
   */
  loadCoupon:function(){
    appUtil.requestLoading({
      url:'me/coupon.data',
      data:{
        openId:this.openId,
        isUsed:0
      }
    }).then(res=>{
      console.log(res) ;
      this.setData({
        couponList:res.data
      })
    })
  },

  /**
   * 
   */
  handleClickCoupon: function(e){
    wx.showActionSheet({
      itemList: this.data.couponList.map((item, i) => {
        return item.name
      }),
      success: res=>{
        console.log(res) ;
        this.setData({
          selectedCoupon: this.data.couponList[res.tapIndex]
        })
      }
    })
  },
  /**
   * 点击下单页面
   */
  handleClickBuy: function(e){
    //检测用户是否已经填写信息,没有填写则跳转到留资页面
    if (app.globalData.userInfo.wxTelephone==null){

      wx.showModal({
        title: '抱歉',
        content: '请留资料',
      })

      return ;
    }

    if (this.data.couponList.length != 0 && this.data.selectedCoupon==null){
      wx.showModal({
        title:'温馨提示',
        content:'检测到您有可用优惠券,是否不使用优惠券继续本次购买',
        success:res=>{
          console.log(res) ;
          if (res.confirm){
            this._bud() ;
          }
        }
      })
    }else{
      this._bud()
    }
  },
  _bud: function(){
    console.log('立即下单');
    
    let { selectedCoupon } = this.data ;
    appUtil.requestLoading({
      'url':'me/AddUserOrder',
      'data':{
        openId:this.openId,
        commodityId: this.itemId,
        shopId:app.globalData.shopId,
        couponId: (selectedCoupon == null ? "" : selectedCoupon.id)
      },
      'method':'POST',
    }).then(res=>{
      console.log(res) ;
      console.log()
      if (res.resCode=="0"){
        //跳转到订单详情页面
        wx.redirectTo({
          url:'./../orderdetail/orderdetail?orderId='+res.data.orderId
        }) ;
      }else{
        wx.showToast({
          title:res.errMsg,
          icon:'none',
        })
      }
    })
  },
  handleClickCall:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.baseData.shopPhone
    })
  }
})
