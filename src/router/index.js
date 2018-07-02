import Vue from 'vue';
import Router from 'vue-router';
import startStop from '@/components/startStop';
import configuration from '@/components/startStop/configuration/configuration';
import config from '@/components/startStop/configuration/config';
import lineWithbag from '@/components/startStop/configuration/lineWithbag';
import bagWithdevice from '@/components/startStop/configuration/bagWithdevice';
//智能停车
import stopConfig from '@/components/startStop/stopConfig/stopConfig';
import bagConfig from '@/components/startStop/stopConfig/bagConfig';
import bagControl from '@/components/startStop/stopConfig/bagControl';
import bagEquipment from '@/components/startStop/stopConfig/bagEquipment';
import lineEquipment from '@/components/startStop/stopConfig/lineEquipment';

//启停分包
import subPackage from '@/components/startStop/subPackage/subPackage';
import regionOfArea from '@/components/startStop/subPackage/regionOfArea';
import areaOfBag from '@/components/startStop/subPackage/areaOfBag';
import subscription from '@/components/subscription/subscription';
import auth from '@/components/subscription/auth';

import warning from '@/components/warning/warning';
import stopStation from '@/components/stopStation';
import basic from '@/components/warning/basic';
import paraTypeMaintain from '@/components/warning/basic/paraTypeMaintain';
import paraTypeManage from '@/components/warning/basic/paraTypeManage';
import maintain from '@/components/warning/maintain';
import paraTypeAlert from '@/components/warning/maintain/paraTypeAlert';
import protectTypeAlert from '@/components/warning/maintain/protectTypeAlert';
import targetTypeAlert from '@/components/warning/maintain/targetTypeAlert';
import statisticalAnalysis from '@/components/warning/statisticalAnalysis';
import invalidAlarm from '@/components/warning/statisticalAnalysis/invalidAlarm';
import parameterOperating from '@/components/warning/statisticalAnalysis/parameterOperating';
import statisticsList from '@/components/warning/statisticalAnalysis/statisticsList';
import signal from '@/components/warning/maintain/configDeviceSignal';
import parameter from '@/components/warning/maintain/configDevicePara';
import editParameter from '@/components/warning/maintain/targetDevicePara';
import deviceList from '@/components/device/list'; //主菜单
import device from '@/components/device/device/device'; //二级设备管理菜单
import device2 from '@/components/device/device/deviceList'; //二级设备管理菜单
import field from '@/components/device/field/field'; //二级系统管理菜单
import fieldList from '@/components/device/field/fieldList'; //系统管理设备列表
import workshop from '@/components/device/device/building/workshop'; //设备管理-建筑设备-生产车间管理
import deport from '@/components/device/device/building/deport'; //设备管理-建筑设备-储煤仓总仓位管理
import meter from '@/components/device/device/electric/meter'; //设备管理-电气设备-仪表信息
import transformer from '@/components/device/device/electric/transformer'; //设备管理-电气设备-变压器信息
import deviceInfo from '@/components/device/device/machine/deviceInfo'; //设备管理-机械设备-设备信息
import partInfo from '@/components/device/device/machine/partInfo'; //设备管理-机械设备-部件信息
import valveInfo from '@/components/device/device/machine/valveInfo'; //设备管理-机械设备-设备信息
import pipeInfo from '@/components/device/device/machine/pipeInfo'; //设备管理-机械设备-设备信息
import flashboardInfo from '@/components/device/device/machine/flashboardInfo'; //设备管理-机械设备-设备信息
import chuteInfo from '@/components/device/device/machine/chuteInfo'; //设备管理-机械设备-设备信息
import editCopy from '@/components/task/editPage/editCopy';
// import fieldList from '@/components/device/field/fieldList';   //系统管理设备列表
import energy from '@/components/energy/energy';
import monitorAll from '@/components/energy/monitorAll';


