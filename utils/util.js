import config from './appConfig.js' ;

let app = getApp() ;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 将url装换为系统可使用的地址
 */
const urlConver = urlpath =>{
  //如果请求的地址包含了一个完整的http请求,则不进行转换
  if(urlpath.indexOf("http")!=-1){
    return urlpath ; 
  }

  if(config.reqType==='local'){

    return `./mock/${urlpath.replace('/','-')}` ;
  }else{
    //根绝配置的环境类型,取不同的请求地址
    let remot = config[config.reqType] ;
    return `${remot}${urlpath}` ;
  }
  
}

/**
 * 系统统一请求入口
 * obj {
 *   url , data , header:null , method:Get , showLoading:false
 * }
 */
const request = (obj) =>{
  return new Promise((resolve,reject)=>{
    //判断是否是本地,并且请求不带http
    if (config.reqType==='local'&&obj.url.indexOf('http')==-1) {
      
      try{
        let data = require(urlConver(obj.url)) ;
        resolve(data) ; 
      }catch(e){
        reject(e) ;
      }
    } else {
      if (obj.showLoading==true){
        wx.showLoading({ title: '加载中', mask: true }) ;
      }
      if ('POST' == obj.method){
        if (obj.header==null){
          obj.header = {} ;
        }
        obj.header["content-type"] = 'application/x-www-form-urlencoded' ; 
      }
      wx.request({
        url: urlConver(obj.url),
        data: obj.data,
        header: obj.header,
        method: obj.method || 'GET',
        dataType: 'json',
        responseType: obj.responseType || 'text',
        success: function (res) {
          resolve(res.data) ;
        },
        fail: function (res) { },
        complete: function (res) {
          if (obj.showLoading == true) {
            wx.hideLoading() ;
          }
          if (obj.complete!=null){
            obj.complete(res) ;
          }
         },
      })
      // return new Promise(function (resolve, reject) {
      // })
    }
  })
  
  
} ;

const requestLoading = (obj) =>{
  obj.showLoading = true ; 
  return request(obj) ;
}

/**
 * 加载图片(废弃)
 */
const loadImage = (url) =>{
  return new Promise((resolve, reject)=>{
    request(
      {
        url,
        responseType: 'arraybuffer',
      }
    ).then(res => {
      let base = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res);
      resolve(base) ;
    })
  })
}

/**
 * 刷新当前页面
 */
const refreshThisPage = () =>{
  let pages = getCurrentPages() ;

  let { route, options} = pages[pages.length-1] ;

  let count = 0 , parame ="" ;
  for(let i in options){

    parame += ((parame == "") ? "?" : "&") + i + "=" + options[i] ;
  }

  wx.redirectTo({
    url: `/${route}${parame}`
  })
}

/**
 * base64编码
 */
const base64_encode =(str) =>{
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0, len = str.length, strin = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}

const base64_decode = (input) =>{
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++));
    enc2 = base64EncodeChars.indexOf(input.charAt(i++));
    enc3 = base64EncodeChars.indexOf(input.charAt(i++));
    enc4 = base64EncodeChars.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  return utf8_decode(output);
}
function utf8_decode(utftext) { // utf-8解码
  var string = '';
  let i = 0;
  let c = 0;
  let c1 = 0;
  let c2 = 0;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c1 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      i += 2;
    } else {
      c1 = utftext.charCodeAt(i + 1);
      c2 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
      i += 3;
    }
  }
  return string;
}

module.exports = {
  formatTime: formatTime,
  request,
  requestLoading,
  loadImage,
  refreshThisPage,
  base64Decode: base64_decode, //解码
  base64Encode: base64_encode  //编码
}
