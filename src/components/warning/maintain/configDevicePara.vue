<!--Author:wangyajie-->
<template>
  <div class="parameter">
    <div class="content-title">
      设备参数配置
    </div>
    <div class="include">
      <div class="info">
        <div class="title1">设备信息</div>
        <Row>
          <Col span="5" class="assetType">
            <span>设备编号：</span>
            <span>{{queryData.thingCode}}</span>
          </Col>
          <Col span="8" class="assetType">
          <span>设备名称：</span>
          <span>{{queryData.thingName}}</span>
          </Col>
          <Col span="5" class="assetType">
          <span>参数类型：</span>
          <span>{{queryData.metricTypeName}}</span>
          </Col>
          <Col span="6" class="assetType">
          <span>信号名称：</span>
          <span>{{queryData.metricName}}</span>
          </Col>
        </Row>
      </div>
      <div class="info">
        <div class="title1">区间展示</div>
        <div class="slider">
          <div class="alt" v-if="JSON.stringify(queryData.alertRules) === '[]'">未配置报警异常区间</div>
          <div class="section" v-else v-for="section in queryData.alertRules" :style="section.style" @click.stop="changePop(section)">
            <Poptip v-model="section.popVisible" placement="top">
              <div slot="content">
                <div class="item" @click="editSection(section)">修改区间</div>
                <div class="item" @click="delSection(section)">删除区间</div>
              </div>
            </Poptip>
            <span class="left">{{section.lowerLimit}}</span>
            <span class="right">{{section.upperLimit}}</span>
          </div>
          <Slider v-model="sliderRange" :min="min" range :max="max" disabled ></Slider>
          <div class="value">
            <div class="min">
              <input type="number" placeholder="请输入最小值" name="minimum" v-model="minimum" v-on:blur="changeSlider()" v-validate="'required'">
              <span v-show="errors.has('minimum')" class="help is-danger">此数据无效，请重新输入</span>
            </div>
            <div class="max">
              <input type="number" placeholder="请输入最大值" name="maximum" v-model="maximum" v-on:blur="changeSlider()" v-validate="'required'">
              <span v-show="errors.has('maximum')" class="help is-danger">此数据无效，请重新输入</span>
              <span v-if="maximum >= 5000" class="help is-danger">您配置区间太大,有些区间可能显示不清楚</span>
            </div>
          </div>
          <div class="sections">
            <div class="title1">配置异常区间</div>
            <div class="limits">
              <div class="limit">
                <input type="number" name="lowerLimit" v-model="lowerLimit" placeholder="输入下限值" @blur="checkValue(1,1,lowerLimit,upperLimit)">
                <span v-show="errors.has('lowerLimit')" class="help is-danger">此数据无效，请重新输入</span>
                <span v-if="limitError == 1 && errorType == 1" class="help is-danger">{{limitErrorMsg}}</span>
              </div>
              <div class="connector">——</div>
              <div class="limit">
                <input type="number" name="upperLimit" v-model="upperLimit" placeholder="输入上限值"  @blur="checkValue(1,2,lowerLimit,upperLimit)">
                <span v-show="errors.has('upperLimit')" class="help is-danger">此数据无效，请重新输入</span>
                <span v-if="limitError == 2 && errorType == 1" class="help is-danger">{{limitErrorMsg}}</span>
              </div>
              <div class="clearfix"></div>
            </div>
          </div>
          <div class="sections">
            <div class="title1">选择报警等级</div>
            <div class="alertLevels">
              <RadioGroup v-model="alertLevel" type="button">
                <Radio label="黄色报警" :class="alertLevel=='黄色报警'?'active':''"></Radio>
                <Radio label="紫色报警" :class="alertLevel=='紫色报警'?'active':''"></Radio>
                <Radio label="蓝色报警" :class="alertLevel=='蓝色报警'?'active':''"></Radio>
              </RadioGroup>
            </div>
          </div>
          <div class="sections">
            <div class="title1">延迟时间（0-3600）</div>
            <div class="alertLevels" style="margin: 15px">
              <Input type="number" max="3600" min="0" v-model="delayTime" placeholder="" style="width: 300px"></Input>
            </div>
          </div>
        </div>
        <div class="buttons">
          <div class="button" @click="cancel()">
            取消
          </div>
          <div class="button" @click="remain()">
            保存并继续添加
          </div>
          <div class="button" @click="goBack()">
            确认并关闭
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <Modal
      title="title"
      width="430"
      v-model="toastModel"
      :mask-closable="false"
      class-name="small-modal"
      :closable="false">
      <p slot="header">
        <span>删除报警区间</span>
        <span class="titleLeft" @click="closeToast()">
          <img src="src/images/warning/webqt_iocn.png" alt="close">
        </span>
      </p>
      <p>
        <span>确定要删除"[{{currentSection.lowerLimit}},{{currentSection.upperLimit}}]"的报警区间?</span>
      </p>
      <div slot="footer">
        <Button type="text" size="large" @click="closeToast()">取消</Button>
        <Button type="primary" size="large" @click="confirmToast()">确定</Button>
      </div>
    </Modal>
    <Modal
      title="title"
      width="430"
      v-model="editModel"
      :mask-closable="false"
      class-name="edit-modal"
      :closable="false">
      <p slot="header">
        <span>修改报警区间</span>
        <span class="titleLeft" @click="closeEdit()">
          <img src="src/images/warning/webqt_iocn.png" alt="close">
        </span>
      </p>
      <div class="sections">
        <div class="title1">配置异常区间</div>
        <div class="limits">
          <div class="limit">
            <input type="number" name="dialogLowerLimit" v-model="editSec.lowerLimit" placeholder="输入下限值">
            <span v-show="errors.has('dialogLowerLimit')" class="help is-danger">此数据无效，请重新输入</span>
            <span v-if="limitError == 1 && errorType == 2" class="help is-danger">{{limitErrorMsg}}</span>
          </div>
          <div class="connector">——</div>
          <div class="limit">
            <input type="number" name="dialogUpperLimit" v-model="editSec.upperLimit" placeholder="输入上限值">
            <span v-show="errors.has('dialogUpperLimit')" class="help is-danger">此数据无效，请重新输入</span>
            <span v-if="limitError == 2 && errorType == 2" class="help is-danger">{{limitErrorMsg}}</span>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="sections">
        <div class="title1">选择报警等级</div>
        <div class="alertLevels">
          <RadioGroup v-model="editSec.alertLevel" @on-change="changeLevel()" type="button">
            <Radio label="黄色报警" :class="editSec.alertLevel==30?'active':''"></Radio>
            <Radio label="紫色报警" :class="editSec.alertLevel==20?'active':''"></Radio>
            <Radio label="蓝色报警" :class="editSec.alertLevel==10?'active':''"></Radio>
          </RadioGroup>
        </div>
        <div class="sections">
          <div class="title1">延迟时间（0-3600）</div>
          <div class="alertLevels" style="margin: 15px">
            <Input type="number" max="3600" min="0" v-model="editSec.delayTime" placeholder="" style="width: 300px"></Input>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="closeEdit()">取消</Button>
        <Button type="primary" size="large" @click="confirmEdit()" :disabled="limitErrorMsg != ''">确定</Button>
      </div>
    </Modal>
    <div class="mask" v-if=""></div>
  </div>
