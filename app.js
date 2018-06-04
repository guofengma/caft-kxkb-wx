//app.js
import appConfig from './utils/appConfig.js';
import appUtil from './utils/util.js';
App({
  onLaunch: function (opt) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    let { wxConfig } = appConfig ;
    //console.log(wx.getStorageSync('openId'))
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        /*wx.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=${wxConfig.appID}&secret=${wxConfig.appSecret}&js_code=${res.code}&grant_type=authorization_code`,
          success:res=>{
            console.log('获取用户openid成功,存入缓存',res) ;
            wx.setStorageSync('openId', res.data.openid) ;
            console.log('缓存存入成功',wx.getStorageSync('openId'))
            
          },
          complete:res=>{
            wx.showModal({
              title: '提示',
              content: JSON.stringify(res),
            })
          }
        })*/
        appUtil.request({
          url: `all/connApi`,
          data:{
            url: appUtil.base64Encode(`https://api.weixin.qq.com/sns/jscode2session?appid=${wxConfig.appID}&secret=${wxConfig.appSecret}&js_code=${res.code}&grant_type=authorization_code`)
          },
        }).then(res=>{
          console.log('获取用户openid成功,存入缓存', res);
          this.globalData.sessionKey = res.session_key ;
          wx.setStorageSync('openId', res.openid);
          console.log('缓存存入成功', wx.getStorageSync('openId'));
          this.globalData.getOpenId = true ;

          this.getUserInfoBySys((data)=>{
            
          }) ;
        })
      }
    }) ;
    // 获取用户信息
    wx.getSetting({
      success: res => {

        if (res.authSetting['scope.userLocation']){
        }
        return ; 
        //默认
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
        }
      }
    })
  },
  /**
   * 到系统内获取用户信息
   */
  getUserInfoBySys: function (fn) {
    appUtil.request({
      url: 'me/getUserInfo',
      data: {
        openId: wx.getStorageSync('openId')
      }
    }).then(res => {
      this.globalData.userInfo = res.data || {};
      //回调
      if (fn != null) {
        fn(res.data);
      }
    })
  },
  globalData: {
    userInfo: {},
    shopId: '00000163-71d4-292b-c81f-5a4b2238c65a',  //门店id  后期会从附近门店获取
    //timestamp:(new Date().getTime()), //时间戳
    getOpenId:false ,
    sessionKey:'',
    userLocationInfo:{},
  }
})