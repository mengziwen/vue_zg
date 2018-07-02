<!--Author:wangyajie-->
<template>
  <div class="paraTypeAlert" id="proTypeAlert">
    <div class="content-title">
      <div>保护类报警维护</div>
      <div>
        <div class="selects">
          <input type="text" name="code"
                 v-model="searchInfo"
                 placeholder="请输入设备编号"
                 v-on:input="inputSearchInfo()"
                 v-on:focus="showList = true"
                 autocomplete="off"
                 required>
          <Icon type="arrow-down-b"></Icon>
          <div class="line"></div>
          <div class="mask" v-show="showList" @click="showList = false"></div>
          <ul class="dataList" v-show="showList">
            <li v-for="x in currentDevices" @click="selectCode(x)">{{x.thingCode}}</li>
          </ul>
        </div>
        <Button type="primary" @click="searchByExact()" style="margin:5px 10px;width: 60px;height: 24px;padding: 3px 15px;background-color:#2c9ae8">
          <Icon type="ios-search-strong" size="16"></Icon>
        </Button>
        <div class="clearfix"></div>
      </div>
    </div>
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
        <select name="category" v-model="currCategory" @click="selCate()" :disabled="!haveSelectAss" @change="changeCategory()" >
          <option v-for="x in categories" v-bind:value="x" v-bind:style="{display:x.code?'block':'none'}">{{x.categoryName}}</option>
        </select>
        <span v-show="!haveSelectAss" class="is-danger errorTip">请选择资产类型后，再选择设备/部件类型</span>
        <div class="mask" v-show="!haveSelectAss" @click="haveSelectAss = true" style="z-index: 11111;"></div>
        <div class="line"></div>
      </div>
      </Col>
      <Col span="8" class="building">
      <label for="building">安装位置：</label>
      <div class="selects" >
        <select name="building" v-model="currBuilding">
          <option v-for="x in buildings" v-bind:value="x">{{x.buildingName}}</option>
        </select>
        <div class="line"></div>
      </div>
      </Col>
    </Row>
    <Row>
      <Col span="8">
      <label for="system">所属系统：</label>
      <div class="selects" >
        <select name="system" v-model="currSystem">
          <option v-for="x in systems" v-bind:value="x">{{x.systemName}}</option>
        </select>
        <div class="line"></div>
      </div>
      </Col>
      <Col span="8" class="system">
      <label for="level">报警等级：</label>
      <div class="selects">
        <select name="level" v-model="currAlertLevel">
          <option v-for="x in alertLevels" v-bind:value="x">{{x.levelName}}</option>
        </select>
        <div class="line"></div>
      </div>
      </Col>
      <Col span="8" class="signal">
      <label for="signal">信号名称：</label>
      <div class="selects" >
        <select name="signal" v-model="currMetricCode">
          <option v-for="x in metricCodes" v-bind:value="x">{{x.metricName}}</option>
        </select>
        <div class="line"></div>
      </div>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <div class="operates">
        <Button type="primary" shape="circle" @click="search()" style="height: 24px;font-size: 14px;padding: 1px 15px;background-color:#2c9ae8">
          <Icon type="ios-search-strong" size="14" ></Icon>
          检索
        </Button>
        <div class="operate" @click="showPop()">
          <img src="src/images/warning/paixu.png"/>
          <span class="sort">排序</span>
          <Poptip v-model="popVisible" placement="bottom">
            <div slot="title">排序方式</div>
            <div slot="content">
              <div class="item" @click.stop="sortBy(4)">设备/部件类型</div>
              <div class="item" @click.stop="sortBy(3)">信号名称</div>
              <div class="item" @click.stop="sortBy(2)">设备号升序</div>
            </div>
          </Poptip>
        </div>
        <Button type="primary" shape="circle" @click="configure()" style="height: 24px;font-size: 14px;padding: 1px 15px;background-color:#2c9ae8">
          <Icon type="compose" size="14" ></Icon>
          编辑
        </Button>
      </div>
      </Col>
    </Row>
    <!--<p class="noDevice" v-if="currentData.length == 0">系统暂时无匹配数据，请更换条件</p>-->
    <Table  ref="selection" :columns="columns" :data="currentData" @on-selection-change="selectRows"></Table>
    <nav v-if="pages>1">
      <ul class="pagination">
        <li><a @click="selectPage(1)"><<</a></li>
        <li><a @click="selectPage(currentPage - 1)">&lt;</a></li>
        <li><a>{{currentPage}}/{{pages}}</a></li>
        <li><a @click="selectPage(currentPage + 1)">&gt;</a></li>
        <li><a @click="selectPage(pages)">&gt;&gt;</a></li>
      </ul>
    </nav>
    <!--loading状态图标-->
    <row v-show="table_isLoading"  style="top: 20px;">
      <Col class="demo-spin-col" span="8" style="left: 33.5%;" >
      <Spin fix>
        <Icon type="load-c" size=34 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      </Col>
    </row>
    <Modal
      title="title"
      width="540"
      v-model="editModel"
      :mask-closable="false"
      class-name="editProModel"
      :closable="false">
      <p slot="header">
        <span>编辑设备设置</span>
        <span class="titleLeft" @click="closeEdit()">
          <img src="src/images/warning/webqt_iocn.png" alt="close">
        </span>
      </p>
      <div class="sections">
        <div class="title"><span>信号名称：</span>{{selected.length > 0?selected[0].metricName:''}}</div>
      </div>
      <div class="sections">
        <div class="title">配置等级：</div>
        <div class="selectLevels">
          <RadioGroup v-model="selectLevel" type="button">
            <Radio label="黄色报警" :class="selectLevel=='黄色报警'?'active':''"></Radio>
            <Radio label="紫色报警" :class="selectLevel=='紫色报警'?'active':''"></Radio>
            <Radio label="蓝色报警" :class="selectLevel=='蓝色报警'?'active':''"></Radio>
          </RadioGroup>
        </div>
      </div>
      <div class="sections">
        <div class="title">开启状态：</div>
        <div class="enable">
          <RadioGroup v-model="selectEnable">
            <Radio label="启用"></Radio>
            <Radio label="停用"></Radio>
          </RadioGroup>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="closeEdit()">取消</Button>
        <Button type="primary" size="large" @click="confirmEdit()">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<style></style>