//transform
import transform from '@/components/startStop/transform/subMenu';
import systemMaintain from '@/components/startStop/transform/systemMaintain';
import infoMaintain from '@/components/startStop/transform/infoMaintain';
import showDetail from '@/components/startStop/transform/showDetail';
import cn from 'vee-validate/dist/locale/zh_CN';
import monitor from '@/components/monitor';
import authority from '@/components/authority';
import monitorConfig from '@/components/monitor/config';
import monitorInfoConfig from '@/components/monitor/infoConfig';
import monitorinfoManage from '@/components/monitor/infoManage';
import monitorstyleManage from '@/components/monitor/styleManage';
import systemManage from '@/components/systemManage/systemManage';
import department from '@/components/systemManage/department';
import testSelect from '@/components/systemManage/testSelect';
import testInput from '@/components/systemManage/testInput';
import employee from '@/components/systemManage/employee';
import station from '@/components/systemManage/station';
import deviceManage from '@/components/device/manage/deviceManage';
import task from '@/components/task/task';
import order from '@/components/task/order';
import feedbackType from '@/components/task/feedbackType';
import feedbackDataUnit from '@/components/task/feedbackDataUnit';
import feedbackDataContent from '@/components/task/feedbackDataContent';
import hiddenUnits from '@/components/task/hiddenUnits';
import locationOfHidden from '@/components/task/locationOfHidden';
import issueList from '@/components/task/issueList';
import developerDefault from '@/components/task/developerDefault';
import fourOrder from '@/components/task/editPage/fourOrder';
import repairOrder from '@/components/task/editPage/repairOrder';
import productOrderEdit from '@/components/task/editPage/productOrderEdit';
import productOrder from '@/components/task/productOrder';
import reminder from '@/components/task/reminder';
import temporder from '@/components/task/editPage/temporder';
import editProduction from '@/components/task/editPage/editProduction';
import updateReminder from '@/components/task/editPage/updateReminder';
import editReminder from '@/components/task/editPage/editReminder';
//密控
import keyControl from '@/components/keyControl/keyControl';
import conformConfig from '@/components/keyControl/conformConfig';
import mainConfig from '@/components/keyControl/mainConfig';
import againConfig from '@/components/keyControl/againConfig';
import TCSConfig from '@/components/keyControl/TCSConfig';
import editConfirm from '@/components/keyControl/editConfirm';


import VeeValidate, {
  Validator
} from 'vee-validate';


//reportForm
import reportForm from '@/components/reportForm/list'
import account from '@/components/reportForm/account'
import daily from '@/components/reportForm/daily'


