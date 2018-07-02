// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import global_ from './commen/global'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios'
Vue.use(ElementUI);
Vue.use(iView);
Vue.prototype.GLOBAL = global_;
Vue.config.productionTip = false
Vue.prototype.HOST = '/api';
Vue.prototype.GLOBAL.path = process.env.PATH;
// debugger
Vue.prototype.$http = axios;
var href = window.location.href;
if (href.split("token=")[1] != null) {
  var token = href.split("token=")[1].split("#")[0];
  Vue.prototype.GLOBAL.token = token;
  Vue.prototype.$http.defaults.headers = {
    Authorization: "Bearer " + Vue.prototype.GLOBAL.token
  };
} else {
  Vue.prototype.$http.defaults.headers = {
    userId: 2,
    userUuid: "a5e688d950df41b89ad5113c92e67590"
  };
}

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  created(){
    this.$http.interceptors.response.use(
      result => {
        // console.log('interceptors result', result);
        if(result.data.code<0){
          // this.$Message.error('后台服务器异常，请联系管理员。');
        }
        return result;
      },
      error => {
        if(error.response==undefined){
          this.$Message.error('请求超时');
        }else if(error.response.status==403){
          this.$Message.error('请重新登录');
        }else if(error.response.status==404){
          this.$Message.error('前台服务器异常，请联系管理员。');
        }else if(error.response.status==400){
          this.$Message.error(error.response);
        }else{
          this.$Message.error('对不起，服务异常');
        }
      }
    );
  }
})
