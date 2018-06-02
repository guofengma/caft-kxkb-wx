// pages/userInfoEdit/userInfoEdit.js
import appUtil from './../../utils/util.js';
import appConfig from './../../utils/appConfig.js';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  openId:'',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openId = wx.getStorageSync("openId")
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
  formSubmit:function(e){
    console.log(e)
    let {value:data} = e.detail ;

    console.log(data) ;
    if (data.wxTelephone=="")

    return ;
    appUtil.requestLoading({
      url:'me/updateUserInfo',
      method:'POST',
      data:{
        openId:this.openId,
        fwx_telephone: data.wxTelephone,
        userName: data.userName,
        fplate_number: data.plateNumber
      }
    }).then(res=>{
      console.log(res) ;
    })
  }
})