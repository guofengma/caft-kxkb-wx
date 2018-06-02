//index.js
//获取应用实例
import appUtil from './../../utils/util.js' ;
import appConfig from './../../utils/appConfig.js' ;
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    shopInfo:{} , //门店信息
    linkList:{}, //快速服务导航
    //urlLocation:'https://yekj.natappvip.cc/caft-kxkb-admin/',
    urlLocation: appConfig.adminPath,
    hotServer:[], //热门套餐服务
    bannerList:[],
    showRP:false ,
  },
  shopId: '',
  openId:'',
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.shopId = app.globalData.shopId ;
    this.openId = wx.getStorageSync('openId') ; 
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

    //判断是否有指定门店id,如果没有,则就近获取
    //如果有指定门店id,则重新赋值门店id
    if (options.shopId!=null){
      this.shopId = options.shopId ; 
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
  onReady: function() {
    this.loadData() ;
  },
  /**
   * 打开分享
   */
  onShareAppMessage:function(opt){
    console.log(opt) ;

    return{
      path: `/pages/index/index?shareOpenId=${this.openId}&shopId=${this.shopId}`
    } ;
  },
  /**
   * 加载数据
   */
  loadData:function() {

    //获取门店信息
    appUtil.request({
      url: 'index/getShopInfo.data',
      data: {
        shopId:this.shopId
      }
    }).then(res=>{
      this.setData({
        shopInfo : res.data
      }) ;

      /**
       * 标题设置
       */
      wx.setNavigationBarTitle({
        title: res.data.name
      })

    });


    //获取快速导航
    setTimeout(()=>{
      appUtil.request({
        url: 'index/getLink.data',
        data: {
          shopId: this.shopId
        }
      }).then(res => {
        let data = res.data;

        this.setData({
          linkList: data
        })
      });
    },10)

    setTimeout(() => {
      this.getBannerList();
    }, 300);

    setTimeout(() => {
      this.getHotServer();
    }, 500)

    
    /**
     * 判断用户是否已经领取新用户专享卡券
     */
    setTimeout(()=>{
      appUtil.request({
        url:'me/userIsGetNewUserCoupon',
        data:{
          openId:this.openId
        }
      }).then(res=>{
        let {data:flag} = res ;
        if (flag==false){
          this.setData({
            showRP:true
          })
        }
      })
    },3000) ;

  },
  /**
   * 获取热门套餐服务
   */
  getHotServer:function(){
    appUtil.request({
      url:'index/getHotServer.data',
      data:{
        shopId:this.shopId
      }
    }).then(res=>{
      this.setData({
        hotServer:res.data
      })
    })
  },
  /**
   * 获取banner信息
   */
  getBannerList:function(){
    appUtil.request({
      url:'index/getBanner.data',
      data:{
        shopId:this.shopId
      }
    }).then(res=>{
      // wx.showModal({
      //   title: '提示',
      //   content: JSON.stringify(res),
      // })
      this.setData({
        bannerList:res.data
      })
    })
  },
  
  loadImage:function(e){
    console.log(e) ;
  },
  /**
   * 拨打电话
   */
  handleCallShop: function(){
    let phone = this.data.shopInfo.telephone ;
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  /**
   * 导航
   */
  handleOpenLocation: function(){
    let { latitude, longitude, name,address } = this.data.shopInfo ; 
    wx.openLocation({
      'latitude':parseFloat(latitude),
      'longitude':parseFloat(longitude),
      scale:15,
      name,
      address,
    })
  },

  /**
   * 点击快速导航
   */
  handleLink: function(opt){
    let { item } = opt.currentTarget.dataset ;
    //判断是否启用
    if (item.enabled!=0){
      //未启用,则提示
      wx.showToast({
        title: '功能暂未在线上开放,请等待',
        icon: 'none',
        duration: 2000
      })
      return ;
    }

    //类型为0,则跳转到指定服务
    if (item.type==null||item.type==0){
      // wx.navigateTo({
      //   url: `/pages/servicedetail/servicedetail?shopId=${this.shopId}&itemId=${item.itemId}`
      // }) ;
      wx.navigateTo({
        url: `/pages/servicelist/servicelist?itemId=${item.itemId}`
      });
    }else if(item.type==1){
      /*wx.navigateTo({
        url: item.redirectUrl
      }) ;*/
      wx.showToast({
        title: '跳转到:' + item.redirectUrl,
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '未知类型'
      })
    }
  },
  /**
   * 点击热门套餐
   */
  handleClickHotServer:function(e){
    let { itemid:itemId } = e.currentTarget.dataset ; 
    wx.navigateTo({
      url: './../servicedetail/servicedetail?itemId=' + itemId
    })
  },
  /**
   * 点击banner时
   */
  handleClickBanner:function(e){
    console.log(e)
    let bannerInfo = e.currentTarget.dataset.banner ;

    //打开套餐
    if (bannerInfo.type == "0" && bannerInfo.itemid!=null){
      wx.navigateTo({
        url: './../servicedetail/servicedetail?itemId=' + bannerInfo.itemid
      })
    } else if (bannerInfo.type == "1" && bannerInfo.redirectUrl){
      //跳转到指定页面
      let redirectUrl = bannerInfo.redirectUrl ; 
      //跳转到外部地址
      if(redirectUrl.indexOf('https')!=-1){

      }else{
        //跳转到内部地址
        wx.navigateTo({
          url: redirectUrl,
          fail:res=>{
            wx.showModal({
              title: '错误提示',
              content: JSON.stringify(res),
            })
          }
        })
      }
    }
  },
  handleClickRPClose:function(){
    this.setData({
      showRP:false
    })
  },
  handleClickRPGet:function(){
    wx.navigateTo({
      url: './../couponCenter/couponCenter',
      success:()=>{
        this.setData({
          showRP: false
        })
      }
    })
  }
})
