<!--Author:wangyajie-->
<template>
  <div class="configure signal">
    <div class="content-header">
      配置设备信号
      <div class="tabs">
        <div class="tab" @click="changeTab(1)" :class="tab==1?'active':''">批量条件筛选</div>
        <div class="tab" @click="changeTab(2)" :class="tab==2?'active':''">精准编号添加</div>
      </div>
    </div>
    <div v-if="tab==1">
      <Row  class="select-blocks">
        <Col span="8" class="assetType">
        <label for="assetType">资产类别：</label>
        <div class="selects">
          <select name="assetType" v-model="currAssetType" @change="changeAsset()">
            <option v-for="x in assetTypes" v-bind:value="x">{{x.assetType}}</option>
          </select>
          <div class="line"></div>
        </div>
        </Col>
        <Col span="8" class="category">
        <label for="category">设备/部件类型：</label>
        <div class="selects">
          <select name="category" v-model="currCategory" @click="selCate()" :disabled="!haveSelectAss" @change="changeCategory()">
            <option v-for="x in categories" v-bind:value="x">{{x.categoryName}}</option>
          </select>
          <span v-show="!haveSelectAss" class="is-danger errorTip">请选择资产类型后，再选择设备/部件类型</span>
          <div class="mask" v-show="!haveSelectAss" @click="haveSelectAss = true" style="z-index: 11111;"></div>
          <div class="line"></div>
        </div>
        </Col>
        <Col span="8" class="system">
        <label for="system">所属系统：</label>
        <div class="selects">
          <select name="system" v-model="currSystem" @click="haveSelectAss=true">
            <option v-for="x in systems" v-bind:value="x">{{x.systemName}}</option>
          </select>
          <div class="line"></div>
        </div>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <label for="signal">信号名称：</label>
        <div class="selects">
          <input type="text" name="code"
                 v-model="currMetricCode.metricName"
                 placeholder="按规则输入信号名称"
                 v-on:input="inputMetric()"
                 v-on:focus="showList = true;haveSelectAss=true"
                 autocomplete="off"
                 required>
          <Icon type="arrow-down-b"></Icon>
          <div class="line"></div>
          <div class="mask" v-show="showList" @click="showList = false"></div>
          <ul class="dataList" v-show="showList">
            <li v-for="x in currMetricCodes" @click="selectMetric(x)">{{x.metricName}}</li>
          </ul>
          <span v-show="!haveSeletCode1" class="is-danger errorTip">请输入信号名称</span>
        </div>
        </Col>
        <Col span="12">
          <div  class="operates">
            <Button type="primary" shape="circle" @click="search()" style="height: 24px;font-size: 14px;padding: 1px 15px;background-color:#2c9ae8">
              <Icon type="ios-search-strong" size="14" ></Icon>
              检索
            </Button>
          </div>
        </Col>
      </Row>
      <p class="noDevice" v-if="filterData.length == 0">您还未添加设备，请检索后带出设备！</p>
      <div v-else>
        <Table ref="selection1" :columns="columns" :time="200" :data="showFilterData1" :loading="loading" @on-selection-change="selectAll1"></Table>
        <Table ref="selection2" :columns="columns" :time="200" :data="showFilterData2" :loading="loading" @on-selection-change="selectAll2"></Table>
      </div>
      <nav v-if="pages>1">
        <ul class="pagination">
          <li><a @click="selectPage(1)"><<</a></li>
          <li><a @click="selectPage(currentPage - 1)">&lt;</a></li>
          <li><a>{{currentPage}}/{{pages}}</a></li>
          <li><a @click="selectPage(currentPage + 1)">&gt;</a></li>
          <li><a @click="selectPage(pages)">&gt;&gt;</a></li>
        </ul>
      </nav>
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
    <div v-else="tab==2">
      <Row  class="select-blocks">
        <Col span="12" class="assetType">
        <label for="assetType">添加设备：</label>
        <!--<div class="selects">-->
          <!--<select name="assetType" v-model="assetType">-->
            <!--<option value="">全部</option>-->
          <!--</select>-->
          <!--<div class="line"></div>-->
        <!--</div>-->
        <div class="selects">
          <input type="text" name="code"
                 v-model="thing.thingCode"
                 placeholder="请输入设备编号"
                 v-on:input="inputThingCode()"
                 v-on:focus="showThingList = true"
                 autocomplete="off"
                 required>
          <Icon type="arrow-down-b"></Icon>
          <div class="line"></div>
          <div class="mask" v-show="showThingList" @click="showThingList = false"></div>
          <ul class="dataList" v-show="showThingList" style="overflow: auto">
            <li v-for="x in deviceList" @click="selectThing(x)">{{x.thingCode}}</li>
          </ul>
        </div>
        </Col>
        <Col span="12" class="signal">
        <label for="signal">信号名称：</label>
        <div class="selects">
          <input type="text" name="metricCode"
                 v-validate="'required'"
                 v-model="currMetricCode.metricName"
                 placeholder="按规则输入信号名称"
                 v-on:input="inputMetric()"
                 v-on:focus="showList = true;haveSeletCode2 = true"
                 autocomplete="off"
                 required>
          <Icon type="arrow-down-b"></Icon>
          <div class="line"></div>
          <div class="mask" v-show="showList" @click="showList = false"></div>
          <ul class="dataList" v-show="showList && thing.thingCode != undefined">
            <li v-for="x in currMetricCodes" @click="selectMetric(x)">{{x.metricName}}</li>
          </ul>
          <span v-if="(thing.thingCode == undefined || thing.thingCode == '') && showList" class="help is-danger" style="position: absolute;">请配置与当前已添加设备相同的参数</span>
          <span v-show="!haveSeletCode2" class="is-danger errorTip">请输入信号名称</span>
        </div>
        </Col>
      </Row>
      <Row>
        <Col span="8" class="metricType">
        <label for="metricType">参数类型：</label>
        <div class="selects">
          <select name="metricType" v-model="currMetricType" @change="haveSeletType=true">
            <option v-for="x in metricTypes" v-bind:value="x" >{{x.categoryName}}</option>
          </select>
          <div class="line"></div>
          <span v-show="!haveSeletType" class="is-danger errorTip">请输入信号名称</span>
        </div>
        </Col>
        <Col span="12">
        <div class="operates">
          <Button type="primary" shape="circle" @click="searchExact()" style="height: 24px;font-size: 14px;padding: 1px 15px;background-color:#2c9ae8">
            <Icon type="ios-search-strong" size="14" ></Icon>
            检索
          </Button>
        </div>
        </Col>
      </Row>
      <p class="noDevice" v-if="exactData.length == 0">您还未添加设备，请检索后带出设备！</p>
      <div v-else>
        <Table ref="selection3" :columns="columns" :data="exactData" @on-selection-change="selectAll3()"></Table>
      </div>
      <nav v-if="pages>1">
        <ul class="pagination">
          <li><a @click="selectPage(1)"><<</a></li>
          <li><a @click="selectPage(currentPage - 1)">&lt;</a></li>
          <li><a>{{currentPage}}/{{pages}}</a></li>
          <li><a @click="selectPage(currentPage + 1)">&gt;</a></li>
          <li><a @click="selectPage(pages)">&gt;&gt;</a></li>
        </ul>
      </nav>
      <div class="buttons">
        <div class="button" @click="cancelExact()">
          取消
        </div>
        <div class="button" @click="remainExact()">
          保存并继续添加
        </div>
        <div class="button" @click="goBackExact()">
          确认并关闭
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>
<style></style>
<script>
  import $ from 'jquery';
  export default {
    data () {
      return {
        tab:1,
//        资产类别
        showList:false,
        assetTypes:[],
//        设备/部件类型
        categories:[],
//        所属系统
        systems:[],
//        信号名称
        metricCodes:[],
        currMetricCodes:[], //当前展示的信号名称
//        当前选择
        currAssetType:{},
        currCategory:{},
        currSystem:{},
        currMetricCode:{},
//        currMetricName:"",
        columns:[
          {
            type: 'selection',
            align: 'center'
          },
          {
            title: '设备编号',
            key: 'thingCode',
            align: 'center'
          },
          {
            title: '设备名称',
            key: 'thingName',
            ellipsis:true
          }
          ],
        currentPage:1,
        pageSize:12,
        pages:null,
//        全部批量条件筛选数据
        filterData:[],
//        当前显示数据
        showFilterData:[],
//        左边
        showFilterData1:[],
        selectDevices1:[],
//        右边
        showFilterData2:[],
        selectDevices2:[],
//        精确编号显示数据
        metricTypes:[],
        currMetricType:{},
        allDevices:[],
        deviceList:[],
        exactData:[],
        showThingList:false,
        thingList:[],
        thing:{},
        loading:true,
        haveSelectAss:true,
        haveSeletCode1:true,
        haveSeletCode2:true,
        haveSeletType:true
      }
    },
    created () {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      var this_obj = this;
      this_obj.assetTypes = JSON.parse(localStorage.getItem("assetTypes"));
      this_obj.categories.push({'categoryName':'全部'});
      this_obj.systems = JSON.parse(localStorage.getItem("systems"));
      this_obj.metricTypes = JSON.parse(localStorage.getItem("metricTypes"));
      this_obj.currAssetType = this_obj.assetTypes[0];
      this_obj.currSystem = this_obj.systems[0];
      this_obj.currCategory = this_obj.categories[0];
      this_obj.currMetricType = this_obj.metricTypes[0];
      this_obj.getMetricCodes();
    },
    computed: {
      copyData: function () {
        var obj={};
        obj=JSON.parse(JSON.stringify(this.metricCodes)); //this.templateData是父组件传递的对象
        return obj
      }
    },
    methods: {
      init(){
        var this_obj = this;
        var query = {};
        if(this_obj.currAssetType.alias){
            query.assetType = this_obj.currAssetType.alias
        }
        if(this_obj.currCategory.code){
          query.category = this_obj.currCategory.code;
        }
        if(this_obj.currSystem.id){
          query.system = this_obj.currSystem.id;
        }
        if(this_obj.currMetricCode.metricCode !=undefined){
          query.metricCode = this_obj.currMetricCode.metricCode;
        }
        this_obj.$http.get('/alarm/alert/param/list',{params:query}
        ).then((response) => {
          if(response.data.code >= 0){
            this_obj.filterData = response.data.obj;
            this_obj.selectPage(1);
            this_obj.filterData.forEach(function (item) {
              if(item.configured){
                item._disabled= true;
//                item._checked = true;
              }
            })
          }else{
            this_obj.$Message.info(res.data.errorMsg);
          }
        }, (response) => {
          this_obj.$Message.info("获取设备列表失败");
        });
      },
      changeAsset(){
        //获取指定资产类别下的设备/部件类别列表
        if(this.currAssetType.alias){
          this.haveSelectAss = true
          this.currMetricCode = {};
          this.getMetricCodes();
          this.$http.get('/api/thing/category/asset',{
            params:{
              'assetType':this.currAssetType.alias
            }
          }).then((response) => {
            if(response.data.code >= 0){
              this.categories = response.data.obj;
              this.categories.splice(0,0,{'categoryName':'全部'})
              this.currCategory = this.categories[0];
            }else{
              this.$Message.info(res.data.errorMsg);
            }
          }, (response) => {
            this.$Message.info("获取设备/部件类别列表失败");
          });
        }else{
          this.categories = [];
          this.categories.push({'categoryName':'全部'});
          this.currCategory = this.categories[0];
        }
      },
      selCate(){
        if(this.currAssetType.alias){
          this.haveSelectAss = true
        }else{
          this.haveSelectAss = false
        }
      },
      changeCategory(){
        this.currMetricCode = {}
        this.getMetricCodes();
      },
      changeTab(tab){
        this.tab = tab;
        this.thing={};
        this.currMetricCode = {};
        this.pages = 0;
        this.getMetricCodes();
      },
      getMetricCodes(){
        //指定参数类型列表
        var request = {};
        var this_obj = this;
        if(this_obj.currAssetType.alias){
          request.assetType = this_obj.currAssetType.alias;
        }
        if(this_obj.currCategory.code){
          request.category = this_obj.currCategory.code;
        }
        if(this_obj.thing.thingCode){
          request.thingCode = this_obj.thing.thingCode;
        }
        this_obj.$http.get('/api/thing/metric/assetAndCategory',{params:request}).then((response) => {
          if(response.data.code >= 0){
            this_obj.metricCodes = response.data.obj;
//            this_obj.metricCodes.splice(0,0,{'metricName':'按规则输入信号名称'});
//            this_obj.currMetricCode = this_obj.metricCodes[0];
            this_obj.currMetricCodes = this_obj.copyData;
          }else{
            this_obj.$Message.info(res.data.errorMsg);
          }
        }, (response) => {
          this_obj.$Message.info("获取系统列表失败");
        });
      },
      selectPage(num){
        var this_obj = this
        this_obj.pages = Math.floor(this_obj.filterData.length / this_obj.pageSize);
        if (typeof num === 'number' && num > 0 && num <= this.pages) {
          this_obj.showFilterData = selectData(this_obj.filterData, (num - 1) * this_obj.pageSize, num * this_obj.pageSize);
          this_obj.showFilterData1 = selectData(this_obj.showFilterData, 0,this_obj.pageSize/2);
          this_obj.showFilterData2 = selectData(this_obj.showFilterData, this_obj.pageSize/2,this_obj.pageSize);
          this_obj.currentPage = num;
        }
        var temp1 = 0
        this_obj.showFilterData1.forEach(function (item) {
          if(item.configured){
            temp1++;
          }
        })
        var temp2 = 0
        this_obj.showFilterData2.forEach(function (item) {
          if(item.configured){
            temp2++;
          }
        })
        setTimeout(function () {
          $(".ivu-checkbox-disabled").each(function () {
            $(this).addClass("ivu-checkbox-checked");
            $(this).removeClass("ivu-checkbox-disabled");
          })
          if(temp1 == this_obj.pageSize/2){
             $("thead").each(function (index,e) {
               if(index == 0){
                 $(this).find(".ivu-checkbox").addClass("ivu-checkbox-checked");
               }
             })
          }else{
            $("thead").each(function (index,e) {
              if(index == 0){
                $(this).find(".ivu-checkbox").removeClass("ivu-checkbox-checked");
              }
            })
          }
          if(temp2 == this_obj.pageSize/2){
            $("thead").each(function (index,e) {
              if(index == 1){
                $(this).find(".ivu-checkbox").addClass("ivu-checkbox-checked");
              }
            })
          }else{
            $("thead").each(function (index,e) {
              if(index == 1){
                $(this).find(".ivu-checkbox").removeClass("ivu-checkbox-checked");
              }
            })
          }
          this_obj.loading = false;
        },200)
      },
      inputMetric(){
          if(this.currMetricCode.metricName != "" && this.currMetricCode.metricName != undefined){
              var tempArr = [];
            for(var i in this.metricCodes){
              var sTxt= this.metricCodes[i].metricName ||'';
              var nPos = find(this.currMetricCode.metricName, sTxt);
              //nPos=sTxt.indexOf(sFind);
              if(nPos>=0){
                tempArr.push(this.metricCodes[i]);
              }
            }
            if(tempArr.length > 4){
              tempArr.splice(4);
            }
            this.currMetricCodes = tempArr;
          }else{
            this.currMetricCodes = this.copyData;
          }
      },
      selectMetric(metric){
        this.currMetricCode = metric;
        if(this.currMetricCode.metricCode != undefined){
          this.haveSeletCode1 = true
          this.haveSeletCode2 = true
        }
        this.showList = false
      },
      search(){
        var this_obj = this;
        this_obj.loading = true;
        if(this_obj.currMetricCode.metricCode == undefined){
          this_obj.haveSeletCode1 = false;
        }else{
          this_obj.init();
        }
      },
      selectAll1(selection){
        var this_obj = this ;
        this_obj.selectDevices1 = [];
        selection.forEach(function(item){
          this_obj.selectDevices1.push(item)
        });
        this_obj.showFilterData1.forEach(function (e) {
          var check = false;
          if(selection.length == 0){
            e._checked = false;
          }else {
            selection.forEach(function (item) {
              if (!check) {
                if (e.thingCode == item.thingCode) {
                  e._checked = true;
                  check = true;
                } else {
                  e._checked = false;
                }
              }
            });
          }
        })
      },
      selectAll2(selection){
        var this_obj = this ;
        this_obj.selectDevices2 = [];
        selection.forEach(function(item){
          this_obj.selectDevices2.push(item)
        });
        this_obj.showFilterData2.forEach(function (e) {
          var check = false;
          if(selection.length == 0){
            e._checked = false;
          }else{
            selection.forEach(function(item){
              if(!check){
                if(e.thingCode == item.thingCode){
                  e._checked = true;
                  check = true;
                }else{
                  e._checked = false;
                }
              }
            });
          }
        })
      },
      selectAll3(){
        this.exactData[0]._checked = true;
      },
      cancel(){
//        this.$refs.selection1.selectAll(false);
//        this.$refs.selection2.selectAll(false);
        this.$router.push({name: 'paraTypeAlert'})
      },
      remain(){
        var url = '/alarm/alert/param/configureList';
        var postData = [];
        var this_obj = this;
        var tempArr = this_obj.selectDevices1.concat(this_obj.selectDevices2);
        tempArr.forEach(function (item) {
            var node ={}
            node.thingCode = item.thingCode;
            node.metricCode = this_obj.currMetricCode.metricCode;
            postData.push(node)
        })
        this_obj.$http.post(url,postData).then(res => {
          if(res.data.code == 0){
            this_obj.$Message.info("配置成功");
          }else{
            this_obj.$Message.info(res.data.errorMsg);
          }
        }, res => {
          console.info(res);
        });
      },
      goBack(){
        this.remain();
        this.$router.push({name: 'paraTypeAlert'})
      },
      /**
       * 精确编号
       */
      getMetricTypes(){
        //指定参数类型列表
        var request = {};
        var this_obj = this;
        request.thingCode = this_obj.thing.thingCode;
        this_obj.$http.get('/api/thing/metricType/assetAndCategory',{params:request}).then((response) => {
          if(response.data.code >= 0){
            this_obj.metricTypes = response.data.obj;
            this_obj.metricTypes.splice(0,0,{'categoryName':'全部'});
            this_obj.currMetricType = this_obj.metricTypes[0];
          }else{
            this_obj.$Message.info(res.data.errorMsg);
          }
        }, (response) => {
          this_obj.$Message.info("获取系统列表失败");
        });
      },
      inputThingCode(){
          var this_obj = this;
        this_obj.currMetricCode = {};
        this_obj.currMetricType = this_obj.metricTypes[0];
        if(this.thing.thingCode != undefined && this.thing.thingCode.length >= 3){
          var query={};
          query.thingStartCode = this_obj.thing.thingCode;
          this_obj.allDevices=[];
          this_obj.$http.get('/api/thing/assetAndCategory',{params:query}
          ).then((response) => {
            if(response.data.code >= 0){
              if(response.data.obj.length > 4){
                response.data.obj.splice(4);
                this_obj.deviceList = response.data.obj
              }else{
                this_obj.deviceList = response.data.obj
              }
            }else{
              this_obj.$Message.info(res.data.errorMsg);
            }
          }, (response) => {
            this_obj.$Message.info("获取设备列表失败");
          });
        }else{
          this_obj.deviceList = [];
          this_obj.currMetricCodes = [];
          this_obj.metricTypes.splice(0,this_obj.metricTypes.length,{'categoryName':'全部'});
        }
      },
      selectThing(thing){
        this.thing = thing;
        this.getMetricTypes();
        this.getMetricCodes();
        this.exactData = [];
        this.showThingList = false
      },
      searchExact(){
        var this_obj = this;
        this_obj.showList = false;
          if(this_obj.currMetricCode.metricCode != undefined && this_obj.currMetricType.code != undefined){
            this_obj.exactData=[]
            var query = {};
            query.metricCode = this.currMetricCode.metricCode;
            query.thingStartCode = this.thing.thingCode;
            this_obj.$http.get('/alarm/alert/param/list',{params:query}
            ).then((response) => {
              if(response.data.code >= 0){
                response.data.obj.forEach(function (item) {
                  if(item.thingCode === this_obj.thing.thingCode){
                    if(item.configured){
                      item._disabled= true;
                    }
                    this_obj.exactData.push(item);
                  }
                })
                setTimeout(function () {
                  if($(".ivu-checkbox-disabled").length > 0){
                    $(".ivu-checkbox").each(function () {
                      $(this).addClass("ivu-checkbox-checked");
                      $(this).removeClass("ivu-checkbox-disabled");
                    })
                  }
                },200)
              }else{
                this_obj.$Message.info(res.data.errorMsg);
              }
            }, (response) => {
              this_obj.$Message.info("获取设备列表失败");
            });
          }else{
              if(this_obj.currMetricCode.metricCode == undefined){
                this_obj.haveSeletCode2 = false;
              }else{
                this_obj.haveSeletCode2 = true;
              }
              if(this_obj.currMetricType.code == undefined){
                this_obj.haveSeletType = false;
              }else{
                this_obj.haveSeletType = true;
              }
            this_obj.exactData = [];
          }
      },
      cancelExact(){
//        this.$refs.selection3.selectAll(false);
        this.$router.push({name: 'paraTypeAlert'})
      },
      remainExact(){
        if(this.exactData[0]._checked){
          var url = '/alarm/alert/param/configureList';
          var postData = [];
          var this_obj = this;
          var node = {};
          node.thingCode = this_obj.thing.thingCode;
          node.metricCode = this_obj.currMetricCode.metricCode;
          postData.push(node);
          this_obj.$http.post(url,postData).then(res => {
            if(res.data.code == 0){
              this_obj.$Message.info("配置成功");
            }else{
              this_obj.$Message.info(res.data.errorMsg);
            }
          }, res => {
            console.info(res);
          });
        }else {
          this.$Message.info("您并未选中任何设备");
        }
      },
      goBackExact(){
        this.remainExact();
        this.$router.push({name: 'paraTypeAlert'})
      }
    }
  }

  /**
   * 截取数据
   * @param {Array} obj 要截取的数组对象
   * @param {number} start 开始位置
   * @param {number} end 结束位置
   */
  function selectData(obj, start, end) {
    if (obj instanceof Array && Number(start) >= 0 && Number(end) >= 0) {
      return obj.slice(start, end);
    }
  }
  /**
   * 数组模糊查询
   * @param sFind 要查找的数据
   * @param sObj比较的数据
   * @returns {number}
   */
  function find(sFind, sObj)
  {
    var nSize = sFind.length;
    var nLen = sObj.length;
    var sCompare;

    if(nSize <= nLen ){
      for(var i = 0; i <= nLen - nSize + 1; i++){
        sCompare = sObj.substring(i, i + nSize);
        if(sCompare == sFind){
          return i;
        }
      }
    }
    return -1;
  }
</script>
