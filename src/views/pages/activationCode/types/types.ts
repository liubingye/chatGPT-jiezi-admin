/**
 * 响应结果
 */
export interface ApifoxModel {
  /**
   * 状态码
   */
  code?: number
  data?: IPageActivationWordVO
  /**
   * 返回消息
   */
  message?: string
  /**
   * 状态字符串
   */
  status?: number
}

/**
* 承载数据
*/
export interface IPageActivationWordVO {
  isEnabled: number
  genTime?: Date
  validityPeriod: any
  status: number
  current?: number
  pages?: number
  records?: ActivationWordVO[]
  size?: number
  total?: number
}

/**
* 激活码展示参数
*/
export interface ActivationWordVO {
  /**
   * 主键
   */
  id?: number
  /**
   * 激活码
   */
  code?: string
  /**
   * 状态 0 未分发未使用 1 已分发未激活 2 已使用
   */
  status?: RecordStatus
  /**
   * 生成时间
   */
  genTime?: Date
  /**
   * 有效期
   */
  validityPeriod?: number
}

/**
* 状态 1 启用 2 停用
*/
export enum RecordStatus {
  The1 = 0,
  The2 = 1,
  The3 = 2,
}

/**
* 状态字符串
*/
export enum ApifoxModelStatus {
  Fail = 'Fail',
  Success = 'Success',
  Unauthorized = 'Unauthorized',
}
