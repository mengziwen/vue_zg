'use strict'
var path=""
if(process.env.ZGIOT_WEB_BACKEND!=null){
  path="'"+process.env.ZGIOT_WEB_BACKEND+"'";
}else{
  // path="'"+"localhost:8080"+"'";
  path="'"+"http://192.168.9.56:9090"+"'";
}

module.exports = {
  PATH: path
}
