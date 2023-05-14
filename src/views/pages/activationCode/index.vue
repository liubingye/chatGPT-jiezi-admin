<script setup lang="ts">
import { NButton, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns, FormItemRule, FormRules } from 'naive-ui'
import type { IPageActivationWordVO } from './types/types'
import api from './api'
import { CrudTable, QueryBarItem } from '@/components/index.js'
import { formatDateTime } from '@/utils'

const $table = ref<any>(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref<any>({})
/** 补充参数（可选） */
const extraParams = ref<any>({})
// 是否启用
// const loading = ref(false)
const columns: DataTableColumns<IPageActivationWordVO> = [

  { title: 'ID', key: 'id', width: 80, ellipsis: { tooltip: true } },
  { title: '激活码', key: 'code', width: 150, ellipsis: { tooltip: true } },
  {
    title: '状态',
    key: 'status',
    width: 60,
    render(row) {
      return h(
        NTag,
        {
          type: row.status === 0 ? 'success' : row.status === 1 ? 'info' : '',
        },
        {
          default: () => { return row.status === 0 ? '未分发' : row.status === 1 ? '未激活' : '已使用' },
        },
      )
    },
  },
  {
    title: '创建时间',
    key: 'genTime',
    width: 150,
    render(row) {
      return h('span', formatDateTime(row.genTime))
    },
  },
  {
    title: '有效期',
    key: 'validityPeriod',
    width: 150,
    render(row) {
      return h('span', `${row.validityPeriod}月`)
    },
  },
  // {
  //   title: '启用',
  //   key: 'isEnabled',
  //   width: 90,
  //   render(row) {
  //     return h(
  //       NSwitch,
  //       {
  //         rubberBand: false,
  //         checkedValue: 1,
  //         uncheckedValue: 0,
  //         value: row.isEnabled,
  //         loading: loading.value,
  //         onUpdate: value,
  //       },
  //     )
  //   },
  // },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => handleDistribute(row),
          disabled: row.status !== 0,
          class: 'action-btn',
        },
        { default: () => '分发并复制' },
      )
    },
  },
]
// 选中事件
function onChecked(rowKeys: string[]) {
  if (rowKeys.length)
    window.$message?.info(`选中${rowKeys.join(' ')}`)
}
const message = useMessage()
async function copyToClipboard(text: any): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    message.success(
      '复制成功',
    )
  }
  catch (error) {
    message.error(
      '复制失败请手动复制',
    )
  }
}
async function handleDistribute(row: object) {
  const res = await api.distributeCode({ id: Number(row.id) })
  if (res.code === 200)
    copyToClipboard(row.code)
  $table.value?.handleQuery()
}
// 模态框
const showModal = ref(false)
function handleOpenGenCode() {
  showModal.value = true
}
interface ModelType {
  count: number | null
  numMonths: number | null
}
const formRef = ref()
const model = ref({
  count: null,
  numMonths: null,
})
const rules: FormRules = {
  count: [{
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value)
        return new Error('请输入生成激活码个数')
      else if (!/^\d*$/.test(value))
        return new Error('个数应该为整数')
      else if (Number(value) <= 0)
        return new Error('激活码数量应该大于0个')
      return true
    },
    trigger: ['blur'],
  }],
  numMonths: [{
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value)
        return new Error('请输入激活码有效期（单位月）')
      else if (!/^\d*$/.test(value))
        return new Error('有效期应该为整数')
      else if (Number(value) <= 0)
        return new Error('月数应该大于0')
      return true
    },
    trigger: ['blur'],
  }],
}
const submitCallback = () => {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const res = await api.getGenCode(model.value)
      if (res.code === 200) {
        showModal.value = false
        $table.value?.handleSearch()
      }
    }
    else {
      message.error('验证失败')
    }
  })
}
onMounted(() => {
  $table.value?.handleSearch()
})
</script>

<template>
  <CommonPage show-footer title="激活码管理">
    <NButton type="info" style="margin-bottom: 20px;" @click="handleOpenGenCode">
      生成激活码
    </NButton>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.getActivationData"
      @on-checked="onChecked"
    >
      <template #queryBar>
        <QueryBarItem label="激活码" :label-width="80">
          <n-input
            v-model:value="queryItems.code"
            type="text"
            placeholder="请输入激活码"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="生成激活码设置"
      content="你确认?"
      positive-text="提交"
      negative-text="取消"
      @positive-click="submitCallback"
    >
      <div>
        <n-form ref="formRef" :model="model" :rules="rules">
          <n-form-item path="count" label="激活码个数">
            <n-input v-model:value="model.count" placeholder="请输入" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="numMonths" label="激活码有效期（月）">
            <n-input v-model:value="model.numMonths" placeholder="请输入" @keydown.enter.prevent />
          </n-form-item>
        </n-form>
      </div>
    </n-modal>
  </CommonPage>
</template>
