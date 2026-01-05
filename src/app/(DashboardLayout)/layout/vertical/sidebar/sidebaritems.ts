import { uniqueId } from 'lodash'

export interface ChildItem {
  id?: string
  name?: string
  icon?: string
  children?: ChildItem[]
  item?: unknown
  url?: string
  color?: string
  disabled?: boolean
  subtitle?: string
  badge?: boolean
  badgeType?: string
  badgeContent?: string
}

export interface MenuItem {
  heading?: string
  name?: string
  icon?: string
  id?: string
  to?: string
  items?: MenuItem[]
  children?: ChildItem[]
  url?: string
  disabled?: boolean
  subtitle?: string
  badgeType?: string
  badge?: boolean
  badgeContent?: string
}

const SidebarContent: MenuItem[] = [
  {
    heading: 'Home',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-2-linear',
        id: uniqueId(),
        url: '/',
      },
    ],
  },
  {
    heading: 'Ikas ERP',
    children: [
      {
        id: uniqueId(),
        name: 'Orders',
        icon: 'solar:bag-linear',
        url: '/ikas/orders',
      },
      {
        id: uniqueId(),
        name: 'Inventory',
        icon: 'solar:box-linear',
        url: '/ikas/inventory',
      },
      {
        id: uniqueId(),
        name: 'Customers',
        icon: 'solar:users-group-rounded-linear',
        url: '/ikas/customers',
      },
    ],
  },
  {
    heading: 'Settings',
    children: [
      {
        id: uniqueId(),
        name: 'Account',
        icon: 'solar:user-circle-linear',
        url: '/auth/profile',
      },
    ],
  },
]

export default SidebarContent