Validator.localize('cn', cn); //中文
const configVeeValidate = {
  fieldsBagName: 'vee-fields', // 默认为 fields
};
Vue.use(VeeValidate, configVeeValidate);
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/energy',
      name: 'energy',
      component: energy,
      children: [{
        path: '/energy/monitorAll',
        name: 'monitorAll',
        component: monitorAll
      }]
    },
    {
      path: '/startStop',
      name: 'startStop',
      component: startStop,
      children: [{
        path: '/startStop/subPackage',
        name: 'subPackage',
        component: subPackage,
        children: [{
            path: '/startStop/subPackage/regionOfArea',
            name: 'regionOfArea',
            component: regionOfArea,

          },
          {
            path: '/startStop/subPackage/regionOfArea/areaOfBag',
            name: 'areaOfBag',
            component: areaOfBag
          }
        ]
      }, {
        path: '/startStop/transform',
        name: 'transform',
        component: transform,
        children: [{
            path: '/startStop/transform/systemMaintain',
            name: 'systemMaintain',
            component: systemMaintain
          },
          {
            path: '/startStop/transform/infoMaintain',
            name: 'infoMaintain',
            component: infoMaintain
          },
          {
            path: '/startStop/transform/infoMaintain/showDetail',
            name: 'showTransformerDetail',
            component: showDetail
          }
        ]
      }, {
        path: '/startStop/configuration',
        name: 'configuration',
        component: configuration,
        children: [{
            path: '/startStop/configuration/config',
            name: 'config',
            component: config,
          },
          {
            path: '/startStop/configuration/lineWithbag',
            name: 'lineWithbag',
            component: lineWithbag,
          },
          {
            path: '/startStop/configuration/bagWithdevice',
            name: 'bagWithdevice',
            component: bagWithdevice,
          }
        ]

      },
        {
          path: '/startStop/stopConfig',
          name: 'stopConfig',
          component: stopConfig,
          children: [
            {
              path: '/startStop/stopConfig/bagConfig',
              name: 'bagConfig',
              component: bagConfig,
            },
            {
              path: '/startStop/stopConfig/bagControl',
              name: 'bagControl',
              component: bagControl,
            },
            {
              path: '/startStop/stopConfig/bagEquipment',
              name: 'bagEquipment',
              component: bagEquipment,
            },
            {
              path: '/startStop/stopConfig/lineEquipment',
              name: 'lineEquipment',
              component: lineEquipment,
            }
          ]
        },
      ]
    },
    {
      path: '/subscription',
      name: 'subscription',
      component: subscription,
      children: [{
          path: '/subscription/auth',
          component: auth
        }
      ]
    },
    {

      path: '/warning',
      name: 'warning',
      component: warning,
      children: [{
          path: '/warning/basic',
          name: 'basic',
          component: basic,
          children: [{
              path: '/warning/basic/paraTypeMaintain',
              name: 'paraTypeMaintain',
              component: paraTypeMaintain,
            },
            {
              path: '/warning/basic/paraTypeManage',
              name: 'paraTypeManage',
              component: paraTypeManage,
            }
          ]
        },
        {
          path: '/warning/maintain',
          name: 'maintain',
          component: maintain,
          children: [{
              path: '/warning/maintain/paraTypeAlert',
              name: 'paraTypeAlert',
              component: paraTypeAlert,
            },
            {
              path: '/warning/maintain/protectTypeAlert',
              name: 'protectTypeAlert',
              component: protectTypeAlert,
            },
            {
              path: '/warning/maintain/targetTypeAlert',
              name: 'targetTypeAlert',
              component: targetTypeAlert,
            },
            {
              path: '/warning/maintain/editParameter',
              name: 'editParameter',
              component: editParameter,
            },
            {
              path: '/warning/maintain/paraTypeAlert/signal',
              name: 'signal',
              component: signal,
            },
            {
              path: '/warning/maintain/paraTypeAlert/parameter',
              name: 'parameter',
              component: parameter,
            },
            {
              path: '/warning/maintain/paraTypeAlert/stopStation',
              name: 'stopStation',
              component: stopStation,
            }
          ]
        },
        {
          path: '/warning/statisticalAnalysis',
          name: 'statisticalAnalysis',
          component: statisticalAnalysis,
          children: [{
              path: '/warning/statisticalAnalysis/parameterOperating',
              name: 'parameterOperating',
              component: parameterOperating,
            },
            {
              path: '/warning/statisticalAnalysis/invalidAlarm',
              name: 'invalidAlarm',
              component: invalidAlarm,
            },
            {
              path: '/warning/statisticalAnalysis/statisticsList',
              name: 'statisticsList',
              component: statisticsList,
            }
          ]
        }
      ]
    },
    {
      path: '/device',
      name: 'deviceList',
      component: deviceList,
      children: [
        // {
        //     path: '/device/deviceList/:deviceId',
        //     name: 'device',
        //     component: device,
        //   },
        {
          path: "/device/fieldList/:tagId",
          name: 'fieldList',
          component: fieldList,
        },
        // {
        //   path: '/device/deviceList2/:deviceId',
        //   name: 'device2',
        //   component: device2
        // },
        // {
        //   path: '/device/deviceManage',
        //   component: deviceManage
        // },
        //设备管理
        //一、机械设备
        //设备信息
        {
          path: '/device/equipment',
          name: 'equipment'
        },
        {
          path: '/device/equipment/machine/deviceInfo/:tagId',
          name: 'deviceInfo',
          component: deviceInfo
        },
        //部件信息
        {
          path: '/device/equipment/machine/partInfo/:tagId',
          name: 'partInfo',
          component: partInfo
        },
        //某个设备的部件信息
        {
          path: '/device/equipment/machine/partInfo/:tagId/:deviceId',
          name: 'partInfo',
          component: partInfo
        },
        //阀门信息
        {
          path: '/device/equipment/machine/valveInfo/:tagId',
          name: 'valveInfo',
          component: valveInfo
        },
        //管道信息
        {
          path: '/device/equipment/machine/pipeInfo/:tagId',
          name: 'pipeInfo',
          component: pipeInfo
        },
        //闸板信息
        {
          path: '/device/equipment/machine/flashboardInfo/:tagId',
          name: 'pipeInfo',
          component: flashboardInfo
        },
        //溜槽信息
        {
          path: '/device/equipment/machine/chuteInfo/:tagId',
          name: 'chuteInfo',
          component: chuteInfo
        },
        //二、电气设备
        {
          path: '/device/equipment/electric/meter/:tagId',
          name: 'meter',
          component: meter
        },
        {
          path: '/device/equipment/electric/transformer/:tagId',
          name: 'transformer',
          component: transformer
        },
        //三、建筑设备
        {
          path: '/device/equipment/building/workshop/:tagId',
          name: 'workshop',
          component: workshop
        },
        {
          path: '/device/equipment/building/deport/:tagId',
          name: 'deport',
          component: deport
        }
      ]
    },
    {
      path: '/task',
      name: 'task',
      component: task,
      children: [{
          path: "/task/order",
          name: 'order',
          component: order
        }, {
          path: '/task/productOrder',
          name: 'productOrder',
          component: productOrder
        },
        {
          path: '/task/feedbackType',
          name: 'feedbackType',
          component: feedbackType
        },
        {
          path: '/task/feedbackDataUnit',
          name: 'feedbackDataUnit',
          component: feedbackDataUnit
        },
        {
          path: '/task/feedbackDataContent',
          name: 'feedbackDataContent',
          component: feedbackDataContent
        },
        {
          path: '/task/hiddenUnits',
          name: 'hiddenUnits',
          component: hiddenUnits
        },
        {
          path: '/task/locationOfHidden',
          name: 'locationOfHidden',
          component: locationOfHidden
        },
        {
          path: "/task/issueList",
          name: "issueList",
          component: issueList
        },
        {
          path: "/task/developerDefault",
          name: "developerDefault",
          component: developerDefault
        },
        {
          path: '/task/order/fourOrder',
          name: "fourOrder",
          component: fourOrder
        },
        {
          path: '/task/order/repairOrder',
          name: "repairOrder",
          component: repairOrder
        },
        {
          path: '/task/order/productOrderEdit',
          name: "productOrderEdit",
          component: productOrderEdit
        },
        {
          path: '/task/order/tempOrder',
          name: "tempOrder",
          component: temporder
        },
        {
          path: '/task/editProduction',
          name: "editProduction",
          component: editProduction
        },
        {
          path: '/task/editCopy',
          name: "editCopy",
          component: editCopy
        },
        {
          path: "/task/reminder",
          name: "reminder",
          component: reminder
        },
        {
          path: "/task/editReminder",
          name: "editReminder",
          component: editReminder
        },
        {
          path: '/task/updateReminder',
          name: "updateReminder",
          component: updateReminder
        }
      ]
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: monitor,
      children: [{
          path: '/monitor/infoManage',
          name: 'monitorinfoManage',
          component: monitorinfoManage,
        },
        {
          path: '/monitor/infoConfig',
          name: 'monitorInfoConfig',
          component: monitorInfoConfig,
        },
        {
          path: '/monitor/styleManage',
          name: 'monitorstyleManage',
          component: monitorstyleManage,
        },
        {
          path: '/monitor/config',
          name: 'monitorConfig',
          component: monitorConfig,
        }
      ]
    },
    {
      path: '/authority',
      name: 'authority',
      component: authority,
    },
    {
      path: '/systemManage',
      name: 'systemManage',
      component: systemManage,
      children: [{
          path: '/systemManage/department',
          name: 'department',
          component: department,
        },
        {
          path: '/systemManage/employee',
          name: 'employee',
          component: employee,
        },
        {
          path: '/systemManage/station',
          name: 'station',
          component: station,
        },
        {
          path: '/systemManage/test',
          name: 'testSelect',
          component: testSelect,
        },
        {
          path: '/systemManage/testInput',
          name: 'testInput',
          component: testInput,
        },
      ]
    },
    {
      path: '/reportForm',
      name: 'reportForm',
      component: reportForm,
      children: [
        {
          path: '/reportForm/account',
          name: 'account',
          component: account,
        },
        {
          path: '/reportForm/daily',
          name: 'daily',
          component: daily,
        }
      ]
    },
    {
      path: '/keyControl',
      name: 'keyControl',
      component: keyControl,
      children: [{
        path: "/keyControl/conformConfig",
        name: 'conformConfig',
        component: conformConfig,
      },{
        path: "/keyControl/mainConfig",
        name: 'mainConfig',
        component: mainConfig
      },{
          path: "/keyControl/againConfig",
          name: 'againConfig',
          component: againConfig
        },
        {
          path: "/keyControl/TCSConfig",
          name: 'TCSConfig',
          component: TCSConfig
        },{
          path: "/keyControl/editConfirm",
          name: 'editConfirm',
          component: editConfirm
        }
      ]
    },

  ]
})
