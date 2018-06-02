// pages/couponCenter/couponCenter.js

import appUtil from './../../utils/util.js';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList:[], //优惠券列表
    typeSrc:{
      newUser:'新人专享优惠',
      share:'分享专属优惠'
    }
  },
  shopId: '',
  openId:'',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shopId = app.globalData.shopId;
    this.openId = wx.getStorageSync('openId') ;
    
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  loadData:function(){

    appUtil.requestLoading({
      'url':'coupon/getCouponList',
      data:{
        openId:this.openId,
        shopId:this.shopId
      }
    }).then(res=>{
      this.setData({
        couponList:res.data
      })
    })
  },
  /**
   * 点击领取事件
   */
  hanleClickGet:function(e){
    let { item } = e.currentTarget.dataset ; 

    appUtil.requestLoading({
      url:'coupon/pickUpCoupon',
      method:'POST',
      data:{
        conponId:item.id,
        openId:this.openId
      }
    }).then(res=>{
      let {data} = res ; 
      if (data.flag==true){
        wx.showToast({
          title: '领取成功',
        });
        this.loadData();
      }else{
        if(data.errCode==-1){
          wx.showModal({
            title: '提示',
            content: data.err,
            showCancel:false
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '分享人数不足',
            confirmText:'去分享',
            success:res=>{
              if(res.confirm){
                wx.switchTab({
                  url: '/pages/home/home',
                  success:res=>{
                    wx.showModal({
                      title: '提示',
                      content: '请点击右上角进行转发分享',
                      showCancel:false
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
    
  }
})