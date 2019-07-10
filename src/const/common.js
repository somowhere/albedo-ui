/*ture 网关模式， false 普通模式*/
/*** 返回消息类型 info */
export const MSG_TYPE_INFO = 0
/*** 返回消息类型 success */
export const MSG_TYPE_SUCCESS = 1
/*** 返回消息类型 warning */
export const MSG_TYPE_WARNING = 2
/*** 返回消息类型 error */
export const MSG_TYPE_ERROR = -1


/*** 否 */
export const SYS_NO = 0
/*** 是 */
export const SYS_YES = 1


export const DATA_STATUS = {
  "正常": { 'title': 'Success', 'class': ' m-badge--success' },
  "审核": { 'title': 'Info', 'class': ' m-badge--info' },
  "删除": { 'title': 'Danger', 'class': ' m-badge--danger' },
  "失效": { 'title': 'Warning', 'class': ' m-badge--warning' },
}

export const DICT_SYS_DATA = {
  "是": { 'class': ' m-badge--info' },
  "否": { 'class': ' m-badge--warning' },
}
