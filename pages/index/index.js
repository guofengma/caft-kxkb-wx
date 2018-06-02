//index.js
//获取应用实例
import appUtil from './../../utils/util.js';
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (opt) {
    /*wx.showModal({
      title: '提示',
      content: JSON.stringify(opt)
    })*/
    wx.showLoading({
      title: '定位中',
    });
    wx.getLocation({
      type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标	
      success:res=>{
        appUtil.requestLoading({
          url:'all/getStores',
          method:'GET',
          data:{
            longitude: res.longitude,
            latitude: res.latitude
          }
        }).then(rej=>{
          if(rej.resCode!=0){
            wx.showToast({
              title:rej.errMsg
            })
          }else{
            let {data} = rej ; 
            if(data.length==0){
              wx.showModal({
                title: '提示',
                content: '获取附近门店信息失败，即将跳转到默认门店',
                showCancel: false,
                success: res => {
                  this.openHome();
                }
              })
            }else{
              let shopId = data[0].storesID ;
              app.globalData.shopId = shopId ;
              this.openHome()
            }
          }
        })
      },
      fail:res=>{
        console.log('fail')
        wx.showModal({
          title:'提示',
          content:'获取定位信息失败，即将跳转到默认门店',
          showCancel:false,
          success:res=>{
            this.openHome();
          }
        })
      },
      complete:res=>{
      }
    })
    
    /**
     * 定时轮询去查找是否有openid  有则进行插入操作
     */
    let timerInserUser = setInterval(()=>{
      
      if (getApp().globalData.getOpenId==true){
      
      let openId = wx.getStorageSync('openId') ;
      console.log(`int-openId:${openId}`)

        clearInterval(timerInserUser) ;
        appUtil.request({
          url: 'me/insertUserInfo',
          data: {
            openId,
            shareOpenId: opt.shareOpenId || ""
          },
        })
      }
    },200) ;

    //不获取用户信息
    return ;
    if (app.globalData.userInfo!=null){
      this.getUserInfoThen(app.globalData.userInfo) ;
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res) ;
        this.getUserInfoThen(res.userInfo) ;
        
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
    this.getUserInfoThen(e.detail.userInfo)
  },
  redirtDemo:function(){
    wx.navigateTo({
      url: '/pages/demo/demo',
    })
  },
  openHome:function(){
    wx.reLaunch({
      url: './../home/home'
    })
  },
  getUserInfoThen: function(userInfo){
    console.log(userInfo)
    if (userInfo==null) return ;
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    });
    app.globalData.userInfo = userInfo;
    console.log(app.globalData.userInfo)
    appUtil.request({
      url: 'me/insertUserInfo',
      data:{
        openId:wx.getStorageSync('openId'),
        shareOpenId:'分享人openid',
        fwx_head_portrait: userInfo.avatarUrl,
        Fwx_name: userInfo.nickName,
        Fsex: userInfo.gender
      },
      complete: res =>{
        console.log('插入用户信息',res) ;
      }
    })
    wx.reLaunch({
      url: './../home/home',
      complete: res => {
        console.log(res);
      }
    })
  }
})