<script>
  import selectBox from '@/components/warning/maintain/selectBox';
  import $ from 'jquery';
  export default {
    data () {
      return {
        editing:false,
        popVisible:false,
        assetTypes:[],
        categories:[],
        buildings:[],
        systems:[],
        alertLevels:[
          {
            levelName:"全部"
          },
          {
            levelName:"蓝色报警",
            level:10
          },
          {
            levelName:"紫色报警",
            level:20
          },
          {
            levelName:"黄色报警",
            level:30
          }
        ],
        radios:[
          {
            label:'启用'
          },
          {
            label:'停用'
          }],
        metricCodes:[],
        currAssetType:{},
        currCategory:{},
        currBuilding:{},
        currSystem:{},
        currAlertLevel:{},
        currMetricCode:{},
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '设备编号',
            key: 'thingCode',
            width: 120
          },
          {
            title: '所属系统',
            key: 'systemName'
          },
          {
            title: '设备名称',
            key: 'thingName'
          },
          {
            title: '资产类别',
            key: 'assetType',
            ellipsis:true,
            render: (h, params) => {
              return h('span',
                getAssetType(params.row.assetType)
              )
            }
          },
          {
            title: '设备/部件类型',
            key: 'categoryName'
          },
          {
            title: '安装位置',
            key: 'buildingId',
            render: (h, params) => {
              return h('span',
                getBuildingName(params.row.buildingId)
              )
            },
          },
          {
            title: '信号名称',
            key: 'metricName'
          },
          {
            title: '报警等级',
            key: 'alertRules.alertLevel',
            render: (h, params) => {
              return h('div', [
                h('span',{
                  attrs:{
                    class:'span'+params.row.thingCode
                  },
                  style:{
                    color:(params.row.alertRules.length !=0 && params.row.alertRules[0].alertLevel)?'':'red'
                  }
                },
                  getAlertLevel(params.row.alertRules.length == 0?undefined:params.row.alertRules[0].alertLevel)
                ),
                h(selectBox, {
                  attrs:{
                    class:'select'+params.row.thingCode
                  },
                  props: {
                    alertLevel: params.row.alertRules[0].alertLevel,
                  },
                  on:{
                    'changLevel': (val) => {
                      params.row.commit = true;
                      params.row.alertRules[0].alertLevel = val;
                     }
                  }
                })
              ]);
            },
            width: 100,
          },
          {
            title: '开启状态',
            key: 'alertRules.enable',
            render: (h, params) => {
              return h('div', [
                h('span',{
                    attrs:{
                      class:'span'+params.row.thingCode
                    },
                    style:{
                      color:(params.row.alertRules.length !=0 && params.row.alertRules[0].enable)?'':'red'
                    }
                  },
                  getEnable(params.row.alertRules.length == 0?undefined:params.row.alertRules[0].enable)
                ),
                h('RadioGroup', {
                  attrs:{
                    class:'select'+params.row.thingCode
                  },
                  style:{
                    display:"none",
                    width:"90%",
                    margin:"0 auto"
                  },
                  props: {
                    value: params.row.alertRules[0].enable?"启用":"停用",
                  },
                  on: {
                    'on-change': (val) => {
                      params.row.commit = true;
                      if(val == '启用'){
                        params.row.alertRules[0].enable = true;
                      }else{
                        params.row.alertRules[0].enable = false;
                      }
                    }
                  }
                },[
                  h('Radio', {
                    props: {
                      label: this.radios[0].label
                    }
                  }, this.radios[0].label),
                  h('Radio', {
                    props: {
                      label: this.radios[1].label
                    }
                  }, this.radios[1].label)
                ])
              ])
            },
            width: 140,
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  attrs:{
                      id:'button' + params.row.thingCode
                  },
                  props: {
                    type: 'text',
                    size: 'small',
                    icon:'compose'
                  },
                  style: {
                    color:'#2c9ae8',
                  },
                  on: {
                    click: () => {
                      var this_obj = this;
                      if(this_obj.editing && !params.row.isEditable){
                        this_obj.$Message.info("请确认提交刚才的操作");
                      }else{
                        this_obj.editing = true
                        $('#button'+params.row.thingCode+' span').html('提交');
                        var spanName = 'span'+params.row.thingCode;
                        var selectName = 'select'+params.row.thingCode;
                        if(params.row.commit){
                          var node = params.row.alertRules;
                          var url = '/alarm/alert/rule?type=1';
                          this_obj.$http.post(url,node).then(res => {
                            if(res.data.code == 0){
                              params.row.commit = false;
                              this_obj.editing = false;
                              this_obj.init();
                            }else{
                              this_obj.$Message.info(res.data.errorMsg);
                            }
                          }, res => {
                            console.info(res);
                          });
                        }else{
                          params.row.isEditable = !params.row.isEditable;
                          this_obj.editing = false
//                          this_obj.init();
                        }
                        if(params.row.isEditable){
                          $("."+spanName)[0].style.display = 'none';
                          $("."+selectName)[0].style.display = 'block';
                          $("."+spanName)[1].style.display = 'none';
                          $("."+selectName)[1].style.display = 'block';
                        }else{
                          $('#button'+params.row.thingCode+' span').html('编辑');
                          $("."+spanName)[0].style.display = 'block';
                          $("."+selectName)[0].style.display = 'none';
                          $("."+spanName)[1].style.display = 'block';
                          $("."+selectName)[1].style.display = 'none';
                        }
                      }
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ],
        sortType:null,
        currentPage:1,
        pageSize:6,
        pages:null,
        currentData:[],
        postData:{},
        loading:true,
        editModel:false,
        selectLevel:"",
        selectEnable:"",
        selected:[],
        searchInfo:"",
        showList:false,
        currentDevices:[],
        haveSelectAss:true,
        table_isLoading:false
      }
    },
    created () {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.table_isLoading = true;
      var this_obj = this;
      this_obj.assetTypes = JSON.parse(localStorage.getItem("assetTypes"));
//      this_obj.categories = JSON.parse(localStorage.getItem("categories"));
      this_obj.systems = JSON.parse(localStorage.getItem("systems"));
      this_obj.currAssetType = this_obj.assetTypes[0];
      this_obj.currSystem = this_obj.systems[0];
      this_obj.categories.push({'categoryName':'全部'});
      this_obj.currCategory = this_obj.categories[0];
      this_obj.currAlertLevel = this_obj.alertLevels[0];
      this_obj.getMetricCodes();
      this_obj.getBuildings();
      this_obj.init()
    },
    computed: {
      copyData: function () {
        var obj={};
        obj=JSON.parse(JSON.stringify(this.postData)); //this.templateData是父组件传递的对象
        return obj
      }
    },
    methods: {
      init(){
        var this_obj = this;
        var url = '/alarm/alert/rule/prot/show';
        var postData = {
          page:this.currentPage - 1,
          alertType:"P",
          count:this_obj.pageSize
        }
//        资产类别
        if(this_obj.currAssetType.alias != undefined){
          postData.assetType = this_obj.currAssetType.alias;
        }
//        设备/部件类型
        if(this_obj.currCategory.code != undefined){
          postData.category = this_obj.currCategory.code;
        }
//        安装位置
        if(this_obj.currBuilding.id != undefined){
          postData.buildingId = this_obj.currBuilding.id;
        }
//        所属系统
        if(this_obj.currSystem.id != undefined){
          postData.system = this_obj.currSystem.id;
        }
//        报警等级
        if(this_obj.currAlertLevel.level != undefined){
          postData.level = this_obj.currAlertLevel.level;
        }
//        信号名称
        if(this_obj.currMetricCode.metricCode !=undefined){
          postData.metricCode = this_obj.currMetricCode.metricCode;
        }
//        排序方式
        if(this_obj.sortType != undefined){
          postData.sortType = this_obj.sortType;
        }
//        设备编号
        if(this_obj.searchInfo){
          postData.thingCode = this_obj.searchInfo;
        }
        this.postData = postData;
        this.getPages();
        this.$http.post(url,postData).then(res => {
          this_obj.table_isLoading = false;
          if(res.data.code == 0){
            this_obj.currentData = res.data.obj.thingAlertRules;
          }else{
            this.$Message.info(res.data.errorMsg);
          }
        }, res => {
          console.info(res);
        });
      },
      getPages(){
        var this_obj =this;
        var postData = this.copyData;
        postData.page = 0;
        postData.count = 10000;
        this_obj.$http.post('/alarm/alert/rule/prot/show',postData).then(res => {
          if(res.data.code == 0){
            var totalPage = res.data.obj.thingAlertRules.length;
            this_obj.pages = Math.ceil(totalPage / this_obj.pageSize);
          }else{
            this_obj.$Message.info(res.data.errorMsg);
          }
        }, res => {
          console.info(res);
        });
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
        this_obj.$http.get('/api/thing/metric/assetAndCategory',{params:request}).then((response) => {
          if(response.data.code >= 0){
            this_obj.metricCodes = response.data.obj;
            this_obj.metricCodes.splice(0,0,{'metricName':'全部'});
            this_obj.currMetricCode = this_obj.metricCodes[0];
          }else{
            this_obj.$Message.info(response.data.errorMsg);
          }
        }, (response) => {
          this_obj.$Message.info("获取信号列表失败");
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
              this.$Message.info(response.data.errorMsg);
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
//          this.$Message.info("请选择资产类型后，再选择设备/部件类型");
        }
      },
      changeCategory(){
        this.currMetricCode = {}
        this.getMetricCodes();
      },
      getBuildings(){
        var this_obj = this;
        this_obj.$http.get('/api/thing/building').then((response) => {
          if(response.data.code >= 0){
            this_obj.buildings = response.data.obj;
            this_obj.buildings.splice(0,0,{'buildingName':'全部'});
            this_obj.currBuilding = this_obj.buildings[0];
            let x = {};
            for (let i of this_obj.buildings) {
              x[i.id] = i.buildingName;
            }
            localStorage.setItem("buildings", JSON.stringify(x));
          }else{
            this_obj.$Message.info(response.data.errorMsg);
          }
        }, (response) => {
          this_obj.$Message.info("获取建筑列表失败");
        });
      },
      search(){
       this.currentData = [];
        this.table_isLoading = true;
        var this_obj = this;
        this_obj.currentPage = 1
        this_obj.loading = true;
        this_obj.init();
      },
      showPop(){
        var this_obj = this;
        this_obj.popVisible = true;
      },
      selectPage(num){
        if(num <= 1){
          num =1;
        }else if(num >= this.pages){
          num = this.pages;
        }
        var this_obj = this;
        this_obj.currentPage = num;
        this_obj.init();
      },
      sortBy(msg){
        var this_obj = this;
        this_obj.popVisible = !this_obj.popVisible;
        this_obj.sortType = msg;
        this_obj.search();
      },
      configure(){
          if(this.selected.length > 0){
            this.editModel = true;
          }else{
            this.$Message.info("您并未选中任何设备!请重新选择");
          }
      },
      selectRows(selection){
        var this_obj = this ;
        this_obj.selected=[]
        selection.forEach(function(item){
          this_obj.selected.push(item)
        });
      },
      confirmEdit(){
        var this_obj = this ;
        var url = '/alarm/alert/rule?type=1';
        if(this_obj.selectLevel == '蓝色报警'){
          var selectLevel = 10;
        }else if(this_obj.selectLevel == '紫色报警'){
          var selectLevel = 20;
        }else if(this_obj.selectLevel == '黄色报警'){
          var selectLevel = 30;
        }else{
          this_obj.$Message.info("请设置报警等级");
          return;
        }
        if(this_obj.selectEnable == '启用'){
          var selectEnable = true;
        }else if(this_obj.selectEnable == '停用') {
          var selectEnable = false;
        }else{
          this_obj.$Message.info("请设置启用状态");
          return;
        }
        var postData = [];
        this_obj.selected.forEach(function (item) {
          var node = {}
          node.id = item.alertRules[0].id;
          node.alertLevel = selectLevel;
          node.enable = selectEnable;
          postData.push(node);
        })
        this_obj.$http.post(url,postData).then(res => {
          if(res.data.code == 0){
            this_obj.init();
            this_obj.editModel = false;
          }else{
            this_obj.$Message.info(res.data.errorMsg);
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
      },
      inputSearchInfo(){
        var this_obj = this;
        if(this_obj.searchInfo != undefined && this_obj.searchInfo.length >= 3){
          var query={};
          query.thingStartCode = this_obj.searchInfo;
          this_obj.currentDevices=[];
          this_obj.$http.get('/api/thing/assetAndCategory',{params:query}
          ).then((response) => {
            if(response.data.code >= 0){
              if(response.data.obj.length > 4){
                response.data.obj.splice(4);
                this_obj.currentDevices = response.data.obj
              }else{
                this_obj.currentDevices = response.data.obj
              }
            }else{
              this_obj.$Message.info(response.data.errorMsg);
            }
          }, (response) => {
            this_obj.$Message.info("获取设备列表失败");
          });
        }else{
          this_obj.currentDevices = [];
        }
      },
      selectCode(thing){
        this.searchInfo = thing.thingCode;
        this.currentDevices = [];
        this.showList = false
      },
      searchByExact(){
        var this_obj = this
        this_obj.currentPage = 1
        this_obj.init();
      }
    }
  }
  function getAssetType(input) {
    switch (input){
      case"DEVICE":return "设备";break;
      case"PARTS":return "部件";break;
      case"VALVE":return "阀门";break;
      case"METER":return "仪表";break;
      default: return input;
    }
  }
  function getAlertLevel(input) {
    switch (input){
      case 10:return "蓝色报警";break;
      case 20:return "紫色报警";break;
      case 30:return "黄色报警";break;
      default: return "未配置等级";
    }
  }
  function getEnable(input) {
    if(input){
      return "启用"
    }else{
      return "停用"
    }
  }
  function getBuildingName(i) {
    return JSON.parse(window.localStorage.buildings)[i];
  }
</script>

