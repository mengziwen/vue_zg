<!--Author:wangyajie-->
<template>
  <div class="paraTypeAlert">
    <div class="content-title">
      <div>参数类报警维护</div>
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
          <select name="category" v-model="currCategory" @click="selCate()" :disabled="!haveSelectAss" @change="changeCategory()">
            <option v-for="x in categories" v-bind:value="x" v-bind:style="{display:x.code?'block':'none'}">{{x.categoryName}}</option>
          </select>
          <span v-show="!haveSelectAss" class="is-danger errorTip">请选择资产类型后，再选择设备/部件类型</span>
          <div class="mask" v-show="!haveSelectAss" @click="haveSelectAss = true" style="z-index: 11111;"></div>
          <div class="line"></div>
        </div>
      </Col>
      <Col span="8" class="system">
        <label for="system">所属系统：</label>
        <div class="selects" >
          <select name="system" v-model="currSystem" >
            <option v-for="x in systems" v-bind:value="x">{{x.systemName}}</option>
          </select>
          <div class="line"></div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="8" class="metricType">
      <label for="metricType">参数类型：</label>
      <div class="selects">
        <select name="metricType" v-model="currMetricType">
          <option v-for="x in metricTypes" v-bind:value="x">{{x.categoryName}}</option>
        </select>

        <div class="line"></div>
      </div>
      </Col>
      <Col span="16">
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
          <Button type="primary" shape="circle" @click="routerGo()" style="height: 24px;font-size: 14px;padding: 1px 15px;background-color:#2c9ae8">
            <Icon type="plus-round" size="14" ></Icon>
            配置设备信号
          </Button>
        </div>
      </Col>
    </Row>
    <!--<p class="noDevice" v-if="allData.length == 0">系统暂时无匹配数据，请更换条件</p>-->
    <Table  ref="selection" :columns="columns" :time="1000"  :data="allData" ></Table>

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
      <Col class="demo-spin-col" span="8" style="left: 33.5%;">
      <Spin fix>
        <Icon type="load-c" size=34 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      </Col>
    </row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        popVisible:false,
        assetTypes:[
          {
            assetType:"全部"
          },
          {
            assetType:"设备",
            alias:"DEVICE"
          },
          {
            assetType:"部件",
            alias:"PARTS"
          },
          {
            assetType:"阀门",
            alias:"VALVE"
          },
          {
            assetType:"仪表",
            alias:"METER"
          }
        ],
        categories:[],
        systems:[],
        metricTypes:[],
        currAssetType:{},
        currCategory:{},
        currSystem:{},
        currMetricType:{},
        sortType:null,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '设备编号',
            key: 'thingCode',
            ellipsis:true
          },
          {
            title: '设备名称',
            key: 'thingName',
            ellipsis:true
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
            key: 'categoryName',
            ellipsis:true
          },
          {
            title: '所属系统',
            key: 'systemName',
            ellipsis:true
          },
          {
            title: '参数类型',
            key: 'metricTypeName',
            ellipsis:true
          },
          {
            title: '信号名称',
            key: 'metricName',
            ellipsis:true
          },
          {
            title: '报警阈值',
            key: 'thresholdText',
            render: (h, params) => {
              return h('span',{
                  style:{
                      color:params.row.alertRules.length > 0?'':'red'
                  }
              },
                getThreshold(params.row.alertRules.length)
              )
            }

          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
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
                      this.$router.push({ name: 'parameter', params: { obj: params.row}})
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ],
        currentPage:1,
        pageSize:6,
        pages:null,
//        currentData:[],
        allData:[],
        postData:{},
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
      // this.$forceUpdate();
      var this_obj = this;
      this_obj.getSystems();
      this_obj.getMetricTypes();
      this_obj.currAssetType = this.assetTypes[0];
      localStorage.setItem("assetTypes", JSON.stringify(this.assetTypes));
      this_obj.categories.push({'categoryName':'全部'});
      this_obj.currCategory = this_obj.categories[0];
      this_obj.init();

