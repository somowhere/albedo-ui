import Mock from 'mockjs'

export default ({mock}) => {
  if (!mock) return;
  Mock.mock('/sys/dict/codes', 'get', (res) => {
    return {
      data: {
        "sys_online_status": [{"value": "on_line", "label": "在线", "version": 0}, {
          "value": "off_line",
          "label": "离线",
          "version": 0
        }],
        "sys_menu_type": [{"value": "0", "label": "菜单", "version": 4}, {
          "value": "1",
          "label": "按钮",
          "version": 4
        }, {"value": "2", "label": "tab按钮", "version": 4}],
        "sys_operator_type": [{"value": "0", "label": "其他", "version": 2}, {
          "value": "1",
          "label": "后台用户",
          "version": 2
        }, {"value": "2", "label": "手机端用户", "version": 2}],
        "sys_business_type": [{"value": "0", "label": "其他", "version": 3}, {
          "value": "1",
          "label": "编辑",
          "version": 2
        }, {"value": "2", "label": "锁定", "version": 2}, {"value": "3", "label": "删除", "version": 2}, {
          "value": "4",
          "label": "导出",
          "version": 2
        }, {"value": "5", "label": "导入", "version": 2}, {"value": "6", "label": "强退", "version": 2}, {
          "value": "7",
          "label": "生成代码",
          "version": 2
        }],
        "sys_data_scope": [{"value": "1", "label": "全部", "version": 7}, {
          "value": "2",
          "label": "所在机构及以下数据",
          "version": 7
        }, {"value": "3", "label": "所在机构数据", "version": 7}, {
          "value": "4",
          "label": "仅本人数据",
          "version": 5
        }, {"value": "5", "label": "按明细设置", "version": 5}],
        "sys": [{"value": "", "label": "是否标识", "version": 17}, {
          "value": null,
          "label": "操作人类别",
          "version": 6
        }, {"value": "", "label": "数据范围", "version": 16}, {
          "value": null,
          "label": "业务操作类型",
          "version": 17
        }, {"value": "", "label": "菜单类型", "version": 8}, {"value": null, "label": "在线状态", "version": 2}],
        "base": [{"value": "biz", "label": "业务数据", "version": 4}, {"value": "sys", "label": "系统数据", "version": 19}],
        "sys_flag": [{"value": "1", "label": "是", "version": 5}, {"value": "0", "label": "否", "version": 6}]
      }
    }
  })
  Mock.mock('/sys/role/?current=1&size=20&queryConditionJson=[]', 'get', (res) => {
    return {
      data: {
        "records": [
          {
            "createdBy": "",
            "createdDate": "2017-10-29 15:45:51",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-13 22:39:46",
            "version": 52,
            "description": null,
            "id": "1",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "全部",
            "dataScope": "1",
            "name": "管理员",
            "code": "ROLE_ADMIN",
            "remark": "管理员"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          },
          {
            "createdBy": "",
            "createdDate": "2018-11-11 19:42:26",
            "lastModifiedBy": "1",
            "lastModifiedDate": "2019-08-07 18:00:54",
            "version": 8,
            "description": null,
            "id": "2",
            "availableText": "是",
            "available": "1",
            "dataScopeText": "按明细设置",
            "dataScope": "5",
            "name": "ROLE_CQQ",
            "code": "ROLE_CQQ",
            "remark": "ROLE_CQQ"
          }
        ],
        "total": 2,
        "size": 20,
        "current": 1,
        "orders": [],
        "queryConditionJson": "[]",
        "searchCount": true,
        "pages": 1
      }
    }
  })
 /*/auth/oauth/token?sfads*/
  Mock.mock(RegExp('/auth/oauth/token' + ".*"), 'post', (res) => {
    return {
      "access_token": "55ba1e92-cc5b-42ff-a7f1-cdfe549c600f",
      "token_type": "bearer",
      "refresh_token": "720f44eb-5275-44b5-aab9-d142da3cfab6",
      "expires_in": 43199,
      "scope": "server",
      "license": "made by albedo"
    }
  })

}
