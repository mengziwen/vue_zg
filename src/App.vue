<template>
  <div id="app" style="min-width:1229px;">
    <div id="topOn"></div>
    <div style="width: 100%;background-color: white">
      <div id="title">
        <div class="" style="float:left;line-height: 78px;font-size: 16px;color:#000000">
          <img src="/src/images/factory/zhigongkaiwu.png" style="vertical-align:middle;margin-right: 30px;position: relative;top:-6px"
          /> 山西西山晋兴能源有限责任公司斜沟煤矿选煤厂
        </div>
        <div style="clear: both"></div>
      </div>
    </div>
    <div class="factoryTop"></div>
    <div class="factoryTitle">
      <span>系统模块</span>
      <i>System module</i>
    </div>
    <div class="modules">
      <div   class="button" @click="clickMsg()">
        <div class="pic backOrange">
          <img src="/src/images/factory/changjia_index_qiting_button.png">
        </div>
        <div class="text">
          启停
        </div>
        <div class="line backOrange"></div>
      </div>
      <!--<router-link :to="{path:'/startStop'}" tag="div" class="button" >-->
        <!--<div class="pic backOrange">-->
          <!--<img src="/src/images/factory/changjia_index_qiting_button.png">-->
        <!--</div>-->
        <!--<div class="text">-->
          <!--启停-->
        <!--</div>-->
        <!--<div class="line backOrange"></div>-->
      <!--</router-link>-->
      <router-link :to="{path:'/subscription/auth'}" tag="div" class="button">
        <div class="pic backYellow">
          <img src="/src/images/factory/dingyue.png" style="margin:5px 0 0 12px;">
        </div>
        <div class="text">
          订阅管理
        </div>
        <div class="line backYellow"></div>
      </router-link>

      <router-link :to="{path:'/warning'}" tag="div" class="button">
        <div class="pic backOrange">
          <img src="/src/images/factory/changjia_index_rizhi_button.png">
        </div>
        <div class="text">报警</div>
        <div class="line backOrange"></div>
      </router-link>
      <div   class="button"  @click="clickMsg()">
        <div class="pic backYellow">
          <img src="/src/images/factory/changjia_index_shebei_button.png">
        </div>
        <div class="text">
          设备管理
        </div>
        <div class="line backYellow"></div>
      </div>
      <!--<router-link :to="{path:'/device'}" tag="div" class="button">-->
        <!--<div class="pic backYellow">-->
          <!--<img src="/src/images/factory/changjia_index_shebei_button.png">-->
        <!--</div>-->
        <!--<div class="text">-->
          <!--设备管理-->
        <!--</div>-->
        <!--<div class="line backYellow"></div>-->
      <!--</router-link>-->
      <router-link :to="{path:'/systemManage/department'}" tag="div" class="button">
        <div class="pic backGreen">
          <img src="/src/images/factory/changjia_index_renyuan_button.png">
        </div>
        <div class="text">人员管理</div>
        <div class="line backGreen"></div>
      </router-link>
      <router-link :to="{path:'/monitor/infoManage'}" tag="div" class="button">
        <div class="pic backOrange">
          <img src="/src/images/factory/jiankong.png">
        </div>
        <div class="text">监控</div>
        <div class="line backYellow"></div>
      </router-link>
      <router-link :to="{path:'/authority'}" tag="div" class="button">
        <div class="pic backOrange">
          <img src="/src/images/factory/quanxianguanli.png">
        </div>
        <div class="text">
          权限管理
        </div>
        <div class="line backBlue"></div>
      </router-link>


      <router-link :to="{path:'/task/order'}" tag="div" class="button">
        <div class="pic backBlue">
          <Icon type="clipboard"></Icon>
        </div>
        <div class="text">
          智能任务
        </div>
        <div class="line backBlue"></div>
      </router-link>
      <router-link :to="{path:'/keyControl/conformConfig'}" tag="div" class="button">
        <div class="pic backGreen">
          <img src="/src/images/factory/icon_mikong.png" style="margin: 12px 0px 0px 12px;">
        </div>
        <div class="text">
          智能密控
        </div>
        <div class="line backGreen"></div>
      </router-link>

      <!--<router-link :to="{path:'/reportForm'}" tag="div" class="button">-->
        <!--<div class="pic backBlue">-->
          <!--<Icon type="clipboard"></Icon>-->
        <!--</div>-->
        <!--<div class="text">-->
          <!--报表-->
        <!--</div>-->
        <!--<div class="line backBlue"></div>-->
      <!--</router-link>-->


      <div style="clear: both"></div>
    </div>
    <div class="backGrey"></div>
    <div class="facContent">
      <transition :name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      fade: "fade"
    };
  },
  created() {

    // created() {
    //   var href = window.location.href;
    //   if (href.split("token=")[1] != null) {
    //     var token = href.split("token=")[1].split("#")[0];
    //     this.GLOBAL.token = token;
    //     this.$http.defaults.headers = {
    //       Authorization: "Bearer " +
    //         this.GLOBAL.token,
    //       userId:"",
    //     };
    // }
    Date.prototype.format = function(fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    };
  },
  mounted() {

  },
  methods: {
    routerToStartStop() {
      window.location.href =
        "http://" +
        this.GLOBAL.path +
        "/?token=" +
        this.GLOBAL.token +
        "#/center/factory/start/configManage/washAreacar";
    },
    routerToAuth() {
      window.location.href =
        "http://" +
        this.GLOBAL.path +
        "/?token=" +
        this.GLOBAL.token +
        "#/center/factory/systemManage";
    },
    clickMsg(){
      this.$Message.warning('此功能正在开发中');
    }
  }
};
</script>
<style src="src/css/factory.css"></style>
<style src="src/css/index/every.css"></style>
<style>
.ivu-table th {
  background-color: #2c9ae8;
  color: white;
}

.pic i {
  font-size: 50px;
  color: white;
  padding: 3px 13px;
}
</style>
