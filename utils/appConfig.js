
/**
 * 2018-5-13 14:25:28
 * 系统参数配置存放点
 * lv.lin
 */
module.exports = {
  reqType:'onLine', //请求类型是否本地程序,是local则请求是直接读取mock内的内容
  remot:"https://",  //正式地址
  test :"http://172.17.163.101:8700/caft-kxkb-api/",  //测试地址
  onLine:"https://yekj.natappvip.cc/caft-kxkb-api/",
  loca127:'http://172.17.163.249:8280/caft-kxkb-api/',
  wxConfig:{ //微信配置
    appSecret:'2597c0f1bbd81f4a4f3e9a254e3ac067',
    appID:'wx928153586c2d1d04'
  },
  //adminPath:'http://172.17.163.101:8600/appFrame1/', //后端图片地址
  adminPath:'https://yekj.natappvip.cc/caft-kxkb-admin/'
}