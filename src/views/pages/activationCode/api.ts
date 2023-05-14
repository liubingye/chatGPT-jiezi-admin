import type { getChatWord, getId, getGenCodeModel } from './types/apiTypes'
import { request } from '@/utils'

export default {
  getActivationData: (params: getChatWord) => request.get('/activation_code/page', { params }),
  distributeCode: (data: getId) => request.post('/activation_code/distribute', data),
  getGenCode: (data: getGenCodeModel) => request.post('/activation_code/gen_code', data),
}
