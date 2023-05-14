/**
 * 敏感词分页查询
 */
export interface getCode {
  /**
   * 单词
   */
  code?: string
  /**
   * 每页多少条
   */
  pageNum: number
  /**
   * 第几页
   */
  pageSize: number
}
