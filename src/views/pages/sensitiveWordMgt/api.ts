import type { getCode } from './types/apiTypes'
import { request } from '@/utils'

export default {
  getSensitiveWordData: (params: getCode) => request.get('/sensitive_word/page', { params }),
}
