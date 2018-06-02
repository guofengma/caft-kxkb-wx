module.exports = {
  resCode: 0,
  data: [
    {
      iconUrl: "../../images/keep-icon.png",
      name: "做保养",
      type: 0, //0 服务,1 其他url
      itemId:"123",
      enabled: 0 , // 0 开启,非0未开启
      redirectUrl: "跳转地址"
    },
    {
      iconUrl: "../../images/carwash-icon.png",
      name: "美容洗车",
      type: 0,
      itemId: "123",
      enabled: 0, // 0 开启,非0未开启
      redirectUrl: "跳转地址"
    },
    {
      iconUrl: "../../images/service-icon.png",
      name: "汽车维修",
      type: 1,
      itemId: "123",
      enabled: 0, // 0 开启,非0未开启
      redirectUrl: "https://baidu.com"
    },
    {
      iconUrl: "../../images/check-icon.png",
      name: "胎压检测",
      enabled: -1, // 0 开启,非0未开启
    }
  ],
  errMsg: "" 
}