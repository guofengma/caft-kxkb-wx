// pages/userInfoEdit/userInfoEdit.js
import appUtil from './../../utils/util.js';
import appConfig from './../../utils/appConfig.js';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:'',
    userName:'',
    plateNumber:'',
  },
  openId:'',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openId = wx.getStorageSync("openId");
    //重新获取用户信息
    app.getUserInfoBySys((res)=>{
      let userInfo = res ;
      this.setData({
        phoneNumber: userInfo.wxTelephone,
        userName: userInfo.userName,
        plateNumber: userInfo.plateNumber,
      })
    })
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
  getUserInfoThen:function(e){
    console.log(e) ;
  },
  /**
   * 获取用户电话号码
   */
  getPhoneNumber:function(e){
    let { encryptedData , iv} = e.detail ;
    let sessionKey = app.globalData.sessionKey ; 
    console.log(encryptedData, iv, sessionKey) ;
    if (encryptedData==null){
      wx.showToast({
        title: '获取失败',
        icon:'none'
      })
      return ; 
    }
    appUtil.request({
      url: 'all/getUserTelephone',
      method:'POST',
      data:{
        encrypted: encodeURIComponent(encryptedData),
        "iv": encodeURIComponent(iv),
        session_key: encodeURIComponent(sessionKey)
      }
    }).then(res=>{
      console.log(res) ;
      let { phoneNumber} = res.data ;
      this.setData({
        phoneNumber
      })
    })


  },
  formSubmit:function(e){
    console.log(e)
    let {value:data} = e.detail ;

    console.log(data) ;
    if (data.wxTelephone == ""){
      wx.showToast({
        title: '请留下您的手机号码',
        icon:'none'
      })
    }else if (data.userName == ""){
      wx.showToast({
        title: '请留下您的真实姓名',
        icon: 'none'
      })
    }else{

      appUtil.requestLoading({
        url: 'me/updateUserInfo',
        method: 'POST',
        data: {
          openId: this.openId,
          fwx_telephone: data.wxTelephone,
          userName: data.userName,
          fplate_number: data.plateNumber
        }
      }).then(res => {
        console.log(res);
        if(res.data.flag==true){
          app.getUserInfoBySys(()=>{
            //返回上一页
            wx.navigateBack() ;
          })
        }else{
          wx.showToast({
            title: res.errMsg,
            icon:'none'
          })
        }
      })
    }
  }
})