import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'activationCode',
  path: '/activationCode',
  component: Layout,
  redirect: '/activationCode/index',
  meta: {
    order: 4,
  },
  children: [
    {
      name: 'activationCodeIndex',
      path: 'index',
      component: () => import('./index.vue'),
      meta: {
        title: '激活码管理',
        icon: 'akar-icons:chat-dots',
      },
    },
  ],
} as RouteType