</template>
<style scoped>
  .ivu-radio-group-item:before{
    height: 0px;
  }
  .ivu-radio-group-item:focus:before{
    height: 0px;
  }
</style>
<script>
  import $ from 'jquery';
  export default{
    name: 'parameter',
    data: () => ({
//      输入的阈值范围
      min:null,
      max:null,
      minimum:null,
      maximum:null,
//      当前报警规则的最大最小值
      maxRuleRange:null,
      minRuleRange:null,
      queryData: {},
      sliderRange:[],
//      上下限值
      lowerLimit:null,
      upperLimit:null,
      delayTime:0,
      limitError:null,
      limitErrorMsg:"",
      alertLevel:null,
      popVisible:false,
      toastModel:false,
      editModel:false,
      currentSection:{},
      editSec:{},
      errorType:null,
      isChangeThreshold:false
    }),
    created () {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.ready()
    },
    watch:{
      minimum(newVal,oldVal){
         if(newVal != oldVal){
           this.isChangeThreshold = true
         }
      },
      maximum(newVal,oldVal){
        if(newVal != oldVal){
          this.isChangeThreshold = true
        }
      },
      editLowerLimit(newVal,oldVal){
        if(newVal != oldVal){
         this.checkValue(2,1,this.editSec.lowerLimit,this.editSec.upperLimit)
        }
      },
      editUpperLimit(newVal,oldVal){
        if(newVal != oldVal){
          this.checkValue(2,2,this.editSec.lowerLimit,this.editSec.upperLimit)
        }
      },
    },
    computed: {
      copyData: function () {
        var obj={};
        obj=JSON.parse(JSON.stringify(this.currentSection)); //this.templateData是父组件传递的对象
        return obj
      },
      editLowerLimit() {
        return this.editSec.lowerLimit
      },
      editUpperLimit() {
        return this.editSec.upperLimit
      }
    },
    methods: {
      /**
       * 数据初始化
       */
      ready() {
        var this_obj = this;
        if(this_obj.$route.params.obj != undefined){
          this_obj.currentThing = this_obj.$route.params.obj;
          localStorage.setItem("currentThing", JSON.stringify(this_obj.currentThing));
        }else if(localStorage.getItem("currentThing") != undefined){
          this_obj.currentThing = JSON.parse(localStorage.getItem("currentThing"));
        }else{
          this_obj.$router.push({name: 'targetTypeAlert'})
        }
        var url = '/alarm/alert/rule/param/show';
        var postData={
          thingCode:this_obj.currentThing.thingCode,
          metricCode:this_obj.currentThing.metricCode,
          alertType:1
        }
        this_obj.$http.post(url,postData).then(res => {
          if(res.data.code == 0){
            this_obj.queryData = res.data.obj.thingAlertRules[0];
            var url = '/alarm/alert/param/threshold';
              var request = {
                thingCode : this_obj.queryData.thingCode,
                metricCode : this_obj.queryData.metricCode
              }
              this_obj.$http.get(url, {params:request}).then(resp => {
                if(resp.data.code == 0){
                  this_obj.queryData.threshold = resp.data.obj;
                  this.init()
                }else{
                  this_obj.$Message.info(resp.data.errorMsg);
                }
              }, resp => {
                this_obj.$Message.info(resp);
              });
          }else{
            this_obj.$Message.info(res.data.errorMsg);
          }
        }, res => {
          console.info(res);
        });
      },
      init(){
        var this_obj = this;
        this_obj.isChangeThreshold = false;
        this_obj.minimum = this_obj.queryData.threshold?this_obj.queryData.threshold.lowerLimit:0;
        this_obj.maximum = this_obj.queryData.threshold?this_obj.queryData.threshold.upperLimit:300;
        this_obj.min = parseInt(this_obj.minimum);
        this_obj.max = parseInt(this_obj.maximum);
        this_obj.sliderRange = [this_obj.min,this_obj.max];
        if(this_obj.queryData.alertRules.length > 0){
          var maxTemp = this_obj.queryData.alertRules[0].upperLimit,minTemp = this_obj.queryData.alertRules[0].lowerLimit;
          this_obj.queryData.alertRules.forEach(function (item) {
            if(item.upperLimit >= maxTemp){
              maxTemp = item.upperLimit
            }
            if(item.lowerLimit <= minTemp){
              minTemp = item.lowerLimit;
            }
            item.popVisible = false;
            var color;
            if(item.alertLevel == 30){
              color = "rgb(253,238,0)";//黄
            }else if(item.alertLevel == 20){
              color = "rgb(180,16,248)";//紫
            }else if(item.alertLevel == 10){
              color = "rgb(48,166,228)";//蓝
            }
//            var unitLength = 668.8 / (this_obj.maximum - this_obj.minimum);
            var unitLength = 0.8 / (this_obj.maximum - this_obj.minimum);
            item.style = {
              width: unitLength *(item.upperLimit - item.lowerLimit)*100  +"%",
//              left: unitLength * (item.lowerLimit - this_obj.minimum) + 83.6 +"px",
              left: (unitLength * (item.lowerLimit - this_obj.minimum) + 0.1)*100 +"%",
              backgroundColor : color
            }
          })
          this_obj.maxRuleRange = maxTemp;
          this_obj.minRuleRange = minTemp;
        }
      },
      /**
       * 取消保存
       */
      cancel() {
//          var this_obj = this;
//          this_obj.lowerLimit = null;
//          this_obj.upperLimit = null;
//          this_obj.alertLevel = null;
        this.$router.push({name: 'paraTypeAlert'})
      },
      /**
       * 检验输入的上下限值
       * param(错误信息出现的位置，input框，下限值，上限值)
       **/
      checkValue(errorType,msg,lowerLimit,upperLimit){
        // lowerLimit = parseInt(lowerLimit);
        // upperLimit = parseInt(upperLimit);
        this.limitErrorMsg = ""
        this.errorType = errorType;
        if(msg == 1){
          if(lowerLimit < this.minimum || lowerLimit > this.maximum){
              this.limitErrorMsg = "此数据无效，请重新输入";
              this.limitError = msg;
          }else if(upperLimit != null){
            if(lowerLimit >= upperLimit){
              this.limitErrorMsg = "此数据无效，请重新输入";
              this.limitError = msg;
            }else{
              this.checkOverlap(errorType,lowerLimit,upperLimit)
            }
          }
        }else if(msg == 2){
          if(upperLimit < this.minimum || upperLimit > this.maximum || lowerLimit >= upperLimit){
            this.limitErrorMsg = "此数据无效，请重新输入";
            this.limitError = msg;
          }else{
            this.checkOverlap(errorType,lowerLimit,upperLimit)
          }
        }
      },
      /**
       * 检验重叠
       **/
      checkOverlap(errorType,lowerLimit,upperLimit){
        var this_obj = this;
        // lowerLimit = parseInt(lowerLimit);
        // upperLimit = parseInt(upperLimit);
        if(upperLimit != null && lowerLimit != null){
          if(this_obj.queryData.alertRules.length > 0){
            var lowerOverlap;
            var upperOverlap;
            if(errorType == 1){
              this_obj.queryData.alertRules.forEach(function (ele) {
                if(upperLimit > ele.upperLimit && lowerLimit < ele.upperLimit){
                  lowerOverlap = true;
                }else if(lowerLimit < ele.lowerLimit && upperLimit >= ele.lowerLimit){
                  upperOverlap = true;
                }else if(lowerLimit >= ele.lowerLimit && upperLimit <= ele.upperLimit){
                  lowerOverlap = true;
                  upperOverlap = true;
                }
              })
            }else if(errorType == 2){
              this_obj.queryData.alertRules.forEach(function (ele) {
                  if( this_obj.currentSection!=undefined && ele.id != this_obj.currentSection.id){
                    if(upperLimit > ele.upperLimit && lowerLimit < ele.upperLimit){
                      lowerOverlap = true;
                    }else if(lowerLimit < ele.lowerLimit && upperLimit >= ele.lowerLimit){
                      upperOverlap = true;
                    }else if(lowerLimit >= ele.lowerLimit && upperLimit <= ele.upperLimit){
                      lowerOverlap = true;
                      upperOverlap = true;
                    }
                  }
              })
            }
            if(lowerOverlap){
              this_obj.limitErrorMsg = "此数据在配置范围内，请重新输入";
              this_obj.limitError = 1;
            }else if(upperOverlap){
              this_obj.limitErrorMsg = "此数据在配置范围内，请重新输入";
              this_obj.limitError = 2;
            }else{
              this_obj.limitError = null;
            }
          }
        }
      },
      /**
       * 保存并继续添加
       */
      remain() {
        this.$validator.validateAll().then((result) => {
            var this_obj = this;
          if (result) {
            if(this_obj.minRuleRange != null
              && this_obj.maxRuleRange != null
              && (this_obj.minimum > this_obj.minRuleRange
              || this_obj.maximum < this_obj.maxRuleRange)){
              this_obj.$Message.info("您输入的时间轴的最值无效，请重新输入！");
            }else{
              if(this_obj.maximum < 5000){
                if(this_obj.isChangeThreshold){
                  this_obj.updateThreshold();
                }
//                debugger
                if(this_obj.limitErrorMsg !="" || this_obj.alertLevel == null||this_obj.delayTime<0||this_obj.delayTime>3600){
                  this_obj.$Message.info("请认真填写数据！");
                }else{
                  if(this_obj.lowerLimit != undefined && this_obj.upperLimit != undefined){
                    this_obj.updateRule();
                  }else{
                    this_obj.$Message.info("未输入有效的上限值和下限值");
                  }
                }

              }else{
                this_obj.$Message.info("未输入有效的阈值");
              }
              this_obj.lowerLimit = null;
              this_obj.upperLimit = null;
              this_obj.alertLevel = null;
            }
          }else{
            this_obj.$Message.info("请认真填写数据！");
          }
        });
      },
      /**
       * 更新报警阈值
       **/
      updateThreshold(){
        var this_obj = this;
        var max= this_obj.maximum, min = this_obj.minimum
        if(max > min){
          var url = '/alarm/alert/param/threshold';
          var postData = {
              lowerLimit:this_obj.minimum,
              metricCode:this_obj.queryData.metricCode,
              ruleType:1,
              thingCode:this_obj.queryData.thingCode,
              upperLimit:this_obj.maximum,
              enable:true
            }
          this_obj.$http.post(url,postData).then(res => {
            if(res.data.code == 0){
//              this.ready();
              this_obj.$router.push({name:'stopStation'});
            }else{
              this_obj.$Message.info(res.data.errorMsg);
            }
          }, res => {
            console.info(res);
          });
        }else{
          this_obj.$Message.info("此数据无效，请重新输入");
        }
      },
      /**
       * 更新报警规则
       */
      updateRule(){
        var this_obj = this;
        var node = {};
        node.ruleType = 1
        node.thingCode = this_obj.queryData.thingCode;
        node.metricCode = this_obj.queryData.metricCode;
        node.lowerLimit = this_obj.lowerLimit;
        node.upperLimit = this_obj.upperLimit;
        node.delayTime = this_obj.delayTime;
        node.enable = true;
        var color;
        if(this_obj.alertLevel == '黄色报警'){
          color = "rgb(253,238,0)";
          node.alertLevel = 30;
        }else if(this_obj.alertLevel == '紫色报警'){
          color = "rgb(180,16,248)";
          node.alertLevel = 20;
        }else{
          color = "rgb(48,166,228)";
          node.alertLevel = 10;
        }
        var unitLength = 0.8 / (this_obj.maximum - this_obj.minimum);
        node.style = {
          width: unitLength *(node.upperLimit - node.lowerLimit)*100  +"%",
//              left: unitLength * (item.lowerLimit - this_obj.minimum) + 83.6 +"px",
          left: (unitLength * (node.lowerLimit - this_obj.minimum) + 0.1)*100 +"%",
          backgroundColor : color
        }
        this_obj.queryData.alertRules.push(node);
        var url = '/alarm/alert/rule?type=1';
        var postData = [node];
        this_obj.$http.post(url,postData).then(res => {
          if(res.data.code == 0){
//              this.ready();
            this_obj.$router.push({name:'stopStation'});
          }else{
            this_obj.$Message.info(res.data.errorMsg);
          }
        }, res => {
          console.info(res);
        });
      },
      /**
       * 确认并关闭
       */
      goBack(){
        this.remain();
        this.$router.push({name: 'targetTypeAlert'})
      },
      /**
       * 修改滑条最大最小值
       */
      changeSlider(){
        var this_obj = this;
        this_obj.min = this_obj.minimum;
        this_obj.max = this_obj.maximum;
        this_obj.sliderRange = [this_obj.min,this_obj.max];
      },
      /**
       * 删除按钮
       */
      delSection(section){
        this.currentSection = section;
        this.toastModel = true;
      },
      changePop(section){
        if(section.popVisible == undefined){
          section.popVisible = true
        }else{
          section.popVisible = !section.popVisible;
        }
      },
      /**
       * 编辑按钮
       */
      editSection(section){
        this.currentSection = section;
        this.editSec = this.copyData;
        this.editModel = true;
      },
      /**
       *切换报警等级
       **/
      changeLevel() {
        if(this.editSec.alertLevel == '黄色报警'){
          this.editSec.alertLevel = 30;
        }else if(this.editSec.alertLevel == '紫色报警'){
          this.editSec.alertLevel = 20;
        }else if(this.editSec.alertLevel == '蓝色报警'){
          this.editSec.alertLevel = 10;
        }
      },
      /**
       * 删除框确认
       */
      confirmToast(){
        var delData =[this.currentSection.id];
        var url = '/alarm/alert/rule?type=1';
        this.$http.delete(url,{data: delData})
          .then(res => {
            if(res.data.code == 0){
//              this.ready();
              this.toastModel = false;
              this.$router.push({name:'stopStation'});
            }else{
              this.$Message.info(res.data.errorMsg);
            }
          }, res => {
            console.info(res);
          });


      },
      /**
       * 删除框关闭
       */
      closeToast(){
        this.toastModel = false;
      },
      /**
       * 编辑框确认
       */
      confirmEdit(){
        var url = '/alarm/alert/rule?type=1';
        if(this.editSec.upperLimit == "" || this.editSec.lowerLimit == ""||this.editSec.delayTime<0||this.editSec.delayTime>3600){
          this.$Message.info("请认真填写数据!");
          return;
        }
        var postData = [
          {
            id:this.editSec.id,
            alertLevel:this.editSec.alertLevel,
            lowerLimit:this.editSec.lowerLimit,
            metricCode:this.queryData.metricCode,
            ruleType:1,
            thingCode:this.queryData.thingCode,
            upperLimit:this.editSec.upperLimit,
            delayTime:this.editSec.delayTime,
            enable:true
          }
        ]
        this.$http.post(url,postData).then(res => {
          if(res.data.code == 0){
//            this.ready();
            this.editModel = false;
            this.$router.push({name:'stopStation'});
          }else{
            this.$Message.info(res.data.errorMsg);
          }
        }, res => {
          console.info(res);
        });
      },
      /**
       * 编辑框关闭
       */
      closeEdit(){
        this.editModel = false;
      }
    }
  }
</script>