//      this_obj.allData = this_obj.currentData;
    },
    computed: {
      copyData: function () {
        var obj={};
        obj=JSON.parse(JSON.stringify(this.postData)); //this.postData是父组件传递的对象
        return obj
      }
    },
    methods: {
      init(){
        var this_obj = this;
        var url = '/alarm/alert/rule/param/show';
        var postData = {
            page:this.currentPage - 1,
            count:this.pageSize,
            alertType:1
        }
        if(this_obj.currAssetType.alias){
          postData.assetType = this_obj.currAssetType.alias;
        }
        if(this_obj.currCategory.code){
          postData.category = this_obj.currCategory.code;
        }
        if(this_obj.currSystem.id){
          postData.system = this_obj.currSystem.id;
        }
        if(this_obj.currMetricType.code){
          postData.metricType = this_obj.currMetricType.code;
        }
        if(this_obj.sortType){
          postData.sortType = this_obj.sortType;
        }
        if(this_obj.searchInfo){
          postData.thingCode = this_obj.searchInfo;
        }
        this.postData = postData;
         this_obj.getPages();
        this_obj.$http.post(url,postData).then(res => {
          this_obj.table_isLoading = false;//hide the loading icon
          if(res.data.code == 0){

            this_obj.allData = res.data.obj.thingAlertRules;

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
        this_obj.$http.post('/alarm/alert/rule/param/show',postData).then(res => {
          if(res.data.code<0){
            this_obj.$Message.error('后台服务器异常，请联系管理员。');
          }
          if(res.data.code == 0){
            var totalPage = res.data.obj.thingAlertRules.length;
            this_obj.pages = Math.ceil(totalPage / this_obj.pageSize);
          }else{
            this_obj.$Message.info(res.data.errorMsg);
          }
        }).catch(error => {
          this_obj.GLOBAL.exception(error);
        });
      },
      getSystems(){
        //获取系统列表
        var this_obj = this;
        this_obj.$http.get('/api/thing/system').then((response) => {
          if(response.data.code >= 0){
            this_obj.systems = response.data.obj;
            this_obj.systems.splice(0,0,{'systemName':'全部'});
            localStorage.setItem("systems", JSON.stringify(this.systems));
            this_obj.currSystem = this_obj.systems[0];
          }else{
            // this_obj.$Message.info(response.data.errorMsg);
          }
        }, (response) => {
          this_obj.$Message.info("获取系统列表失败");
        });
      },
//      getCategories(){
//        //设备/部件类别列表
//        var this_obj = this;
//        this_obj.$http.get('/api/thing/category').then((response) => {
//          if(response.data.code >= 0){
//            this_obj.categories = response.data.obj;
//            this_obj.categories.splice(0,0,{'categoryName':'全部'});
//            localStorage.setItem("categories", JSON.stringify(this.categories));
//            this_obj.currCategory = this_obj.categories[0];
//          }else{
//            this_obj.$Message.info(res.data.errorMsg);
//          }
//        }, (response) => {
//          this_obj.$Message.info("获取设备/部件类别列表失败");
//        });
//      },
      getMetricTypes(){
        //指定参数类型列表
        var request = {};
        var this_obj = this;
        if(this_obj.currAssetType.alias){
          request.assetType = this_obj.currAssetType.alias;
        }
        if(this_obj.currCategory.code){
          request.category = this_obj.currCategory.code;
        }
        this_obj.$http.get('/api/thing/metricType/assetAndCategory',{params:request}).then((response) => {
          if(response.data.code >= 0){
            this_obj.metricTypes = response.data.obj;
            this_obj.metricTypes.splice(0,0,{'categoryName':'全部'});
            localStorage.setItem("metricTypes", JSON.stringify(this.metricTypes));
            this_obj.currMetricType = this_obj.metricTypes[0];
          }else{
            this_obj.$Message.info(response.data.errorMsg);
          }
        }, (response) => {
          this_obj.$Message.info("获取参数类型列表失败");
        });
      },
      changeAsset(){
        //获取指定资产类别下的设备/部件类别列表
        var this_obj = this;
        if(this_obj.currAssetType.alias){
          this_obj.haveSelectAss = true
          this_obj.getMetricTypes();
          this_obj.$http.get('/api/thing/category/asset',{
            params:{
              'assetType':this.currAssetType.alias
            }
          }).then((response) => {
            if(response.data.code >= 0){
              this_obj.categories = response.data.obj;
              this_obj.categories.splice(0,0,{'categoryName':'全部'})
              this_obj.currCategory = this.categories[0];
            }else{
              this_obj.$Message.info(response.data.errorMsg);
            }
          }, (response) => {
            this_obj.$Message.info("获取设备/部件类别列表失败");
          });
        }else{
          this_obj.categories = [];
          this_obj.categories.push({'categoryName':'全部'});
          this_obj.currCategory = this.categories[0];
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
        this.getMetricTypes();
      },
      routerGo(){
        this.$router.push('/warning/maintain/paraTypeAlert/signal')
      },
      showPop(){
          var this_obj = this;
          this_obj.popVisible = true;
      },
      search(){
        this.allData = [];
        this.table_isLoading = true;
        var this_obj = this;
        this_obj.currentPage = 1
        this_obj.init();
//        setTimeout(function () {
//          this_obj.allData = this_obj.currentData;
//          this_obj.loading = false;
//        },1000)
      },
      sortBy(msg){
        var this_obj = this;
        this_obj.popVisible = !this_obj.popVisible;
        this_obj.sortType = msg;
        this_obj.search();
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
//        setTimeout(function () {
//          this_obj.allData = this_obj.currentData;
//          this_obj.loading = false;
//        },1000)
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
//        setTimeout(function () {
//          this_obj.allData = this_obj.currentData;
//          this_obj.loading = false;
//        },1000)
      }
    }
  }
  function getAssetType(input) {
    switch (input){
      case"DEVICE":return "设备";break;
      case"PARTS":return "部件";break;
      case"VALVE":return "阀门";break;
      case"METER":return "仪表";break;
      default: return "暂无";
    }
  }
  function getThreshold(input) {
    if(input>0){
        return "已配置"
    }else{
        return "未配置数值"
    }
  }
</script>
