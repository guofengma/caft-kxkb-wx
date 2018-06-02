// pages/servicelist/servicelist.js
import appUtil from './../../utils/util.js';
import appConfig from './../../utils/appConfig.js';
const app = getApp() ;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceList:[],
    urlLocation: appConfig.adminPath,
    linkList:[] , //快捷导航列表
    thisLink:{} , //当前导航
    hideMode:'hide',
    filterTypeIcon:'icon-down' ,//箭头
    hasNext:true,
    pageSize: 6,
    filterPriceIcon:'icon-up-down',
  },
  itemId:'',
  shopId: '',
  linkDataByitemId:{},
  pageInfo:{
    pageIndex:0,
    pageSize:6,
    priceSort:-1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.itemId = options.itemId;
    this.shopId = app.globalData.shopId;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadData();
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
    //底部加载数据
    if(this.data.hasNext){
      console.log("底部加载数据")
      this.pageInfo.pageIndex++ ;
      this.loadServerList() ;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 加载数据
   */
  loadData: function(){
    this.loadServerList(this.itemId) ;
    appUtil.request({
      url: 'index/getLink.data',
      data: {
        shopId: this.shopId
      }
    }).then(res => {
      let linkList = res.data;
      //数据格式转换
      for(let l in linkList){
        let it = linkList[l] ;
        this.linkDataByitemId[it.itemId] = it ;
      }

      this.setData({
        linkList
      }) ;

      this.setData({
        thisLink: this.linkDataByitemId[this.itemId]
      }) ;

    });

  },
  /**
   * 获取服务列表
   * @parma itemId 大类id
   * @parma pageFrom 起
   * @parma pageTo 止
   * @parma priceSort 价格排序  -1||null 不排序, 0-正序 ,1-倒序 
   */
  loadServerList: function (itemId){
    if(itemId!=null){
      this.itemId = itemId ; 
    }else{
      itemId = this.itemId ; 
    }

    let { pageIndex, pageSize, priceSort} = this.pageInfo ; 
    appUtil.requestLoading({
      url: 'service/getCommodityList',
      data: {
        F_service_type_id: itemId
        , 'pageIndex': pageIndex * pageSize
        , 'pageSize': pageSize
        ,'priceSort': priceSort
      }
    }).then(res => {
      if (pageIndex==0){
        this.setData({
          serviceList:[]
        },()=>{
          setTimeout(()=>{
            this.setData({
              serviceList: res.data
            });
          },200)
        })
      }else{
        //追加数据
        this.setData({
          serviceList: this.data.serviceList.concat(res.data)
        });
      }
      //无更多数据
      if (res.data == null || res.data.length == 0 || res.data.length<pageSize){
        this.setData({
          hasNext:false
        })
      }
    });
  },
  /**
   * 点击列表
   */
  handleClickItem: function(e){
    
    let {item} = e.currentTarget.dataset ;

    console.log(item) ;

    wx.navigateTo({
      url:'./../servicedetail/servicedetail?itemId='+item.FId
    })
  },
  /**
   * 点击蒙版top
   */
  handleModeTop: function(e){
    this.setData(
      {
        hideMode:"hide",
        filterTypeIcon:'icon-down'
      }
    )
  },
  /**
   * 点击蒙版内的item
   */
  handleModeListItem: function(e){
    let { itemid } = e.target.dataset ;
    this.setData({
      thisLink: this.linkDataByitemId[itemid],
      hasNext:true ,
      filterPriceIcon:'icon-up-down'
    });

    //重置页数和排序
    this.pageInfo.pageIndex = 0 ;
    this.pageInfo.priceSort = -1 ;
    this.loadServerList(itemid) ;

  },
  /**
   * 点击切换大类
   */
  handleClickChangeType: function(){
    this.setData({
      hideMode:'',
      filterTypeIcon:'icon-up'
    })
  },
  /**
   * 点击对价格进行排序
   */
  handleClickPriceSort: function(){
    this.pageInfo.pageIndex = 0;

    let priceSort = this.pageInfo.priceSort ; 
    let icon ;
    if (priceSort == -1 || priceSort==0){
      priceSort = 1 ;
      icon = 'icon-down';
    } else if (priceSort==1){
      priceSort = 0;
      icon = 'icon-up'
    }
    this.setData({
      filterPriceIcon: icon,
      hasNext:true
    })
    this.pageInfo.priceSort = priceSort ;
    this.loadServerList() ;
  }
})